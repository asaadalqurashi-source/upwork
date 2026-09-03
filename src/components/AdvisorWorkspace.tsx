import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Video, 
  Calendar, 
  Clock, 
  FileText, 
  ShieldCheck, 
  Lock, 
  Plus, 
  DollarSign, 
  Sparkles,
  Paperclip,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award,
  Download,
  UserCheck,
  Edit3,
  BarChart3
} from 'lucide-react';
import { BookingSession, Language, PostSessionDeliverable, Advisor } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { DeliverableModal } from './DeliverableModal';
import { AdvisorProfileEdit } from './AdvisorProfileEdit';
import { PlatformInsights } from './PlatformInsights';
import { downloadExecutiveSummaryPDF } from '../utils/pdfExport';

interface AdvisorWorkspaceProps {
  sessions: BookingSession[];
  lang: Language;
  advisor?: Advisor;
  onAcceptSession: (id: string) => void;
  onRejectSession: (id: string) => void;
  onSubmitDeliverable: (sessionId: string, deliverable: PostSessionDeliverable) => void;
  onUpdateAdvisorProfile?: (updatedAdvisor: Partial<Advisor>) => void;
}

export const AdvisorWorkspace: React.FC<AdvisorWorkspaceProps> = ({
  sessions,
  lang,
  advisor,
  onAcceptSession,
  onRejectSession,
  onSubmitDeliverable,
  onUpdateAdvisorProfile
}) => {
  const t = TRANSLATIONS[lang];
  const isRtl = lang === 'ar';

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'editProfile' | 'insights'>('overview');
  const [selectedSessionForDeliverable, setSelectedSessionForDeliverable] = useState<BookingSession | null>(null);

  // Default active advisor if not provided
  const currentAdvisor: Advisor = advisor || sessions[0]?.advisor || {
    id: 'adv-01',
    name: 'م. خالد بن عبدالعزيز التميمي',
    nameEn: 'Eng. Khalid Al-Tamimi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    currentRole: 'عضو مجلس إدارة غير تنفيذي ومستشار تحول سلاسل الإمداد',
    currentRoleEn: 'Non-Executive Board Member & Supply Chain Transformation Advisor',
    primaryFunction: 'COO',
    functionLabelAr: 'نائب رئيس تنفيذي للعمليات التشغيلية (Ex-COO)',
    functionLabelEn: 'Former Chief Operating Officer (Ex-COO)',
    primaryTrackRecord: 'SABIC',
    sectors: ['Logistics & Supply Chain', 'Petrochemicals & Energy', 'Manufacturing & Mining'],
    bioAr: 'خبرة تفوق 28 عاماً في قيادة العمليات اللوجستية وسلاسل الإمداد العالمية في سابك وأرامكو السعودية.',
    bioEn: 'Over 28 years of executive leadership in global logistics and supply chain at SABIC and Saudi Aramco.',
    experienceYears: 28,
    formerRoles: [],
    hourlyRate: 3200,
    currency: 'SAR',
    rating: 4.98,
    reviewsCount: 47,
    totalSessionsCompleted: 62,
    verifiedBadgesAr: ['قيادي تنفيذي سابق (SABIC)', 'عضو مجلس إدارة معتمد'],
    verifiedBadgesEn: ['Former SABIC EVP', 'Certified Board Director'],
    videoElevatorPitch: {
      duration: '0:34',
      videoThumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-giving-a-presentation-in-an-office-41487-large.mp4',
      summaryAr: 'موجز استراتيجي حول كيفية كشف الفاقد التشغيلي وإعادة بناء شبكات التوزيع اللوجستي.',
      summaryEn: 'Executive summary on auditing operational bottlenecks and restructuring distribution networks.',
      topicsCoveredAr: ['إعادة هيكلة سلاسل الإمداد', 'إدارة المخاطر التشغيلية'],
      topicsCoveredEn: ['Supply Chain Restructuring', 'Operational Risk Governance']
    },
    availableDays: ['الأحد', 'الثلاثاء', 'الخميس'],
    bufferMinutes: 30,
    googleCalendarConnected: true,
    microsoftOutlookConnected: true
  };

  // Weekly availability mock schedule
  const [weeklySlots, setWeeklySlots] = useState([
    { id: 'ws-1', dayAr: 'الأحد', dayEn: 'Sunday', time: '10:00 AM - 11:00 AM', status: 'available' },
    { id: 'ws-2', dayAr: 'الأحد', dayEn: 'Sunday', time: '02:00 PM - 03:00 PM', status: 'available' },
    { id: 'ws-3', dayAr: 'الثلاثاء', dayEn: 'Tuesday', time: '10:00 AM - 11:00 AM', status: 'blocked' },
    { id: 'ws-4', dayAr: 'الثلاثاء', dayEn: 'Tuesday', time: '04:00 PM - 05:00 PM', status: 'available' },
    { id: 'ws-5', dayAr: 'الخميس', dayEn: 'Thursday', time: '09:00 AM - 10:00 AM', status: 'available' },
    { id: 'ws-6', dayAr: 'الخميس', dayEn: 'Thursday', time: '11:00 AM - 12:00 PM', status: 'available' }
  ]);

  const toggleSlotStatus = (id: string) => {
    setWeeklySlots(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, status: s.status === 'available' ? 'blocked' : 'available' };
      }
      return s;
    }));
  };

  const pendingDeliverableSessions = sessions.filter(s => s.status === 'confirmed' && !s.deliverable);
  const completedSessions = sessions.filter(s => s.deliverable);

  const pendingEscrowTotal = pendingDeliverableSessions.reduce((acc, s) => acc + s.feeSAR, 0);
  const earnedTotal = completedSessions.reduce((acc, s) => acc + s.feeSAR, 0);

  const handleDownloadPDF = (deliverable: PostSessionDeliverable, session: BookingSession) => {
    downloadExecutiveSummaryPDF(deliverable, session, lang);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Top Banner: Advisor Status & Financial Escrow Summary */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-white">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-indigo-200 text-xs font-semibold mb-2">
            <Award className="w-3.5 h-3.5 text-indigo-400" />
            <span>{currentAdvisor.primaryTrackRecord} Executive Alumni • {currentAdvisor.primaryFunction}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {lang === 'ar' ? `مرحباً بك، ${currentAdvisor.name}` : `Welcome back, ${currentAdvisor.nameEn}`}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl font-normal leading-relaxed">
            {lang === 'ar' 
              ? 'إدارة الجلسات الاستشارية، رفع تقارير التوصيات التنفيذية لتحرير مبالغ الضمان المالي، وتحديث ملفك وخيارات الفيديو.' 
              : 'Manage bookings, submit deliverables for instant escrow release, and update your video pitch & rates.'}
          </p>
        </div>

        {/* Financial Escrow KPI blocks */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex-1 md:flex-none p-4 rounded-xl bg-slate-800 border border-slate-700 text-center min-w-[150px]">
            <p className="text-xs text-slate-300 font-medium">{t.advisorSpace.escrowPendingRelease}</p>
            <p className="text-xl font-bold text-indigo-300 mt-1">
              {pendingEscrowTotal.toLocaleString()} SAR
            </p>
            <span className="text-[10px] text-slate-400">
              {pendingDeliverableSessions.length} {lang === 'ar' ? 'جلسات بانتظار التقرير' : 'pending reports'}
            </span>
          </div>

          <div className="flex-1 md:flex-none p-4 rounded-xl bg-slate-800 border border-slate-700 text-center min-w-[150px]">
            <p className="text-xs text-slate-300 font-medium">{t.advisorSpace.totalEarned}</p>
            <p className="text-xl font-bold text-emerald-400 mt-1">
              {earnedTotal.toLocaleString()} SAR
            </p>
            <span className="text-[10px] text-emerald-400 flex items-center justify-center gap-1 font-medium">
              <CheckCircle2 className="w-3 h-3" />
              <span>{lang === 'ar' ? 'تم الإفراج البنكي' : 'Escrow Released'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Advisor Workspace Subtabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-slate-100 border border-slate-200">
        
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <FileText className="w-4 h-4 text-indigo-200" />
          <span>{lang === 'ar' ? 'المهام والجلسات الاستشارية' : 'Deliverables & Sessions'}</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
            activeSubTab === 'overview' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            {pendingDeliverableSessions.length} Pending
          </span>
        </button>

        <button
          id="advisor-edit-profile-tab"
          onClick={() => setActiveSubTab('editProfile')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'editProfile'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Edit3 className="w-4 h-4 text-indigo-200" />
          <span>{lang === 'ar' ? 'تعديل الملف التنفيذي وفيديو الـ 30 ثانية' : 'Edit Profile & 30s Video Pitch'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('insights')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'insights'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-indigo-200" />
          <span>{lang === 'ar' ? 'مؤشرات المنصة والتحليلات' : 'Platform Insights & Escrow Trends'}</span>
        </button>

      </div>

      {/* SUBTAB 1: OVERVIEW & DELIVERABLES */}
      {activeSubTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in">
          
          {/* Pending Deliverables */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <span>{t.advisorSpace.pendingDeliverables}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono font-bold">
                  {pendingDeliverableSessions.length}
                </span>
              </h2>
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                {lang === 'ar' ? 'رفع التقرير يطلق فوراً مبلغ الضمان إلى حسابك البنكي' : 'Submitting report instantly releases escrow funds'}
              </span>
            </div>

            {pendingDeliverableSessions.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center text-slate-500 text-xs shadow-2xs">
                {lang === 'ar' ? 'لا توجد جلسات معلقة بانتظار رفع التقارير حالياً.' : 'No pending deliverable reports at the moment.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {pendingDeliverableSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-300 shadow-2xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 transition-all"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 text-xs font-mono font-bold border border-slate-200">
                          {session.referenceCode}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                          {session.feeSAR.toLocaleString()} SAR {lang === 'ar' ? 'محتجز في الضمان' : 'in Escrow'}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {session.date} • {session.timeSlot}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900">
                        {session.challengeBrief.title}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-2">
                        {session.challengeBrief.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 font-medium">
                        <span className="text-slate-900 font-semibold">
                          {lang === 'ar' ? 'العميل:' : 'Client:'} {session.clientName} ({session.clientCompany})
                        </span>
                        <span>•</span>
                        <span className="text-emerald-700 font-mono flex items-center gap-1 font-bold">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>NDA Signed</span>
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto shrink-0">
                      <a
                        href={session.meetLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 lg:flex-none px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 border border-slate-200 transition-colors flex items-center justify-center gap-2"
                      >
                        <Video className="w-4 h-4 text-emerald-600" />
                        <span>{lang === 'ar' ? 'رابط Google Meet' : 'Join Google Meet'}</span>
                      </a>

                      <button
                        id={`submit-deliverable-btn-${session.id}`}
                        onClick={() => setSelectedSessionForDeliverable(session)}
                        className="flex-1 lg:flex-none px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <FileText className="w-4 h-4 text-white" />
                        <span>{t.advisorSpace.submitDeliverableBtn}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Two Column Section: Weekly Availability & Completed History with PDF Downloads */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Weekly Availability & Slot Blocker */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <span>{t.advisorSpace.availabilityManager}</span>
                </h2>
                <span className="text-[11px] text-emerald-800 font-mono font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Google Calendar 2-Way Sync</span>
                </span>
              </div>

              <p className="text-xs text-slate-500 font-medium">
                {lang === 'ar' 
                  ? 'انقر لحظر المواعيد المزدحمة أو فتح أوقات استشارة جديدة، وستتزامن فوراً مع منصة الحجز.' 
                  : 'Click any slot to block or open it for booking. Changes sync instantly across APIs.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {weeklySlots.map((slot) => (
                  <div
                    key={slot.id}
                    onClick={() => toggleSlotStatus(slot.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      slot.status === 'available'
                        ? 'bg-emerald-50/50 border-emerald-200 hover:border-emerald-300'
                        : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {lang === 'ar' ? slot.dayAr : slot.dayEn}
                      </p>
                      <p className="text-[11px] text-slate-600 font-mono mt-0.5 font-medium">
                        {slot.time}
                      </p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                      slot.status === 'available'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-200 text-slate-600 border border-slate-300'
                    }`}>
                      {slot.status === 'available' ? t.advisorSpace.blockSlot : t.advisorSpace.unblockSlot}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Completed History & Escrow Releases (With PDF Download) */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>{t.advisorSpace.completedHistory}</span>
                </h2>
                <span className="text-xs text-slate-500 font-medium">
                  {completedSessions.length} {lang === 'ar' ? 'جلسات منجزة' : 'completed'}
                </span>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {completedSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-200 transition-all text-xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{session.clientCompany} ({session.clientName})</span>
                      <span className="text-emerald-700 font-bold text-sm">+{session.feeSAR.toLocaleString()} SAR</span>
                    </div>

                    <p className="text-slate-600 text-[11px] line-clamp-1">{session.challengeBrief.title}</p>
                    
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500 pt-1.5 border-t border-slate-200">
                      <span className="font-mono text-slate-500">TX: {session.deliverable?.releaseTxHash?.substring(0, 16)}...</span>

                      {session.deliverable && (
                        <button
                          onClick={() => handleDownloadPDF(session.deliverable!, session)}
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-indigo-700 font-semibold border border-indigo-200 transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                        >
                          <Download className="w-3 h-3 text-indigo-600" />
                          <span>{lang === 'ar' ? 'تحميل التقرير (PDF)' : 'Executive PDF'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* SUBTAB 2: EDIT PROFILE VIEW */}
      {activeSubTab === 'editProfile' && (
        <AdvisorProfileEdit
          advisor={currentAdvisor}
          lang={lang}
          onSaveProfile={(updated) => {
            if (onUpdateAdvisorProfile) {
              onUpdateAdvisorProfile(updated);
            }
          }}
          onCancel={() => setActiveSubTab('overview')}
        />
      )}

      {/* SUBTAB 3: PLATFORM INSIGHTS (Recharts) */}
      {activeSubTab === 'insights' && (
        <PlatformInsights lang={lang} />
      )}

      {/* Deliverable Builder Modal */}
      {selectedSessionForDeliverable && (
        <DeliverableModal
          session={selectedSessionForDeliverable}
          lang={lang}
          onClose={() => setSelectedSessionForDeliverable(null)}
          onSubmitDeliverable={onSubmitDeliverable}
        />
      )}

    </div>
  );
};
