import React, { useEffect, useRef, useState } from 'react';
import { Phone, X, ChevronRight } from 'lucide-react';
import { useClinicConfig } from '../context/ClinicConfigContext';
import { formatTelHref } from '../utils/phone';

export const CallFloat: React.FC = () => {
  const { config } = useClinicConfig();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const options = [
    { label: 'Emergency', value: config.emergencyHotline || '9743033256' },
    { label: 'Reception', value: config.receptionistWhatsapp || '9900047256' },
    { label: 'Landline', value: config.phone }
  ].filter(
    (item, index, arr) =>
      arr.findIndex((x) => x.value.replace(/\D/g, '') === item.value.replace(/\D/g, '')) === index
  );

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [isOpen]);

  return (
    <div ref={rootRef} className="fixed float-safe-call z-40 flex flex-col items-end gap-3">
      {isOpen && (
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-4 shadow-2xl border border-pink-200/90 w-[calc(100vw-2.5rem)] max-w-xs sm:w-72 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-pink-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-600 to-rose-600 text-white flex items-center justify-center shadow-sm">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-slate-900 block leading-tight">Call clinic</span>
                <span className="text-[10px] text-pink-700 font-bold">Choose a number</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              aria-label="Close call menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            {options.map((item) => (
              <a
                key={item.value}
                href={formatTelHref(item.value)}
                className="w-full p-2.5 bg-pink-50 hover:bg-pink-100 text-slate-800 font-bold text-xs rounded-xl border border-pink-200 transition-all flex items-center justify-between cursor-pointer group"
                onClick={() => setIsOpen(false)}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <Phone className="w-4 h-4 text-pink-600 flex-shrink-0" />
                  <span className="text-left min-w-0">
                    <span className="block font-extrabold text-pink-900 leading-tight">{item.label}</span>
                    <span className="text-[11px] text-slate-600 font-semibold">{item.value}</span>
                  </span>
                </span>
                <ChevronRight className="w-4 h-4 text-pink-500 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white shadow-[0_12px_30px_-8px_rgb(219_39_119_/_0.55)] flex items-center justify-center transition-all border-2 border-white/90 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        aria-label="Call clinic options"
        aria-expanded={isOpen}
      >
        <Phone className="w-6 h-6" />
      </button>
    </div>
  );
};
