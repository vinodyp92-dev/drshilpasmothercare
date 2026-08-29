import React, { useState } from 'react';
import { MessageCircle, Phone, Calendar, X, Heart, ShieldCheck, ChevronRight } from 'lucide-react';
import { useClinicConfig } from '../context/ClinicConfigContext';

interface WhatsAppFloatProps {
  onOpenBooking: () => void;
}

export const WhatsAppFloat: React.FC<WhatsAppFloatProps> = ({ onOpenBooking }) => {
  const { config } = useClinicConfig();
  const [isOpen, setIsOpen] = useState(false);

  // Helper to clean phone numbers for WhatsApp API links
  const formatWhatsappNum = (numStr?: string) => {
    if (!numStr) return '';
    const raw = numStr.replace(/[^0-9]/g, '');
    return raw.length === 10 ? `91${raw}` : raw;
  };

  const recepNum = formatWhatsappNum(config.receptionistWhatsapp || config.mobile);
  const docNum = formatWhatsappNum(config.doctorWhatsapp || config.mobile);

  const defaultMsg = encodeURIComponent(
    `Hello ${config.name}, I would like to inquire about OPD consultation timings & book an appointment.`
  );

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      
      {/* Expanded Quick Options Menu */}
      {isOpen && (
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-4 shadow-2xl border border-emerald-200/90 w-[calc(100vw-2.5rem)] max-w-xs sm:w-80 space-y-3 animate-fade-in">
          
          <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                <MessageCircle className="w-4 h-4 fill-white text-emerald-500" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-slate-900 block leading-tight">Clinic Helpdesk</span>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Replies in ~5 mins
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-slate-600 font-medium leading-relaxed bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
            Welcome to Mother & Child Speciality Clinic, Tumakuru! How can our reception team assist you today?
          </p>

          <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200/80 text-[10px] text-emerald-800 font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>End-to-End Encrypted & Privacy Protected</span>
          </div>

          <div className="space-y-2">
            {/* Reception Desk WhatsApp Link */}
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
                  <span className="text-[10px] text-emerald-100 font-medium">{config.receptionistWhatsapp || config.mobile}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* Doctor Direct WhatsApp Link */}
            <a
              href={`https://wa.me/${docNum}?text=${defaultMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-bold text-xs rounded-xl border border-emerald-200 transition-all flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <div className="text-left">
                  <span className="block font-extrabold text-emerald-900 leading-tight">Doctor Direct WhatsApp</span>
                  <span className="text-[10px] text-emerald-700 font-semibold">{config.doctorWhatsapp || config.mobile}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* Direct Call */}
            <a
              href={`tel:${config.phone.replace(/[^0-9+]/g, '')}`}
              className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 transition-all flex items-center justify-between cursor-pointer group"
            >
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-pink-600" />
                <span>Call Desk: {config.phone}</span>
              </span>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* Book Appointment Modal Trigger */}
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenBooking();
              }}
              className="w-full p-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-between cursor-pointer group"
            >
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-white" />
                <span>Book Visit / OPD Slot</span>
              </span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="pt-2 text-[10px] text-slate-400 text-center font-medium border-t border-slate-100">
            Emergency Care Available 24x7 • Tumakuru
          </div>

        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs rounded-full shadow-[0_12px_30px_-8px_rgb(16_185_129_/_0.55)] flex items-center gap-2 transition-all cursor-pointer border-2 border-white/90 hover:-translate-y-0.5 active:translate-y-0"
        aria-label="Quick WhatsApp & Call Support"
        aria-expanded={isOpen}
      >
        <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
        <span className="hidden sm:inline font-bold">WhatsApp / Quick booking</span>
        <span className="sm:hidden font-bold">WhatsApp</span>
      </button>

    </div>
  );
};
