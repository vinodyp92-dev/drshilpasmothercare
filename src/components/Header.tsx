import React, { useState, useEffect } from 'react';
import { Phone, MapPin, AlertCircle, Calendar, Menu, X } from 'lucide-react';
import { useClinicConfig } from '../context/ClinicConfigContext';
import { isClinicOpenNow } from '../utils/clinicHours';
import { ClinicLogo } from './ClinicLogo';
import { ClinicBrandTitle } from './ClinicBrandTitle';

interface HeaderProps {
  onOpenBooking: (doctorId?: string, serviceId?: string) => void;
  onOpenEmergency: () => void;
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenBooking,
  onOpenEmergency,
  onNavigate,
  activeSection
}) => {
  const { config } = useClinicConfig();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOpenNow, setIsOpenNow] = useState(true);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateOpenStatus = () => setIsOpenNow(isClinicOpenNow());

    updateOpenStatus();
    const id = window.setInterval(updateOpenStatus, 60_000);
    return () => window.clearInterval(id);
  }, [config.hours]);

  const navItems = [
    { id: 'services', label: 'Services' },
    { id: 'doctors', label: 'Doctors' },
    { id: 'booking', label: 'Book Visit' },
    { id: 'health-tools', label: 'Health Tools' },
    { id: 'symptom-checker', label: 'Symptoms' },
    { id: 'location', label: 'Location' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="bg-slate-950 text-slate-200 text-xs py-2 px-4 sm:px-6 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <MapPin className="w-3.5 h-3.5 text-pink-400" />
              <span className="truncate max-w-[18rem] sm:max-w-none">
                {config.address}, {config.cityStatePincode}
              </span>
            </span>
            <span className="hidden sm:inline-block text-slate-700">|</span>
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isOpenNow ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="font-semibold text-slate-100">
                {isOpenNow ? 'Clinic open now' : 'OPD closed · Emergency on-call'}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenEmergency}
              className="flex items-center gap-1.5 text-rose-100 hover:text-white font-semibold bg-rose-950/90 hover:bg-rose-900 px-2.5 py-1 rounded-lg border border-rose-800/80 transition-colors cursor-pointer text-[11px]"
            >
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>Maternity emergency</span>
            </button>
            <a
              href={`tel:${config.phone.replace(/[^0-9+]/g, '')}`}
              className="flex items-center gap-1.5 text-slate-100 hover:text-white transition-colors font-bold text-xs"
            >
              <Phone className="w-3.5 h-3.5 text-pink-400" />
              <span>{config.phone}</span>
            </a>
          </div>
        </div>
      </div>

      <div
        className={`surface-glass border-b transition-shadow duration-300 ${
          isScrolled ? 'border-slate-200/90 shadow-md' : 'border-slate-200/60 shadow-none'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <button
            onClick={() => onNavigate('hero')}
            className="flex items-center gap-3.5 text-left cursor-pointer group min-w-0"
          >
            <ClinicLogo size="md" className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex-shrink-0" />
            <ClinicBrandTitle />
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onOpenBooking()}
              className="hidden sm:inline-flex px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 rounded-xl transition-colors cursor-pointer"
            >
              WhatsApp booking
            </button>
            <button
              onClick={() => onOpenBooking()}
              className="btn-primary px-4 py-2 text-xs cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book visit</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-slate-600 hover:text-pink-900 rounded-xl hover:bg-pink-50 cursor-pointer"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <div className="hidden xl:block border-t border-slate-100/80 py-1.5 px-4 sm:px-6 bg-white/40">
          <div className="max-w-7xl mx-auto flex items-center justify-start gap-1">
            {navItems.map((item) => {
              const active = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`relative px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? 'bg-pink-600 text-white shadow-sm'
                      : 'text-slate-700 hover:text-pink-800 hover:bg-pink-50/80'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="xl:hidden bg-white/95 border-t border-pink-100 px-4 pt-3 pb-6 space-y-3 animate-fade-in">
            <nav className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    activeSection === item.id
                      ? 'bg-pink-50 text-pink-900'
                      : 'text-slate-700 hover:bg-pink-50/50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="pt-3 border-t border-pink-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  onOpenBooking();
                  setMobileMenuOpen(false);
                }}
                className="btn-primary w-full py-2.5 text-xs"
              >
                Book via WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
