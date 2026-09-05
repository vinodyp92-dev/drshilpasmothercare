import React from 'react';
import { useClinicConfig } from '../context/ClinicConfigContext';

type ClinicBrandTitleProps = {
  variant?: 'header' | 'footer' | 'hero';
  className?: string;
  showTagline?: boolean;
};

export const ClinicBrandTitle: React.FC<ClinicBrandTitleProps> = ({
  variant = 'header',
  className = '',
  showTagline = true
}) => {
  const { config } = useClinicConfig();
  const { brandPrefix, brandAccent, taglineTransliteration } = config;

  if (variant === 'hero') {
    return (
      <div className={`space-y-2 text-center ${className}`}>
        <h1 className="font-aesthetic font-extrabold tracking-tight text-white leading-[1.05]">
          <span className="block text-3xl sm:text-4xl lg:text-5xl text-pink-200">{brandPrefix}</span>
          <span className="block text-4xl sm:text-5xl lg:text-6xl text-pink-100 mt-1 font-brand">
            {brandAccent}
          </span>
        </h1>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`text-left ${className}`}>
        <span className="font-aesthetic text-xl sm:text-2xl font-extrabold text-pink-800 block leading-tight">
          {brandPrefix}
        </span>
        <span className="font-brand text-2xl sm:text-3xl text-pink-600 tracking-wide block leading-none mt-0.5">
          {brandAccent}
        </span>
        {showTagline && (
          <span className="text-[10px] sm:text-[11px] text-pink-700/80 font-medium block mt-2 leading-relaxed font-sans-body normal-case tracking-normal uppercase">
            {taglineTransliteration}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`min-w-0 text-left ${className}`}>
      <span className="font-aesthetic text-[15px] sm:text-xl lg:text-2xl font-extrabold text-pink-800 block leading-tight truncate group-hover:text-pink-900 transition-colors">
        {brandPrefix}
      </span>
      <span className="font-brand text-lg sm:text-2xl lg:text-3xl text-pink-600 tracking-wide block leading-none truncate">
        {brandAccent}
      </span>
      {showTagline && (
        <span className="text-[9px] sm:text-[10px] text-pink-800/80 font-medium block mt-1.5 leading-snug font-sans-body tracking-normal line-clamp-2 uppercase">
          {taglineTransliteration}
        </span>
      )}
    </div>
  );
};
