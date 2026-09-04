import React from 'react';
import { AlertTriangle, Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { useClinicConfig } from '../context/ClinicConfigContext';
import { formatWhatsappNumber } from '../utils/whatsapp';
import { ClinicLogo } from './ClinicLogo';
import { ClinicBrandTitle } from './ClinicBrandTitle';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenEmergency: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenEmergency }) => {
  const { config } = useClinicConfig();

  const whatsappNumber = formatWhatsappNumber(config.receptionistWhatsapp || config.mobile);
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello, I would like to enquire about an appointment at ${config.name}.`)}`
    : `mailto:${config.email}`;

  return (
    <footer className="bg-slate-950 text-slate-300 pt-12 pb-8 border-t border-rose-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
        <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-950/90 via-slate-900 to-rose-950/90 border border-rose-800/80 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <AlertTriangle className="w-6 h-6 text-rose-400 flex-shrink-0" />
            <div>
              <span className="text-rose-200 font-extrabold text-xs uppercase tracking-wider block">Obstetric Emergency Notice</span>
              <p className="text-xs text-rose-300">
                If you experience severe abdominal pain, sudden fluid leak, heavy bleeding, or decreased fetal movement, call emergency lines or visit immediately.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenEmergency}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors flex-shrink-0 cursor-pointer"
          >
            Emergency Guidance
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3.5">
              <ClinicLogo size="md" className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0" />
              <ClinicBrandTitle variant="footer" />
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Dedicated Obstetric, Gynaecology, High-Risk Pregnancy and Fertility Care center in Tumakuru, Karnataka. Led by Dr. Shilpa, MS (OBG).
            </p>

            <div className="text-xs text-slate-400 space-y-1 pt-1">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-pink-400 flex-shrink-0 mt-0.5" />
                <span>{config.address}, {config.cityStatePincode}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-pink-400 flex-shrink-0" />
                <span>Phone: {config.phone} | {config.mobile} | {config.mobileAlt}</span>
              </div>
            </div>
          </div>

          

          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
              Operating Timings
            </h4>
            <div className="space-y-1.5 text-xs text-slate-400 font-medium">
              <p className="text-pink-200 font-bold">Mon–Sat (evening only):</p>
              <p>{config.hours.weekdays.replace(' (Evening consultation)', '')}</p>
              <p className="text-slate-500 text-[11px]">Morning consultation is not offered at present.</p>
              <p className="text-pink-200 font-bold pt-1">Sunday:</p>
              <p className="text-rose-300 font-bold">{config.hours.sunday}</p>
              <p className="text-amber-200/90 font-semibold pt-2 leading-relaxed">{config.hours.festivalNotice}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Contact the Clinic</h4>
            <p className="text-xs text-slate-400">
              Message reception on WhatsApp or email for appointment help and visit questions.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Reception</span>
            </a>
            <a
              href={`mailto:${config.email}`}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-pink-200 border border-pink-900/60 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{config.email}</span>
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {config.name}. All rights reserved.</p>
          <p className="text-slate-500">Appointments confirmed via WhatsApp by clinic reception.</p>
        </div>
      </div>
    </footer>
  );
};
