import React, { useState, useEffect } from 'react';
import { ClinicConfigProvider } from './context/ClinicConfigContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { DoctorsSection } from './components/DoctorsSection';
import { HealthToolsSection } from './components/HealthToolsSection';
import { BookingSection } from './components/BookingSection';
import { ReviewsSection } from './components/ReviewsSection';
import { LocationHours } from './components/LocationHours';
import { Footer } from './components/Footer';
import { EmergencyBannerModal } from './components/EmergencyBannerModal';
import { WhatsAppFloat } from './components/WhatsAppFloat';
import { Reveal } from './components/Reveal';

const SECTION_IDS = [
  'hero',
  'doctors',
  'services',
  'booking',
  'health-tools',
  'location'
] as const;

function MainApp() {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [bookingDoctorId, setBookingDoctorId] = useState<string | undefined>();
  const [bookingServiceName, setBookingServiceName] = useState<string | undefined>();

  useEffect(() => {
    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el)
    );
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0.1, 0.25, 0.5] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenBooking = (doctorId?: string, serviceName?: string) => {
    if (doctorId) setBookingDoctorId(doctorId);
    if (serviceName) setBookingServiceName(serviceName);
    scrollToSection('booking');
  };

  return (
    <div className="min-h-screen bg-white font-sans-body text-slate-800 antialiased relative overflow-x-hidden">
      <Header
        onOpenBooking={() => handleOpenBooking()}
        onNavigate={scrollToSection}
        activeSection={activeSection}
      />

      <main>
        <Hero onOpenBooking={() => handleOpenBooking()} onNavigate={scrollToSection} />

        <Reveal>
          <DoctorsSection onSelectDoctor={(doctorId) => handleOpenBooking(doctorId, undefined)} />
        </Reveal>

        <Reveal delay={1}>
          <ServicesSection
            onSelectService={(serviceName) => handleOpenBooking(undefined, serviceName)}
          />
        </Reveal>

        <Reveal>
          <BookingSection
            preselectedDoctorId={bookingDoctorId}
            preselectedServiceName={bookingServiceName}
          />
        </Reveal>

        <Reveal delay={1}>
          <HealthToolsSection
            onOpenBooking={(doctorId, serviceId) => handleOpenBooking(doctorId, serviceId)}
          />
        </Reveal>

        <Reveal>
          <ReviewsSection />
        </Reveal>

        <Reveal delay={1}>
          <LocationHours />
        </Reveal>
      </main>

      <Footer onNavigate={scrollToSection} onOpenEmergency={() => setEmergencyModalOpen(true)} />

      <WhatsAppFloat onOpenBooking={() => handleOpenBooking()} />

      <EmergencyBannerModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ClinicConfigProvider>
      <MainApp />
    </ClinicConfigProvider>
  );
}
