import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  FileText, 
  Star, 
  UserCheck, 
  Calendar, 
  X, 
  ExternalLink, 
  Sparkles,
  Info,
  DollarSign,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { ToastNotification, Language } from '../types';

interface GlobalToastContainerProps {
  toasts: ToastNotification[];
  lang: Language;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<{
  toast: ToastNotification;
  lang: Language;
  onDismiss: (id: string) => void;
}> = ({ toast, lang, onDismiss }) => {
  const isRtl = lang === 'ar';
  const duration = toast.durationMs || 5000;
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const intervalTime = 50;
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          onDismiss(toast.id);
          return 0;
        }
        return prev - step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [duration, isPaused, onDismiss, toast.id]);

  // Styling and configuration based on toast type
  const getTypeConfig = () => {
    switch (toast.type) {
      case 'nda_signed':
        return {
          icon: <Lock className="w-5 h-5 text-indigo-400" />,
          badgeIcon: <ShieldCheck className="w-3 h-3 text-emerald-400" />,
          accentBorder: 'border-indigo-500/40 shadow-indigo-500/10',
          glowBg: 'from-slate-900 via-slate-900 to-slate-950',
          progressColor: 'bg-indigo-500',
          badgeDefaultAr: 'توثيق قانوني مشفر (SHA-256)',
          badgeDefaultEn: 'SHA-256 Legally Executed NDA',
          iconBg: 'bg-indigo-950/60 border-indigo-500/30'
        };
      case 'escrow_locked':
        return {
          icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
          badgeIcon: <DollarSign className="w-3 h-3 text-emerald-400" />,
          accentBorder: 'border-emerald-500/40 shadow-emerald-500/10',
          glowBg: 'from-slate-900 via-slate-900 to-slate-950',
          progressColor: 'bg-emerald-500',
          badgeDefaultAr: 'محمي في خزينة الضمان البنكي',
          badgeDefaultEn: 'Escrow Vault Secured (SAR)',
          iconBg: 'bg-emerald-950/60 border-emerald-500/30'
        };
      case 'escrow_released':
        return {
          icon: <Sparkles className="w-5 h-5 text-indigo-400" />,
          badgeIcon: <CheckCircle2 className="w-3 h-3 text-emerald-400" />,
          accentBorder: 'border-indigo-500/40 shadow-indigo-500/10',
          glowBg: 'from-slate-900 via-slate-900 to-slate-950',
          progressColor: 'bg-indigo-500',
          badgeDefaultAr: 'تم الإفراج والتحويل البنكي',
          badgeDefaultEn: 'Escrow Released & Transferred',
          iconBg: 'bg-indigo-950/60 border-indigo-500/30'
        };
      case 'deliverable_submitted':
        return {
          icon: <FileText className="w-5 h-5 text-sky-400" />,
          badgeIcon: <Sparkles className="w-3 h-3 text-indigo-400" />,
          accentBorder: 'border-sky-500/40 shadow-sky-500/10',
          glowBg: 'from-slate-900 via-slate-900 to-slate-950',
          progressColor: 'bg-sky-500',
          badgeDefaultAr: 'خارطة طريق الـ 90 يوماً جاهزة',
          badgeDefaultEn: '90-Day Roadmap Ready',
          iconBg: 'bg-sky-950/60 border-sky-500/30'
        };
      case 'feedback_submitted':
        return {
          icon: <Star className="w-5 h-5 text-indigo-400 fill-indigo-400" />,
          badgeIcon: <CheckCircle2 className="w-3 h-3 text-indigo-400" />,
          accentBorder: 'border-indigo-500/40 shadow-indigo-500/10',
          glowBg: 'from-slate-900 via-slate-900 to-slate-950',
          progressColor: 'bg-indigo-500',
          badgeDefaultAr: 'تقييم موثق ومعتمد',
          badgeDefaultEn: 'Verified Client Review',
          iconBg: 'bg-indigo-950/60 border-indigo-500/30'
        };
      case 'profile_updated':
        return {
          icon: <UserCheck className="w-5 h-5 text-emerald-400" />,
          badgeIcon: <Sparkles className="w-3 h-3 text-emerald-300" />,
          accentBorder: 'border-emerald-500/40 shadow-emerald-500/10',
          glowBg: 'from-slate-900 via-slate-900 to-slate-950',
          progressColor: 'bg-emerald-500',
          badgeDefaultAr: 'تحديث الملف التنفيذي',
          badgeDefaultEn: 'Executive Profile Updated',
          iconBg: 'bg-emerald-950/60 border-emerald-500/30'
        };
      default:
        return {
          icon: <Info className="w-5 h-5 text-slate-200" />,
          badgeIcon: <CheckCircle2 className="w-3 h-3 text-slate-300" />,
          accentBorder: 'border-slate-700 shadow-slate-900/30',
          glowBg: 'from-slate-900 via-slate-900 to-slate-950',
          progressColor: 'bg-indigo-500',
          badgeDefaultAr: 'إشعار فوري',
          badgeDefaultEn: 'System Action',
          iconBg: 'bg-slate-800 border-slate-700'
        };
    }
  };

  const config = getTypeConfig();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`relative w-full sm:w-[420px] rounded-xl bg-slate-900/95 backdrop-blur-xl border ${config.accentBorder} shadow-2xl p-4 overflow-hidden select-none pointer-events-auto transition-all`}
      role="alert"
      aria-live="assertive"
    >
      {/* Top Header Badge & Close Button */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-800/80 border border-slate-700 text-[11px] font-medium text-slate-300 font-mono">
          {config.badgeIcon}
          <span>
            {lang === 'ar' 
              ? (toast.badgeAr || config.badgeDefaultAr) 
              : (toast.badgeEn || config.badgeDefaultEn)}
          </span>
          {toast.referenceCode && (
            <span className="text-indigo-300 font-semibold ms-1 border-s border-slate-700 ps-1">
              {toast.referenceCode}
            </span>
          )}
        </div>

        <button
          onClick={() => onDismiss(toast.id)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          title={lang === 'ar' ? 'إغلاق الإشعار' : 'Dismiss notification'}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Body with Icon and Message */}
      <div className="flex items-start gap-3">
        <div className={`p-2.5 rounded-lg border ${config.iconBg} shrink-0 mt-0.5`}>
          {config.icon}
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <h4 className="text-sm font-semibold text-white leading-tight">
            {lang === 'ar' ? toast.titleAr : toast.titleEn}
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            {lang === 'ar' ? toast.messageAr : toast.messageEn}
          </p>

          {/* Optional Action Button */}
          {toast.action && (
            <div className="pt-2">
              <button
                onClick={() => {
                  toast.action?.onClick();
                  onDismiss(toast.id);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
              >
                <span>{lang === 'ar' ? toast.action.labelAr : toast.action.labelEn}</span>
                {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Live Countdown Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800/50 overflow-hidden">
        <div
          className={`h-full ${config.progressColor} transition-all duration-75`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  );
};

export const GlobalToastContainer: React.FC<GlobalToastContainerProps> = ({
  toasts,
  lang,
  onDismiss
}) => {
  return (
    <div
      aria-label="Global Action Notifications"
      className="fixed z-[9999] bottom-4 end-4 sm:bottom-6 sm:end-6 flex flex-col gap-3 max-w-[calc(100vw-2rem)] pointer-events-none"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            lang={lang}
            onDismiss={onDismiss}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
