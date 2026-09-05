import React, { useEffect, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, MessageCircle, Sparkles } from 'lucide-react';
import { useClinicConfig } from '../context/ClinicConfigContext';
import { formatWhatsappNumber } from '../utils/whatsapp';
import { ClinicLogo } from './ClinicLogo';
import { CallNumbersMenu } from './CallNumbersMenu';
import heroSlide1 from '../assets/images/hero-slide-1.jpg';
import heroSlide3 from '../assets/images/hero-slide-3.jpg';
import heroSlide4 from '../assets/images/hero-slide-4.jpg';

interface HeroProps {
  onOpenBooking: (doctorId?: string, serviceId?: string) => void;
  onNavigate: (sectionId: string) => void;
}

const SLIDE_INTERVAL_MS = 5500;

/** Lifestyle photos with soft baby-pink / lavender color wash (kept light so photos stay prominent) */
const HERO_SLIDES = [
  {
    src: heroSlide1,
    gradient: 'from-[#fce7f3]/35 via-[#fbcfe8]/20 to-[#e9d5ff]/30',
    accent: 'from-pink-300/15 via-fuchsia-200/10 to-violet-300/15',
    alt: 'Expecting mother — maternity care journey',
    label: 'Maternity care'
  },
  {
    src: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=2000&q=85',
    gradient: 'from-[#fae8ff]/35 via-[#f5d0fe]/20 to-[#e0e7ff]/30',
    accent: 'from-fuchsia-200/12 via-pink-200/10 to-indigo-200/12',
    alt: 'Mother holding newborn with gentle care',
    label: 'Mother & baby'
  },
  {
    src: heroSlide3,
    gradient: 'from-[#fdf2f8]/35 via-[#fce7f3]/20 to-[#ede9fe]/30',
    accent: 'from-rose-200/15 via-pink-300/8 to-purple-200/15',
    alt: 'Newborn baby — early parenthood care',
    label: 'Newborn care'
  },
  {
    src: heroSlide4,
    gradient: 'from-[#f3e8ff]/35 via-[#fce7f3]/20 to-[#fdf4ff]/30',
    accent: 'from-violet-300/12 via-pink-200/10 to-rose-200/12',
    alt: 'Peaceful baby resting — family wellness',
    label: 'Family wellness'
  },
  {
    src: 'https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?auto=format&fit=crop&w=2000&q=85',
    gradient: 'from-[#fce7f3]/30 via-[#fbcfe8]/18 to-[#fae8ff]/25',
    accent: 'from-pink-200/12 via-rose-200/10 to-fuchsia-200/12',
    alt: 'Expectant mother outdoors — antenatal wellness',
    label: 'Antenatal wellness'
  },
  {
    src: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=2000&q=85',
    gradient: 'from-[#ede9fe]/30 via-[#fce7f3]/18 to-[#fdf2f8]/25',
    accent: 'from-violet-200/12 via-pink-200/10 to-rose-200/12',
    alt: 'Tiny newborn hands — gentle newborn care',
    label: 'Gentle beginnings'
  },
  {
    src: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=2000&q=85',
    gradient: 'from-[#fdf4ff]/30 via-[#fae8ff]/18 to-[#e0e7ff]/25',
    accent: 'from-fuchsia-200/12 via-violet-200/10 to-indigo-200/12',
    alt: 'Mother and child bonding — family care',
    label: 'Bonding & care'
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
              className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out ${
                index === active ? 'opacity-100 z-[1]' : 'opacity-0 z-0'
              }`}
              aria-hidden={index !== active}
            >
              <img
                src={slide.src}
                alt={slide.alt}
                className={`h-full w-full object-cover scale-105 ${
                  index === active ? 'hero-kenburns' : ''
                }`}
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`}
                aria-hidden
              />
              <div
                className={`absolute inset-0 bg-gradient-to-tr ${slide.accent}`}
                aria-hidden
              />
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.4) 0, transparent 42%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.25) 0, transparent 35%), radial-gradient(circle at 70% 75%, rgba(244,114,182,0.12) 0, transparent 40%)'
                }}
                aria-hidden
              />
            </div>
          ))}

          <div
            className="absolute inset-0 z-[2] bg-gradient-to-b from-white/20 via-transparent to-pink-950/20"
            aria-hidden
          />
        </div>

        <div className="relative z-[3] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[min(90vh,860px)] flex flex-col justify-center py-16 sm:py-20 pb-28">
          <div className="w-full flex flex-col items-center text-center hero-enter">
            {/* Tagline arc hugs the white badge (bottom), with a small safe clearance */}
            <div className="relative mx-auto mb-4 sm:mb-5 w-fit">
              <div className="relative z-0 rounded-full p-2 sm:p-2.5 bg-white/90 shadow-[0_20px_50px_-20px_rgba(190,24,93,0.45)]">
                <ClinicLogo
                  size="xl"
                  showBadgeBackground={false}
                  className="!rounded-full !w-40 !h-40 sm:!w-48 sm:!h-48 lg:!w-52 lg:!h-52 !border-0 !shadow-none !ring-0 !p-1.5 bg-white"
                />

                {/* Overlay sized to the white badge; path sits just outside its rim */}
                <svg
                  viewBox="0 0 200 200"
                  className="absolute left-1/2 top-1/2 z-[1] h-[136%] w-[136%] -translate-x-1/2 -translate-y-1/2 overflow-visible pointer-events-none"
                  role="img"
                  aria-label={config.taglineTransliteration}
                >
                  <defs>
                    {/*
                      Badge fills center: r ≈ 100/1.36 ≈ 73.5
                      Path at r=78 ≈ ~6px outside white badge; bottom arc (sweep 0)
                    */}
                    <path
                      id="hero-tagline-arc"
                      d="M 22 100 A 78 78 0 0 0 178 100"
                      fill="none"
                    />
                  </defs>
                  <text
                    fill="#6b21a8"
                    dy="6"
                    style={{
                      fontSize: '12.5px',
                      fontWeight: 800,
                      letterSpacing: '0.05em',
                      wordSpacing: '0.15em',
                      fontFamily: 'Playfair Display, Georgia, serif',
                      textTransform: 'uppercase'
                    }}
                  >
                    <textPath
                      href="#hero-tagline-arc"
                      xlinkHref="#hero-tagline-arc"
                      startOffset="50%"
                      textAnchor="middle"
                      spacing="auto"
                      textLength={255}
                      lengthAdjust="spacing"
                    >
                      {config.taglineTransliteration.toUpperCase()}
                    </textPath>
                  </text>
                </svg>
              </div>
            </div>

            <div className="mx-auto inline-block text-left px-2 mt-8 sm:mt-9">
              <h1 className="font-aesthetic font-extrabold tracking-tight leading-[1.05]">
                <span className="block text-3xl sm:text-5xl lg:text-6xl text-pink-800">
                  {config.brandPrefix}
                </span>
                <span className="block text-4xl sm:text-6xl lg:text-7xl text-pink-600 mt-1 font-brand">
                  {config.brandAccent}
                </span>
              </h1>
            </div>

            <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed px-4 text-center">
              Expert obstetric, gynaecology, fertility and antenatal care in Tumakuru.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-12 sm:pt-14 w-full max-w-lg px-4">
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

              <CallNumbersMenu variant="hero" />
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
            { value: '5.00 ★', label: 'Patient reviews' },
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
