import React, { useEffect, useRef, useState } from 'react';
import { Phone, ChevronDown } from 'lucide-react';
import { useClinicConfig } from '../context/ClinicConfigContext';
import { formatTelHref } from '../utils/phone';

type CallNumbersMenuProps = {
  variant?: 'header' | 'hero' | 'mobile';
  className?: string;
};

export const CallNumbersMenu: React.FC<CallNumbersMenuProps> = ({
  variant = 'header',
  className = ''
}) => {
  const { config } = useClinicConfig();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const numbers = [
    { label: 'Landline', value: config.phone },
    { label: 'Mobile', value: config.mobile },
    { label: 'Alternate', value: config.mobileAlt }
  ];

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  const triggerClass =
    variant === 'hero'
      ? 'inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-[0.9rem] text-sm font-bold text-white border border-white/40 bg-white/15 hover:bg-white/25 backdrop-blur-sm transition-colors cursor-pointer'
      : variant === 'mobile'
        ? 'btn-secondary w-full py-2.5 text-xs cursor-pointer'
        : 'inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-pink-800 bg-pink-50 hover:bg-pink-100 border border-pink-200 rounded-xl transition-colors cursor-pointer';

  const panelClass =
    variant === 'hero'
      ? 'absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 rounded-2xl border border-pink-200 bg-white text-slate-800 shadow-xl p-2 z-20'
      : variant === 'mobile'
        ? 'relative mt-2 w-full rounded-2xl border border-pink-200 bg-white text-slate-800 shadow-md p-2 z-10'
      : 'absolute right-0 top-full mt-2 w-64 rounded-2xl border border-pink-200 bg-white text-slate-800 shadow-xl p-2 z-50';

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={triggerClass}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <Phone className="w-4 h-4" />
        <span>{variant === 'hero' ? 'Call us' : 'Call'}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className={panelClass} role="menu">
          <p className="px-3 pt-2 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-pink-700">
            Call clinic
          </p>
          {numbers.map((item) => (
            <a
              key={item.value}
              href={formatTelHref(item.value)}
              role="menuitem"
              className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-pink-50 transition-colors"
              onClick={() => setOpen(false)}
            >
              <span className="text-[11px] font-semibold text-slate-500">{item.label}</span>
              <span className="text-sm font-extrabold text-pink-800">{item.value}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
