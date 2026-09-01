import React, { useEffect, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { ClinicBrandTitle } from './ClinicBrandTitle';

interface HeroProps {
  onOpenBooking: (doctorId?: string, serviceId?: string) => void;
  onNavigate: (sectionId: string) => void;
}

const SLIDE_INTERVAL_MS = 5500;

/** Full-bleed clinic lifestyle slides (no doctor portraits). */
const HERO_SLIDES = [
  {
    src: 'https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?auto=format&fit=crop&w=2000&q=85',
    alt: 'Expecting mother — maternity care journey',
    label: 'Maternity care'
  },
  {
    src: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=2000&q=85',
    alt: 'Mother holding newborn with gentle care',
    label: 'Mother & baby'
  },
  {
    src: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=2000&q=85',
    alt: 'Newborn baby hands — early parenthood',
    label: 'Newborn care'
  },
  {
    src: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=2000&q=85',
    alt: 'Peaceful baby resting — family wellness',
    label: 'Family wellness'
  }
] as const;

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onNavigate }) => {
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

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden bg-slate-950 text-white"
      aria-roledescription="carousel"
      aria-label="Clinic highlights slideshow"
    >
      <div
        className="relative min-h-[min(88vh,820px)]"
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
            </div>
          ))}

          <div
            className="absolute inset-0 z-[2] bg-gradient-to-r from-slate-950/88 via-slate-950/55 to-slate-950/25"
            aria-hidden
          />
          <div
            className="absolute inset-0 z-[2] bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/35"
            aria-hidden
          />
        </div>

        <div className="relative z-[3] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[min(88vh,820px)] flex flex-col justify-center py-20 sm:py-24 pb-28">
          <div className="max-w-2xl space-y-6 hero-enter">
            <ClinicBrandTitle variant="hero" />

            <p className="text-sm sm:text-base text-slate-200/90 max-w-xl leading-relaxed">
              Expert obstetric, gynaecology, infertility and antenatal care in Tumakuru —
              led by Dr. Shilpa Rani G R, MS (OBG), DNB (OBG).
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onOpenBooking()}
                className="btn-primary px-6 py-3.5 text-sm cursor-pointer group"
              >
                <Calendar className="w-4 h-4" />
                <span>Book via WhatsApp</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('services')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-[0.9rem] text-sm font-bold text-white border border-white/35 bg-white/10 hover:bg-white/18 backdrop-blur-sm transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-pink-200" />
                <span>Explore our services</span>
              </button>
            </div>

            <p className="text-xs text-pink-100/80 font-medium pt-1" aria-live="polite">
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
                    index === active ? 'w-8 bg-pink-400' : 'w-2.5 bg-white/45 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => goTo(active - 1)}
                className="w-10 h-10 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => goTo(active + 1)}
                className="w-10 h-10 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-[3] border-t border-white/10 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { value: '5,000+', label: 'Healthy deliveries' },
            { value: '15+ Yrs', label: 'OBG expertise' },
            { value: '4.98 ★', label: 'Patient reviews' },
            { value: 'Tumakuru', label: 'Shettihalli Main Rd' }
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {stat.value}
              </div>
              <div className="text-[11px] sm:text-xs font-semibold text-slate-300 mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
