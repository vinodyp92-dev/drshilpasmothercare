import React, { useEffect, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, MessageCircle, Sparkles } from 'lucide-react';
import { useClinicConfig } from '../context/ClinicConfigContext';
import { formatWhatsappNumber } from '../utils/whatsapp';
import { ClinicLogo } from './ClinicLogo';
import { CallNumbersMenu } from './CallNumbersMenu';

interface HeroProps {
  onOpenBooking: (doctorId?: string, serviceId?: string) => void;
  onNavigate: (sectionId: string) => void;
}

const SLIDE_INTERVAL_MS = 5500;

/** Soft baby-pink / lavender themed maternity slides */
const HERO_SLIDES = [
  {
    gradient: 'from-[#fce7f3] via-[#fbcfe8] to-[#e9d5ff]',
    accent: 'from-pink-300/40 via-fuchsia-200/30 to-violet-300/40',
    alt: 'Soft pink maternity care atmosphere',
    label: 'Maternity care'
  },
  {
    gradient: 'from-[#fae8ff] via-[#f5d0fe] to-[#e0e7ff]',
    accent: 'from-fuchsia-200/35 via-pink-200/30 to-indigo-200/35',
    alt: 'Lavender mother and baby wellness',
    label: 'Mother & baby'
  },
  {
    gradient: 'from-[#fdf2f8] via-[#fce7f3] to-[#ede9fe]',
    accent: 'from-rose-200/40 via-pink-300/25 to-purple-200/40',
    alt: 'Baby pink newborn care mood',
    label: 'Newborn care'
  },
  {
    gradient: 'from-[#f3e8ff] via-[#fce7f3] to-[#fdf4ff]',
    accent: 'from-violet-300/35 via-pink-200/30 to-rose-200/35',
    alt: 'Purple-pink family wellness theme',
    label: 'Family wellness'
  }
] as const;

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onNavigate }) => {
  const { config } = useClinicConfig();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = HERO_SLIDES.length;

  const goTo = (index: number) => {
    setActive(((index % total) + total) % total);
  };

  useEffect(() => {
    if (paused) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % total);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [paused, total]);

  const whatsappNumber = formatWhatsappNumber(config.receptionistWhatsapp || config.mobile);
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello ${config.name}, I would like to book an appointment.`)}`
    : undefined;

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden text-slate-900"
      aria-roledescription="carousel"
      aria-label="Clinic highlights slideshow"
    >
      <div
        className="relative min-h-[min(90vh,860px)]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="absolute inset-0">
          {HERO_SLIDES.map((slide, index) => (
            <div
              key={`${slide.label}-${index}`}
              className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out bg-gradient-to-br ${slide.gradient} ${
                index === active ? 'opacity-100 z-[1]' : 'opacity-0 z-0'
              }`}
              aria-hidden={index !== active}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-tr ${slide.accent} ${
                  index === active ? 'hero-kenburns' : ''
                }`}
              />
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.7) 0, transparent 42%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.45) 0, transparent 35%), radial-gradient(circle at 70% 75%, rgba(244,114,182,0.25) 0, transparent 40%)'
                }}
                aria-hidden
              />
            </div>
          ))}

          <div
            className="absolute inset-0 z-[2] bg-gradient-to-b from-white/25 via-transparent to-pink-950/25"
            aria-hidden
          />
        </div>

        <div className="relative z-[3] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[min(90vh,860px)] flex flex-col justify-center py-16 sm:py-20 pb-28">
          <div className="w-full flex flex-col items-center text-center hero-enter">
            {/* Circular logo + circular tagline arc fully below (no overlap) */}
            <div className="relative flex flex-col items-center mb-4 sm:mb-6 w-full max-w-[440px]">
              <div className="rounded-full p-2 sm:p-2.5 bg-white/90 shadow-[0_20px_50px_-20px_rgba(190,24,93,0.45)]">
                <ClinicLogo
                  size="xl"
                  showBadgeBackground={false}
                  className="!rounded-full !w-40 !h-40 sm:!w-48 sm:!h-48 lg:!w-52 lg:!h-52 !border-0 !shadow-none !ring-0 !p-1.5 bg-white"
                />
              </div>

              <svg
                viewBox="0 0 440 230"
                className="w-full max-w-[440px] h-auto mt-1 overflow-visible"
                role="img"
                aria-label={config.taglineTransliteration}
              >
                <defs>
                  {/* Circular smile under the logo — full bottom semicircle */}
                  <path
                    id="hero-tagline-arc"
                    d="M 30 12 A 190 190 0 0 1 410 12"
                    fill="none"
                  />
                </defs>
                <text
                  fill="#9d174d"
                  style={{
                    fontSize: '28px',
                    fontWeight: 700,
                    letterSpacing: '0.02em',
                    fontFamily: 'Playfair Display, Georgia, serif'
                  }}
                >
                  <textPath
                    href="#hero-tagline-arc"
                    xlinkHref="#hero-tagline-arc"
                    startOffset="50%"
                    textAnchor="middle"
                  >
                    {config.taglineTransliteration}
                  </textPath>
                </text>
              </svg>
            </div>

            <h1 className="font-aesthetic font-extrabold tracking-tight leading-[1.05] px-2 text-center">
              <span className="block text-3xl sm:text-5xl lg:text-6xl text-pink-800">
                {config.brandPrefix}
              </span>
              <span className="block text-4xl sm:text-6xl lg:text-7xl text-pink-600 mt-1">
                {config.brandAccent}
              </span>
            </h1>

            <p className="mt-4 text-sm sm:text-base text-slate-700/90 italic max-w-xl leading-relaxed px-4">
              {config.taglineEnglish}
            </p>

            <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed px-4">
              Expert obstetric, gynaecology, fertility and antenatal care in Tumakuru —
              led by Dr. Shilpa Rani G R, MS (OBG), DNB (OBG).
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-6 w-full max-w-lg px-4">
              {whatsappUrl ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary px-6 py-3.5 text-sm group"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Book via WhatsApp</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenBooking()}
                  className="btn-primary px-6 py-3.5 text-sm cursor-pointer group"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book via WhatsApp</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}

              <CallNumbersMenu
                variant="hero"
                className="[&_button]:!text-pink-900 [&_button]:!border-pink-300/80 [&_button]:!bg-white/70 [&_button]:hover:!bg-white"
              />
            </div>

            <button
              type="button"
              onClick={() => onNavigate('services')}
              className="mt-3 inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-pink-800 hover:text-pink-950 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Explore our services
            </button>

            <p className="text-xs text-pink-800/80 font-semibold pt-3" aria-live="polite">
              {HERO_SLIDES[active].label}
            </p>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-[4] pb-6 sm:pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2" role="tablist" aria-label="Slide selectors">
              {HERO_SLIDES.map((slide, index) => (
                <button
                  key={slide.label}
                  type="button"
                  role="tab"
                  aria-selected={index === active}
                  aria-label={`Show slide ${index + 1}: ${slide.label}`}
                  onClick={() => goTo(index)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    index === active ? 'w-8 bg-pink-500' : 'w-2.5 bg-pink-900/25 hover:bg-pink-900/45'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => goTo(active - 1)}
                className="w-10 h-10 rounded-full border border-pink-300/70 bg-white/60 hover:bg-white backdrop-blur-sm flex items-center justify-center cursor-pointer transition-colors text-pink-800"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => goTo(active + 1)}
                className="w-10 h-10 rounded-full border border-pink-300/70 bg-white/60 hover:bg-white backdrop-blur-sm flex items-center justify-center cursor-pointer transition-colors text-pink-800"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-[3] border-t border-pink-200/60 bg-gradient-to-r from-pink-50 via-fuchsia-50 to-violet-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { value: '5,000+', label: 'Healthy deliveries' },
            { value: '15+ Yrs', label: 'OBG expertise' },
            { value: '4.98 ★', label: 'Patient reviews' },
            { value: 'Tumakuru', label: 'Shettihalli Main Rd' }
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-xl sm:text-2xl font-extrabold text-pink-900 tracking-tight">
                {stat.value}
              </div>
              <div className="text-[11px] sm:text-xs font-semibold text-slate-600 mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
