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
  const { brandPrefix, brandAccent, taglineTransliteration, taglineEnglish } = config;

  if (variant === 'hero') {
    return (
      <div className={`space-y-3 ${className}`}>
        <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-pink-200/95">
          <span className="font-aesthetic normal-case tracking-tight text-base sm:text-lg text-white">
            {brandPrefix}{' '}
          </span>
          <span className="text-pink-300">{brandAccent}</span>
        </p>
        {showTagline && (
          <>
            <p className="font-aesthetic text-2xl sm:text-3xl lg:text-4xl text-pink-100/95 leading-snug max-w-xl">
              {taglineTransliteration}
            </p>
            <p className="text-sm sm:text-base text-slate-200/90 italic max-w-xl leading-relaxed">
              {taglineEnglish}
            </p>
          </>
        )}
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={className}>
        <span className="font-aesthetic text-lg sm:text-xl font-semibold text-pink-100 block leading-tight">
          {brandPrefix}
        </span>
        <span className="font-aesthetic text-xl sm:text-2xl font-extrabold text-white tracking-wide block leading-none mt-0.5">
          {brandAccent}
        </span>
        {showTagline && (
          <span className="text-[10px] sm:text-[11px] text-pink-300/90 font-medium block mt-2 leading-relaxed font-sans-body normal-case tracking-normal">
            {taglineTransliteration}
            <span className="block italic text-pink-200/80 mt-0.5">{taglineEnglish}</span>
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`min-w-0 ${className}`}>
      <span className="font-aesthetic text-base sm:text-lg font-semibold text-slate-800 block leading-tight group-hover:text-pink-800 transition-colors">
        {brandPrefix}
      </span>
      <span className="font-aesthetic text-lg sm:text-xl lg:text-2xl font-extrabold text-pink-700 tracking-wide block leading-none">
        {brandAccent}
      </span>
      {showTagline && (
        <span className="text-[9px] sm:text-[10px] text-pink-800/80 font-medium block mt-1.5 leading-snug font-sans-body normal-case tracking-normal line-clamp-2">
          {taglineTransliteration}
        </span>
      )}
    </div>
  );
};
