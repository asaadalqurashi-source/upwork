import React from 'react';
import { 
  Star, 
  ShieldCheck, 
  Play, 
  Calendar, 
  Building, 
  Award, 
  Clock, 
  ArrowLeft, 
  ArrowRight,
  Sparkles,
  CheckCircle,
  Video
} from 'lucide-react';
import { Advisor, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface AdvisorCardProps {
  advisor: Advisor;
  lang: Language;
  onBookClick: (advisor: Advisor) => void;
  onWatchVideoClick: (advisor: Advisor) => void;
  aiMatchScore?: number;
  matchRationale?: string;
}

export const AdvisorCard: React.FC<AdvisorCardProps> = ({
  advisor,
  lang,
  onBookClick,
  onWatchVideoClick,
  aiMatchScore,
  matchRationale
}) => {
  const t = TRANSLATIONS[lang];
  const isRtl = lang === 'ar';

  return (
    <div 
      id={`advisor-card-${advisor.id}`}
      className="group relative rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#818CF8] shadow-strategic-low hover:shadow-strategic-high transition-all duration-200 flex flex-col justify-between overflow-hidden"
    >
      {/* Top Banner highlight for high Match */}
      {aiMatchScore && aiMatchScore > 85 && (
        <div className="bg-[#2D1B69] px-4 py-1.5 text-xs font-semibold text-white flex items-center justify-between shadow-xs">
          <span className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-[#C7D2FE]" />
            <span>{t.card.aiMatchScore} {aiMatchScore}%</span>
          </span>
          <span className="text-[11px] font-medium text-[#E0E7FF] truncate max-w-[220px]">
            {matchRationale || (lang === 'ar' ? 'تطابق عالي مع معايير البحث والخبرة المطلوبة' : 'Strong match with required expertise')}
          </span>
        </div>
      )}

      <div className="p-6">
        
        {/* Header: Avatar, Name, Verified Badges & Rating */}
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <img
              src={advisor.avatar}
              alt={advisor.name}
              className="w-20 h-20 rounded-xl object-cover border border-[#E2E8F0] shadow-xs group-hover:border-[#4F46E5] transition-all"
            />
            <button
              onClick={() => onWatchVideoClick(advisor)}
              className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-[#180052] text-white shadow-xs hover:scale-105 transition-transform flex items-center justify-center cursor-pointer"
              title={t.card.viewVideoPitch}
            >
              <Play className="w-3 h-3 fill-white" />
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EEF0FF] text-[#2D1B69] text-[11px] font-semibold border border-[#D8E3FB]">
                <ShieldCheck className="w-3 h-3 text-[#4F46E5]" />
                <span>{advisor.primaryTrackRecord}</span>
              </span>
              <span className="text-xs text-slate-500 font-normal">
                • {advisor.experienceYears} {t.card.experience}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-[#111C2D] mt-1 group-hover:text-[#4F46E5] transition-colors line-clamp-1">
              {lang === 'ar' ? advisor.name : advisor.nameEn}
            </h3>

            <p className="text-xs text-[#4F46E5] font-semibold mt-0.5 line-clamp-1">
              {lang === 'ar' ? advisor.functionLabelAr : advisor.functionLabelEn}
            </p>

            {/* Rating and completed sessions */}
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-600 font-medium">
              <span className="flex items-center gap-1 text-[#10B981] font-semibold">
                <Star className="w-3.5 h-3.5 fill-[#10B981] text-[#10B981]" />
                <span className="text-[#111C2D]">{advisor.rating}</span>
                <span className="text-slate-400 font-normal">({advisor.reviewsCount})</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500">
                {advisor.totalSessionsCompleted} {lang === 'ar' ? 'جلسة منجزة' : 'sessions'}
              </span>
            </div>
          </div>
        </div>

        {/* Bio summary */}
        <p className="mt-4 text-xs text-slate-600 leading-relaxed line-clamp-3">
          {lang === 'ar' ? advisor.bioAr : advisor.bioEn}
        </p>

        {/* Former Track Record Timeline */}
        <div className="mt-4 pt-3 border-t border-[#E7EEFF] space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {t.card.formerTrack}
          </p>
          {advisor.formerRoles.slice(0, 2).map((role, idx) => (
            <div key={idx} className="bg-[#F9F9FF] p-2.5 rounded-lg border border-[#E2E8F0] text-xs">
              <div className="flex items-center justify-between gap-1">
                <span className="font-semibold text-[#111C2D] line-clamp-1">
                  {lang === 'ar' ? role.role : role.roleEn}
                </span>
                <span className="text-[10px] text-[#2D1B69] shrink-0 font-semibold bg-[#EEF0FF] px-2 py-0.5 rounded-full border border-[#D8E3FB]">
                  {role.years}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 font-normal">
                {lang === 'ar' ? role.company : role.companyEn}
              </p>
              <p className="text-[10px] text-[#005236] mt-1 flex items-start gap-1 font-medium">
                <CheckCircle className="w-3 h-3 shrink-0 mt-0.5 text-[#10B981]" />
                <span className="line-clamp-1">
                  {lang === 'ar' ? role.keyAchievementAr : role.keyAchievementEn}
                </span>
              </p>
            </div>
          ))}
        </div>

        {/* Verified Badges */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {(lang === 'ar' ? advisor.verifiedBadgesAr : advisor.verifiedBadgesEn).map((badge, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 rounded-full bg-[#F0F3FF] text-[#2D1B69] text-[10px] font-medium border border-[#D8E3FB]"
            >
              {badge}
            </span>
          ))}
        </div>

      </div>

      {/* Footer: Rate, 30s Pitch Video trigger & Booking Button */}
      <div className="p-4 bg-[#F9F9FF] border-t border-[#E7EEFF] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500 font-medium">{t.card.hourlyFee}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-[#111C2D]">
                {advisor.hourlyRate.toLocaleString()}
              </span>
              <span className="text-xs text-[#4F46E5] font-semibold">
                {advisor.currency} / {lang === 'ar' ? 'ساعة' : 'hr'}
              </span>
            </div>
          </div>

          <button
            onClick={() => onWatchVideoClick(advisor)}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#F0F3FF] text-xs font-semibold text-[#2D1B69] border border-[#D8E3FB] transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Video className="w-3.5 h-3.5 text-[#4F46E5]" />
            <span>{lang === 'ar' ? 'فيديو 30ث' : '30s Pitch'}</span>
          </button>
        </div>

        <button
          id={`book-advisor-btn-${advisor.id}`}
          onClick={() => onBookClick(advisor)}
          className="w-full py-2.5 px-4 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-xs sm:text-sm shadow-strategic-low hover:shadow-strategic-mid transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Calendar className="w-4 h-4 text-white" />
          <span>{t.card.bookSession}</span>
          {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
