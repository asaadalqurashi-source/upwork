import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  ThumbsUp, 
  Award, 
  MessageSquare,
  Lock
} from 'lucide-react';
import { BookingSession, Language, SessionRatingFeedback } from '../types';

interface RatingFeedbackModalProps {
  session: BookingSession;
  lang: Language;
  onClose: () => void;
  onSubmitFeedback: (sessionId: string, feedback: SessionRatingFeedback) => void;
}

export const RatingFeedbackModal: React.FC<RatingFeedbackModalProps> = ({
  session,
  lang,
  onClose,
  onSubmitFeedback
}) => {
  const isRtl = lang === 'ar';
  const existingFeedback = session.ratingFeedback;

  const [ratingOverall, setRatingOverall] = useState(existingFeedback?.ratingOverall || 5);
  const [ratingProfessionalism, setRatingProfessionalism] = useState(existingFeedback?.ratingProfessionalism || 5);
  const [ratingInsightQuality, setRatingInsightQuality] = useState(existingFeedback?.ratingInsightQuality || 5);
  
  const [selectedTags, setSelectedTags] = useState<string[]>(
    existingFeedback?.selectedTags || [
      lang === 'ar' ? 'وضوح الرؤية الاستراتيجية' : 'Strategic Clarity',
      lang === 'ar' ? 'خارطة طريق تنفيذية قابلة للتطبيق' : 'Actionable 90-Day Roadmap'
    ]
  );
  const [testimonial, setTestimonial] = useState(
    existingFeedback?.testimonial || (lang === 'ar' 
      ? 'جلسة استثنائية قدمت حلولاً مباشرة لتحديات سلاسل الإمداد ومكنتنا من تحديد وفورات كلفة واضحة في ميزانية الربع القادم.' 
      : 'Exceptional executive consultation that directly unblocked our operational bottleneck and identified immediate cost savings.')
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const availableTags = [
    { ar: 'وضوح الرؤية الاستراتيجية', en: 'Strategic Clarity' },
    { ar: 'خارطة طريق تنفيذية قابلة للتطبيق', en: 'Actionable 90-Day Roadmap' },
    { ar: 'عمق تجربة الشركات القيادية (C-Suite Depth)', en: 'C-Suite Board Depth' },
    { ar: 'تشخيص سريع للفاقد التشغيلي', en: 'Rapid Bottleneck Audit' },
    { ar: 'خبرة موثوقة في السوق السعودي', en: 'Deep Saudi Market Expertise' },
    { ar: 'دقة الالتزام باتفاقية السرية (NDA)', en: 'Strict NDA Compliance' }
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const feedback: SessionRatingFeedback = {
        id: `rf-${Date.now()}`,
        ratingOverall,
        ratingProfessionalism,
        ratingInsightQuality,
        selectedTags,
        testimonial,
        submittedAt: new Date().toISOString(),
        clientName: session.clientName
      };

      onSubmitFeedback(session.id, feedback);
      setIsSubmitting(false);
      setSubmittedSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1200);
    }, 800);
  };

  const StarSelector = ({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) => (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
      <span className="text-xs font-medium text-slate-800">{label}</span>
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-1 text-slate-400 hover:scale-110 transition-transform cursor-pointer"
          >
            <Star
              className={`w-5 h-5 ${
                star <= value ? 'text-indigo-600 fill-indigo-600' : 'text-slate-300'
              }`}
            />
          </button>
        ))}
        <span className="text-xs font-semibold font-mono text-indigo-700 ms-1.5">{value}.0</span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        id="rating-feedback-modal"
        className="relative w-full max-w-2xl rounded-2xl bg-white border border-slate-200/80 shadow-2xl overflow-hidden text-slate-800 my-auto animate-in fade-in zoom-in-95 duration-200"
      >
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/20 border border-indigo-400/30 text-indigo-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {lang === 'ar' ? 'تقييم الجلسة وجودة التوصيات التنفيذية' : 'Rate Advisor & Actionable Insight Quality'}
              </h2>
              <p className="text-xs text-indigo-300 font-medium">
                {session.referenceCode} • {lang === 'ar' ? session.advisor.name : session.advisor.nameEn} ({session.advisor.primaryTrackRecord})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedSuccess ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-300 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {lang === 'ar' ? 'تم توثيق تقييمك التنفيذي بنجاح' : 'Executive Rating Recorded Successfully'}
            </h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              {lang === 'ar' 
                ? 'شكراً لك. تقييمك يسهم في رفع معايير الحوكمة وجودة مخرجات الـ 90 يوماً عبر شبكة مشور.' 
                : 'Thank you. Your feedback enforces high governance and quality standards across the Mushowr network.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            
            {/* Advisor Summary Card */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3 text-xs">
              <img
                src={session.advisor.avatar}
                alt={session.advisor.name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200"
              />
              <div className="flex-1">
                <p className="font-bold text-slate-900 text-sm">
                  {lang === 'ar' ? session.advisor.name : session.advisor.nameEn}
                </p>
                <p className="text-slate-500 text-[11px] line-clamp-1">
                  {session.challengeBrief.title}
                </p>
              </div>
              <div className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-mono font-semibold border border-indigo-100">
                {session.feeSAR.toLocaleString()} SAR
              </div>
            </div>

            {/* Star Rating Criteria */}
            <div className="space-y-2.5">
              <StarSelector
                value={ratingOverall}
                onChange={setRatingOverall}
                label={lang === 'ar' ? 'التقييم العام للجلسة الاستشارية:' : 'Overall Advisory Experience:'}
              />
              <StarSelector
                value={ratingProfessionalism}
                onChange={setRatingProfessionalism}
                label={lang === 'ar' ? 'الاحترافية والالتزام بمعايير الحوكمة (Professionalism):' : 'Advisor Professionalism & Governance:'}
              />
              <StarSelector
                value={ratingInsightQuality}
                onChange={setRatingInsightQuality}
                label={lang === 'ar' ? 'عمق الرؤى وجودة التوصيات (Actionable Insight Quality):' : 'Actionable Insight & Deliverable Quality:'}
              />
            </div>

            {/* Endorsement Tags */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                {lang === 'ar' ? 'أبرز نقاط التميز في الجلسة (Endorsement Tags):' : 'Key Highlights & Endorsements:'}
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tagObj, idx) => {
                  const tagText = lang === 'ar' ? tagObj.ar : tagObj.en;
                  const isSelected = selectedTags.includes(tagText);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleTag(tagText)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-2xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      {tagText}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Written Testimonial Textarea */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                {lang === 'ar' ? 'التعليق الاستراتيجي وشهادة التقييم:' : 'Executive Testimonial & Written Remarks:'}
              </label>
              <textarea
                rows={3}
                value={testimonial}
                onChange={(e) => setTestimonial(e.target.value)}
                placeholder={lang === 'ar' ? 'اكتب انطباعك حول أثر التوصيات على قرارات شركتك...' : 'Share how the roadmap will impact your business...'}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-indigo-600 focus:bg-white leading-relaxed font-medium"
                required
              />
            </div>

            {/* Footer Actions */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 border border-slate-300 transition-colors cursor-pointer"
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{lang === 'ar' ? 'جارٍ الحفظ والتوثيق...' : 'Recording Review...'}</span>
                  </>
                ) : (
                  <>
                    <Star className="w-4 h-4 fill-white" />
                    <span>{lang === 'ar' ? 'اعتماد التقييم التنفيذي' : 'Submit Verified Rating'}</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
