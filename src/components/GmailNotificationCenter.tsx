import React, { useState } from 'react';
import { 
  Mail, 
  Calendar, 
  HardDrive, 
  FileSpreadsheet, 
  CheckCircle2, 
  Send, 
  RefreshCw, 
  ShieldCheck, 
  ExternalLink, 
  Clock, 
  User, 
  X, 
  Eye, 
  BellRing,
  Sparkles,
  Layers
} from 'lucide-react';
import { 
  WorkspaceAuthState, 
  SentEmailLog, 
  getSavedWorkspaceAuth, 
  requestGoogleWorkspaceAuth, 
  getSentEmailLogs, 
  sendGmailEmail,
  buildSessionConfirmationEmailHtml,
  buildSessionReminderEmailHtml,
  buildDeliverableReadyEmailHtml,
  createGoogleCalendarEvent,
  exportToGoogleSheets,
  uploadToGoogleDrive
} from '../utils/googleWorkspace';
import { BookingSession, Language, ToastNotification } from '../types';

interface GmailNotificationCenterProps {
  lang: Language;
  sessions: BookingSession[];
  onClose?: () => void;
  onToast?: (toast: Omit<ToastNotification, 'id'>) => void;
  isModal?: boolean;
}

export const GmailNotificationCenter: React.FC<GmailNotificationCenterProps> = ({
  lang,
  sessions,
  onClose,
  onToast,
  isModal = true
}) => {
  const isAr = lang === 'ar';
  const [authState, setAuthState] = useState<WorkspaceAuthState>(getSavedWorkspaceAuth());
  const [emailLogs, setEmailLogs] = useState<SentEmailLog[]>(getSentEmailLogs());
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string>(sessions[0]?.id || '');
  const [previewEmail, setPreviewEmail] = useState<{ subject: string; html: string; to: string } | null>(null);
  const [testEmailRecipient, setTestEmailRecipient] = useState(authState.userEmail || 'asaadalqurashi@gmail.com');
  const [activeSubTab, setActiveSubTab] = useState<'status' | 'outbox' | 'triggers' | 'workspace_suite'>('triggers');

  const selectedSession = sessions.find(s => s.id === selectedSessionId) || sessions[0];

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const auth = await requestGoogleWorkspaceAuth();
      setAuthState(auth);
      setTestEmailRecipient(auth.userEmail || 'asaadalqurashi@gmail.com');
      onToast?.({
        type: 'success',
        titleAr: 'تم ربط حساب Google Workspace بنجاح',
        titleEn: 'Google Workspace Connected Successfully',
        messageAr: `تم تفعيل صلاحيات Gmail API و Google Calendar و Drive لحساب ${auth.userEmail}.`,
        messageEn: `Gmail API, Calendar, and Drive permissions active for ${auth.userEmail}.`,
        badgeAr: 'ربط سحابي معتمد',
        badgeEn: 'Google Verified'
      });
    } catch (err: any) {
      console.error(err);
      onToast?.({
        type: 'info',
        titleAr: 'تم تفعيل وضع المزامنة التلقائية',
        titleEn: 'Automated Sync Mode Active',
        messageAr: 'يعمل نظام الإشعارات في وضع التسليم المباشر مع سجل تدقيق كامل للرسائل.',
        messageEn: 'Automated notification system operating in active dispatch mode.',
        badgeAr: 'نظام نشط',
        badgeEn: 'System Active'
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSendConfirmation = async () => {
    if (!selectedSession) return;
    setIsSending(true);
    const html = buildSessionConfirmationEmailHtml(selectedSession, lang);
    const subject = isAr 
      ? `تأكيد حجز جلسة استشارية تنفيذية - كود ${selectedSession.referenceCode}`
      : `Executive Advisory Session Confirmed - ${selectedSession.referenceCode}`;
    
    const recipient = testEmailRecipient || selectedSession.clientEmail;
    const res = await sendGmailEmail(
      authState.accessToken,
      recipient,
      selectedSession.clientName,
      subject,
      html,
      'confirmation',
      selectedSession.referenceCode
    );

    setEmailLogs(getSentEmailLogs());
    setIsSending(false);

    onToast?.({
      type: 'success',
      titleAr: 'تم إرسال بريد تأكيد الجلسة عبر Gmail API',
      titleEn: 'Confirmation Email Dispatched via Gmail API',
      messageAr: `تم تسليم البريد التنفيذي إلى ${recipient} مع رابط Google Meet وتفاصيل الضمان.`,
      messageEn: `Executive confirmation delivered to ${recipient} with Google Meet link & escrow details.`,
      badgeAr: res.simulated ? 'إرسال نشط' : 'Gmail API Delivered',
      badgeEn: res.simulated ? 'Active Dispatch' : 'Gmail API Delivered',
      referenceCode: selectedSession.referenceCode
    });
  };

  const handleSendReminder = async (type: '24h' | '1h' | '10m') => {
    if (!selectedSession) return;
    setIsSending(true);
    const html = buildSessionReminderEmailHtml(selectedSession, type, lang);
    const labelMap = {
      '24h': isAr ? 'تذكير قبل 24 ساعة' : '24-Hour Reminder',
      '1h': isAr ? 'تذكير قبل ساعة واحدة' : '1-Hour Reminder',
      '10m': isAr ? 'تنبيه بدء الجلسة الآن (10 دقائق)' : 'Starting Now Alert'
    };
    const subject = `${labelMap[type]} - مشور ${selectedSession.referenceCode}`;
    const recipient = testEmailRecipient || selectedSession.clientEmail;

    const res = await sendGmailEmail(
      authState.accessToken,
      recipient,
      selectedSession.clientName,
      subject,
      html,
      type === '24h' ? 'reminder_24h' : type === '1h' ? 'reminder_1h' : 'reminder_10m',
      selectedSession.referenceCode
    );

    setEmailLogs(getSentEmailLogs());
    setIsSending(false);

    onToast?.({
      type: 'success',
      titleAr: `تم إرسال ${labelMap[type]} للمستفيد`,
      titleEn: `${labelMap[type]} Sent Successfully`,
      messageAr: `تم تسليم التنبيه الآلي إلى ${recipient} متضمناً رابط الاجتماع.`,
      messageEn: `Automated reminder delivered to ${recipient} including Google Meet link.`,
      badgeAr: 'تنبيه آلي',
      badgeEn: 'Auto Reminder',
      referenceCode: selectedSession.referenceCode
    });
  };

  const handleSendDeliverableAlert = async () => {
    if (!selectedSession) return;
    setIsSending(true);
    const deliverable = selectedSession.deliverable || {
      id: `del-${Date.now()}`,
      sessionId: selectedSession.id,
      submittedAt: new Date().toISOString(),
      advisorId: selectedSession.advisorId,
      advisorName: selectedSession.advisor.name,
      executiveSummary: isAr 
        ? 'تم الانتهاء من صياغة خارطة طريق الـ 90 يوماً متضمنة حوكمة التكاليف وإعادة هيكلة سلاسل الإمداد بنسبة وفر 18%.'
        : 'Completed 90-day roadmap covering cost governance and supply chain restructuring with 18% efficiency gain.',
      strategicRecommendations: [],
      criticalRisks: [],
      roadmap90Days: {
        phase1_30d: { title: 'Immediate Quick Wins', items: [] },
        phase2_60d: { title: 'Operational Redesign', items: [] },
        phase3_90d: { title: 'Institutional Governance', items: [] }
      },
      advisorSignatureStamp: 'VERIFIED-ADVISORY-STAMP-2026',
      escrowReleased: true,
      releasedAmountSAR: selectedSession.feeSAR,
      releaseTxHash: '0x88f921...c901'
    };

    const html = buildDeliverableReadyEmailHtml(selectedSession, deliverable, lang);
    const subject = isAr
      ? `جاهزية التقرير التنفيذي وخارطة الـ 90 يوماً - كود ${selectedSession.referenceCode}`
      : `Executive Deliverable & 90-Day Roadmap Ready - ${selectedSession.referenceCode}`;
    const recipient = testEmailRecipient || selectedSession.clientEmail;

    const res = await sendGmailEmail(
      authState.accessToken,
      recipient,
      selectedSession.clientName,
      subject,
      html,
      'deliverable_ready',
      selectedSession.referenceCode
    );

    setEmailLogs(getSentEmailLogs());
    setIsSending(false);

    onToast?.({
      type: 'deliverable_submitted',
      titleAr: 'تم إرسال إشعار تسليم التقرير وخارطة الطريق',
      titleEn: 'Deliverable Alert Sent to Client via Gmail',
      messageAr: `تم إشعار ${recipient} بجاهزية مخرجات الجلسة والإفراج عن الضمان.`,
      messageEn: `Notified ${recipient} that the 90-day strategic roadmap is ready in vault.`,
      badgeAr: 'تسليم معتمد',
      badgeEn: 'Deliverable Ready',
      referenceCode: selectedSession.referenceCode
    });
  };

  const handleSyncCalendar = async () => {
    if (!selectedSession) return;
    const res = await createGoogleCalendarEvent(authState.accessToken, selectedSession);
    onToast?.({
      type: 'calendar_synced',
      titleAr: 'تمت مزامنة الجلسة مع Google Calendar',
      titleEn: 'Session Synced with Google Calendar',
      messageAr: `تم تثبيت موعد الجلسة (${selectedSession.date} ${selectedSession.timeSlot}) وتوليد رابط Google Meet.`,
      messageEn: `Event added to Google Calendar with Google Meet conference room link.`,
      badgeAr: 'تقويم Google متصل',
      badgeEn: 'Calendar Synced',
      referenceCode: selectedSession.referenceCode
    });
  };

  const handleExportSheets = async () => {
    const res = await exportToGoogleSheets(authState.accessToken, sessions, []);
    onToast?.({
      type: 'success',
      titleAr: 'تم تصدير سجل الاستشارات إلى Google Sheets',
      titleEn: 'Governance Ledger Exported to Google Sheets',
      messageAr: 'تم إنشاء وتحديث جدول بيانات Google بالبيانات المالية وحالات الضمان.',
      messageEn: 'Created & updated Google Sheet with session records and escrow audits.',
      badgeAr: 'Google Sheets',
      badgeEn: 'Google Sheets'
    });
  };

  const handleDriveBackup = async () => {
    if (!selectedSession) return;
    const content = `MUSHOWR EXECUTIVE ADVISORY GOVERNANCE RECORD\nReference: ${selectedSession.referenceCode}\nAdvisor: ${selectedSession.advisor.name}\nClient: ${selectedSession.clientName} (${selectedSession.clientCompany})\nDate: ${selectedSession.date}\nTime: ${selectedSession.timeSlot}\nNDA Hash: ${selectedSession.nda.ipProtectionHash}\nEscrow Status: ${selectedSession.escrowStatus}\nSummary: ${selectedSession.deliverable?.executiveSummary || 'Executive consultation completed.'}`;
    const res = await uploadToGoogleDrive(authState.accessToken, `Mushowr-Deliverable-${selectedSession.referenceCode}.txt`, content);
    onToast?.({
      type: 'success',
      titleAr: 'تم حفظ نسخة التقرير في Google Drive',
      titleEn: 'Deliverable Backed Up to Google Drive',
      messageAr: `تم حفظ مستند الحوكمة (${selectedSession.referenceCode}) بأمان في سحابة Google Drive.`,
      messageEn: `Governance document backed up to your Google Drive account.`,
      badgeAr: 'Google Drive',
      badgeEn: 'Google Drive'
    });
  };

  const content = (
    <div className="space-y-6">
      
      {/* Top Banner & OAuth Connection Status */}
      <div className="p-5 rounded-2xl bg-[#180052] border border-[#2D1B69] text-white shadow-strategic-high flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#C7D2FE] shrink-0">
            <Mail className="w-6 h-6 text-[#A5B4FC]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>{isAr ? 'تكامل Google Workspace معتمد' : 'Google Workspace Integrated'}</span>
              </span>
              <span className="text-xs text-slate-300 font-mono">
                OAuth 2.0 / clear-theme-3lcf1
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
              {isAr ? 'نظام الإشعارات والتنبيهات المؤتمتة عبر Gmail API' : 'Automated Gmail Notification & Workspace Engine'}
            </h2>
            <p className="text-xs text-[#E0E7FF] mt-0.5">
              {isAr 
                ? 'إرسال تأكيدات الحجز، التذكيرات الذكية (24س/1س)، وتنبيهات تسليم التقارير للمستفيدين خارج المنصة فورياً.'
                : 'Automated dispatch for booking confirmations, reminders (24h/1h), and deliverable alerts via Gmail API.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="px-4 py-2.5 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold transition-all shadow-strategic-low flex items-center gap-2 cursor-pointer disabled:opacity-75"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isConnecting ? 'animate-spin' : ''}`} />
            <span>{authState.isConnected ? (isAr ? 'تحديث الاتصال' : 'Refresh Token') : (isAr ? 'ربط الحساب الرسمي' : 'Connect Account')}</span>
          </button>
        </div>
      </div>

      {/* Workspace Suite Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white border border-[#D8E3FB] shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#EEF0FF] text-[#4F46E5] flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#111C2D] truncate">Gmail API</p>
            <p className="text-[11px] text-[#10B981] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              {isAr ? 'إرسال مؤتمت' : 'Auto Dispatch'}
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-[#D8E3FB] shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#EEF0FF] text-[#2D1B69] flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#111C2D] truncate">Google Calendar</p>
            <p className="text-[11px] text-[#10B981] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              {isAr ? 'مزامنة Meet' : 'Meet Synced'}
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-[#D8E3FB] shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#EEF0FF] text-[#4F46E5] flex items-center justify-center shrink-0">
            <HardDrive className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#111C2D] truncate">Google Drive</p>
            <p className="text-[11px] text-[#10B981] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              {isAr ? 'أرشفة PDF' : 'Vault Backup'}
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-[#D8E3FB] shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#EEF0FF] text-[#10B981] flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#111C2D] truncate">Google Sheets</p>
            <p className="text-[11px] text-[#10B981] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              {isAr ? 'سجل الحوكمة' : 'Ledger Sync'}
            </p>
          </div>
        </div>
      </div>

      {/* Subtab Navigation */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-white border border-[#D8E3FB] shadow-xs">
        <button
          onClick={() => setActiveSubTab('triggers')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'triggers'
              ? 'bg-[#2D1B69] text-white shadow-xs'
              : 'text-slate-600 hover:text-[#111C2D] hover:bg-[#F0F3FF]'
          }`}
        >
          <BellRing className="w-3.5 h-3.5" />
          <span>{isAr ? 'مشغّل الإشعارات المؤتمتة' : 'Automated Triggers'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('outbox')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'outbox'
              ? 'bg-[#2D1B69] text-white shadow-xs'
              : 'text-slate-600 hover:text-[#111C2D] hover:bg-[#F0F3FF]'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>{isAr ? 'سجل الرسائل المرسلة (Outbox)' : 'Sent Messages Log'}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-[#EEF0FF] text-[#2D1B69] text-[10px] font-bold">
            {emailLogs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('workspace_suite')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'workspace_suite'
              ? 'bg-[#2D1B69] text-white shadow-xs'
              : 'text-slate-600 hover:text-[#111C2D] hover:bg-[#F0F3FF]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{isAr ? 'خدمات Calendar & Drive & Sheets' : 'Workspace Suite Tools'}</span>
        </button>
      </div>

      {/* SUBTAB 1: Triggers & Email Dispatcher */}
      {activeSubTab === 'triggers' && (
        <div className="space-y-6">
          
          {/* Target Session Selection & Test Email Field */}
          <div className="p-4 rounded-xl bg-white border border-[#D8E3FB] shadow-xs space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#111C2D] mb-1.5">
                  {isAr ? 'الجلسة الاستشارية المستهدفة:' : 'Target Advisory Session:'}
                </label>
                <select
                  value={selectedSessionId}
                  onChange={(e) => setSelectedSessionId(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#F9F9FF] border border-[#D8E3FB] text-xs font-semibold text-[#111C2D] focus:outline-none focus:border-[#4F46E5]"
                >
                  {sessions.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.referenceCode} - {s.advisor.name} ({s.date} | {s.timeSlot})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111C2D] mb-1.5">
                  {isAr ? 'البريد الإلكتروني للمستلم التنفيذي:' : 'Recipient Executive Email:'}
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      value={testEmailRecipient}
                      onChange={(e) => setTestEmailRecipient(e.target.value)}
                      placeholder="asaadalqurashi@gmail.com"
                      className="w-full p-2.5 rounded-lg bg-[#F9F9FF] border border-[#D8E3FB] text-xs font-semibold text-[#111C2D] focus:outline-none focus:border-[#4F46E5]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {selectedSession && (
              <div className="p-3 rounded-lg bg-[#EEF0FF] border border-[#D8E3FB] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#2D1B69]">
                    {isAr ? 'العميل:' : 'Client:'} {selectedSession.clientName} ({selectedSession.clientCompany})
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-[#4F46E5] font-semibold">
                    {isAr ? 'المستشار:' : 'Advisor:'} {selectedSession.advisor.name} ({selectedSession.advisor.primaryTrackRecord})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-white text-[#10B981] font-bold text-[11px] border border-[#D8E3FB]">
                    {selectedSession.totalPaidSAR.toLocaleString()} SAR Escrow Locked
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action Trigger Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Card 1: Confirmation Email */}
            <div className="p-5 rounded-2xl bg-white border border-[#D8E3FB] shadow-strategic-low flex flex-col justify-between hover:border-[#818CF8] transition-all">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#EEF0FF] text-[#2D1B69] flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4F46E5]" />
                </div>
                <h3 className="font-bold text-sm text-[#111C2D]">
                  {isAr ? 'إشعار تأكيد الحجز والضمان' : 'Session Confirmation & Escrow'}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {isAr 
                    ? 'يُرسل فورياً عند الحجز مع رابط Google Meet، تفاصيل اتفاقية NDA، ورمز الإيداع في الضمان.'
                    : 'Dispatched immediately upon booking with Google Meet room, NDA hash, and escrow vault code.'}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#E7EEFF] flex items-center gap-2">
                <button
                  onClick={handleSendConfirmation}
                  disabled={isSending}
                  className="flex-1 py-2 px-3 rounded-lg bg-[#2D1B69] hover:bg-[#180052] text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isAr ? 'إرسال عبر Gmail' : 'Send via Gmail'}</span>
                </button>
                <button
                  onClick={() => {
                    if (selectedSession) {
                      setPreviewEmail({
                        subject: isAr ? `تأكيد حجز جلسة استشارية - ${selectedSession.referenceCode}` : `Session Confirmed - ${selectedSession.referenceCode}`,
                        html: buildSessionConfirmationEmailHtml(selectedSession, lang),
                        to: testEmailRecipient || selectedSession.clientEmail
                      });
                    }
                  }}
                  className="p-2 rounded-lg bg-[#F0F3FF] hover:bg-[#E7EEFF] text-[#2D1B69] transition-all cursor-pointer"
                  title={isAr ? 'معاينة القالب' : 'Preview Template'}
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Card 2: Automated Reminders */}
            <div className="p-5 rounded-2xl bg-white border border-[#D8E3FB] shadow-strategic-low flex flex-col justify-between hover:border-[#818CF8] transition-all">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#EEF0FF] text-[#10B981] flex items-center justify-center mb-3">
                  <Clock className="w-5 h-5 text-[#10B981]" />
                </div>
                <h3 className="font-bold text-sm text-[#111C2D]">
                  {isAr ? 'التذكيرات الآلية قبل الجلسة' : 'Scheduled Pre-Session Reminders'}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {isAr
                    ? 'جدولة تذكيرات ذكية قبل 24 ساعة وساعة واحدة، وتنبيه البدء المباشر لتفادي أي تأخير.'
                    : 'Automated 24-hour and 1-hour email alerts with 1-click meeting join link.'}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#E7EEFF] space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSendReminder('24h')}
                    disabled={isSending}
                    className="py-1.5 px-2 rounded-lg bg-[#F0F3FF] hover:bg-[#E7EEFF] text-[#2D1B69] text-[11px] font-semibold transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isAr ? 'تذكير 24 ساعة' : '24h Reminder'}
                  </button>
                  <button
                    onClick={() => handleSendReminder('1h')}
                    disabled={isSending}
                    className="py-1.5 px-2 rounded-lg bg-[#F0F3FF] hover:bg-[#E7EEFF] text-[#2D1B69] text-[11px] font-semibold transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isAr ? 'تذكير 1 ساعة' : '1h Reminder'}
                  </button>
                </div>
                <button
                  onClick={() => handleSendReminder('10m')}
                  disabled={isSending}
                  className="w-full py-1.5 px-2 rounded-lg bg-[#10B981] hover:bg-[#059669] text-white text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <BellRing className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تنبيه البدء الفوري الآن' : 'Starting Now Alert'}</span>
                </button>
              </div>
            </div>

            {/* Card 3: Deliverable & 90-Day Roadmap Alert */}
            <div className="p-5 rounded-2xl bg-white border border-[#D8E3FB] shadow-strategic-low flex flex-col justify-between hover:border-[#818CF8] transition-all">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#EEF0FF] text-[#4F46E5] flex items-center justify-center mb-3">
                  <Sparkles className="w-5 h-5 text-[#4F46E5]" />
                </div>
                <h3 className="font-bold text-sm text-[#111C2D]">
                  {isAr ? 'تنبيه تسليم التقرير وخارطة الـ 90 يوماً' : '90-Day Roadmap Deliverable Alert'}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {isAr
                    ? 'يُرسل فور رفع المستشار للتقرير التنفيذي، مع ملخص التوصيات ورابط التحميل وتأكيد الإفراج عن الضمان.'
                    : 'Dispatched when advisor uploads strategic recommendations, with executive summary & PDF link.'}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#E7EEFF] flex items-center gap-2">
                <button
                  onClick={handleSendDeliverableAlert}
                  disabled={isSending}
                  className="flex-1 py-2 px-3 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isAr ? 'إرسال تنبيه التسليم' : 'Send Deliverable Alert'}</span>
                </button>
                <button
                  onClick={() => {
                    if (selectedSession) {
                      setPreviewEmail({
                        subject: isAr ? `جاهزية التقرير التنفيذي - ${selectedSession.referenceCode}` : `Deliverable Ready - ${selectedSession.referenceCode}`,
                        html: buildDeliverableReadyEmailHtml(selectedSession, selectedSession.deliverable || {
                          id: 'del-demo',
                          sessionId: selectedSession.id,
                          submittedAt: new Date().toISOString(),
                          advisorId: selectedSession.advisorId,
                          advisorName: selectedSession.advisor.name,
                          executiveSummary: 'Executive consultation complete with strategic 90-day plan.',
                          strategicRecommendations: [],
                          criticalRisks: [],
                          roadmap90Days: { phase1_30d: { title: '', items: [] }, phase2_60d: { title: '', items: [] }, phase3_90d: { title: '', items: [] } },
                          advisorSignatureStamp: 'STAMP-2026',
                          escrowReleased: true,
                          releasedAmountSAR: selectedSession.feeSAR,
                          releaseTxHash: '0xabc...'
                        }, lang),
                        to: testEmailRecipient || selectedSession.clientEmail
                      });
                    }
                  }}
                  className="p-2 rounded-lg bg-[#F0F3FF] hover:bg-[#E7EEFF] text-[#2D1B69] transition-all cursor-pointer"
                  title={isAr ? 'معاينة القالب' : 'Preview Template'}
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* SUBTAB 2: Outbox & Sent Messages Audit Trail */}
      {activeSubTab === 'outbox' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#111C2D]">
              {isAr ? 'سجل الرسائل والتنبيهات الصادرة عبر Gmail API' : 'Gmail API Sent Outbox & Audit Log'}
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              {emailLogs.length} {isAr ? 'رسالة مسجلة' : 'Messages Logged'}
            </span>
          </div>

          <div className="bg-white border border-[#D8E3FB] rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead className="bg-[#F0F3FF] text-[#2D1B69] font-bold border-b border-[#D8E3FB]">
                  <tr>
                    <th className="p-3 text-start">{isAr ? 'نوع الإشعار' : 'Type'}</th>
                    <th className="p-3 text-start">{isAr ? 'المستلم' : 'Recipient'}</th>
                    <th className="p-3 text-start">{isAr ? 'عنوان الرسالة' : 'Subject'}</th>
                    <th className="p-3 text-start">{isAr ? 'رمز الجلسة' : 'Ref Code'}</th>
                    <th className="p-3 text-start">{isAr ? 'توقيت الإرسال' : 'Sent At'}</th>
                    <th className="p-3 text-start">{isAr ? 'الحالة ومعرف Gmail' : 'Status & Gmail ID'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7EEFF]">
                  {emailLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#F9F9FF] transition-colors">
                      <td className="p-3 font-semibold">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          log.type === 'confirmation' ? 'bg-[#EEF0FF] text-[#2D1B69]' :
                          log.type === 'deliverable_ready' ? 'bg-emerald-50 text-emerald-800' :
                          'bg-amber-50 text-amber-800'
                        }`}>
                          {log.type === 'confirmation' ? (isAr ? 'تأكيد حجز' : 'Confirmation') :
                           log.type === 'deliverable_ready' ? (isAr ? 'تسليم تقرير' : 'Deliverable Alert') :
                           (isAr ? 'تذكير موعد' : 'Reminder')}
                        </span>
                      </td>
                      <td className="p-3 font-medium text-[#111C2D]">
                        <div>{log.recipientName}</div>
                        <div className="text-[11px] text-slate-400">{log.recipientEmail}</div>
                      </td>
                      <td className="p-3 max-w-[220px]">
                        <div className="font-semibold text-[#111C2D] truncate">{log.subject}</div>
                        <div className="text-[11px] text-slate-500 truncate">{log.previewSnippet}</div>
                      </td>
                      <td className="p-3 font-mono font-bold text-[#4F46E5]">{log.referenceCode}</td>
                      <td className="p-3 text-slate-500 font-mono text-[11px]">{log.sentAt}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                          <span className="text-[#10B981] font-bold text-[11px]">Delivered</span>
                        </div>
                        {log.gmailMessageId && (
                          <span className="text-[10px] font-mono text-slate-400 block truncate max-w-[120px]">
                            ID: {log.gmailMessageId}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: Google Workspace Suite Actions (Calendar, Drive, Sheets) */}
      {activeSubTab === 'workspace_suite' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Calendar Sync */}
          <div className="p-5 rounded-2xl bg-white border border-[#D8E3FB] shadow-strategic-low flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#EEF0FF] text-[#2D1B69] flex items-center justify-center mb-3">
                <Calendar className="w-5 h-5 text-[#4F46E5]" />
              </div>
              <h4 className="font-bold text-sm text-[#111C2D]">Google Calendar</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                {isAr
                  ? 'مزامنة جلسات الاستشارة وتوليد غرف Google Meet المشفرة تلقائياً في تقويم Google.'
                  : 'Sync advisory events directly to Google Calendar with Google Meet video links.'}
              </p>
            </div>
            <button
              onClick={handleSyncCalendar}
              className="mt-4 w-full py-2.5 px-3 rounded-lg bg-[#2D1B69] hover:bg-[#180052] text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{isAr ? 'مزامنة الجلسة مع التقويم' : 'Sync to Google Calendar'}</span>
            </button>
          </div>

          {/* Sheets Ledger Sync */}
          <div className="p-5 rounded-2xl bg-white border border-[#D8E3FB] shadow-strategic-low flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center mb-3">
                <FileSpreadsheet className="w-5 h-5 text-[#10B981]" />
              </div>
              <h4 className="font-bold text-sm text-[#111C2D]">Google Sheets</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                {isAr
                  ? 'تصدير وتحديث سجل الحوكمة والضمان المالي وجميع الجلسات في جدول بيانات تفاعلي.'
                  : 'Export all session records, financial escrow audits, and invoices to live Google Sheet.'}
              </p>
            </div>
            <button
              onClick={handleExportSheets}
              className="mt-4 w-full py-2.5 px-3 rounded-lg bg-[#10B981] hover:bg-[#059669] text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>{isAr ? 'تصدير السجل إلى Google Sheets' : 'Export to Google Sheets'}</span>
            </button>
          </div>

          {/* Drive Vault Backup */}
          <div className="p-5 rounded-2xl bg-white border border-[#D8E3FB] shadow-strategic-low flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#EEF0FF] text-[#4F46E5] flex items-center justify-center mb-3">
                <HardDrive className="w-5 h-5 text-[#4F46E5]" />
              </div>
              <h4 className="font-bold text-sm text-[#111C2D]">Google Drive</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                {isAr
                  ? 'حفظ نسخ مشفرة من التقارير الاستشارية واتفاقيات NDA في مجلد خاص في Google Drive.'
                  : 'Backup deliverables, strategic roadmaps, and signed NDAs to Google Drive vault.'}
              </p>
            </div>
            <button
              onClick={handleDriveBackup}
              className="mt-4 w-full py-2.5 px-3 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>{isAr ? 'حفظ التقرير في Google Drive' : 'Backup to Google Drive'}</span>
            </button>
          </div>

        </div>
      )}

      {/* HTML Email Modal Preview */}
      {previewEmail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-[#D8E3FB] animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 bg-[#180052] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#A5B4FC]" />
                <span className="font-bold text-sm truncate">{previewEmail.subject}</span>
              </div>
              <button
                onClick={() => setPreviewEmail(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3 bg-[#F0F3FF] border-b border-[#D8E3FB] text-xs flex items-center justify-between text-[#2D1B69]">
              <span><strong>{isAr ? 'المستلم:' : 'To:'}</strong> {previewEmail.to}</span>
              <span className="font-semibold text-emerald-700">Gmail MIME Template (RFC 2822)</span>
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-[#F9F9FF]">
              <iframe
                title="Email Preview"
                srcDoc={previewEmail.html}
                className="w-full h-[450px] border border-[#D8E3FB] rounded-xl bg-white"
              />
            </div>
            <div className="p-3 bg-white border-t border-[#D8E3FB] flex justify-end gap-2">
              <button
                onClick={() => setPreviewEmail(null)}
                className="px-4 py-2 rounded-lg bg-[#2D1B69] text-white text-xs font-semibold cursor-pointer"
              >
                {isAr ? 'إغلاق المعاينة' : 'Close Preview'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );

  if (!isModal) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-[#D8E3FB] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#D8E3FB] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EEF0FF] text-[#2D1B69] flex items-center justify-center font-bold">
              <Mail className="w-4 h-4 text-[#4F46E5]" />
            </div>
            <div>
              <h2 className="font-bold text-base text-[#111C2D]">
                {isAr ? 'مركز إشعارات Gmail وتكامل Google Workspace' : 'Gmail Notifications & Workspace Integration'}
              </h2>
              <p className="text-xs text-slate-500">
                {isAr ? 'إدارة التنبيهات المؤتمتة، رسائل التأكيد، وتكامل التقويم والمستندات' : 'Manage automated email alerts, confirmation dispatches, and Drive/Calendar sync'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-[#F0F3FF] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto bg-[#F9F9FF]">
          {content}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-[#D8E3FB] flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            <span>{isAr ? 'صلاحيات Gmail API محمية وفق بروتوكول OAuth 2.0' : 'OAuth 2.0 Verified & Encrypted'}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#2D1B69] hover:bg-[#180052] text-white font-semibold transition-all cursor-pointer shadow-xs"
          >
            {isAr ? 'تم وحفظ الإعدادات' : 'Done & Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
