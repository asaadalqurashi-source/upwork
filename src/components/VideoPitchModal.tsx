import React, { useState, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Calendar, 
  CheckCircle, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';
import { Advisor, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface VideoPitchModalProps {
  advisor: Advisor | null;
  lang: Language;
  onClose: () => void;
  onBookNow: (advisor: Advisor) => void;
}

export const VideoPitchModal: React.FC<VideoPitchModalProps> = ({
  advisor,
  lang,
  onClose,
  onBookNow
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(12);
  const totalDuration = 30; // 30-sec pitch
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!advisor) return null;
  const t = TRANSLATIONS[lang];

  const handlePlayToggle = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="video-pitch-modal"
        className="relative w-full max-w-2xl rounded-2xl bg-white border border-slate-200/80 shadow-2xl overflow-hidden text-slate-800 flex flex-col"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {t.videoModal.title}
              </h3>
              <p className="text-xs text-slate-300">
                {lang === 'ar' ? advisor.name : advisor.nameEn} • {lang === 'ar' ? advisor.functionLabelAr : advisor.functionLabelEn}
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

        {/* Video Player Container */}
        <div className="relative bg-black aspect-video flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            src={advisor.videoElevatorPitch.videoUrl}
            poster={advisor.videoElevatorPitch.videoThumbnail}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover"
          />

          {/* On-screen Watermark Badges */}
          <div className="absolute top-4 start-4 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-md border border-white/10 text-xs text-white">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold">{advisor.primaryTrackRecord} Verified</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-300">30s Elevator Pitch</span>
          </div>

          {/* Play/Pause Center Overlay (when paused) */}
          {!isPlaying && (
            <button
              onClick={handlePlayToggle}
              className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-2xl hover:scale-105 transition-transform cursor-pointer"
            >
              <Play className="w-6 h-6 fill-white ms-0.5" />
            </button>
          )}

          {/* Video Controls Bar */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 flex flex-col gap-2">
            {/* Progress line */}
            <div className="w-full bg-slate-700/60 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-500 h-full transition-all duration-300"
                style={{ width: `${(currentTime / totalDuration) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-3">
                <button 
                  onClick={handlePlayToggle}
                  className="hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                </button>
                <button 
                  onClick={handleMuteToggle}
                  className="hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <span className="font-mono text-[11px] text-slate-300">
                  0:{currentTime < 10 ? `0${currentTime}` : currentTime} / 0:{totalDuration}
                </span>
              </div>

              <div className="text-[11px] text-indigo-300 font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{lang === 'ar' ? 'موجز استشاري مكثف' : 'Condensed Executive Brief'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Video Key Takeaways & Strategic Summary */}
        <div className="p-6 space-y-4">
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
              {t.videoModal.executivePitch}
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200 font-medium">
              "{lang === 'ar' ? advisor.videoElevatorPitch.summaryAr : advisor.videoElevatorPitch.summaryEn}"
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              {t.videoModal.keyThemes}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {(lang === 'ar' ? advisor.videoElevatorPitch.topicsCoveredAr : advisor.videoElevatorPitch.topicsCoveredEn).map((topic, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="line-clamp-1">{topic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Direct CTA */}
          <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p className="text-xs text-slate-500 font-medium">{t.card.hourlyFee}</p>
              <p className="text-lg font-bold text-slate-900">
                {advisor.hourlyRate.toLocaleString()} {advisor.currency}
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 border border-slate-300 transition-colors cursor-pointer"
              >
                {t.videoModal.close}
              </button>

              <button
                onClick={() => {
                  onClose();
                  onBookNow(advisor);
                }}
                className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-white" />
                <span>{t.videoModal.proceedToBook}</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
