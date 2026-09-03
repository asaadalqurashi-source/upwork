import React from 'react';

interface MushowrLogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'wordmark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showArabic?: boolean;
  theme?: 'light' | 'dark';
}

export const MushowrLogo: React.FC<MushowrLogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
  showArabic = true,
  theme = 'light'
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-lg', height: 'h-7', arabic: 'text-sm' },
    md: { icon: 'w-9 h-9', text: 'text-2xl', height: 'h-9', arabic: 'text-base' },
    lg: { icon: 'w-11 h-11', text: 'text-3xl', height: 'h-11', arabic: 'text-lg' },
    xl: { icon: 'w-14 h-14', text: 'text-4xl', height: 'h-14', arabic: 'text-xl' }
  };

  const currentSize = sizeMap[size];

  // Ribbon origami icon mark based on the uploaded logo
  const IconMark = (
    <svg 
      className={`${currentSize.icon} shrink-0`} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Mushowr Brand Icon"
    >
      <defs>
        <linearGradient id="mushowrRibbonLeft" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#162B75" />
          <stop offset="50%" stopColor="#2546B0" />
          <stop offset="100%" stopColor="#3730A3" />
        </linearGradient>
        <linearGradient id="mushowrRibbonCenter" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2D1B69" />
          <stop offset="50%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
        <linearGradient id="mushowrRibbonRight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#311042" />
          <stop offset="60%" stopColor="#4C1D95" />
          <stop offset="100%" stopColor="#6B21A8" />
        </linearGradient>
        <linearGradient id="ribbonShadow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0F172A" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#1E1B4B" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      {/* Left folded leg of M */}
      <path 
        d="M18 84V26C18 20 25 16 30 20L48 35C50 37 54 37 56 35L74 20C79 16 86 20 86 26V84C86 87 81 89 78 86L62 67C60 64 56 64 54 67L38 86C35 89 18 87 18 84Z" 
        fill="url(#mushowrRibbonCenter)"
      />
      {/* Left primary fold */}
      <path 
        d="M18 26C18 20 25 16 30 20L52 38L42 56L22 39C19 36 18 31 18 26Z" 
        fill="url(#mushowrRibbonLeft)"
      />
      {/* Right fold */}
      <path 
        d="M86 26C86 20 79 16 74 20L52 38L62 56L82 39C85 36 86 31 86 26Z" 
        fill="url(#mushowrRibbonRight)"
      />
      {/* Inner shadow fold for depth */}
      <path 
        d="M48 35L38 52L52 64L66 52L56 35C54 33 50 33 48 35Z" 
        fill="url(#ribbonShadow)"
      />
    </svg>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center justify-center ${className}`}>{IconMark}</div>;
  }

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {IconMark}
      
      {variant !== 'icon' && (
        <div className="flex flex-col text-start leading-none">
          <div className="flex items-center gap-2">
            {/* Wordmark in the exact ribbon gradient styling */}
            <span 
              className={`font-['IBM_Plex_Sans',sans-serif] font-bold tracking-tight ${currentSize.text} bg-gradient-to-r from-[#142B6F] via-[#2D1B69] to-[#581C87] bg-clip-text text-transparent`}
            >
              Mushowr
            </span>
            {showArabic && (
              <span className={`font-semibold text-slate-400 font-['IBM_Plex_Sans_Arabic'] ${currentSize.arabic} border-s border-slate-300 ps-2 leading-none`}>
                مشور
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
