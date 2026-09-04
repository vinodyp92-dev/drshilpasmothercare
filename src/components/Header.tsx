import React, { useState, useEffect } from 'react';
import { MessageCircle, Menu, X } from 'lucide-react';
import { useClinicConfig } from '../context/ClinicConfigContext';
import { formatWhatsappNumber } from '../utils/whatsapp';
import { ClinicLogo } from './ClinicLogo';
import { ClinicBrandTitle } from './ClinicBrandTitle';
import { CallNumbersMenu } from './CallNumbersMenu';

interface HeaderProps {
  onOpenBooking: (doctorId?: string, serviceId?: string) => void;
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenBooking,
  onNavigate,
  activeSection
}) => {
  const { config } = useClinicConfig();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'doctors', label: 'Doctors' },
    { id: 'services', label: 'Services' },
    { id: 'booking', label: 'Book Visit' },
    { id: 'health-tools', label: 'Health Tools' },
    { id: 'location', label: 'Location' },
    { id: 'contact', label: 'Contact Us', targetId: 'location' as const }
  ];

  const whatsappNumber = formatWhatsappNumber(config.receptionistWhatsapp || config.mobile);
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello ${config.name}, I would like to book an appointment.`)}`
    : undefined;

  return (
    <header className="sticky top-0 z-40 w-full">
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
            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp
              </a>
            ) : (
              <button
                onClick={() => onOpenBooking()}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp
              </button>
            )}

            <div className="hidden sm:block">
              <CallNumbersMenu variant="header" />
            </div>

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
              const sectionId = 'targetId' in item && item.targetId ? item.targetId : item.id;
              const active = activeSection === sectionId;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(sectionId)}
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
              {navItems.map((item) => {
                const sectionId = 'targetId' in item && item.targetId ? item.targetId : item.id;
                return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(sectionId);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    activeSection === sectionId
                      ? 'bg-pink-50 text-pink-900'
                      : 'text-slate-700 hover:bg-pink-50/50'
                  }`}
                >
                  {item.label}
                </button>
              );
              })}
            </nav>
            <div className="pt-3 border-t border-pink-100 flex flex-col gap-2">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full py-2.5 text-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Book via WhatsApp
                </a>
              )}
              <CallNumbersMenu variant="mobile" />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
