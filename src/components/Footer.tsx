import React from 'react';
import { AlertTriangle, Phone, Mail, MapPin, MessageCircle, Navigation } from 'lucide-react';
import { useClinicConfig } from '../context/ClinicConfigContext';
import { formatWhatsappNumber } from '../utils/whatsapp';
import { formatTelHref } from '../utils/phone';
import { ClinicLogo } from './ClinicLogo';
import { ClinicBrandTitle } from './ClinicBrandTitle';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenEmergency: () => void;
}

const QUICK_LINKS = [
  { id: 'doctors', label: 'Doctors' },
  { id: 'services', label: 'Services' },
  { id: 'booking', label: 'Book Visit' },
  { id: 'health-tools', label: 'Health Tools' },
  { id: 'location', label: 'Visit Us' },
  { id: 'reviews', label: 'Reviews' }
] as const;

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenEmergency }) => {
  const { config } = useClinicConfig();

  const whatsappNumber = formatWhatsappNumber(config.receptionistWhatsapp);
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello, I would like to enquire about an appointment at ${config.name}.`)}`
    : `mailto:${config.email}`;

  return (
    <footer className="bg-gradient-to-b from-pink-50 via-rose-50/80 to-violet-50 text-slate-700 border-t border-pink-200/80">
      {/* Emergency strip — clinic-standard trust / safety note */}
      <div className="border-b border-rose-200/70 bg-rose-50/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-rose-800 font-medium flex items-start sm:items-center gap-2 text-center sm:text-left">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5 sm:mt-0" />
            <span>
              Obstetric emergency? Call{' '}
              <a
                href={formatTelHref(config.emergencyHotline)}
                className="font-extrabold underline underline-offset-2 hover:text-rose-950"
              >
                {config.emergencyHotline}
              </a>{' '}
              or seek urgent care immediately.
            </span>
          </p>
          <button
            type="button"
            onClick={onOpenEmergency}
            className="text-xs font-bold text-rose-700 hover:text-rose-900 underline underline-offset-2 cursor-pointer flex-shrink-0"
          >
            Emergency guidance
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Brand + address */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <ClinicLogo size="md" className="w-12 h-12 flex-shrink-0" />
              <ClinicBrandTitle variant="footer" showTagline={false} />
            </div>
            <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-pink-600 flex-shrink-0 mt-0.5" />
                <span>
                  {config.address}, {config.landmark}, {config.cityStatePincode}
                </span>
              </p>
              <a
                href={config.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-pink-700 font-semibold hover:text-pink-900"
              >
                <Navigation className="w-3.5 h-3.5" />
                Get directions
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-pink-900 mb-3">
              Quick links
            </h4>
            <ul className="space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(link.id)}
                    className="text-xs text-slate-600 hover:text-pink-800 font-medium transition-colors cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-pink-900 mb-3">
              Hours
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li>
                <span className="block text-pink-800 font-bold">Mon–Sat</span>
                <span>{config.hours.weekdays.replace(' (Evening consultation)', '')}</span>
              </li>
              <li>
                <span className="block text-pink-800 font-bold">Sunday</span>
                <span className="text-rose-700 font-semibold">{config.hours.sunday}</span>
              </li>
              <li className="text-[11px] text-slate-500 leading-relaxed pt-1">
                {config.hours.festivalNotice}
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-pink-900 mb-3">
              Contact
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium mb-4">
              <li>
                <a
                  href={formatTelHref(config.phone)}
                  className="inline-flex items-center gap-2 hover:text-pink-800"
                >
                  <Phone className="w-3.5 h-3.5 text-pink-600" />
                  {config.phone}
                </a>
              </li>
              <li>
                <a
                  href={formatTelHref(config.receptionistWhatsapp)}
                  className="inline-flex items-center gap-2 hover:text-pink-800"
                >
                  <Phone className="w-3.5 h-3.5 text-pink-600" />
                  {config.receptionistWhatsapp}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${config.email}`}
                  className="inline-flex items-center gap-2 hover:text-pink-800 break-all"
                >
                  <Mail className="w-3.5 h-3.5 text-pink-600 flex-shrink-0" />
                  {config.email}
                </a>
              </li>
            </ul>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp Reception
            </a>
          </div>
        </div>
      </div>

      {/* Legal / copyright bar */}
      <div className="border-t border-pink-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} {config.name}. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Appointments confirmed via WhatsApp by clinic reception.
          </p>
        </div>
      </div>
    </footer>
  );
};
