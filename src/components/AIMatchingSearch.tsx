import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Filter, 
  Building2, 
  Award, 
  Briefcase, 
  RotateCcw,
  SlidersHorizontal,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { Language, CorporateTrackRecord, CSuiteFunction, IndustrySector } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface AIMatchingSearchProps {
  lang: Language;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTrackRecord: string;
  setSelectedTrackRecord: (track: string) => void;
  selectedFunction: string;
  setSelectedFunction: (func: string) => void;
  selectedSector: string;
  setSelectedSector: (sector: string) => void;
  maxHourlyRate: number;
  setMaxHourlyRate: (rate: number) => void;
  onAiMatchTriggered: () => void;
  isAiAnalyzing: boolean;
}

export const AIMatchingSearch: React.FC<AIMatchingSearchProps> = ({
  lang,
  searchQuery,
  setSearchQuery,
  selectedTrackRecord,
  setSelectedTrackRecord,
  selectedFunction,
  setSelectedFunction,
  selectedSector,
  setSelectedSector,
  maxHourlyRate,
  setMaxHourlyRate,
  onAiMatchTriggered,
  isAiAnalyzing
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const t = TRANSLATIONS[lang];

  const quickQueries = [
    t.hero.tryQuery1,
    t.hero.tryQuery2,
    t.hero.tryQuery3,
    t.hero.tryQuery4
  ];

  const corporateTracks: { id: string; labelAr: string; labelEn: string }[] = [
    { id: 'ALL', labelAr: 'كافة الشركات الوطنية', labelEn: 'All Flagships' },
    { id: 'SABIC', labelAr: 'سابك (Ex-SABIC)', labelEn: 'Ex-SABIC' },
    { id: 'Aramco', labelAr: 'أرامكو السعودية (Ex-Aramco)', labelEn: 'Ex-Saudi Aramco' },
    { id: 'STC', labelAr: 'مجموعة STC (Ex-STC)', labelEn: 'Ex-STC Group' },
    { id: 'PIF', labelAr: 'صندوق الاستثمارات (PIF Portfolio)', labelEn: 'Ex-PIF Portfolio' },
    { id: 'Almarai', labelAr: 'المراعي (Ex-Almarai)', labelEn: 'Ex-Almarai' },
    { id: 'Maaden', labelAr: 'معادن (Ex-Maaden)', labelEn: 'Ex-Maaden' },
    { id: 'McKinsey', labelAr: 'ماكينزي (Ex-McKinsey)', labelEn: 'Ex-McKinsey' }
  ];

  const csuiteFunctions: { id: string; labelAr: string; labelEn: string }[] = [
    { id: 'ALL', labelAr: 'كافة المناصب القيادية', labelEn: 'All C-Suite' },
    { id: 'CEO', labelAr: 'رئيس تنفيذي (CEO / MD)', labelEn: 'Chief Executive Officer (CEO)' },
    { id: 'COO', labelAr: 'رئيس العمليات وسلاسل الإمداد (COO)', labelEn: 'Chief Operating Officer (COO)' },
    { id: 'CFO', labelAr: 'رئيس مالي وحوكمة (CFO)', labelEn: 'Chief Financial Officer (CFO)' },
    { id: 'CTO', labelAr: 'رئيس تقنية وتحول رقمي (CTO)', labelEn: 'Chief Technology Officer (CTO)' },
    { id: 'CHRO', labelAr: 'رئيس موارد بشرية وقيادات (CHRO)', labelEn: 'Chief Human Resources (CHRO)' },
    { id: 'CSO', labelAr: 'رئيس استراتيجية وتطوير (CSO)', labelEn: 'Chief Strategy Officer (CSO)' }
  ];

  const industrySectors: { id: string; labelAr: string; labelEn: string }[] = [
    { id: 'ALL', labelAr: 'كافة القطاعات الاقتصادية', labelEn: 'All Sectors' },
    { id: 'Logistics & Supply Chain', labelAr: 'اللوجستيات وسلاسل الإمداد', labelEn: 'Logistics & Supply Chain' },
    { id: 'Petrochemicals & Energy', labelAr: 'البتروكيماويات والطاقة', labelEn: 'Petrochemicals & Energy' },
    { id: 'Telecom & Digital Economy', labelAr: 'الاتصالات والاقتصاد الرقمي', labelEn: 'Telecom & Digital' },
    { id: 'Banking & Fintech', labelAr: 'القطاع المالي والمصرفي', labelEn: 'Banking & Fintech' },
    { id: 'Retail & FMCG', labelAr: 'التجزئة والسلع الاستهلاكية', labelEn: 'Retail & FMCG' },
    { id: 'Real Estate & Megaprojects', labelAr: 'التطوير العقاري والمشاريع الكبرى', labelEn: 'Real Estate & Megaprojects' },
    { id: 'Manufacturing & Mining', labelAr: 'الصناعة والتعدين', labelEn: 'Manufacturing & Mining' }
  ];

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedTrackRecord('ALL');
    setSelectedFunction('ALL');
    setSelectedSector('ALL');
    setMaxHourlyRate(4500);
  };

  return (
    <section className="relative pt-10 pb-12 overflow-hidden bg-[#F9F9FF] border-b border-[#D8E3FB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Hero Header */}
        <div className="text-center max-w-4xl mx-auto mb-9">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#111C2D] leading-tight">
            {t.hero.headline}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {t.hero.subheadline}
          </p>

          {/* Value proposition stats banner */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-white border border-[#D8E3FB] shadow-strategic-low">
            <div className="p-2 text-center border-e border-[#E7EEFF] last:border-none">
              <p className="text-xl sm:text-2xl font-bold text-[#2D1B69]">{t.hero.stat1Number}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">{t.hero.stat1Label}</p>
            </div>
            <div className="p-2 text-center border-e border-[#E7EEFF] last:border-none">
              <p className="text-xl sm:text-2xl font-bold text-[#10B981]">{t.hero.stat2Number}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">{t.hero.stat2Label}</p>
            </div>
            <div className="p-2 text-center border-e border-[#E7EEFF] last:border-none">
              <p className="text-xl sm:text-2xl font-bold text-[#111C2D]">{t.hero.stat3Number}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">{t.hero.stat3Label}</p>
            </div>
            <div className="p-2 text-center">
              <p className="text-xl sm:text-2xl font-bold text-[#4F46E5]">{t.hero.stat4Number}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">{t.hero.stat4Label}</p>
            </div>
          </div>
        </div>

        {/* Natural Language Search Box */}
        <div className="max-w-4xl mx-auto bg-white border border-[#D8E3FB] rounded-2xl p-3.5 sm:p-5 shadow-strategic-mid">
          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5 text-[#4F46E5]" />
              </div>
              <input
                id="ai-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.hero.smartSearchPlaceholder}
                className="w-full ps-12 pe-4 py-3.5 rounded-lg bg-[#F9F9FF] border border-[#D8E3FB] text-[#111C2D] placeholder-slate-400 text-sm focus:outline-hidden focus:border-[#4F46E5] focus:bg-white transition-all shadow-2xs"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onAiMatchTriggered();
                }}
              />
            </div>

            <button
              id="trigger-ai-match-btn"
              onClick={onAiMatchTriggered}
              disabled={isAiAnalyzing}
              className="px-6 py-3.5 rounded-lg bg-[#2D1B69] hover:bg-[#180052] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-strategic-low hover:shadow-strategic-mid disabled:opacity-75 cursor-pointer shrink-0"
            >
              {isAiAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{lang === 'ar' ? 'جارٍ البحث عن الخبير...' : 'Finding Advisors...'}</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 text-[#C7D2FE]" />
                  <span>{t.hero.aiMatchingBtn}</span>
                </>
              )}
            </button>
          </div>

          {/* Quick suggestion queries */}
          <div className="mt-3.5 pt-3.5 border-t border-[#E7EEFF] flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 flex items-center gap-1 font-semibold">
              <Zap className="w-3.5 h-3.5 text-[#4F46E5]" />
              {t.hero.tryQueriesLabel}
            </span>
            {quickQueries.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSearchQuery(q);
                  setTimeout(() => onAiMatchTriggered(), 50);
                }}
                className="px-3 py-1 rounded-full bg-[#F0F3FF] hover:bg-[#EEF0FF] text-[#2D1B69] hover:text-[#180052] border border-[#D8E3FB] hover:border-[#4F46E5] transition-all text-xs text-start line-clamp-1 cursor-pointer font-medium"
              >
                "{q}"
              </button>
            ))}
          </div>
        </div>

        {/* Filters Toggle & Toolbar */}
        <div className="max-w-4xl mx-auto mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              id="toggle-filters-btn"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 border cursor-pointer ${
                showAdvancedFilters
                  ? 'bg-[#2D1B69] text-white border-[#2D1B69] shadow-xs'
                  : 'bg-white text-slate-700 border-[#D8E3FB] hover:bg-[#F0F3FF]'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#4F46E5]" />
              <span>{t.filters.title}</span>
              {(selectedTrackRecord !== 'ALL' || selectedFunction !== 'ALL' || selectedSector !== 'ALL') && (
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              )}
            </button>

            {(selectedTrackRecord !== 'ALL' || selectedFunction !== 'ALL' || selectedSector !== 'ALL' || searchQuery) && (
              <button
                onClick={handleResetFilters}
                className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:text-[#2D1B69] bg-white border border-[#D8E3FB] hover:bg-[#F0F3FF] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t.filters.resetFilters}</span>
              </button>
            )}
          </div>

          {/* Quick Track Record Pills */}
          <div className="hidden md:flex items-center gap-1.5 overflow-x-auto py-1">
            {corporateTracks.slice(1, 6).map((ct) => (
              <button
                key={ct.id}
                onClick={() => setSelectedTrackRecord(selectedTrackRecord === ct.id ? 'ALL' : ct.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all shrink-0 border cursor-pointer ${
                  selectedTrackRecord === ct.id
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {lang === 'ar' ? ct.labelAr : ct.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Expandable Advanced Filter Panel */}
        {showAdvancedFilters && (
          <div className="max-w-4xl mx-auto mt-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-5 animate-in fade-in duration-200">
            
            {/* Filter 1: Corporate Track Record */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>{t.filters.trackRecord}</span>
              </label>
              <select
                id="filter-track-record"
                value={selectedTrackRecord}
                onChange={(e) => setSelectedTrackRecord(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium focus:outline-hidden focus:border-indigo-600 focus:bg-white"
              >
                {corporateTracks.map((ct) => (
                  <option key={ct.id} value={ct.id}>
                    {lang === 'ar' ? ct.labelAr : ct.labelEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter 2: C-Suite Function */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                <span>{t.filters.csuiteFunction}</span>
              </label>
              <select
                id="filter-function"
                value={selectedFunction}
                onChange={(e) => setSelectedFunction(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium focus:outline-hidden focus:border-indigo-600 focus:bg-white"
              >
                {csuiteFunctions.map((fn) => (
                  <option key={fn.id} value={fn.id}>
                    {lang === 'ar' ? fn.labelAr : fn.labelEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter 3: Industry Sector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-indigo-600" />
                <span>{t.filters.industrySector}</span>
              </label>
              <select
                id="filter-sector"
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium focus:outline-hidden focus:border-indigo-600 focus:bg-white"
              >
                {industrySectors.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    {lang === 'ar' ? sec.labelAr : sec.labelEn}
                  </option>
                ))}
              </select>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
