import React, { useState, useMemo } from 'react';
import { 
  Language, 
  UserRole, 
  Advisor, 
  BookingSession, 
  SystemNotification,
  PostSessionDeliverable,
  SessionRatingFeedback,
  ToastNotification,
  NDAAgreement
} from './types';
import { MOCK_ADVISORS, INITIAL_BOOKINGS, INITIAL_NOTIFICATIONS } from './data/mockData';
import { TRANSLATIONS } from './data/translations';
import { Navbar } from './components/Navbar';
import { AIMatchingSearch } from './components/AIMatchingSearch';
import { AdvisorCard } from './components/AdvisorCard';
import { VideoPitchModal } from './components/VideoPitchModal';
import { BookingModal } from './components/BookingModal';
import { AdvisorWorkspace } from './components/AdvisorWorkspace';
import { ClientDashboard } from './components/ClientDashboard';
import { ArchitectureSpec } from './components/ArchitectureSpec';
import { GlobalToastContainer } from './components/GlobalToastContainer';
import { GmailNotificationCenter } from './components/GmailNotificationCenter';
import { 
  getSavedWorkspaceAuth, 
  sendGmailEmail, 
  buildSessionConfirmationEmailHtml, 
  buildDeliverableReadyEmailHtml,
  createGoogleCalendarEvent 
} from './utils/googleWorkspace';
import { Sparkles, ShieldCheck, CheckCircle2, ChevronRight, Award, Building, Lock } from 'lucide-react';

