import React, { useState } from 'react';
import { MessageCircle, X, ShieldCheck, ChevronRight } from 'lucide-react';
import { useClinicConfig } from '../context/ClinicConfigContext';
import { formatWhatsappNumber } from '../utils/whatsapp';

export const WhatsAppFloat: React.FC = () => {
  const { config } = useClinicConfig();
  const [isOpen, setIsOpen] = useState(false);

  const recepNum = formatWhatsappNumber(config.receptionistWhatsapp);

  const defaultMsg = encodeURIComponent(
    `Hello ${config.name}, I would like to inquire about OPD consultation timings & book an appointment.`
  );

  return (
    <>
      {isOpen && (
        <div className="fixed float-safe-wa-menu z-40 bg-white/95 backdrop-blur-xl rounded-3xl p-4 shadow-2xl border border-emerald-200/90 w-[calc(100vw-2.5rem)] max-w-xs sm:w-80 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                <MessageCircle className="w-4 h-4 fill-white text-emerald-500" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-slate-900 block leading-tight">WhatsApp Helpdesk</span>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Replies in ~5 mins
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              aria-label="Close WhatsApp menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-slate-600 font-medium leading-relaxed bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
            Welcome to Dr. Shilpa&apos;s MOTHER CARE, Tumakuru! How can our reception team assist you today?
          </p>

          <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200/80 text-[10px] text-emerald-800 font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>End-to-End Encrypted & Privacy Protected</span>
          </div>

          <div className="space-y-2">
            {recepNum && (
              <a
                href={`https://wa.me/${recepNum}?text=${defaultMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                  <div className="text-left">
                    <span className="block font-extrabold leading-tight">Reception Desk WhatsApp</span>
                    <span className="text-[10px] text-emerald-100 font-medium">{config.receptionistWhatsapp}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            )}
          </div>

          <div className="pt-2 text-[10px] text-slate-400 text-center font-medium border-t border-slate-100">
            WhatsApp booking • Tumakuru
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed float-safe-wa z-40 w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-full shadow-[0_12px_30px_-8px_rgb(16_185_129_/_0.55)] flex items-center justify-center transition-all cursor-pointer border-2 border-white/90 hover:-translate-y-0.5 active:translate-y-0"
        aria-label="WhatsApp booking options"
        aria-expanded={isOpen}
      >
        <MessageCircle className="w-6 h-6 fill-white text-emerald-600" />
      </button>
    </>
  );
};
