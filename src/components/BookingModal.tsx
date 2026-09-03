import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  UploadCloud, 
  FileText, 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  CheckCircle2, 
  Copy, 
  Download, 
  Video, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Paperclip, 
  Trash2, 
  AlertCircle, 
  FileCheck, 
  Building2, 
  UserCheck,
  Zap,
  ListChecks,
  ExternalLink,
  Sun,
  Sunset,
  Moon,
  Info,
  Check,
  Award
} from 'lucide-react';
import { Advisor, Language, BookingSession, NDAAgreement } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { PRESET_CHALLENGE_TEMPLATES, PresetChallengeTemplate } from '../data/mockData';

interface BookingModalProps {
  advisor: Advisor | null;
  lang: Language;
  onClose: () => void;
  onBookingConfirmed: (newSession: BookingSession) => void;
  onNdaSigned?: (nda: NDAAgreement) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  advisor,
  lang,
  onClose,
  onBookingConfirmed,
  onNdaSigned
}) => {
  const isRtl = lang === 'ar';
  const t = TRANSLATIONS[lang];

  // Booking Flow Mode: 'express' (1-Screen Fast Booking) or 'guided' (5-Step Tour)
  const [bookingMode, setBookingMode] = useState<'express' | 'guided'>('express');
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Time slot filtering
  const [slotPeriodFilter, setSlotPeriodFilter] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');

  // Step 1: Calendar & Slot
  const [selectedDate, setSelectedDate] = useState('2026-09-03');
  const [selectedSlot, setSelectedSlot] = useState('10:00 AM - 11:00 AM');
  const [calendarSyncActive, setCalendarSyncActive] = useState(true);

  // Step 2: Challenge Brief & Document Vault
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [briefTitle, setBriefTitle] = useState('إعادة هيكلة سلاسل الإمداد اللوجستية وخفض كلفة النقل');
  const [briefDesc, setBriefDesc] = useState('نواجه تحديات في تكلفة الميل الأخير وتأخيرات في سلاسل الإمداد بمستودعاتنا المركزية. نحتاج لتشخيص تنفيذي مباشر لإعادة توزيع أسطول النقل ومراكز الفرز.');
  const [strategicGoal, setStrategicGoal] = useState('خفض كلفة النقل بنسبة 18% وتحقيق كفاءة سلاسل التوريد خلال 90 يوماً.');
  const [attachedFiles, setAttachedFiles] = useState<Array<{ id: string; name: string; size: string; type: string; uploadedAt: string }>>([
    { id: 'f1', name: 'Logistics_Bottlenecks_Audit.pdf', size: '2.8 MB', type: 'application/pdf', uploadedAt: '2026-08-30' }
  ]);
  const [isUploading, setIsUploading] = useState(false);

  // Step 3: NDA E-Sign
  const [clientSignerName, setClientSignerName] = useState('أ. مشعل بن فهد الدوسري (الرئيس التنفيذي)');
  const [clientCompanyName, setClientCompanyName] = useState('شركة الأفق للحلول اللوجستية');
  const [clientEmail, setClientEmail] = useState('m.aldosari@alofooq-logistics.sa');
  const [clientPhone, setClientPhone] = useState('+966 50 123 4567');
  const [ndaAccepted, setNdaAccepted] = useState(true);
  const [generatedNdaHash] = useState('sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069');

  // Step 4: Escrow Payment
  const [paymentMethod, setPaymentMethod] = useState<'mada' | 'corporate_card' | 'bank_transfer'>('mada');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Step 5: Generated Artifacts & Feedback
  const [createdSession, setCreatedSession] = useState<BookingSession | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Find recommended templates for this advisor
  const advisorTemplates = useMemo(() => {
    if (!advisor) return PRESET_CHALLENGE_TEMPLATES;
    const matched = PRESET_CHALLENGE_TEMPLATES.filter(tpl => tpl.functionCategory === advisor.primaryFunction);
    return matched.length > 0 ? matched : PRESET_CHALLENGE_TEMPLATES;
  }, [advisor]);

  // Set default brief from matched template on initial load
  useEffect(() => {
    if (advisor && advisorTemplates.length > 0 && !selectedTemplateId) {
      const firstTpl = advisorTemplates[0];
      setSelectedTemplateId(firstTpl.id);
      setBriefTitle(lang === 'ar' ? firstTpl.titleAr : firstTpl.titleEn);
      setBriefDesc(lang === 'ar' ? firstTpl.descriptionAr : firstTpl.descriptionEn);
      setStrategicGoal(lang === 'ar' ? firstTpl.strategicGoalAr : firstTpl.strategicGoalEn);
    }
  }, [advisor, lang]);

  if (!advisor) return null;

  const sessionFee = advisor.hourlyRate;
  const platformFee = Math.round(sessionFee * 0.10);
  const vat = Math.round((sessionFee + platformFee) * 0.15);
  const totalAmount = sessionFee + platformFee + vat;

  // Calendar dates with realistic slots
  const availableDates = [
    { 
      date: '2026-09-03', 
      dayAr: 'الخميس', 
      dayEn: 'Thursday', 
      slots: [
        { time: '09:00 AM - 10:00 AM', period: 'morning' },
        { time: '10:00 AM - 11:00 AM', period: 'morning' },
        { time: '02:00 PM - 03:00 PM', period: 'afternoon' },
        { time: '05:30 PM - 06:30 PM', period: 'evening' }
      ] 
    },
    { 
      date: '2026-09-06', 
      dayAr: 'الأحد', 
      dayEn: 'Sunday', 
      slots: [
        { time: '10:00 AM - 11:00 AM', period: 'morning' },
        { time: '11:30 AM - 12:30 PM', period: 'morning' },
        { time: '01:30 PM - 02:30 PM', period: 'afternoon' },
        { time: '04:00 PM - 05:00 PM', period: 'afternoon' }
      ] 
    },
    { 
      date: '2026-09-08', 
      dayAr: 'الثلاثاء', 
      dayEn: 'Tuesday', 
      slots: [
        { time: '09:30 AM - 10:30 AM', period: 'morning' },
        { time: '01:00 PM - 02:00 PM', period: 'afternoon' },
        { time: '03:30 PM - 04:30 PM', period: 'afternoon' },
        { time: '06:00 PM - 07:00 PM', period: 'evening' }
      ] 
    }
  ];

  const activeDateObj = availableDates.find(d => d.date === selectedDate) || availableDates[0];
  const filteredSlots = activeDateObj.slots.filter(s => {
    if (slotPeriodFilter === 'all') return true;
    return s.period === slotPeriodFilter;
  });

  const handleSelectTemplate = (tpl: PresetChallengeTemplate) => {
    setSelectedTemplateId(tpl.id);
    setBriefTitle(lang === 'ar' ? tpl.titleAr : tpl.titleEn);
    setBriefDesc(lang === 'ar' ? tpl.descriptionAr : tpl.descriptionEn);
    setStrategicGoal(lang === 'ar' ? tpl.strategicGoalAr : tpl.strategicGoalEn);
  };

  const handleClearTemplate = () => {
    setSelectedTemplateId(null);
    setBriefTitle('');
    setBriefDesc('');
    setStrategicGoal('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      const file = e.target.files[0];
      setTimeout(() => {
        setAttachedFiles(prev => [
          ...prev,
          {
            id: `f-${Date.now()}`,
            name: file.name,
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            type: file.type || 'application/octet-stream',
            uploadedAt: new Date().toISOString().split('T')[0]
          }
        ]);
        setIsUploading(false);
      }, 500);
    }
  };

  const removeFile = (id: string) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleProcessBooking = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      const generatedMeetLink = `https://meet.google.com/msh-${advisor.primaryTrackRecord.toLowerCase()}-${Math.random().toString(36).substring(2, 6)}`;
      const refCode = `MSH-SES-${Math.floor(1000 + Math.random() * 9000)}`;

      const newNda: NDAAgreement = {
        id: `nda-${Date.now()}`,
        agreementNumber: `MSH-NDA-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        clientName: clientSignerName,
        clientCompany: clientCompanyName,
        clientSignDate: new Date().toLocaleString(),
        clientSignatureData: clientSignerName,
        advisorName: advisor.name,
        advisorSignDate: new Date().toLocaleString(),
        advisorSignatureData: advisor.name,
        ipProtectionHash: generatedNdaHash,
        status: 'fully_executed',
        governingLaw: 'أنظمة المملكة العربية السعودية التجارية والقضائية',
        nonCircumventionMonths: 24
      };

      const newSession: BookingSession = {
        id: `ses-${Date.now()}`,
        referenceCode: refCode,
        advisorId: advisor.id,
        advisor,
        clientId: 'client-881',
        clientName: clientSignerName,
        clientCompany: clientCompanyName,
        clientEmail: clientEmail,
        clientPhone: clientPhone,
        date: selectedDate,
        timeSlot: selectedSlot,
        timezone: 'Asia/Riyadh (GMT+3)',
        status: 'confirmed',
        meetLink: generatedMeetLink,
        calendarSynced: calendarSyncActive,
        challengeBrief: {
          id: `brf-${Date.now()}`,
          title: briefTitle || (lang === 'ar' ? 'استشارة استراتيجية تنفيذية' : 'Executive Advisory Session'),
          industry: advisor.sectors[0],
          companyName: clientCompanyName,
          companyStage: 'growth',
          description: briefDesc || (lang === 'ar' ? 'جلسة تشخيص تنفيذي واستراتيجي' : 'Strategic executive diagnostic session'),
          urgency: 'immediate',
          strategicGoal: strategicGoal || (lang === 'ar' ? 'خارطة طريق تنفيذية لمدة 90 يوماً' : '90-Day actionable roadmap'),
          attachedFiles,
          budgetCapSAR: totalAmount
        },
        nda: newNda,
        escrowStatus: 'held_in_escrow',
        feeSAR: sessionFee,
        platformFeeSAR: platformFee,
        vatSAR: vat,
        totalPaidSAR: totalAmount,
        escrowHoldTxId: `ESCROW-TX-${Math.floor(10000000 + Math.random() * 90000000)}`,
        remindersScheduled: {
          h24: true,
          h1: true,
          m10: true
        },
        createdAt: new Date().toISOString()
      };

      setCreatedSession(newSession);
      onBookingConfirmed(newSession);
      if (onNdaSigned) onNdaSigned(newNda);
      setIsProcessingPayment(false);
      setCurrentStep(5);
    }, 900);
  };

  const handleCopyLink = () => {
    if (createdSession) {
      navigator.clipboard?.writeText(createdSession.meetLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Generate Google Calendar Web Add Link
  const googleCalendarUrl = useMemo(() => {
    if (!createdSession) return '#';
    const title = encodeURIComponent(`مشور: جلسة استشارية تنفيذية - ${advisor.name}`);
    const details = encodeURIComponent(
      `منصة مشور للاستشارات التنفيذية B2B\n` +
      `المستشار: ${advisor.name} (${advisor.functionLabelAr})\n` +
      `العميل: ${createdSession.clientName} - ${createdSession.clientCompany}\n` +
      `رابط Google Meet: ${createdSession.meetLink}\n` +
      `رقم الجلسة: ${createdSession.referenceCode}\n` +
      `محمية باتفاقية السرية وحساب الضمان.`
    );
    const location = encodeURIComponent(createdSession.meetLink);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  }, [createdSession, advisor]);

  const downloadIcsMock = () => {
    if (!createdSession) return;
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Mushowr//Executive Advisory Platform//AR
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VEVENT
UID:${createdSession.id}@mushowr.sa
DTSTAMP:20260901T000000Z
DTSTART:20260903T070000Z
DTEND:20260903T080000Z
SUMMARY:مشور: جلسة استشارة مع ${advisor.name}
DESCRIPTION:رابط الاجتماع: ${createdSession.meetLink}\\nالرقم المرجعي: ${createdSession.referenceCode}
LOCATION:${createdSession.meetLink}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `Mushowr_Advisory_${createdSession.referenceCode}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        id="booking-modal-container"
        className="relative w-full max-w-4xl bg-white border border-slate-200/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto"
      >
        
        {/* Top Header - Teams Purple Branded */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#5B5FC7] via-[#4F52B2] to-[#383A7F] text-white border-b border-[#D1D3F8]/30 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={advisor.avatar}
              alt={advisor.name}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-white/60 shadow-md shrink-0"
            />
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
                <span>{advisor.primaryTrackRecord} • {advisor.functionLabelAr}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white font-serif mt-1">
                {lang === 'ar' ? advisor.name : advisor.nameEn}
              </h2>
              <p className="text-xs text-white/90 font-normal">
                {lang === 'ar' ? advisor.currentRole : advisor.currentRoleEn}
              </p>
            </div>
          </div>

          <button
            id="close-booking-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-all cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs (Express vs Guided) - Only visible when not in Step 5 Confirmation */}
        {currentStep !== 5 && (
          <div className="px-5 sm:px-6 pt-3.5 pb-2.5 bg-[#F5F6F8] border-b border-[#E1DFDD] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#ECEEF2] border border-[#E1DFDD]">
              <button
                onClick={() => setBookingMode('express')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  bookingMode === 'express'
                    ? 'bg-[#5B5FC7] text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-white" />
                <span>{t.bookingFlow.modeExpress}</span>
              </button>

              <button
                onClick={() => setBookingMode('guided')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  bookingMode === 'guided'
                    ? 'bg-[#5B5FC7] text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                <ListChecks className="w-3.5 h-3.5 text-[#5B5FC7]" />
                <span>{t.bookingFlow.modeGuided}</span>
              </button>
            </div>

            {/* Teams Calendar & Escrow Sync Pill */}
            <div className="flex items-center gap-2 text-[11px] text-[#107C41] font-medium bg-[#E6F5EC] px-3 py-1 rounded-full border border-[#107C41]/30">
              <ShieldCheck className="w-3.5 h-3.5 text-[#107C41] shrink-0" />
              <span>{lang === 'ar' ? 'تزامن تقويم Teams و Google Meet مع ضمان مالي' : 'Teams & Meet Calendar Synced • Escrow Protected'}</span>
            </div>
          </div>
        )}

        {/* Guided Step Progress Bar (Only in Guided Mode and when step < 5) */}
        {bookingMode === 'guided' && currentStep !== 5 && (
          <div className="px-5 sm:px-6 py-3 bg-white border-b border-[#E1DFDD] overflow-x-auto">
            <div className="flex items-center justify-between min-w-[500px] text-xs">
              {[
                { step: 1, label: t.bookingFlow.step1 },
                { step: 2, label: t.bookingFlow.step2 },
                { step: 3, label: t.bookingFlow.step3 },
                { step: 4, label: t.bookingFlow.step4 },
              ].map((s) => (
                <button
                  key={s.step}
                  onClick={() => setCurrentStep(s.step as any)}
                  className={`flex items-center gap-2 font-bold transition-colors cursor-pointer ${
                    currentStep === s.step
                      ? 'text-[#5B5FC7]'
                      : currentStep > s.step
                      ? 'text-[#107C41]'
                      : 'text-slate-400'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    currentStep === s.step
                      ? 'bg-[#EEF0FF] text-[#5B5FC7] border-2 border-[#5B5FC7]'
                      : currentStep > s.step
                      ? 'bg-[#E6F5EC] text-[#107C41]'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {currentStep > s.step ? '✓' : s.step}
                  </span>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto max-h-[70vh] space-y-6">
          
          {/* ========================================================== */}
          {/* ⚡ EXPRESS 1-SCREEN BOOKING MODE                           */}
          {/* ========================================================== */}
          {bookingMode === 'express' && currentStep !== 5 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Section 1: Teams Scheduling Assistant & Calendar */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E1DFDD] shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E8EBED]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#EEF0FF] text-[#5B5FC7] flex items-center justify-center font-bold">
                      <CalendarIcon className="w-4 h-4 text-[#5B5FC7]" />
                    </div>
                    <div>
                      <span className="text-slate-900 font-bold text-sm block">
                        {lang === 'ar' ? 'تقويم جدولة الاجتماع التنفيذي' : 'Executive Scheduling Assistant'}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        (UTC+03:00) Riyadh • 60 min session
                      </span>
                    </div>
                  </div>

                  {/* Time Period Filter Chips - Teams Pill Style */}
                  <div className="flex items-center gap-1 bg-[#F5F6F8] p-1 rounded-xl border border-[#E1DFDD] text-[11px]">
                    <button
                      onClick={() => setSlotPeriodFilter('all')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        slotPeriodFilter === 'all' ? 'bg-[#5B5FC7] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-950'
                      }`}
                    >
                      {t.bookingFlow.periodAll}
                    </button>
                    <button
                      onClick={() => setSlotPeriodFilter('morning')}
                      className={`px-2 py-1 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        slotPeriodFilter === 'morning' ? 'bg-[#5B5FC7] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-950'
                      }`}
                    >
                      <Sun className="w-3 h-3 text-amber-500" />
                      <span>{lang === 'ar' ? 'صباحي' : 'Morning'}</span>
                    </button>
                    <button
                      onClick={() => setSlotPeriodFilter('afternoon')}
                      className={`px-2 py-1 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        slotPeriodFilter === 'afternoon' ? 'bg-[#5B5FC7] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-950'
                      }`}
                    >
                      <Sunset className="w-3 h-3 text-orange-500" />
                      <span>{lang === 'ar' ? 'بعد الظهر' : 'Afternoon'}</span>
                    </button>
                    <button
                      onClick={() => setSlotPeriodFilter('evening')}
                      className={`px-2 py-1 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        slotPeriodFilter === 'evening' ? 'bg-[#5B5FC7] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-950'
                      }`}
                    >
                      <Moon className="w-3 h-3 text-indigo-500" />
                      <span>{lang === 'ar' ? 'مسائي' : 'Evening'}</span>
                    </button>
                  </div>
                </div>

                {/* Teams Calendar Day Picker Strip */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    {lang === 'ar' ? 'اختر اليوم المتاح' : 'Select Available Day'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {availableDates.map((d) => {
                      const isSelected = selectedDate === d.date;
                      return (
                        <button
                          key={d.date}
                          onClick={() => {
                            setSelectedDate(d.date);
                            if (d.slots.length > 0) setSelectedSlot(d.slots[0].time);
                          }}
                          className={`p-3.5 rounded-2xl border text-start transition-all cursor-pointer relative overflow-hidden ${
                            isSelected
                              ? 'bg-[#EEF0FF] border-[#5B5FC7] shadow-sm text-slate-950 ring-2 ring-[#5B5FC7]/20'
                              : 'bg-white border-[#E1DFDD] hover:border-[#5B5FC7]/40 text-slate-700 hover:bg-[#F5F6F8]'
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-0 right-0 left-0 h-1 bg-[#5B5FC7]" />
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-600">{lang === 'ar' ? d.dayAr : d.dayEn}</span>
                            <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-[#5B5FC7]' : 'bg-[#107C41]'}`} />
                          </div>
                          <p className="text-base font-bold mt-1 font-mono text-slate-900">{d.date}</p>
                          <div className="mt-2 flex items-center justify-between text-[10px]">
                            <span className={`px-2 py-0.5 rounded-md font-bold ${
                              isSelected ? 'bg-[#5B5FC7] text-white' : 'bg-[#F5F6F8] text-[#107C41] border border-[#E1DFDD]'
                            }`}>
                              {d.slots.length} {lang === 'ar' ? 'مواعيد متاحة' : 'free slots'}
                            </span>
                            <span className="text-slate-400 font-mono">60m</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Teams Calendar Time Slots - Grid Cards */}
                <div>
                  <label className="block text-xs font-bold text-[#5B5FC7] uppercase tracking-wider mb-2">
                    {lang === 'ar' ? 'المواعيد المتاحة (Teams Agenda Slots)' : 'Available Agenda Slots'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {filteredSlots.map((s, idx) => {
                      const isSelected = selectedSlot === s.time;
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedSlot(s.time)}
                          className={`p-3 rounded-xl border text-start transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                            isSelected
                              ? 'bg-[#5B5FC7] text-white border-[#5B5FC7] shadow-sm ring-2 ring-[#5B5FC7]/30'
                              : 'bg-white text-slate-800 border-[#E1DFDD] hover:bg-[#EEF0FF]/50 hover:border-[#5B5FC7]/40'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold">{s.time}</span>
                            <Video className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#5B5FC7]'}`} />
                          </div>
                          <div className="flex items-center justify-between text-[10px] pt-1 border-t border-current/15">
                            <span className={`flex items-center gap-1 font-semibold ${isSelected ? 'text-white/90' : 'text-[#107C41]'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-[#107C41]'}`} />
                              <span>{lang === 'ar' ? 'متاح' : 'Free'}</span>
                            </span>
                            <span className={`font-mono ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>60m</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Section 2: Strategic Challenge Brief with 1-Click Preset Templates */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E1DFDD] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E8EBED]">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <Sparkles className="w-4 h-4 text-[#5B5FC7]" />
                    <span>{t.bookingFlow.presetTemplatesLabel}</span>
                  </div>
                  <button
                    onClick={handleClearTemplate}
                    className="text-[11px] text-[#5B5FC7] hover:underline font-medium cursor-pointer"
                  >
                    {t.bookingFlow.customBriefOption}
                  </button>
                </div>

                {/* Preset Templates Horizontal Chips */}
                <div className="flex flex-wrap gap-2">
                  {advisorTemplates.map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => handleSelectTemplate(tpl)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                        selectedTemplateId === tpl.id
                          ? 'bg-[#EEF0FF] border-[#5B5FC7] text-[#383A7F] shadow-2xs'
                          : 'bg-[#F5F6F8] border-[#E1DFDD] text-slate-700 hover:bg-[#EEF0FF]/40'
                      }`}
                    >
                      {selectedTemplateId === tpl.id ? <Check className="w-3.5 h-3.5 text-[#107C41]" /> : <Sparkles className="w-3 h-3 text-[#5B5FC7]" />}
                      <span>{lang === 'ar' ? tpl.titleAr : tpl.titleEn}</span>
                    </button>
                  ))}
                </div>

                {/* Challenge Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.bookingFlow.challengeTitleLabel}
                  </label>
                  <input
                    type="text"
                    value={briefTitle}
                    onChange={(e) => setBriefTitle(e.target.value)}
                    placeholder="عنوان التحدي الاستراتيجي..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F6F8] border border-[#E1DFDD] text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#5B5FC7] focus:bg-white"
                  />
                </div>

                {/* Challenge Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.bookingFlow.challengeDescLabel}
                  </label>
                  <textarea
                    rows={2}
                    value={briefDesc}
                    onChange={(e) => setBriefDesc(e.target.value)}
                    placeholder="سياق التحدي..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F6F8] border border-[#E1DFDD] text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#5B5FC7] focus:bg-white"
                  />
                </div>

                {/* Strategic Goal */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.bookingFlow.strategicGoalLabel}
                  </label>
                  <input
                    type="text"
                    value={strategicGoal}
                    onChange={(e) => setStrategicGoal(e.target.value)}
                    placeholder="الهدف والمخرجات المتوقعة..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F6F8] border border-[#E1DFDD] text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#5B5FC7] focus:bg-white"
                  />
                </div>
              </div>

              {/* Section 3: Document Vault & Direct NDA Consent */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* File Upload Vault */}
                <div className="p-4 rounded-2xl bg-[#F5F6F8] border border-[#E1DFDD] flex flex-col justify-between">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                      <Paperclip className="w-3.5 h-3.5 text-[#5B5FC7]" />
                      <span>{t.bookingFlow.uploadDocuments}</span>
                    </label>
                    <p className="text-[11px] text-slate-500 mb-2">
                      {lang === 'ar' ? 'مرفقات مشفرة بـ AES-256 ومحمية باتفاقية السرية' : 'Encrypted with AES-256 under NDA'}
                    </p>

                    {attachedFiles.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#E1DFDD] text-xs mb-1.5">
                        <span className="font-mono text-slate-800 truncate max-w-[180px]">{file.name}</span>
                        <button onClick={() => removeFile(file.id)} className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <label className="mt-2 flex items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed border-[#5B5FC7]/40 bg-white hover:bg-[#EEF0FF]/30 text-xs font-bold text-[#5B5FC7] cursor-pointer transition-colors">
                    <UploadCloud className="w-4 h-4 text-[#5B5FC7]" />
                    <span>{isUploading ? (lang === 'ar' ? 'جارٍ الرفع...' : 'Uploading...') : (lang === 'ar' ? '+ إرفاق ملف إضافي' : '+ Attach Document')}</span>
                    <input type="file" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>

                {/* 1-Click E-Sign NDA Card */}
                <div className="p-4 rounded-2xl bg-[#EEF0FF] border border-[#D1D3F8] flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-2 text-[#383A7F] font-bold text-xs">
                      <Lock className="w-4 h-4 text-[#107C41]" />
                      <span>اتفاقية عدم الإفصاح المتبادلة (B2B NDA)</span>
                    </div>
                    <p className="text-[11px] text-slate-700 mt-1 leading-relaxed">
                      {lang === 'ar' 
                        ? 'توقيع إلكتروني ملزم قانونياً يحمي أسرار منشأتك وبياناتك وفق الأنظمة القضائية والتجارية السعودية.'
                        : 'Legally binding mutual NDA protecting corporate secrets under Saudi commercial law.'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <input
                      type="text"
                      value={clientSignerName}
                      onChange={(e) => setClientSignerName(e.target.value)}
                      placeholder="اسم الموقع والصفة الوظيفية..."
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#D1D3F8] text-xs font-serif font-bold text-slate-900 focus:outline-none focus:border-[#5B5FC7]"
                    />

                    <label className="flex items-center gap-2 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={ndaAccepted}
                        onChange={(e) => setNdaAccepted(e.target.checked)}
                        className="rounded border-slate-300 text-[#5B5FC7] focus:ring-[#5B5FC7]"
                      />
                      <span className="text-[11px] font-bold text-slate-800">
                        {t.bookingFlow.agreeAndSign} (SHA-256 Verified)
                      </span>
                    </label>
                  </div>
                </div>

              </div>

              {/* Section 4: Corporate Escrow Gateway & Transparent Price Breakdown */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#1E1F24] text-white space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <ShieldCheck className="w-5 h-5 text-[#5B5FC7]" />
                    <span>{t.bookingFlow.escrowTitle}</span>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setPaymentMethod('mada')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        paymentMethod === 'mada' ? 'bg-[#5B5FC7] text-white shadow-xs' : 'bg-white/10 text-slate-200 hover:bg-white/20'
                      }`}
                    >
                      {lang === 'ar' ? 'مدى للشركات' : 'Mada B2B'}
                    </button>
                    <button
                      onClick={() => setPaymentMethod('corporate_card')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        paymentMethod === 'corporate_card' ? 'bg-[#5B5FC7] text-white shadow-xs' : 'bg-white/10 text-slate-200 hover:bg-white/20'
                      }`}
                    >
                      {lang === 'ar' ? 'بطاقة ائتمان' : 'Visa / MC'}
                    </button>
                    <button
                      onClick={() => setPaymentMethod('bank_transfer')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        paymentMethod === 'bank_transfer' ? 'bg-[#5B5FC7] text-white shadow-xs' : 'bg-white/10 text-slate-200 hover:bg-white/20'
                      }`}
                    >
                      {lang === 'ar' ? 'تحويل سداد' : 'SADAD Wire'}
                    </button>
                  </div>
                </div>

                {/* Guarantee Banner */}
                <p className="text-xs text-slate-200 leading-relaxed font-normal">
                  {t.bookingFlow.escrowRefundGuarantee}
                </p>

                {/* Price Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/10 text-xs">
                  <div>
                    <span className="text-slate-300">{t.bookingFlow.breakdownSessionFee}</span>
                    <p className="font-bold text-white mt-0.5">{sessionFee.toLocaleString()} SAR</p>
                  </div>
                  <div>
                    <span className="text-slate-300">{t.bookingFlow.breakdownPlatformFee}</span>
                    <p className="font-bold text-white mt-0.5">{platformFee.toLocaleString()} SAR</p>
                  </div>
                  <div>
                    <span className="text-slate-300">{t.bookingFlow.breakdownVAT}</span>
                    <p className="font-bold text-white mt-0.5">{vat.toLocaleString()} SAR</p>
                  </div>
                  <div className="bg-white/10 p-2 rounded-xl text-end">
                    <span className="text-[#EEF0FF] text-[11px] font-bold">{t.bookingFlow.breakdownTotal}</span>
                    <p className="font-serif font-bold text-lg text-white">{totalAmount.toLocaleString()} SAR</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================== */}
          {/* 📋 GUIDED 5-STEP TOUR (STEP 1 TO 4)                       */}
          {/* ========================================================== */}
          {bookingMode === 'guided' && currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-3.5 rounded-2xl bg-[#EEF0FF] border border-[#D1D3F8] flex items-start gap-3">
                <Info className="w-5 h-5 text-[#5B5FC7] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-[#383A7F]">{t.bookingFlow.syncNotice}</p>
                  <p className="text-slate-600 mt-0.5 font-medium">{t.bookingFlow.bufferNotice}</p>
                </div>
              </div>

              {/* Day selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {t.bookingFlow.selectDate}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {availableDates.map((d) => (
                    <button
                      key={d.date}
                      onClick={() => {
                        setSelectedDate(d.date);
                        if (d.slots.length > 0) setSelectedSlot(d.slots[0].time);
                      }}
                      className={`p-4 rounded-2xl border text-start transition-all cursor-pointer ${
                        selectedDate === d.date
                          ? 'bg-[#EEF0FF] border-[#5B5FC7] shadow-sm text-slate-950 ring-2 ring-[#5B5FC7]/20'
                          : 'bg-white border-[#E1DFDD] hover:border-[#5B5FC7]/40 text-slate-700 hover:bg-[#F5F6F8]'
                      }`}
                    >
                      <p className="text-xs text-slate-500 font-medium">{lang === 'ar' ? d.dayAr : d.dayEn}</p>
                      <p className="text-base font-bold mt-1 font-mono">{d.date}</p>
                      <span className="inline-block mt-2 px-2 py-0.5 rounded-md bg-white border border-[#E1DFDD] text-[10px] font-bold text-[#107C41]">
                        {d.slots.length} {lang === 'ar' ? 'مواعيد متاحة' : 'free slots'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Slot selection */}
              <div>
                <label className="block text-xs font-bold text-[#5B5FC7] uppercase tracking-wider mb-2">
                  {t.bookingFlow.selectTime}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {activeDateObj.slots.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSlot(s.time)}
                      className={`px-3 py-3 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                        selectedSlot === s.time
                          ? 'bg-[#5B5FC7] text-white border-[#5B5FC7] shadow-xs'
                          : 'bg-white text-slate-700 border-[#E1DFDD] hover:bg-[#EEF0FF]/40'
                      }`}
                    >
                      {s.time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {bookingMode === 'guided' && currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Preset Templates Selector */}
              <div className="p-4 rounded-2xl bg-[#EEF0FF] border border-[#D1D3F8] space-y-3">
                <div className="flex items-center gap-2 text-[#383A7F] font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-[#5B5FC7]" />
                  <span>{t.bookingFlow.presetTemplatesLabel}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {advisorTemplates.map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => handleSelectTemplate(tpl)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                        selectedTemplateId === tpl.id
                          ? 'bg-white border-[#5B5FC7] text-[#383A7F] shadow-2xs'
                          : 'bg-white/70 border-[#E1DFDD] text-slate-700 hover:bg-white'
                      }`}
                    >
                      {selectedTemplateId === tpl.id ? <Check className="w-3.5 h-3.5 text-[#107C41]" /> : <Sparkles className="w-3 h-3 text-[#5B5FC7]" />}
                      <span>{lang === 'ar' ? tpl.titleAr : tpl.titleEn}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title & Desc Inputs */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t.bookingFlow.challengeTitleLabel}
                </label>
                <input
                  type="text"
                  value={briefTitle}
                  onChange={(e) => setBriefTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#F5F6F8] border border-[#E1DFDD] text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#5B5FC7] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t.bookingFlow.challengeDescLabel}
                </label>
                <textarea
                  rows={3}
                  value={briefDesc}
                  onChange={(e) => setBriefDesc(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#F5F6F8] border border-[#E1DFDD] text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#5B5FC7] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t.bookingFlow.strategicGoalLabel}
                </label>
                <input
                  type="text"
                  value={strategicGoal}
                  onChange={(e) => setStrategicGoal(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#F5F6F8] border border-[#E1DFDD] text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#5B5FC7] focus:bg-white"
                />
              </div>

              {/* Documents */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t.bookingFlow.uploadDocuments}
                </label>
                <label className="flex items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-[#5B5FC7]/40 bg-[#F5F6F8] hover:bg-[#EEF0FF]/30 text-xs font-bold text-[#5B5FC7] cursor-pointer transition-colors">
                  <UploadCloud className="w-4 h-4 text-[#5B5FC7]" />
                  <span>{isUploading ? (lang === 'ar' ? 'جارٍ الرفع...' : 'Uploading...') : t.bookingFlow.dragDropText}</span>
                  <input type="file" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>
          )}

          {bookingMode === 'guided' && currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-3.5 rounded-2xl bg-[#E6F5EC] border border-[#107C41]/30 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#107C41] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-[#107C41]">{t.bookingFlow.ndaTitle}</p>
                  <p className="text-slate-700 mt-0.5 font-medium">{t.bookingFlow.ndaNotice}</p>
                </div>
              </div>

              {/* NDA Legal Agreement Document Viewer */}
              <div className="p-4 rounded-2xl bg-[#F5F6F8] border border-[#E1DFDD] max-h-52 overflow-y-auto text-xs text-slate-700 leading-relaxed space-y-3 font-mono">
                <div className="text-center pb-2 border-b border-[#E1DFDD]">
                  <p className="font-bold text-slate-900">اتفاقية عدم إفصاح وحماية المعلومات السرية المتبادلة (B2B NDA)</p>
                  <p className="text-[10px] text-slate-500">الرقم المرجعي الموحد: MSH-NDA-2026-SA</p>
                </div>
                <p>
                  <strong>الطرف الأول (العميل):</strong> {clientCompanyName}، ويمثلها قانونياً: {clientSignerName}.
                </p>
                <p>
                  <strong>الطرف الثاني (المستشار التنفيذي):</strong> {advisor.name}، بصفته مستشاراً استراتيجياً معتمداً في منصة مشور.
                </p>
                <p>
                  <strong>1. نطاق السرية:</strong> يلتزم الطرفان التزاماً مطلقاً بالمحافظة على سرية كافة البيانات، النماذج المالية، خطط العمل، والوثائق المرفوعة في المستودع الرقمي.
                </p>
                <p>
                  <strong>2. عدم الالتفاف (Non-Circumvention):</strong> يلتزم الطرف الثاني بعدم استغلال أي معلومات تجارية أو أسرار تشغيلية حصل عليها لمصلحته الشخصية لمدة 24 شهراً.
                </p>
              </div>

              {/* E-Signature Input */}
              <div className="bg-[#EEF0FF] p-4 rounded-2xl border border-[#D1D3F8] space-y-3">
                <label className="block text-xs font-bold text-[#383A7F] uppercase tracking-wider">
                  {t.bookingFlow.drawSignature}
                </label>
                <input
                  type="text"
                  value={clientSignerName}
                  onChange={(e) => setClientSignerName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#D1D3F8] text-slate-900 text-sm focus:outline-none focus:border-[#5B5FC7] font-serif"
                />
                <label className="flex items-start gap-2 pt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ndaAccepted}
                    onChange={(e) => setNdaAccepted(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-[#5B5FC7] focus:ring-[#5B5FC7]"
                  />
                  <span className="text-xs text-slate-800 font-medium">
                    {t.bookingFlow.agreeAndSign} ({new Date().toLocaleDateString()})
                  </span>
                </label>
              </div>
            </div>
          )}

          {bookingMode === 'guided' && currentStep === 4 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-[#1E1F24] text-white flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-[#5B5FC7] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-white text-sm">{t.bookingFlow.escrowTitle}</p>
                  <p className="text-slate-200 mt-1 leading-relaxed">{t.bookingFlow.escrowGuaranteeNotice}</p>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setPaymentMethod('mada')}
                  className={`p-3.5 rounded-xl border text-start text-xs font-bold transition-all cursor-pointer ${
                    paymentMethod === 'mada' ? 'bg-[#EEF0FF] border-[#5B5FC7] text-[#383A7F] shadow-2xs' : 'bg-white border-[#E1DFDD] text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-[#107C41] mb-1" />
                  <span>{lang === 'ar' ? 'مدى للشركات (Mada B2B)' : 'Mada Debit'}</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('corporate_card')}
                  className={`p-3.5 rounded-xl border text-start text-xs font-bold transition-all cursor-pointer ${
                    paymentMethod === 'corporate_card' ? 'bg-[#EEF0FF] border-[#5B5FC7] text-[#383A7F] shadow-2xs' : 'bg-white border-[#E1DFDD] text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#5B5FC7] mb-1" />
                  <span>{lang === 'ar' ? 'بطاقة ائتمان الشركات' : 'Corporate Card'}</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`p-3.5 rounded-xl border text-start text-xs font-bold transition-all cursor-pointer ${
                    paymentMethod === 'bank_transfer' ? 'bg-[#EEF0FF] border-[#5B5FC7] text-[#383A7F] shadow-2xs' : 'bg-white border-[#E1DFDD] text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <FileCheck className="w-4 h-4 text-[#0078D4] mb-1" />
                  <span>{lang === 'ar' ? 'أمر تحويل بنكي فوري (سداد)' : 'Direct Wire (SADAD)'}</span>
                </button>
              </div>

              {/* Financial Breakdown */}
              <div className="p-4 rounded-2xl bg-[#F5F6F8] border border-[#E1DFDD] space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>{t.bookingFlow.breakdownSessionFee}</span>
                  <span className="font-bold text-slate-900">{sessionFee.toLocaleString()} SAR</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>{t.bookingFlow.breakdownPlatformFee}</span>
                  <span>{platformFee.toLocaleString()} SAR</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>{t.bookingFlow.breakdownVAT}</span>
                  <span>{vat.toLocaleString()} SAR</span>
                </div>
                <div className="pt-2 border-t border-[#E1DFDD] flex justify-between text-sm font-bold text-slate-900">
                  <span>{t.bookingFlow.breakdownTotal}</span>
                  <span className="text-base text-[#5B5FC7] font-serif font-bold">{totalAmount.toLocaleString()} SAR</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* ✅ STEP 5: FINAL PROVISIONING & CONFIRMATION RESULT        */}
          {/* ========================================================== */}
          {currentStep === 5 && createdSession && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              <div className="text-center p-6 rounded-3xl bg-[#E6F5EC] border border-[#107C41]/30 shadow-sm">
                <div className="w-14 h-14 rounded-full bg-[#107C41]/15 border-2 border-[#107C41] flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-8 h-8 text-[#107C41]" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-serif">
                  {t.bookingFlow.successTitle}
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-lg mx-auto leading-relaxed">
                  {t.bookingFlow.successMeetGenerated}
                </p>
                <div className="mt-3 inline-block px-3.5 py-1 rounded-full bg-white border border-[#E1DFDD] text-xs font-mono text-[#5B5FC7] font-bold shadow-2xs">
                  {lang === 'ar' ? 'الرقم المرجعي المعتمد:' : 'Ref Code:'} {createdSession.referenceCode}
                </div>
              </div>

              {/* Microsoft Teams / Google Meet Link Box with Direct Enter & Copy Buttons */}
              <div className="p-4 rounded-2xl bg-[#F5F6F8] border border-[#E1DFDD] space-y-3">
                <label className="block text-xs font-bold text-[#5B5FC7] uppercase tracking-wider flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-[#5B5FC7]" />
                  <span>{t.bookingFlow.meetLinkBox}</span>
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={createdSession.meetLink}
                    className="flex-1 px-4 py-3 rounded-xl bg-white border border-[#E1DFDD] text-[#107C41] font-mono text-xs sm:text-sm font-bold focus:outline-none"
                  />
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleCopyLink}
                      className="flex-1 sm:flex-initial px-4 py-3 rounded-xl bg-white hover:bg-slate-100 text-xs font-bold text-slate-800 border border-[#E1DFDD] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Copy className="w-4 h-4 text-[#5B5FC7]" />
                      <span>{copiedLink ? t.bookingFlow.copied : t.bookingFlow.copyLink}</span>
                    </button>
                    <a
                      href={createdSession.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-3 rounded-xl bg-[#5B5FC7] hover:bg-[#4F52B2] text-xs font-bold text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <ExternalLink className="w-4 h-4 text-white" />
                      <span>{t.bookingFlow.openMeetNow}</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Calendar Integration Direct Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Direct Google Calendar */}
                <a
                  href={googleCalendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-white hover:bg-[#EEF0FF]/30 border border-[#E1DFDD] hover:border-[#5B5FC7]/40 flex items-center justify-between gap-3 text-slate-900 transition-all shadow-2xs group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EBF3FC] border border-[#B4D6FA] flex items-center justify-center text-[#0078D4] font-bold text-xs shrink-0">
                      G
                    </div>
                    <div className="text-xs">
                      <p className="font-bold text-slate-900 group-hover:text-[#5B5FC7] transition-colors">{t.bookingFlow.addToGoogleCalendar}</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">{lang === 'ar' ? 'مزامنة فورية لحساب Google Workspace' : 'Sync to Google Workspace Calendar'}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#5B5FC7]" />
                </a>

                {/* Download .ICS for Apple & Outlook / Teams */}
                <button
                  onClick={downloadIcsMock}
                  className="p-4 rounded-2xl bg-white hover:bg-[#EEF0FF]/30 border border-[#E1DFDD] hover:border-[#5B5FC7]/40 flex items-center justify-between gap-3 text-slate-900 transition-all shadow-2xs group cursor-pointer text-start"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EEF0FF] border border-[#D1D3F8] flex items-center justify-center text-[#5B5FC7] font-bold text-xs shrink-0">
                      <CalendarIcon className="w-5 h-5 text-[#5B5FC7]" />
                    </div>
                    <div className="text-xs">
                      <p className="font-bold text-slate-900 group-hover:text-[#5B5FC7] transition-colors">{t.bookingFlow.downloadIcs}</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">{lang === 'ar' ? 'ملف دعوة قياسي لـ Outlook و Teams و Apple iCal' : 'Standard invite for Outlook, Teams & Apple'}</p>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-slate-400 group-hover:text-[#5B5FC7]" />
                </button>

              </div>

              {/* Automated Reminder Pipeline */}
              <div className="p-4 rounded-2xl bg-white border border-[#E1DFDD] space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t.bookingFlow.remindersScheduledList}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-[#F5F6F8] border border-[#E1DFDD] text-slate-700 flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#107C41] shrink-0" />
                    <span>{t.bookingFlow.r24}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F5F6F8] border border-[#E1DFDD] text-slate-700 flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#107C41] shrink-0" />
                    <span>{t.bookingFlow.r1}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F5F6F8] border border-[#E1DFDD] text-slate-700 flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#107C41] shrink-0" />
                    <span>{t.bookingFlow.r10}</span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer Action Controls */}
        <div className="p-4 sm:p-5 bg-[#F5F6F8] border-t border-[#E1DFDD] flex items-center justify-between gap-4">
          
          {/* Back Button (In Guided Mode) */}
          {bookingMode === 'guided' && currentStep > 1 && currentStep < 5 ? (
            <button
              onClick={() => setCurrentStep((prev) => (prev - 1) as any)}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 border border-[#E1DFDD] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {isRtl ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5 text-[#5B5FC7]" />}
              <span>{lang === 'ar' ? 'السابق' : 'Previous'}</span>
            </button>
          ) : <div />}

          {/* Express Mode Instant Confirm Button */}
          {bookingMode === 'express' && currentStep !== 5 && (
            <button
              id="express-confirm-booking-btn"
              onClick={handleProcessBooking}
              disabled={isProcessingPayment || !briefTitle || !ndaAccepted}
              className="w-full sm:w-auto px-8 py-3 rounded-xl teams-primary-btn text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
            >
              {isProcessingPayment ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{lang === 'ar' ? 'جارٍ قفل الموعد في التقويم وحجز الضمان وتوليد الرابط...' : 'Securing Escrow & Provisioning Meeting...'}</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-white" />
                  <span>{t.bookingFlow.oneClickConfirmBooking} ({totalAmount.toLocaleString()} SAR)</span>
                  {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </>
              )}
            </button>
          )}

          {/* Guided Mode Next Buttons */}
          {bookingMode === 'guided' && currentStep === 1 && (
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-2.5 rounded-xl teams-primary-btn text-white font-bold text-xs transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <span>{lang === 'ar' ? 'التالي: ملف التحدي والوثائق' : 'Next: Challenge Brief'}</span>
              {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          )}

          {bookingMode === 'guided' && currentStep === 2 && (
            <button
              onClick={() => setCurrentStep(3)}
              disabled={!briefTitle || !briefDesc}
              className="px-6 py-2.5 rounded-xl teams-primary-btn text-white font-bold text-xs transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              <span>{lang === 'ar' ? 'التالي: توقيع اتفاقية NDA' : 'Next: Sign NDA'}</span>
              {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          )}

          {bookingMode === 'guided' && currentStep === 3 && (
            <button
              onClick={() => setCurrentStep(4)}
              disabled={!ndaAccepted || !clientSignerName}
              className="px-6 py-2.5 rounded-xl teams-primary-btn text-white font-bold text-xs transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              <span>{lang === 'ar' ? 'التالي: بوابة الدفع وحساب الضمان' : 'Next: Escrow Payment'}</span>
              {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          )}

          {bookingMode === 'guided' && currentStep === 4 && (
            <button
              onClick={handleProcessBooking}
              disabled={isProcessingPayment}
              className="px-6 py-3 rounded-xl teams-primary-btn text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-sm disabled:opacity-75 cursor-pointer"
            >
              {isProcessingPayment ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{lang === 'ar' ? 'جارٍ الإيداع وتوليد الرابط...' : 'Securing Escrow...'}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t.bookingFlow.payAndConfirm} ({totalAmount.toLocaleString()} SAR)</span>
                </>
              )}
            </button>
          )}

          {/* Step 5 Done Button */}
          {currentStep === 5 && (
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-8 py-2.5 rounded-xl bg-[#1E1F24] hover:bg-[#2B2D31] text-white font-bold text-xs border border-transparent transition-all cursor-pointer shadow-2xs"
            >
              <span>{lang === 'ar' ? 'إغلاق وعرض في قائمة جلساتي' : 'Done & View My Sessions'}</span>
            </button>
          )}

        </div>

      </div>
    </div>
  );
};
