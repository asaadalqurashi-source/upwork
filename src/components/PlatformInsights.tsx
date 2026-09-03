import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Award, 
  ShieldCheck, 
  Calendar, 
  Star, 
  DollarSign, 
  Sparkles,
  Users,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { Language } from '../types';

interface PlatformInsightsProps {
  lang: Language;
}

export const PlatformInsights: React.FC<PlatformInsightsProps> = ({ lang }) => {
  const isRtl = lang === 'ar';
  const [activeTimeframe, setActiveTimeframe] = useState<'6m' | '12m'>('6m');

  // 6-Month Historical Escrow Volume Trend Data (March 2026 - August 2026)
  const escrowTrendData = [
    { monthAr: 'مارس', monthEn: 'Mar 2026', volumeSAR: 148000, consultations: 42, avgSatisfaction: 4.94 },
    { monthAr: 'أبريل', monthEn: 'Apr 2026', volumeSAR: 186000, consultations: 53, avgSatisfaction: 4.95 },
    { monthAr: 'مايو', monthEn: 'May 2026', volumeSAR: 232000, consultations: 68, avgSatisfaction: 4.97 },
    { monthAr: 'يونيو', monthEn: 'Jun 2026', volumeSAR: 289000, consultations: 84, avgSatisfaction: 4.96 },
    { monthAr: 'يوليو', monthEn: 'Jul 2026', volumeSAR: 345000, consultations: 102, avgSatisfaction: 4.98 },
    { monthAr: 'أغسطس', monthEn: 'Aug 2026', volumeSAR: 418000, consultations: 124, avgSatisfaction: 4.98 }
  ];

  // Sector breakdown data
  const sectorData = [
    { sectorAr: 'سلاسل الإمداد والخدمات اللوجستية', sectorEn: 'Supply Chain & Logistics', count: 128, color: '#4F46E5' },
    { sectorAr: 'التقنية المالية والمصرفية', sectorEn: 'Fintech & Banking', count: 104, color: '#0284C7' },
    { sectorAr: 'البتروكيماويات والطاقة', sectorEn: 'Energy & Petrochemicals', count: 88, color: '#059669' },
    { sectorAr: 'المشاريع الكبرى والتطوير العقاري', sectorEn: 'Megaprojects & Real Estate', count: 76, color: '#7C3AED' },
    { sectorAr: 'التجزئة والسلع الاستهلاكية', sectorEn: 'Retail & Consumer (FMCG)', count: 62, color: '#2563EB' }
  ];

  // Rating and feedback criteria scores
  const ratingBreakdown = [
    { criterionAr: 'الاحترافية والالتزام بالوقت', criterionEn: 'Professionalism & Punctuality', score: 4.99, percentage: 99.8 },
    { criterionAr: 'عمق الرؤى والجدوى الاستراتيجية', criterionEn: 'Actionable Insight Quality', score: 4.97, percentage: 99.4 },
    { criterionAr: 'دقة خارطة طريق الـ 90 يوماً', criterionEn: '90-Day Execution Roadmap Clarity', score: 4.96, percentage: 99.2 },
    { criterionAr: 'ملاءمة الخبرة التنفيذية السابقة', criterionEn: 'Corporate Alumni Background Fit', score: 4.98, percentage: 99.6 }
  ];

  const totalEscrow6Months = escrowTrendData.reduce((acc, curr) => acc + curr.volumeSAR, 0);
  const totalConsultations6Months = escrowTrendData.reduce((acc, curr) => acc + curr.consultations, 0);
  const overallAvgRating = 4.98;

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xl text-xs space-y-1">
          <p className="font-semibold text-slate-900">{label}</p>
          <p className="text-indigo-600 font-mono font-semibold">
            {lang === 'ar' ? 'حجم الضمان:' : 'Escrow Volume:'} {payload[0]?.value?.toLocaleString()} SAR
          </p>
          {payload[1] && (
            <p className="text-sky-600 font-mono font-semibold">
              {lang === 'ar' ? 'الجلسات المنجزة:' : 'Consultations:'} {payload[1]?.value}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Widget Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-white">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{lang === 'ar' ? 'مؤشرات المنصة والحوكمة اللحظية' : 'Platform Insights & Escrow Intelligence'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
            {lang === 'ar' ? 'مؤشرات الأداء وثقة مجالس الإدارة' : 'Platform Governance & Performance Metrics'}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed font-normal">
            {lang === 'ar' 
              ? 'بيانات شفافة ومحدثة ترصد حجم الأموال المحمية في حساب الضمان، جودة التوصيات التنفيذية، وإجمالي الاستشارات المنفذة.' 
              : 'Real-time telemetry tracking escrow volume velocity, executive advisor ratings, and completed advisory turnarounds.'}
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-800/80 border border-slate-700">
          <button
            onClick={() => setActiveTimeframe('6m')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTimeframe === '6m'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            {lang === 'ar' ? 'آخر 6 أشهر' : 'Last 6 Months'}
          </button>
          <button
            onClick={() => setActiveTimeframe('12m')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTimeframe === '12m'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            {lang === 'ar' ? 'سنوي (12 شهر)' : 'Annual'}
          </button>
        </div>
      </div>

      {/* 3 Core KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* KPI 1: Historical Escrow Volume */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">{lang === 'ar' ? 'إجمالي حجم الضمان المدار' : 'Historical Escrow Volume'}</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {totalEscrow6Months.toLocaleString()} <span className="text-sm font-semibold text-indigo-600">SAR</span>
          </p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold pt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+28.4% {lang === 'ar' ? 'نمو شهري في حجم الودائع' : 'MoM Escrow Velocity'}</span>
          </div>
        </div>

        {/* KPI 2: Total Consultations */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">{lang === 'ar' ? 'إجمالي الجلسات الاستشارية' : 'Total Executive Consultations'}</span>
            <div className="p-2 rounded-lg bg-sky-50 text-sky-600 border border-sky-100">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {totalConsultations6Months.toLocaleString()} <span className="text-sm font-semibold text-sky-600">{lang === 'ar' ? 'جلسة' : 'Sessions'}</span>
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium pt-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% {lang === 'ar' ? 'التزام بتسليم مخرجات الـ 90 يوماً' : 'Roadmap Delivery Compliance'}</span>
          </div>
        </div>

        {/* KPI 3: Average Advisor Rating */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">{lang === 'ar' ? 'متوسط تقييم المستشارين' : 'Average Advisor Rating'}</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Star className="w-4 h-4 fill-indigo-600 text-indigo-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {overallAvgRating}
            </p>
            <span className="text-xs text-slate-500 font-medium">/ 5.00 ({lang === 'ar' ? 'من 473 تقييم معتمد' : 'from 473 verified reviews'})</span>
          </div>
          <div className="flex items-center gap-1 text-indigo-600 text-xs pt-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-indigo-500 text-indigo-500" />
              ))}
            </div>
            <span className="text-slate-600 ms-1 font-semibold">99.6% {lang === 'ar' ? 'معدل الرضا' : 'Satisfaction Rate'}</span>
          </div>
        </div>

      </div>

      {/* Main Chart Section: 6-Month Escrow Volume & Consultation Trends */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span>{lang === 'ar' ? 'اتجاه حجم الضمان المالي والاستشارات (آخر 6 أشهر)' : 'Historical Escrow Volume & Consultations Trend (Last 6 Months)'}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-normal">
              {lang === 'ar' ? 'المبالغ المحتجزة والمحررة تلقائياً للمستشارين بعد اعتماد التقارير' : 'Escrow amounts held and settled to advisors upon verified deliverable approval'}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              <span>{lang === 'ar' ? 'حجم الضمان (SAR)' : 'Escrow Volume (SAR)'}</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
              <span>{lang === 'ar' ? 'عدد الجلسات' : 'Sessions Count'}</span>
            </span>
          </div>
        </div>

        {/* Recharts Area Component */}
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={escrowTrendData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="teamsEscrowGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis 
                dataKey={lang === 'ar' ? 'monthAr' : 'monthEn'} 
                stroke="#94A3B8" 
                tick={{ fill: '#64748B', fontSize: 11 }}
                axisLine={{ stroke: '#E2E8F0' }}
              />
              <YAxis 
                stroke="#94A3B8" 
                tick={{ fill: '#64748B', fontSize: 11 }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                axisLine={{ stroke: '#E2E8F0' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="volumeSAR" 
                name={lang === 'ar' ? 'حجم الضمان' : 'Escrow Volume'}
                stroke="#4F46E5" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#teamsEscrowGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two-Column Grid: Sector Demand & Rating Quality Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Sector Demand Distribution */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>{lang === 'ar' ? 'توزيع الاستشارات حسب القطاعات الحيوية' : 'Consultations by Industry Sector'}</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono font-semibold">462 Total</span>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                <XAxis type="number" stroke="#94A3B8" tick={{ fill: '#64748B', fontSize: 11 }} />
                <YAxis 
                  type="category" 
                  dataKey={lang === 'ar' ? 'sectorAr' : 'sectorEn'} 
                  stroke="#94A3B8" 
                  tick={{ fill: '#334155', fontSize: 10 }}
                  width={isRtl ? 150 : 160}
                />
                <Tooltip 
                  formatter={(value: any) => [`${value} ${lang === 'ar' ? 'استشارة' : 'Consultations'}`, lang === 'ar' ? 'الطلب' : 'Demand']}
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#E2E8F0', borderRadius: '0.75rem', color: '#0f172a', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {sectorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Advisor Rating & Actionable Quality Breakdown */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Star className="w-4 h-4 text-indigo-600 fill-indigo-600" />
              <span>{lang === 'ar' ? 'معايير تقييم جودة المخرجات الاستشارية' : 'Executive Rating & Insight Quality Breakdown'}</span>
            </h3>
            <span className="text-xs text-emerald-800 font-mono font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">4.98 / 5.0</span>
          </div>

          <div className="space-y-4 pt-1">
            {ratingBreakdown.map((item, idx) => (
              <div key={idx} className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-800 font-medium">
                    {lang === 'ar' ? item.criterionAr : item.criterionEn}
                  </span>
                  <span className="text-indigo-600 font-mono font-semibold">
                    {item.score} / 5.0 ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-indigo-600"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between text-xs text-emerald-900 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'ar' ? 'التقييمات مشروطة بالهوية والموافقة على التقرير' : 'All reviews verified by corporate identity & report delivery'}</span>
            </div>
            <span className="text-emerald-700 font-semibold">100% Verified</span>
          </div>
        </div>

      </div>

    </div>
  );
};
