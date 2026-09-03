import React, { useState } from 'react';
import { 
  User, 
  DollarSign, 
  Video, 
  Upload, 
  Play, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Briefcase, 
  Save, 
  Plus, 
  Trash2,
  FileText,
  AlertCircle
} from 'lucide-react';
import { Advisor, Language, CSuiteFunction, CorporateTrackRecord, IndustrySector } from '../types';

interface AdvisorProfileEditProps {
  advisor: Advisor;
  lang: Language;
  onSaveProfile: (updatedAdvisor: Partial<Advisor>) => void;
  onCancel: () => void;
}

export const AdvisorProfileEdit: React.FC<AdvisorProfileEditProps> = ({
  advisor,
  lang,
  onSaveProfile,
  onCancel
}) => {
  const isRtl = lang === 'ar';

  // Form State
  const [nameAr, setNameAr] = useState(advisor.name);
  const [nameEn, setNameEn] = useState(advisor.nameEn);
  const [currentRoleAr, setCurrentRoleAr] = useState(advisor.currentRole);
  const [currentRoleEn, setCurrentRoleEn] = useState(advisor.currentRoleEn);
  const [primaryFunction, setPrimaryFunction] = useState<CSuiteFunction>(advisor.primaryFunction);
  const [primaryTrackRecord, setPrimaryTrackRecord] = useState<CorporateTrackRecord>(advisor.primaryTrackRecord);
  const [hourlyRate, setHourlyRate] = useState(advisor.hourlyRate);
  const [bioAr, setBioAr] = useState(advisor.bioAr);
  const [bioEn, setBioEn] = useState(advisor.bioEn);
  const [experienceYears, setExperienceYears] = useState(advisor.experienceYears);
  const [selectedSectors, setSelectedSectors] = useState<IndustrySector[]>(advisor.sectors);

  // Video Pitch State
  const [videoUrl, setVideoUrl] = useState(advisor.videoElevatorPitch.videoUrl);
  const [videoDuration, setVideoDuration] = useState(advisor.videoElevatorPitch.duration);
  const [videoThumbnail, setVideoThumbnail] = useState(advisor.videoElevatorPitch.videoThumbnail);
  const [videoSummaryAr, setVideoSummaryAr] = useState(advisor.videoElevatorPitch.summaryAr);
  const [videoSummaryEn, setVideoSummaryEn] = useState(advisor.videoElevatorPitch.summaryEn);
  const [topicsCoveredAr, setTopicsCoveredAr] = useState<string[]>(advisor.videoElevatorPitch.topicsCoveredAr);
  const [topicsCoveredEn, setTopicsCoveredEn] = useState<string[]>(advisor.videoElevatorPitch.topicsCoveredEn);

  const [newTopicAr, setNewTopicAr] = useState('');
  const [newTopicEn, setNewTopicEn] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const availableFunctions: { id: CSuiteFunction; ar: string; en: string }[] = [
    { id: 'CEO', ar: 'رئيس تنفيذي (CEO)', en: 'Chief Executive Officer (CEO)' },
    { id: 'COO', ar: 'رئيس تنفيذي للعمليات (COO)', en: 'Chief Operating Officer (COO)' },
    { id: 'CFO', ar: 'رئيس مالي تنفيذي (CFO)', en: 'Chief Financial Officer (CFO)' },
    { id: 'CTO', ar: 'رئيس تقني تنفيذي (CTO)', en: 'Chief Technology Officer (CTO)' },
    { id: 'CHRO', ar: 'رئيس موارد بشرية (CHRO)', en: 'Chief HR Officer (CHRO)' },
    { id: 'CSO', ar: 'رئيس استراتيجية وتطوير (CSO)', en: 'Chief Strategy Officer (CSO)' },
    { id: 'BOARD_DIRECTOR', ar: 'عضو مجلس إدارة معتمد', en: 'Certified Board Director' }
  ];

  const availableTracks: CorporateTrackRecord[] = [
    'SABIC', 'Aramco', 'STC', 'PIF', 'Almarai', 'Maaden', 'SNB', 'McKinsey'
  ];

  const allSectors: IndustrySector[] = [
    'Logistics & Supply Chain',
    'Petrochemicals & Energy',
    'Telecom & Digital Economy',
    'Banking & Fintech',
    'Retail & FMCG',
    'Healthcare & Pharma',
    'Real Estate & Megaprojects',
    'Manufacturing & Mining'
  ];

  const samplePitchVideos = [
    {
      title: 'Executive Presentation #1',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-man-giving-a-presentation-in-an-office-41487-large.mp4',
      thumb: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
      duration: '0:34'
    },
    {
      title: 'Boardroom Strategic Pitch #2',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-confident-businessman-looking-at-the-camera-41460-large.mp4',
      thumb: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop&q=80',
      duration: '0:31'
    },
    {
      title: 'Operational Restructuring Pitch #3',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-businessman-talking-to-camera-in-the-office-41483-large.mp4',
      thumb: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
      duration: '0:30'
    }
  ];

  const toggleSector = (sector: IndustrySector) => {
    if (selectedSectors.includes(sector)) {
      setSelectedSectors(prev => prev.filter(s => s !== sector));
    } else {
      setSelectedSectors(prev => [...prev, sector]);
    }
  };

  const handleSimulatedVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadProgress(15);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev === null || prev >= 100) {
            clearInterval(interval);
            setVideoDuration('0:30');
            return null;
          }
          return prev + 25;
        });
      }, 250);
    }
  };

  const handleAddTopic = () => {
    if (newTopicAr.trim() && newTopicEn.trim()) {
      setTopicsCoveredAr(prev => [...prev, newTopicAr.trim()]);
      setTopicsCoveredEn(prev => [...prev, newTopicEn.trim()]);
      setNewTopicAr('');
      setNewTopicEn('');
    }
  };

  const handleRemoveTopic = (index: number) => {
    setTopicsCoveredAr(prev => prev.filter((_, i) => i !== index));
    setTopicsCoveredEn(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      onSaveProfile({
        name: nameAr,
        nameEn,
        currentRole: currentRoleAr,
        currentRoleEn,
        primaryFunction,
        primaryTrackRecord,
        hourlyRate,
        bioAr,
        bioEn,
        experienceYears,
        sectors: selectedSectors,
        videoElevatorPitch: {
          duration: videoDuration,
          videoThumbnail,
          videoUrl,
          summaryAr: videoSummaryAr,
          summaryEn: videoSummaryEn,
          topicsCoveredAr,
          topicsCoveredEn
        }
      });

      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 600);
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-8 animate-in fade-in duration-200 text-slate-800">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-2">
            <User className="w-3.5 h-3.5 text-indigo-600" />
            <span>{lang === 'ar' ? 'إعدادات الملف الاستشاري التنفيذي' : 'Executive Advisor Profile Settings'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {lang === 'ar' ? 'تعديل السيرة الذاتية، التسعير، وفيديو الـ 30 ثانية' : 'Edit Executive Bio, Hourly Rate & 30s Video Pitch'}
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-normal">
            {lang === 'ar' 
              ? 'تحديث بياناتك المهنية والخبرات ومقاطع الفيديو التعريفية لعرضها على كبار قادة الأعمال والشركات.' 
              : 'Keep your executive credentials and video elevator pitch updated for business leaders and enterprise clients.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 border border-slate-300 transition-colors cursor-pointer"
          >
            {lang === 'ar' ? 'رجوع للمساحة' : 'Back to Workspace'}
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 text-xs text-emerald-800 animate-in fade-in font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{lang === 'ar' ? 'تم حفظ وتحديث ملفك التنفيذي بنجاح في المنصة.' : 'Executive advisor profile and video pitch successfully updated.'}</span>
          </div>
          <span className="font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">SAVED</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Section 1: Executive Title & Financial Rates */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-600" />
            <span>{lang === 'ar' ? '1. البيانات المهنية والتسعير في حساب الضمان' : '1. Professional Credentials & Advisory Rates'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Arabic Name */}
            <div>
              <label className="block text-xs text-slate-600 mb-1.5 font-medium">
                {lang === 'ar' ? 'الاسم الكامل (بالعربية)' : 'Full Name (Arabic)'}
              </label>
              <input
                type="text"
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-600 focus:bg-white"
                required
              />
            </div>

            {/* English Name */}
            <div>
              <label className="block text-xs text-slate-600 mb-1.5 font-medium">
                {lang === 'ar' ? 'الاسم الكامل (بالإنجليزية)' : 'Full Name (English)'}
              </label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-600 focus:bg-white"
                required
              />
            </div>

            {/* Hourly Rate in SAR */}
            <div>
              <label className="block text-xs text-slate-600 mb-1.5 font-medium flex items-center justify-between">
                <span>{lang === 'ar' ? 'أجر الاستشارة بالساعة (SAR)' : 'Hourly Advisory Rate (SAR)'}</span>
                <span className="text-indigo-600 font-mono font-semibold">Net: {Math.round(hourlyRate * 0.9).toLocaleString()} SAR</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={1000}
                  max={10000}
                  step={100}
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 font-mono focus:outline-none focus:border-indigo-600 focus:bg-white"
                  required
                />
                <span className="absolute inset-y-0 end-0 pe-3 flex items-center text-xs text-slate-400 font-semibold">
                  SAR
                </span>
              </div>
            </div>

            {/* C-Suite Function */}
            <div>
              <label className="block text-xs text-slate-600 mb-1.5 font-medium">
                {lang === 'ar' ? 'الصفة التنفيذية الرئيسية' : 'Primary C-Suite Function'}
              </label>
              <select
                value={primaryFunction}
                onChange={(e) => setPrimaryFunction(e.target.value as CSuiteFunction)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-600 focus:bg-white"
              >
                {availableFunctions.map((fn) => (
                  <option key={fn.id} value={fn.id}>
                    {lang === 'ar' ? fn.ar : fn.en}
                  </option>
                ))}
              </select>
            </div>

            {/* Corporate Track Record Alumni */}
            <div>
              <label className="block text-xs text-slate-600 mb-1.5 font-medium">
                {lang === 'ar' ? 'سجل الخبرة القيادية الأبرز (Alumni)' : 'Key Corporate Track Record'}
              </label>
              <select
                value={primaryTrackRecord}
                onChange={(e) => setPrimaryTrackRecord(e.target.value as CorporateTrackRecord)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-600 focus:bg-white"
              >
                {availableTracks.map((tr) => (
                  <option key={tr} value={tr}>
                    {tr} Leadership Alumni
                  </option>
                ))}
              </select>
            </div>

            {/* Years of Executive Experience */}
            <div>
              <label className="block text-xs text-slate-600 mb-1.5 font-medium">
                {lang === 'ar' ? 'سنوات الخبرة التنفيذية' : 'Executive Experience (Years)'}
              </label>
              <input
                type="number"
                min={10}
                max={50}
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-600 focus:bg-white"
                required
              />
            </div>

          </div>
        </div>

        {/* Section 2: Executive Bio & Focus */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>{lang === 'ar' ? '2. النبذة الاستراتيجية (Executive Bio)' : '2. Executive Strategic Bio'}</span>
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-600 mb-1.5 font-medium flex items-center justify-between">
                <span>{lang === 'ar' ? 'النبذة التنفيذية (بالعربية)' : 'Executive Bio (Arabic)'}</span>
                <span className="text-[10px] text-slate-400 font-mono">{bioAr.length} chars</span>
              </label>
              <textarea
                rows={4}
                value={bioAr}
                onChange={(e) => setBioAr(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-indigo-600 focus:bg-white leading-relaxed"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-slate-600 mb-1.5 font-medium flex items-center justify-between">
                <span>{lang === 'ar' ? 'النبذة التنفيذية (بالإنجليزية)' : 'Executive Bio (English)'}</span>
                <span className="text-[10px] text-slate-400 font-mono">{bioEn.length} chars</span>
              </label>
              <textarea
                rows={4}
                value={bioEn}
                onChange={(e) => setBioEn(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-indigo-600 focus:bg-white leading-relaxed"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 3: Industry Sectors */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
            {lang === 'ar' ? '3. القطاعات الاقتصادية والصناعية المستهدفة' : '3. Targeted Industry Sectors'}
          </label>
          <div className="flex flex-wrap gap-2">
            {allSectors.map((sector) => {
              const isChecked = selectedSectors.includes(sector);
              return (
                <button
                  key={sector}
                  type="button"
                  onClick={() => toggleSector(sector)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all border cursor-pointer ${
                    isChecked
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-2xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {isChecked ? '✓ ' : '+ '}{sector}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 4: 30-Second Elevator Pitch Video & Snippet Upload */}
        <div className="space-y-4 p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Video className="w-4 h-4 text-indigo-600" />
              <span>{lang === 'ar' ? '4. فيديو العرض التعريفي الموجز (30s Pitch Video)' : '4. 30-Second Video Pitch Snippet'}</span>
            </h3>
            <span className="text-xs text-emerald-800 font-mono font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>HD 1080p Stream</span>
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left: Video Player Preview & Upload Box */}
            <div className="space-y-3">
              <div className="relative rounded-xl overflow-hidden aspect-video bg-black border border-slate-300 shadow-xs group">
                <video
                  src={videoUrl}
                  poster={videoThumbnail}
                  controls
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 start-2 px-2.5 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] font-mono text-white border border-white/20">
                  {videoDuration}
                </div>
              </div>

              {/* Upload Input & Samples */}
              <div className="space-y-2">
                <label className="block text-xs text-slate-600 font-medium">
                  {lang === 'ar' ? 'رفع فيديو جديد أو اختيار نموذج معتمد:' : 'Upload Video File or Select Template:'}
                </label>
                
                <div className="flex items-center gap-2">
                  <label className="flex-1 py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 border border-dashed border-slate-300 hover:border-indigo-600 text-xs text-slate-700 font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs">
                    <Upload className="w-4 h-4 text-indigo-600" />
                    <span>{lang === 'ar' ? 'رفع ملف MP4 (أقصى حد 35 ثانية)' : 'Upload MP4 Video (Max 35s)'}</span>
                    <input
                      type="file"
                      accept="video/mp4,video/webm"
                      className="hidden"
                      onChange={handleSimulatedVideoUpload}
                    />
                  </label>
                </div>

                {uploadProgress !== null && (
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[11px] text-indigo-700 font-bold">
                      <span>{lang === 'ar' ? 'جارٍ معالجة الفيديو وضغطه...' : 'Processing video stream...'}</span>
                      <span className="font-mono">{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full bg-indigo-600 transition-all" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                )}

                {/* Preset Snippets */}
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <span className="text-[11px] text-slate-500 font-medium">{lang === 'ar' ? 'نماذج جاهزة:' : 'Presets:'}</span>
                  {samplePitchVideos.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setVideoUrl(s.url);
                        setVideoThumbnail(s.thumb);
                        setVideoDuration(s.duration);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-[10px] text-slate-700 font-medium transition-colors cursor-pointer shadow-2xs"
                    >
                      {s.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Pitch Summaries & Topic Tags */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1 font-medium">
                  {lang === 'ar' ? 'ملخص الرسالة المرئية (بالعربية)' : 'Video Summary (Arabic)'}
                </label>
                <textarea
                  rows={2}
                  value={videoSummaryAr}
                  onChange={(e) => setVideoSummaryAr(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1 font-medium">
                  {lang === 'ar' ? 'ملخص الرسالة المرئية (بالإنجليزية)' : 'Video Summary (English)'}
                </label>
                <textarea
                  rows={2}
                  value={videoSummaryEn}
                  onChange={(e) => setVideoSummaryEn(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                />
              </div>

              {/* Topics Covered */}
              <div className="space-y-2 pt-1">
                <label className="block text-xs text-slate-600 font-medium">
                  {lang === 'ar' ? 'المحاور المشمولة في الفيديو (Topics Covered):' : 'Key Topics Covered in Video:'}
                </label>

                <div className="flex flex-wrap gap-1.5">
                  {topicsCoveredAr.map((top, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-semibold border border-indigo-100"
                    >
                      <span>{lang === 'ar' ? top : topicsCoveredEn[idx] || top}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTopic(idx)}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <input
                    type="text"
                    placeholder={lang === 'ar' ? 'المحور بالعربية...' : 'Topic in Arabic...'}
                    value={newTopicAr}
                    onChange={(e) => setNewTopicAr(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      placeholder={lang === 'ar' ? 'Topic in English...' : 'Topic in English...'}
                      value={newTopicEn}
                      onChange={(e) => setNewTopicEn(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                    />
                    <button
                      type="button"
                      onClick={handleAddTopic}
                      disabled={!newTopicAr || !newTopicEn}
                      className="px-2.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold disabled:opacity-40 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* Submit Bar */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 border border-slate-300 transition-colors cursor-pointer"
          >
            {lang === 'ar' ? 'إلغاء التغييرات' : 'Cancel'}
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{lang === 'ar' ? 'جارٍ حفظ التحديثات...' : 'Saving Changes...'}</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{lang === 'ar' ? 'حفظ وتحديث الملف التنفيذي' : 'Save & Publish Profile'}</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};
