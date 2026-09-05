import React, { useState, useEffect } from 'react';
import { MessageCircle, Menu, X, Phone, MapPin } from 'lucide-react';
import { useClinicConfig } from '../context/ClinicConfigContext';
import { formatWhatsappNumber } from '../utils/whatsapp';
import { formatTelHref } from '../utils/phone';
import { ClinicLogo } from './ClinicLogo';
import { ClinicBrandTitle } from './ClinicBrandTitle';

interface HeaderProps {
  onOpenBooking: (doctorId?: string, serviceId?: string) => void;
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

const HEADER_CALL_NUMBER = '9743033256';

export const Header: React.FC<HeaderProps> = ({
  onOpenBooking,
  onNavigate,
  activeSection
}) => {
  const { config } = useClinicConfig();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'doctors', label: 'Doctors' },
    { id: 'services', label: 'Services' },
    { id: 'booking', label: 'Book Visit' },
    { id: 'health-tools', label: 'Health Tools' },
    { id: 'location', label: 'Location', href: config.googleMapsUrl },
    { id: 'contact', label: 'Contact Us', targetId: 'location' as const }
  ];

  const whatsappNumber = formatWhatsappNumber(config.receptionistWhatsapp || config.mobile);
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello ${config.name}, I would like to book an appointment.`)}`
    : undefined;

  const handleNav = (item: (typeof navItems)[number]) => {
    if ('href' in item && item.href) {
      window.open(item.href, '_blank', 'noopener,noreferrer');
      return;
    }
    const sectionId = 'targetId' in item && item.targetId ? item.targetId : item.id;
    onNavigate(sectionId);
  };

  const navClass = (item: (typeof navItems)[number], active: boolean) =>
    `relative px-3 py-2 text-[12px] font-semibold tracking-wide transition-colors cursor-pointer rounded-full ${
      active
        ? 'text-pink-800 bg-pink-100/90'
        : 'text-slate-600 hover:text-pink-800 hover:bg-pink-50/80'
    }`;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 w-full header-safe-top">
        <div
          className={`border-b backdrop-blur-xl transition-all duration-300 ${
            isScrolled
              ? 'bg-white/95 border-pink-200/70 shadow-[0_8px_30px_-12px_rgba(190,24,93,0.25)]'
              : 'bg-white/85 border-pink-100/80 shadow-none'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-3 lg:gap-5">
            <button
              type="button"
              onClick={() => onNavigate('hero')}
              className="flex items-center gap-2 sm:gap-2.5 text-left cursor-pointer group min-w-0 flex-1 lg:flex-none"
            >
              <ClinicLogo size="md" className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0" />
              <ClinicBrandTitle showTagline={false} className="min-w-0" />
            </button>

            <nav
              className="hidden lg:flex flex-1 items-center justify-center gap-0.5 xl:gap-1 min-w-0"
              aria-label="Primary"
            >
              {navItems.map((item) => {
                const sectionId = 'targetId' in item && item.targetId ? item.targetId : item.id;
                const active = !('href' in item && item.href) && activeSection === sectionId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNav(item)}
                    className={navClass(item, active)}
                  >
                    {'href' in item && item.href ? (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3 opacity-70" />
                        {item.label}
                      </span>
                    ) : (
                      item.label
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center gap-2 ml-auto lg:ml-0 flex-shrink-0">
              {whatsappUrl ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/90 rounded-full transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenBooking()}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/90 rounded-full transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp
                </button>
              )}

              <a
                href={formatTelHref(HEADER_CALL_NUMBER)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-pink-800 bg-pink-50 hover:bg-pink-100 border border-pink-200 rounded-full transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                Call
              </a>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-600 hover:text-pink-900 rounded-xl hover:bg-pink-50 cursor-pointer"
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="lg:hidden bg-white/98 border-t border-pink-100 px-4 pt-3 pb-5 space-y-3 animate-fade-in">
              <nav className="flex flex-col space-y-1">
                {navItems.map((item) => {
                  const sectionId = 'targetId' in item && item.targetId ? item.targetId : item.id;
                  const active = !('href' in item && item.href) && activeSection === sectionId;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        handleNav(item);
                        setMobileMenuOpen(false);
                      }}
                      className={`text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                        active
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
                <a
                  href={formatTelHref(HEADER_CALL_NUMBER)}
                  className="btn-secondary w-full py-2.5 text-xs inline-flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call {HEADER_CALL_NUMBER}
                </a>
              </div>
            </div>
          )}
        </div>
      </header>
      {/* Spacer so fixed header does not cover page content */}
      <div className="header-offset" aria-hidden />
    </>
  );
};
