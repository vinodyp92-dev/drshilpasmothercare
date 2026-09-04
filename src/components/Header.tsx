import React, { useState, useEffect } from 'react';
import { Calendar, Menu, X } from 'lucide-react';
import { ClinicLogo } from './ClinicLogo';
import { ClinicBrandTitle } from './ClinicBrandTitle';

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
    { id: 'contact', label: 'Contact Us' }
  ];

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
              const active =
                activeSection === item.id ||
                (item.id === 'contact' && activeSection === 'location');
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
                    activeSection === item.id ||
                    (item.id === 'contact' && activeSection === 'location')
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