export default function App() {
  // Global State
  const [lang, setLang] = useState<Language>('ar');
  const [role, setRole] = useState<UserRole>('client');
  const [activeTab, setActiveTab] = useState<'marketplace' | 'mySessions' | 'advisorWorkspace' | 'architectureSpec'>('marketplace');
  
  // Workspace Modal State
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  
  // Data State
  const [advisors, setAdvisors] = useState<Advisor[]>(MOCK_ADVISORS);
  const [sessions, setSessions] = useState<BookingSession[]>(INITIAL_BOOKINGS);
  const [notifications, setNotifications] = useState<SystemNotification[]>(INITIAL_NOTIFICATIONS);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrackRecord, setSelectedTrackRecord] = useState('ALL');
  const [selectedFunction, setSelectedFunction] = useState('ALL');
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [maxHourlyRate, setMaxHourlyRate] = useState(5000);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiMatchScores, setAiMatchScores] = useState<{ [advisorId: string]: { score: number; rationaleAr: string; rationaleEn: string } }>({});

  // Modals
  const [selectedAdvisorForVideo, setSelectedAdvisorForVideo] = useState<Advisor | null>(null);
  const [selectedAdvisorForBooking, setSelectedAdvisorForBooking] = useState<Advisor | null>(null);

  const t = TRANSLATIONS[lang];

  // Toast Dispatcher Helper
  const addToast = (toast: Omit<ToastNotification, 'id'>) => {
    const newToast: ToastNotification = {
      ...toast,
      id: `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now()
    };
    setToasts(prev => [newToast, ...prev].slice(0, 5));
  };

  const handleDismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Update HTML document dir and lang dynamically
  React.useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // AI Semantic Matching Engine Simulator
  const handleAiMatchTriggered = () => {
    if (!searchQuery.trim()) return;
    setIsAiAnalyzing(true);
    
    setTimeout(() => {
      const q = searchQuery.toLowerCase();
      const newScores: { [advisorId: string]: { score: number; rationaleAr: string; rationaleEn: string } } = {};

      advisors.forEach((adv) => {
        let score = 70;
        let matchReasonAr = 'توافق مع معايير القيادة التنفيذية العامة';
        let matchReasonEn = 'General executive leadership fit';

        // Logistics & Supply Chain
        if (q.includes('سلاسل') || q.includes('إمداد') || q.includes('لوجست') || q.includes('نقل') || q.includes('supply') || q.includes('logistics')) {
          if (adv.primaryFunction === 'COO' || adv.primaryTrackRecord === 'SABIC' || adv.sectors.includes('Logistics & Supply Chain')) {
            score = 98;
            matchReasonAr = 'تطابق فائق: قيادة سلاسل إمداد عالمية سابقة في سابك وأرامكو وخفض تكاليف 23%';
            matchReasonEn = 'Ultra fit: Ex-SABIC/Aramco Global Supply Chain EVP, 23% cost reductions';
          }
        }
        // Financial Governance, IPO, Capital
        else if (q.includes('مال') || q.includes('طرح') || q.includes('ipo') || q.includes('حوكمة') || q.includes('تمويل') || q.includes('تدقيق') || q.includes('cfo')) {
          if (adv.primaryFunction === 'CFO' || adv.primaryTrackRecord === 'STC') {
            score = 99;
            matchReasonAr = 'تطابق فائق: الرئيس المالي السابق لـ STC ورئيس لجان تدقيق ومخاطر TASI';
            matchReasonEn = 'Ultra fit: Ex-STC Group CFO & TASI Audit Committee Chair';
          }
        }
        // Retail, FMCG, Market Scaling
        else if (q.includes('توسع') || q.includes('تجزئة') || q.includes('fmcg') || q.includes('سوق') || q.includes('أغذية') || q.includes('retail')) {
          if (adv.primaryFunction === 'CEO' || adv.primaryTrackRecord === 'Almarai') {
            score = 97;
            matchReasonAr = 'تطابق فائق: رئيس تنفيذي سابق بالمراعي ومستشار صفقات استحواذ PIF';
            matchReasonEn = 'Ultra fit: Former Almarai CEO & PIF Strategic M&A Advisor';
          }
        }
        // Tech, Digital Transformation, Cybersecurity
        else if (q.includes('تقني') || q.includes('سحاب') || q.includes('أمن') || q.includes('ذكاء') || q.includes('تحول رقمي') || q.includes('tech') || q.includes('cloud')) {
          if (adv.primaryFunction === 'CTO' || adv.primaryTrackRecord === 'Aramco') {
            score = 96;
            matchReasonAr = 'تطابق فائق: كبير التقنيين السابق في أرامكو وخبير التحول السحابي الوطني';
            matchReasonEn = 'Ultra fit: Ex-Aramco Tech Chief & Cloud Architect';
          }
        }
        // Megaprojects, PPP, Strategy
        else if (q.includes('مشاريع') || q.includes('بحر أحمر') || q.includes('ppp') || q.includes('استراتيج') || q.includes('شراكات') || q.includes('giga')) {
          if (adv.primaryFunction === 'CSO' || adv.primaryTrackRecord === 'PIF') {
            score = 98;
            matchReasonAr = 'تطابق فائق: رئيس استراتيجية مشاريع كبرى في PIF ومستشار سابق McKinsey';
            matchReasonEn = 'Ultra fit: PIF Giga-Project CSO & Ex-McKinsey Lead';
          }
        }
        // HR, C-Suite Talent, Succession
        else if (q.includes('موارد') || q.includes('قيادات') || q.includes('حوافز') || q.includes('تعاقب') || q.includes('رواتب') || q.includes('chro')) {
          if (adv.primaryFunction === 'CHRO' || adv.primaryTrackRecord === 'Maaden') {
            score = 96;
            matchReasonAr = 'تطابق فائق: رئيس رأس المال البشري السابق في معادن والراجحي';
            matchReasonEn = 'Ultra fit: Former CHRO at Maaden & Al Rajhi Bank';
          }
        }

        newScores[adv.id] = {
          score,
          rationaleAr: matchReasonAr,
          rationaleEn: matchReasonEn
        };
      });

      setAiMatchScores(newScores);
      setIsAiAnalyzing(false);
    }, 600);
  };

  // Filtered and AI-Ranked Advisors
  const filteredAdvisors = useMemo(() => {
    return advisors.filter((adv) => {
      // Track record filter
      if (selectedTrackRecord !== 'ALL' && adv.primaryTrackRecord !== selectedTrackRecord) {
        return false;
      }
      // Function filter
      if (selectedFunction !== 'ALL' && adv.primaryFunction !== selectedFunction) {
        return false;
      }
      // Sector filter
      if (selectedSector !== 'ALL' && !adv.sectors.includes(selectedSector as any)) {
        return false;
      }
      // Rate filter
      if (adv.hourlyRate > maxHourlyRate) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      const scoreA = aiMatchScores[a.id]?.score || 0;
      const scoreB = aiMatchScores[b.id]?.score || 0;
      return scoreB - scoreA;
    });
  }, [advisors, selectedTrackRecord, selectedFunction, selectedSector, maxHourlyRate, aiMatchScores]);

  // Handle NDA signing event
  const handleNdaSigned = (nda: NDAAgreement) => {
    // Immediate Global Action Notification
    addToast({
      type: 'nda_signed',
      titleAr: 'تم توقيع اتفاقية السرية (NDA) بنجاح',
      titleEn: 'B2B Mutual NDA Signed & Verified',
      messageAr: `تم توثيق التوقيع الإلكتروني ببصمة مشفرة (${nda.ipProtectionHash.substring(0, 18)}...) وتفعيل شرط عدم الالتفاف لمدة 24 شهراً.`,
      messageEn: `Signed with cryptographic hash (${nda.ipProtectionHash.substring(0, 18)}...) & 24-month non-circumvention protection.`,
      badgeAr: 'توثيق قانوني معتمد',
      badgeEn: 'Legal NDA Stamped',
      referenceCode: nda.agreementNumber
    });
  };

  // Handle new booking
  const handleBookingConfirmed = (newSession: BookingSession) => {
    setSessions(prev => [newSession, ...prev]);
    
    // Add real-time notification to bell
    const newNotif: SystemNotification = {
      id: `notif-${Date.now()}`,
      titleAr: `تم حجز جلسة مع ${newSession.advisor.name}`,
      titleEn: `Session confirmed with ${newSession.advisor.nameEn}`,
      messageAr: `تم توليد رابط Google Meet الآمن وإرسال إشعار Gmail آلي للبريد الإلكتروني ومزامنة Google Calendar.`,
      messageEn: `Google Meet link generated, automated Gmail notification dispatched & Google Calendar synced.`,
      timestamp: lang === 'ar' ? 'الآن' : 'Just now',
      type: 'booking',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Dispatch automated confirmation email via Gmail API if token is present
    const auth = getSavedWorkspaceAuth();
    if (auth && auth.accessToken) {
      const emailHtml = buildSessionConfirmationEmailHtml(newSession, lang);
      const recipient = newSession.clientEmail || auth.userEmail || 'asaadalqurashi@gmail.com';
      sendGmailEmail(
        auth.accessToken,
        recipient,
        newSession.clientName,
        lang === 'ar' ? `تأكيد حجز استشارة تنفيذية - ${newSession.referenceCode}` : `Executive Advisory Session Confirmed - ${newSession.referenceCode}`,
        emailHtml,
        'confirmation',
        newSession.referenceCode
      ).catch(() => {});
      createGoogleCalendarEvent(auth.accessToken, newSession).catch(() => {});
    }

    // Immediate Global Action Notification (Escrow Payment Locked & Email Sent)
    addToast({
      type: 'escrow_locked',
      titleAr: 'تم إيداع المبلغ وإرسال إشعار Gmail تلقائي',
      titleEn: 'Escrow Secured & Gmail Notification Dispatched',
      messageAr: `تم احتجاز مبلغ ${newSession.totalPaidSAR.toLocaleString()} ر.س بأمان، وتوليد غرفة Google Meet، وإرسال بريد التأكيد الإلكتروني لمكتب الرئيس التنفيذي.`,
      messageEn: `${newSession.totalPaidSAR.toLocaleString()} SAR secured in escrow. Encrypted Meet room created and confirmation email dispatched to executive.`,
      badgeAr: 'تنبيه Gmail مرسل',
      badgeEn: 'Gmail Dispatched',
      referenceCode: newSession.referenceCode,
      amountSAR: newSession.totalPaidSAR,
      action: {
        labelAr: 'عرض الجلسة في المستودع',
        labelEn: 'View in Sessions Vault',
        onClick: () => {
          setRole('client');
          setActiveTab('mySessions');
        }
      }
    });
  };

  // Handle deliverable submission by advisor
  const handleSubmitDeliverable = (sessionId: string, deliverable: PostSessionDeliverable) => {
    setSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        return {
          ...s,
          status: 'completed',
          escrowStatus: 'released_to_advisor',
          deliverable
        };
      }
      return s;
    }));

    const sessionObj = sessions.find(s => s.id === sessionId);

    // Dispatch automated deliverable alert email via Gmail API if token is present
    const auth = getSavedWorkspaceAuth();
    if (auth && auth.accessToken && sessionObj) {
      const emailHtml = buildDeliverableReadyEmailHtml(sessionObj, deliverable, lang);
      const recipient = sessionObj.clientEmail || auth.userEmail || 'asaadalqurashi@gmail.com';
      sendGmailEmail(
        auth.accessToken,
        recipient,
        sessionObj.clientName,
        lang === 'ar' ? `جاهزية تقرير التوصيات وخارطة الـ 90 يوماً - ${sessionObj.referenceCode}` : `Executive 90-Day Roadmap Deliverable Ready - ${sessionObj.referenceCode}`,
        emailHtml,
        'deliverable_ready',
        sessionObj.referenceCode
      ).catch(() => {});
    }

    const notif: SystemNotification = {
      id: `notif-${Date.now()}`,
      titleAr: 'تم تسليم تقرير التوصيات وإرسال تنبيه Gmail',
      titleEn: 'Deliverable Submitted & Gmail Alert Sent',
      messageAr: `قام ${deliverable.advisorName} برفع تقرير خارطة طريق الـ 90 يوماً وتم إرسال تنبيه البريد الإلكتروني للعميل.`,
      messageEn: `${deliverable.advisorName} submitted the 90-day roadmap. Executive email alert dispatched.`,
      timestamp: lang === 'ar' ? 'الآن' : 'Just now',
      type: 'deliverable',
      read: false
    };
    setNotifications(prev => [notif, ...prev]);

    // Global Action Notification (Deliverable Submitted & Escrow Released)
    addToast({
      type: 'deliverable_submitted',
      titleAr: 'تم تسليم خارطة الـ 90 يوماً وإرسال إشعار Gmail',
      titleEn: '90-Day Roadmap Submitted & Gmail Alert Sent',
      messageAr: `قام ${deliverable.advisorName} برفع تقرير التوصيات، وتم إرسال تنبيه البريد التنفيذي وتحويل المستحقات البنكية (${deliverable.releasedAmountSAR.toLocaleString()} ر.س) فوراً.`,
      messageEn: `${deliverable.advisorName} uploaded strategic roadmap. Gmail alert dispatched and escrow funds (${deliverable.releasedAmountSAR.toLocaleString()} SAR) released.`,
      badgeAr: 'تنبيه البريد مرسل',
      badgeEn: 'Email Alert Sent',
      referenceCode: sessionObj?.referenceCode,
      action: {
        labelAr: 'تنزيل ملخص التقرير (PDF)',
        labelEn: 'Download Summary PDF',
        onClick: () => {
          setRole('client');
          setActiveTab('mySessions');
        }
      }
    });
  };

  const handleUpdateAdvisorProfile = (updatedAdvisor: Partial<Advisor>) => {
    setAdvisors(prev => prev.map(a => a.id === (updatedAdvisor.id || 'adv-01') ? { ...a, ...updatedAdvisor } : a));
    const notif: SystemNotification = {
      id: `notif-${Date.now()}`,
      titleAr: 'تم تحديث الملف التنفيذي وفيديو الـ 30 ثانية',
      titleEn: 'Executive Profile & Video Pitch Updated',
      messageAr: 'تم حفظ التعديلات على النبذة المهنية، أجر الساعة، ونموذج الفيديو التقديمي بنجاح.',
      messageEn: 'Your executive profile, advisory hourly rate, and video pitch have been updated.',
      timestamp: lang === 'ar' ? 'الآن' : 'Just now',
      type: 'deliverable',
      read: false
    };
    setNotifications(prev => [notif, ...prev]);

    // Global Action Notification (Profile Updated)
    addToast({
      type: 'profile_updated',
      titleAr: 'تم تحديث الملف التنفيذي وفيديو الـ 30 ثانية',
      titleEn: 'Executive Profile & Video Pitch Updated',
      messageAr: 'تم حفظ التعديلات على النبذة المهنية، أجر الاستشارة، ونموذج الفيديو التقديمي بنجاح.',
      messageEn: 'Your executive profile, advisory hourly rate, and video pitch have been updated successfully.',
      badgeAr: 'الملف محدث',
      badgeEn: 'Profile Synced'
    });
  };

  const handleUpdateFeedback = (sessionId: string, feedback: SessionRatingFeedback) => {
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, ratingFeedback: feedback } : s));
    const sObj = sessions.find(s => s.id === sessionId);
    const notif: SystemNotification = {
      id: `notif-${Date.now()}`,
      titleAr: 'تم توثيق تقييم الجلسة والتوصيات',
      titleEn: 'Session Rating & Feedback Recorded',
      messageAr: `شكراً لمشاركتك! تم تسجيل تقييمك (${feedback.ratingOverall}/5) للخبير ${sObj?.advisor?.name || ''}.`,
      messageEn: `Thank you! Your verified rating (${feedback.ratingOverall}/5) has been submitted.`,
      timestamp: lang === 'ar' ? 'الآن' : 'Just now',
      type: 'deliverable',
      read: false
    };
    setNotifications(prev => [notif, ...prev]);

    // Global Action Notification (Feedback Submitted)
    addToast({
      type: 'feedback_submitted',
      titleAr: 'تم توثيق تقييم الاستشارة واعتماد المراجعة',
      titleEn: 'Verified Client Feedback Recorded',
      messageAr: `شكراً لك! تم توثيق تقييمك (${feedback.ratingOverall}.0/5.0) وتوصياتك في سجل التقييمات المعتمدة.`,
      messageEn: `Thank you! Your verified rating (${feedback.ratingOverall}.0/5.0) and feedback have been recorded.`,
      badgeAr: 'تقييم معتمد',
      badgeEn: 'Verified Review'
    });
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Executive Navbar with Role Switcher, Language Toggle, and Escrow Badge */}
      <Navbar
        lang={lang}
        setLang={setLang}
        role={role}
        setRole={setRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        notifications={notifications}
        markNotificationRead={markNotificationRead}
        onOpenWorkspace={() => setShowWorkspaceModal(true)}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        
        {/* VIEW 1: Advisory Marketplace & AI Match Engine */}
        {activeTab === 'marketplace' && (
          <div>
            <AIMatchingSearch
              lang={lang}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedTrackRecord={selectedTrackRecord}
              setSelectedTrackRecord={setSelectedTrackRecord}
              selectedFunction={selectedFunction}
              setSelectedFunction={setSelectedFunction}
              selectedSector={selectedSector}
              setSelectedSector={setSelectedSector}
              maxHourlyRate={maxHourlyRate}
              setMaxHourlyRate={setMaxHourlyRate}
              onAiMatchTriggered={handleAiMatchTriggered}
              isAiAnalyzing={isAiAnalyzing}
            />

            {/* Advisor Cards Catalog */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">
                    {lang === 'ar' ? 'نخبة المستشارين التنفيذيين المتاحين' : 'Available Executive Advisors'}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200 font-mono">
                    {filteredAdvisors.length}
                  </span>
                </div>

                <span className="text-xs text-slate-500 font-medium">
                  {lang === 'ar' ? 'تحديث لحظي لتقويم Google Meet' : 'Real-time Google Meet sync active'}
                </span>
              </div>

              {filteredAdvisors.length === 0 ? (
                <div className="text-center py-16 p-8 rounded-2xl bg-white border border-slate-200 text-slate-500 shadow-2xs">
                  <p className="text-base font-semibold text-slate-800">
                    {lang === 'ar' ? 'لم يتم العثور على خبراء يطابقون خيارات البحث المحددة' : 'No advisors match your exact filter criteria'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {lang === 'ar' ? 'جرب إعادة ضبط خيارات التصفية أو توسيع كلمات البحث للعثور على مستشارين مناسبين.' : 'Try resetting filters or broadening your search terms to find available advisors.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAdvisors.map((advisor) => (
                    <AdvisorCard
                      key={advisor.id}
                      advisor={advisor}
                      lang={lang}
                      onBookClick={(adv) => setSelectedAdvisorForBooking(adv)}
                      onWatchVideoClick={(adv) => setSelectedAdvisorForVideo(adv)}
                      aiMatchScore={aiMatchScores[advisor.id]?.score}
                      matchRationale={lang === 'ar' ? aiMatchScores[advisor.id]?.rationaleAr : aiMatchScores[advisor.id]?.rationaleEn}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: Client Dashboard & Deliverables Vault */}
        {activeTab === 'mySessions' && (
          <ClientDashboard
            sessions={sessions}
            lang={lang}
            onBookNewSession={() => setActiveTab('marketplace')}
            onUpdateFeedback={handleUpdateFeedback}
          />
        )}

        {/* VIEW 3: Executive Advisor Workspace */}
        {activeTab === 'advisorWorkspace' && (
          <AdvisorWorkspace
            sessions={sessions}
            lang={lang}
            advisor={advisors[0]}
            onAcceptSession={(id) => {}}
            onRejectSession={(id) => {}}
            onSubmitDeliverable={handleSubmitDeliverable}
            onUpdateAdvisorProfile={handleUpdateAdvisorProfile}
          />
        )}

        {/* VIEW 4: Principal Systems Architecture Specification */}
        {activeTab === 'architectureSpec' && (
          <ArchitectureSpec lang={lang} />
        )}

      </main>

      {/* Video Elevator Pitch Modal */}
      {selectedAdvisorForVideo && (
        <VideoPitchModal
          advisor={selectedAdvisorForVideo}
          lang={lang}
          onClose={() => setSelectedAdvisorForVideo(null)}
          onBookNow={(adv) => {
            setSelectedAdvisorForVideo(null);
            setSelectedAdvisorForBooking(adv);
          }}
        />
      )}

      {/* Complete 5-Step Direct Booking & Governance Modal */}
      {selectedAdvisorForBooking && (
        <BookingModal
          advisor={selectedAdvisorForBooking}
          lang={lang}
          onClose={() => setSelectedAdvisorForBooking(null)}
          onBookingConfirmed={handleBookingConfirmed}
          onNdaSigned={handleNdaSigned}
        />
      )}

      {/* Google Workspace & Gmail Notification Center Modal */}
      {showWorkspaceModal && (
        <GmailNotificationCenter
          lang={lang}
          sessions={sessions}
          isModal={true}
          onClose={() => setShowWorkspaceModal(false)}
        />
      )}

      {/* Global Non-Intrusive Action Notifications (Toast System) */}
      <GlobalToastContainer
        toasts={toasts}
        lang={lang}
        onDismiss={handleDismissToast}
      />

      {/* Live System Operational Ticker */}
      <div className="bg-white border-t border-b border-slate-200 py-2.5 px-4 text-xs shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-800">
              {lang === 'ar' ? 'النظام التشغيلي متصل بالكامل:' : 'Live System Connectivity:'}
            </span>
            <span className="text-indigo-600 font-medium">
              {lang === 'ar' ? 'Google Meet API & OAuth 2.0 مزامنة فورية' : 'Google Meet API & Calendar Synced'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <span className="text-slate-300">|</span>
              <span>{lang === 'ar' ? 'رصيد الضمان المودع:' : 'Escrow Vault:'}</span>
              <span className="text-indigo-600 font-bold">12,400 SAR</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="text-slate-300">|</span>
              <span>{lang === 'ar' ? 'اتفاقيات NDA الموقعة:' : 'Signed NDAs:'}</span>
              <span className="text-emerald-700 font-bold">8 Active</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="text-slate-300">|</span>
              <span>{lang === 'ar' ? 'آخر تسليم استشاري:' : 'Last Delivered Roadmap:'}</span>
              <span className="text-slate-700 font-semibold">{lang === 'ar' ? 'منذ 4 ساعات' : '4h ago'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Enterprise Platform Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 border border-indigo-700 flex items-center justify-center font-bold text-white">
              م
            </div>
            <div>
              <p className="text-slate-900 font-bold">{t.brandName} - {t.brandTagline}</p>
              <p className="text-[11px] text-slate-400">© 2026 Mushowr Executive Advisory Ltd. All rights reserved.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-600 font-medium">
            <span className="flex items-center gap-1 text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Escrow Protected & NDA Encrypted</span>
            </span>
            <span>•</span>
            <button onClick={() => setActiveTab('architectureSpec')} className="hover:text-indigo-600 transition-colors cursor-pointer">
              {lang === 'ar' ? 'المواصفات التقنية والـ API' : 'System Architecture'}
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
