import React, { useState } from 'react';
import { 
  Calendar, 
  Video, 
  FileText, 
  ShieldCheck, 
  Lock, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Copy, 
  ChevronRight, 
  AlertTriangle,
  Sparkles,
  Printer,
  Star,
  DollarSign,
  Receipt,
  TrendingUp,
  Award,
  Hash,
  Eye,
  Check,
  Mail,
  HardDrive
} from 'lucide-react';
import { BookingSession, Language, PostSessionDeliverable, SessionRatingFeedback, BillingInvoice } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { RatingFeedbackModal } from './RatingFeedbackModal';
import { PlatformInsights } from './PlatformInsights';
import { AiExecutiveSummaryViewer } from './AiExecutiveSummaryViewer';
import { GmailNotificationCenter } from './GmailNotificationCenter';
import { downloadExecutiveSummaryPDF, downloadInvoicePDF } from '../utils/pdfExport';
import { AiExecutiveSummaryTakeaways } from '../types';

interface ClientDashboardProps {
  sessions: BookingSession[];
  lang: Language;
  onBookNewSession: () => void;
  onUpdateFeedback?: (sessionId: string, feedback: SessionRatingFeedback) => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  sessions,
  lang,
  onBookNewSession,
  onUpdateFeedback
}) => {
  const t = TRANSLATIONS[lang];
  const isRtl = lang === 'ar';

  const [activeSubTab, setActiveSubTab] = useState<'sessions' | 'deliverables' | 'billing' | 'insights' | 'workspace'>('sessions');
  const [deliverableSectionView, setDeliverableSectionView] = useState<'all' | 'ai_summary' | 'roadmap'>('all');
  const [selectedDeliverable, setSelectedDeliverable] = useState<PostSessionDeliverable | null>(
    sessions.find(s => s.deliverable)?.deliverable || null
  );
  const [selectedSessionView, setSelectedSessionView] = useState<BookingSession | null>(
    sessions.find(s => s.deliverable) || sessions[0] || null
  );
  const [selectedSessionForRating, setSelectedSessionForRating] = useState<BookingSession | null>(null);
  const [copiedInvoiceId, setCopiedInvoiceId] = useState<string | null>(null);

  const handleAiSummaryUpdated = (updatedSummary: AiExecutiveSummaryTakeaways) => {
    if (selectedSessionView) {
      selectedSessionView.aiExecutiveSummary = updatedSummary;
      if (selectedSessionView.deliverable) {
        selectedSessionView.deliverable.aiExecutiveSummary = updatedSummary;
      }
      setSelectedDeliverable(selectedSessionView.deliverable || null);
    }
  };

  const upcomingSessions = sessions.filter(s => s.status === 'confirmed' && !s.deliverable);
  const completedSessions = sessions.filter(s => s.deliverable);

  // Generate Invoices from sessions
  const invoices: BillingInvoice[] = sessions.map((s, idx) => ({
    id: `inv-${s.id}`,
    invoiceNumber: `INV-2026-${8820 + idx * 114}`,
    sessionId: s.id,
    referenceCode: s.referenceCode,
    advisorId: s.advisorId,
    advisorName: s.advisor.name,
    advisorNameEn: s.advisor.nameEn,
    advisorTrackRecord: s.advisor.primaryTrackRecord,
    clientName: s.clientName,
    clientCompany: s.clientCompany,
    clientVatNumber: '310892019400003',
    issueDate: s.createdAt ? s.createdAt.slice(0, 10) : s.date,
    advisoryFeeSAR: s.feeSAR,
    platformFeeSAR: s.platformFeeSAR || Math.round(s.feeSAR * 0.1),
    vatAmountSAR: s.vatSAR || Math.round((s.feeSAR + (s.platformFeeSAR || Math.round(s.feeSAR * 0.1))) * 0.15),
    totalAmountSAR: s.totalPaidSAR || (s.feeSAR + Math.round(s.feeSAR * 0.1) + Math.round((s.feeSAR + Math.round(s.feeSAR * 0.1)) * 0.15)),
    status: s.escrowStatus === 'released_to_advisor' ? 'escrow_released' : 'paid_in_escrow',
    escrowReleaseTxHash: s.deliverable?.releaseTxHash || (s.escrowStatus === 'released_to_advisor' ? '0x8f7c9e120491ab4e7892c' : undefined),
    escrowHoldTxId: s.escrowHoldTxId || `ESCROW-HOLD-TX-${8920 + idx * 77}`,
    paymentMethod: 'Corporate Mada / Apple Pay (Escrow Vault)',
    zatcaQrCodeHash: `ZATCA-EINV-2026-${s.referenceCode}-AUTH-0x892a014f`,
    challengeTitle: s.challengeBrief.title
  }));

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedInvoiceId(id);
    setTimeout(() => setCopiedInvoiceId(null), 2000);
  };

  const handleDownloadDeliverablePDF = (deliverable: PostSessionDeliverable, session: BookingSession) => {
    downloadExecutiveSummaryPDF(deliverable, session, lang);
  };

  const handleDownloadTaxInvoice = (inv: BillingInvoice) => {
    downloadInvoicePDF(inv, lang);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Top Banner: Midnight Purple Palette */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#180052] border border-[#2D1B69] shadow-strategic-high flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-white">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#C7D2FE] text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Corporate Advisory & Governance Vault</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {lang === 'ar' ? 'بوابة العميل والتقارير التنفيذية' : 'Client Executive Portal & Governance Vault'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl font-normal leading-relaxed">
            {lang === 'ar' 
              ? 'متابعة الجلسات المجدولة، تنزيل مخرجات الـ 90 يوماً كملف PDF رسمي، مراجعة الفواتير الضريبية ZATCA، وتقييم أداء الخبراء.' 
              : 'Manage executive sessions, export official 90-day roadmaps as PDFs, audit ZATCA invoices, and rate advisors.'}
          </p>
        </div>

        <button
          onClick={onBookNewSession}
          className="px-5 py-3 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-xs sm:text-sm transition-all shadow-strategic-low hover:shadow-strategic-mid flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Calendar className="w-4 h-4" />
          <span>{lang === 'ar' ? 'حجز جلسة استشارية جديدة' : 'Book New Advisory'}</span>
        </button>
      </div>

      {/* Subtabs Navigation Bar */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-white border border-[#D8E3FB] shadow-strategic-low">
        
        <button
          onClick={() => setActiveSubTab('sessions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'sessions'
              ? 'bg-[#2D1B69] text-white shadow-xs'
              : 'text-slate-600 hover:text-[#111C2D] hover:bg-[#F0F3FF]'
          }`}
        >
          <Calendar className="w-4 h-4 text-[#A5B4FC]" />
          <span>{lang === 'ar' ? 'الجلسات والاستشارات' : 'Advisory Sessions'}</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
            activeSubTab === 'sessions' ? 'bg-white/20 text-white' : 'bg-[#EEF0FF] text-[#2D1B69]'
          }`}>
            {sessions.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('deliverables')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'deliverables'
              ? 'bg-[#2D1B69] text-white shadow-xs'
              : 'text-slate-600 hover:text-[#111C2D] hover:bg-[#F0F3FF]'
          }`}
        >
          <FileText className="w-4 h-4 text-[#A5B4FC]" />
          <span>{lang === 'ar' ? 'مستودع المخرجات (PDF)' : 'Deliverables Vault (PDF)'}</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
            activeSubTab === 'deliverables' ? 'bg-white/20 text-white' : 'bg-[#EEF0FF] text-[#2D1B69] border border-[#D8E3FB]'
          }`}>
            {completedSessions.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('billing')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'billing'
              ? 'bg-[#2D1B69] text-white shadow-xs'
              : 'text-slate-600 hover:text-[#111C2D] hover:bg-[#F0F3FF]'
          }`}
        >
          <Receipt className="w-4 h-4 text-[#A5B4FC]" />
          <span>{lang === 'ar' ? 'الفواتير وسندات الضمان' : 'Billing & Invoices'}</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
            activeSubTab === 'billing' ? 'bg-white/20 text-white' : 'bg-[#EEF0FF] text-[#2D1B69] border border-[#D8E3FB]'
          }`}>
            {invoices.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('insights')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'insights'
              ? 'bg-[#2D1B69] text-white shadow-xs'
              : 'text-slate-600 hover:text-[#111C2D] hover:bg-[#F0F3FF]'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-[#10B981]" />
          <span>{lang === 'ar' ? 'مؤشرات المنصة' : 'Platform Insights'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('workspace')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'workspace'
              ? 'bg-[#2D1B69] text-white shadow-xs'
              : 'text-slate-600 hover:text-[#111C2D] hover:bg-[#F0F3FF]'
          }`}
        >
          <Mail className="w-4 h-4 text-[#A5B4FC]" />
          <span>{lang === 'ar' ? 'تكامل Gmail والتنبيهات' : 'Gmail & Workspace'}</span>
          <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 text-[10px] font-bold">
            API Active
          </span>
        </button>

      </div>

      {/* TAB 1: SESSIONS (Upcoming + Completed) */}
      {activeSubTab === 'sessions' && (
        <div className="space-y-8 animate-in fade-in">
          
          {/* Upcoming Sessions */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              <span>{lang === 'ar' ? 'الجلسات القادمة والمؤكدة' : 'Upcoming Confirmed Sessions'}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
                {upcomingSessions.length}
              </span>
            </h2>

            {upcomingSessions.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center text-slate-500 text-xs shadow-2xs">
                {lang === 'ar' ? 'لا توجد جلسات قادمة مجدولة حالياً.' : 'No upcoming sessions scheduled.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-4 hover:border-indigo-300 transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-mono font-bold border border-indigo-200">
                          {session.referenceCode}
                        </span>
                        <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{lang === 'ar' ? 'المبلغ محمي في الضمان' : 'Escrow Secured'}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <img
                          src={session.advisor.avatar}
                          alt={session.advisor.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs"
                        />
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">
                            {lang === 'ar' ? session.advisor.name : session.advisor.nameEn}
                          </h3>
                          <p className="text-xs text-indigo-600 font-semibold">
                            {lang === 'ar' ? session.advisor.functionLabelAr : session.advisor.functionLabelEn}
                          </p>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                        <p className="font-semibold text-slate-800 line-clamp-1">{session.challengeBrief.title}</p>
                        <p className="text-slate-500 text-[11px] font-medium">{session.date} • {session.timeSlot}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <a
                        href={session.meetLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <Video className="w-4 h-4" />
                        <span>{lang === 'ar' ? 'دخول Google Meet' : 'Join Google Meet'}</span>
                      </a>

                      <button
                        onClick={() => setActiveSubTab('workspace')}
                        className="px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-semibold flex items-center gap-1 border border-indigo-200 transition-all cursor-pointer shadow-2xs"
                        title="إرسال تنبيه عبر Gmail أو مزامنة التقويم"
                      >
                        <Mail className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{lang === 'ar' ? 'تنبيه Gmail' : 'Gmail Alert'}</span>
                      </button>

                      <div className="px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-[11px] text-slate-700 font-semibold flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>NDA Signed</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Completed Sessions List */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{lang === 'ar' ? 'سجل الجلسات المكتملة' : 'Completed Advisory Consultations'}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                {completedSessions.length}
              </span>
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {completedSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-300 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-mono font-bold border border-indigo-200">
                        {session.referenceCode}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                        {lang === 'ar' ? 'تم تسليم التقرير والإفراج عن الضمان' : 'Report Delivered & Escrow Released'}
                      </span>
                      <span className="text-xs text-slate-500 font-mono font-medium">
                        {session.date}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      {session.challengeBrief.title}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                      <span>{lang === 'ar' ? 'المستشار:' : 'Advisor:'} <strong className="text-slate-900">{session.advisor.name}</strong> ({session.advisor.primaryTrackRecord})</span>
                      <span>•</span>
                      <span className="font-bold text-slate-900">{session.feeSAR.toLocaleString()} SAR</span>
                    </div>

                    {/* Show existing rating or rating prompt */}
                    {session.ratingFeedback ? (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center gap-3 text-xs text-slate-700">
                        <div className="flex items-center gap-1 text-indigo-600">
                          <Star className="w-3.5 h-3.5 fill-indigo-600" />
                          <span className="font-bold font-mono">{session.ratingFeedback.ratingOverall}.0/5.0</span>
                        </div>
                        <span className="text-slate-600 italic">"{session.ratingFeedback.testimonial.slice(0, 70)}..."</span>
                        <button
                          onClick={() => setSelectedSessionForRating(session)}
                          className="text-[11px] text-indigo-600 hover:underline ms-auto font-semibold cursor-pointer"
                        >
                          {lang === 'ar' ? 'تعديل التقييم' : 'Edit Review'}
                        </button>
                      </div>
                    ) : (
                      <div className="pt-1">
                        <button
                          onClick={() => setSelectedSessionForRating(session)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200 transition-colors cursor-pointer"
                        >
                          <Star className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{lang === 'ar' ? 'تقييم الجلسة وجودة التوصيات' : 'Rate Advisor & Insight Quality'}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Actions: View Deliverable & Download PDF */}
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto shrink-0">
                    {session.deliverable && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedDeliverable(session.deliverable || null);
                            setSelectedSessionView(session);
                            setDeliverableSectionView('ai_summary');
                            setActiveSubTab('deliverables');
                          }}
                          className="flex-1 md:flex-none px-3.5 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                          title="View Executive Summary & Key Decisions"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{lang === 'ar' ? 'محضر وقرارات الجلسة' : 'Executive Minutes'}</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedDeliverable(session.deliverable || null);
                            setSelectedSessionView(session);
                            setDeliverableSectionView('all');
                            setActiveSubTab('deliverables');
                          }}
                          className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                        >
                          <Eye className="w-4 h-4" />
                          <span>{lang === 'ar' ? 'استعراض التقرير' : 'View Report'}</span>
                        </button>

                        <button
                          onClick={() => handleDownloadDeliverablePDF(session.deliverable!, session)}
                          className="flex-1 md:flex-none px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                          title="Download Executive Summary PDF"
                        >
                          <Download className="w-4 h-4 text-slate-600" />
                          <span>{lang === 'ar' ? 'تحميل PDF' : 'PDF'}</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: DELIVERABLES VAULT (With PDF Export) */}
      {activeSubTab === 'deliverables' && (
        <div className="space-y-6 animate-in fade-in">
          
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <span>{lang === 'ar' ? 'مستودع مخرجات الـ 90 يوماً والتقارير التنفيذية' : '90-Day Execution Roadmaps Vault'}</span>
            </h2>

            {selectedDeliverable && selectedSessionView && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadDeliverablePDF(selectedDeliverable, selectedSessionView)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'تحميل التقرير كملف PDF رسمي' : 'Download Executive PDF'}</span>
                </button>

                <button
                  onClick={() => setSelectedSessionForRating(selectedSessionView)}
                  className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-xs text-indigo-700 font-semibold border border-indigo-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Star className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{selectedSessionView.ratingFeedback ? (lang === 'ar' ? 'تم التقييم' : 'Rated') : (lang === 'ar' ? 'تقييم المستشار' : 'Rate Advisor')}</span>
                </button>
              </div>
            )}
          </div>

          {completedSessions.length === 0 ? (
            <div className="p-12 rounded-2xl bg-white border border-slate-200 text-center text-slate-500 text-xs shadow-2xs">
              {lang === 'ar' ? 'لم تنتهِ أي جلسة بعد. سيظهر تقرير التوصيات فور تقديمه من قبل الخبير.' : 'No completed deliverable reports yet.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Selector List */}
              <div className="space-y-3">
                {completedSessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => {
                      setSelectedSessionView(session);
                      setSelectedDeliverable(session.deliverable || null);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedSessionView?.id === session.id
                        ? 'bg-white border-indigo-600 ring-2 ring-indigo-600/10 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-indigo-600">
                        {session.referenceCode}
                      </span>
                      <span className="text-[10px] text-emerald-800 font-semibold px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                        {lang === 'ar' ? 'تقرير معتمد' : 'Verified'}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">
                      {session.challengeBrief.title}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1 font-medium">
                      {lang === 'ar' ? session.advisor.name : session.advisor.nameEn}
                    </p>
                  </div>
                ))}
              </div>

              {/* Right: Full High-Fidelity Executive Deliverable Display */}
              {selectedDeliverable && selectedSessionView && (
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Mode Selector Tabs (All, AI Summary, 90-day Roadmap) */}
                  <div className="flex items-center justify-between p-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setDeliverableSectionView('all')}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          deliverableSectionView === 'all'
                            ? 'bg-slate-900 text-white shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        {lang === 'ar' ? 'العرض الشامل المتكامل' : 'Complete View'}
                      </button>

                      <button
                        onClick={() => setDeliverableSectionView('ai_summary')}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                          deliverableSectionView === 'ai_summary'
                            ? 'bg-indigo-600 text-white shadow-2xs'
                            : 'text-indigo-700 hover:bg-indigo-50'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'محضر الجلسة والقرارات' : 'Executive Minutes'}</span>
                      </button>

                      <button
                        onClick={() => setDeliverableSectionView('roadmap')}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          deliverableSectionView === 'roadmap'
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        {lang === 'ar' ? 'خارطة الـ 90 يوماً والمخاطر' : '90-Day Roadmap & Risks'}
                      </button>
                    </div>

                    <button
                      onClick={() => handleDownloadDeliverablePDF(selectedDeliverable, selectedSessionView)}
                      className="hidden sm:flex px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[11px] font-semibold text-slate-800 transition-all items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-600" />
                      <span>PDF</span>
                    </button>
                  </div>

                  {/* AI EXECUTIVE SUMMARY VIEWER (Shows in 'all' or 'ai_summary' mode) */}
                  {(deliverableSectionView === 'all' || deliverableSectionView === 'ai_summary') && (
                    <AiExecutiveSummaryViewer
                      session={selectedSessionView}
                      lang={lang}
                      onSummaryUpdated={handleAiSummaryUpdated}
                    />
                  )}

                  {/* WRITTEN DELIVERABLE & ROADMAP (Shows in 'all' or 'roadmap' mode) */}
                  {(deliverableSectionView === 'all' || deliverableSectionView === 'roadmap') && (
                    <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-6 text-slate-800">
                      
                      {/* Header Bar */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                        <div>
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-mono font-bold border border-indigo-200 mb-2">
                            <span>DOC REF: {selectedDeliverable.id.toUpperCase()}</span>
                            <span>•</span>
                            <span>{selectedSessionView.referenceCode}</span>
                          </div>
                          <h3 className="text-lg font-bold text-slate-900">
                            {lang === 'ar' ? 'تقرير التوصيات وخارطة طريق الـ 90 يوماً' : 'Executive Advisory Summary & 90-Day Roadmap'}
                          </h3>
                          <p className="text-xs text-indigo-600 font-semibold mt-0.5">
                            {lang === 'ar' ? 'المستشار التنفيذي:' : 'Executive Advisor:'} {selectedDeliverable.advisorName}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDownloadDeliverablePDF(selectedDeliverable, selectedSessionView)}
                            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-800 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <Download className="w-3.5 h-3.5 text-slate-600" />
                            <span>PDF Export</span>
                          </button>
                        </div>
                      </div>

                      {/* 1. Diagnostic Summary */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                          {lang === 'ar' ? '1. ملخص التشخيص والقرار الاستراتيجي (Executive Diagnostic)' : '1. Executive Diagnostic Assessment'}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                          {selectedDeliverable.executiveSummary}
                        </p>
                      </div>

                      {/* 2. Strategic Recommendations */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          {lang === 'ar' ? '2. المبادرات الاستراتيجية ذات الأثر العالي' : '2. High-Impact Strategic Initiatives'}
                        </h4>
                        <div className="space-y-3">
                          {selectedDeliverable.strategicRecommendations.map((rec) => (
                            <div key={rec.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-900 text-sm">{rec.title}</span>
                                <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-semibold border border-indigo-200">
                                  {rec.impact} Impact
                                </span>
                              </div>
                              <p className="text-slate-600">{rec.description}</p>
                              <ul className="list-disc list-inside space-y-1 text-slate-500 text-[11px] pt-1 font-medium">
                                {rec.actionableSteps.map((step, idx) => (
                                  <li key={idx}>{step}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 3. Critical Risks Matrix */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                          {lang === 'ar' ? '3. مصفوفة المخاطر وطرق التحوط (Risk Mitigation Matrix)' : '3. Risk Mitigation Matrix'}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {selectedDeliverable.criticalRisks.map((risk) => (
                            <div key={risk.id} className="p-3.5 rounded-xl bg-rose-50/50 border border-rose-200 text-xs space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-rose-900 flex items-center gap-1">
                                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                                  <span>{risk.severity} Risk</span>
                                </span>
                              </div>
                              <p className="font-semibold text-slate-900">{risk.risk}</p>
                              <p className="text-emerald-800 text-[11px] pt-1 border-t border-rose-200/60 font-medium">
                                <strong>{lang === 'ar' ? 'خطة التحوط:' : 'Mitigation:'}</strong> {risk.mitigation}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 4. 90-Day Milestone Roadmap */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                          {lang === 'ar' ? '4. خارطة طريق التنفيذ (90-Day Milestone Roadmap)' : '4. 90-Day Milestone Roadmap'}
                        </h4>
                        <div className="space-y-2.5">
                          <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 text-xs space-y-1.5">
                            <span className="font-bold text-blue-950 block">{selectedDeliverable.roadmap90Days.phase1_30d.title}</span>
                            <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px] font-medium">
                              {selectedDeliverable.roadmap90Days.phase1_30d.items.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-200 text-xs space-y-1.5">
                            <span className="font-bold text-indigo-950 block">{selectedDeliverable.roadmap90Days.phase2_60d.title}</span>
                            <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px] font-medium">
                              {selectedDeliverable.roadmap90Days.phase2_60d.items.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-1.5">
                            <span className="font-bold text-emerald-950 block">{selectedDeliverable.roadmap90Days.phase3_90d.title}</span>
                            <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px] font-medium">
                              {selectedDeliverable.roadmap90Days.phase3_90d.items.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Stamp & Verification */}
                      <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 text-slate-600 font-medium">
                          <ShieldCheck className="w-4 h-4 text-indigo-600" />
                          <span>{selectedDeliverable.advisorSignatureStamp}</span>
                        </div>
                        <div className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-mono font-bold">
                          Escrow Released: {selectedDeliverable.releasedAmountSAR.toLocaleString()} SAR
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* TAB 3: BILLING & TAX INVOICES */}
      {activeSubTab === 'billing' && (
        <div className="space-y-6 animate-in fade-in">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-sky-600" />
                <span>{lang === 'ar' ? 'سجل الفواتير الضريبية وسندات الضمان المالي' : 'Tax Invoices & Escrow Financial Settlement Records'}</span>
              </h2>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                {lang === 'ar' 
                  ? 'فواتير ضريبية مبسطة معتمدة وفق متطلبات هيئة الزكاة والضريبة والجمارك (ZATCA) مع سندات إفراج الضمان.' 
                  : 'ZATCA-compliant simplified tax invoices and verified escrow settlement certificates.'}
              </p>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 font-medium flex items-center gap-2 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>VAT: 31094827100003</span>
            </div>
          </div>

          {/* Invoices List Table / Cards */}
          <div className="grid grid-cols-1 gap-4">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 shadow-2xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 transition-all text-slate-800"
              >
                {/* Left: Invoice Meta */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-mono font-bold border border-indigo-200">
                      {inv.invoiceNumber}
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                      {inv.status === 'escrow_released' 
                        ? (lang === 'ar' ? 'تم الإفراج عن الضمان والتحصيل' : 'Settled & Escrow Released') 
                        : (lang === 'ar' ? 'محتجز في حساب الضمان' : 'Held in Escrow')}
                    </span>
                    <span className="text-xs text-slate-500 font-mono font-medium">
                      {inv.issueDate}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    {inv.challengeTitle}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-700 pt-1">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                      <span className="text-slate-500 text-[10px] block font-medium">{lang === 'ar' ? 'المستشار:' : 'Advisor:'}</span>
                      <strong className="text-slate-900">{lang === 'ar' ? inv.advisorName : inv.advisorNameEn}</strong> ({inv.advisorTrackRecord})
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                      <span className="text-slate-500 text-[10px] block font-medium">{lang === 'ar' ? 'سند الإيداع:' : 'Escrow Hold ID:'}</span>
                      <span className="font-mono text-slate-900 font-bold">{inv.escrowHoldTxId}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                      <span className="text-slate-500 text-[10px] block font-medium">{lang === 'ar' ? 'طريقة الدفع:' : 'Payment Method:'}</span>
                      <span className="text-emerald-700 font-bold">{inv.paymentMethod}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Amounts Breakdown & Download Invoice Button */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-end justify-between gap-4 w-full lg:w-auto shrink-0 border-t lg:border-t-0 lg:border-s border-slate-200 pt-4 lg:pt-0 lg:ps-6">
                  <div className="text-start sm:text-end space-y-1">
                    <div className="text-xs text-slate-500 space-x-2 rtl:space-x-reverse font-medium">
                      <span>{lang === 'ar' ? 'أجر الاستشارة:' : 'Fee:'} {inv.advisoryFeeSAR.toLocaleString()} SAR</span>
                      <span>+</span>
                      <span>{lang === 'ar' ? 'ضريبة (15%):' : 'VAT:'} {inv.vatAmountSAR.toLocaleString()} SAR</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">
                      {inv.totalAmountSAR.toLocaleString()} <span className="text-xs font-sans text-indigo-600 font-bold">SAR</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleDownloadTaxInvoice(inv)}
                      className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'تنزيل الفاتورة الضريبية (PDF)' : 'Download Tax Invoice (PDF)'}</span>
                    </button>

                    <button
                      onClick={() => handleCopy(inv.invoiceNumber, inv.id)}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-colors cursor-pointer"
                      title="Copy Invoice ID"
                    >
                      {copiedInvoiceId === inv.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 4: PLATFORM INSIGHTS (Recharts) */}
      {activeSubTab === 'insights' && (
        <PlatformInsights lang={lang} />
      )}

      {/* TAB 5: GOOGLE WORKSPACE & GMAIL NOTIFICATIONS */}
      {activeSubTab === 'workspace' && (
        <div className="animate-in fade-in">
          <GmailNotificationCenter
            lang={lang}
            sessions={sessions}
            isModal={false}
          />
        </div>
      )}

      {/* Rating & Feedback Modal */}
      {selectedSessionForRating && (
        <RatingFeedbackModal
          session={selectedSessionForRating}
          lang={lang}
          onClose={() => setSelectedSessionForRating(null)}
          onSubmitFeedback={(sessionId, feedback) => {
            if (onUpdateFeedback) {
              onUpdateFeedback(sessionId, feedback);
            }
          }}
        />
      )}

    </div>
  );
};
