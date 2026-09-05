import React from 'react';
import { Phone } from 'lucide-react';
import { formatTelHref } from '../utils/phone';
import { useClinicConfig } from '../context/ClinicConfigContext';

type CallNumbersMenuProps = {
  variant?: 'header' | 'hero' | 'mobile';
  className?: string;
};

/** Reception call number for header / hero CTAs (not emergency). */
export const CallNumbersMenu: React.FC<CallNumbersMenuProps> = ({
  variant = 'header',
  className = ''
}) => {
  const { config } = useClinicConfig();
  const callNumber = config.receptionistWhatsapp || '9900047256';

  const triggerClass =
    variant === 'hero'
      ? 'inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-[0.9rem] text-sm font-bold text-pink-900 border border-pink-300/80 bg-white/70 hover:bg-white backdrop-blur-sm transition-colors'
      : variant === 'mobile'
        ? 'btn-secondary w-full py-2.5 text-xs inline-flex items-center justify-center gap-1.5'
        : 'inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-pink-800 bg-pink-50 hover:bg-pink-100 border border-pink-200 rounded-full transition-colors';

  return (
    <a
      href={formatTelHref(callNumber)}
      className={`${triggerClass} ${className}`}
      aria-label={`Call reception at ${callNumber}`}
    >
      <Phone className="w-4 h-4" />
      <span>{variant === 'hero' ? 'Call us' : 'Call'}</span>
    </a>
  );
};
