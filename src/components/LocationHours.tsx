import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Navigation, ChevronDown, ChevronUp, Building2, Settings, Car, ShieldCheck, Lock } from 'lucide-react';
import { getClinicFaqs } from '../utils/faq';
import { useClinicConfig } from '../context/ClinicConfigContext';

export const LocationHours: React.FC = () => {
  const { config } = useClinicConfig();
  const faqs = getClinicFaqs(config);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <section id="location" className="py-16 sm:py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-pink-800 bg-pink-50 px-3.5 py-1 rounded-full border border-pink-200/80 inline-flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-pink-600" />
            Location, Timings & FAQs
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Visit Our Clinic in Tumakuru
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Conveniently located on Shettihalli Main Road with dedicated patient parking and comfortable facilities for expecting mothers.
          </p>
        </div>

        {/* Location & Operating Hours Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Configurable Operating Hours & Contacts */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Hours Card */}
            <div className="bg-gradient-to-br from-pink-50/80 via-white to-rose-50/60 p-6 rounded-3xl border border-pink-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-pink-600" />
                  Clinic Operating Hours
                </h3>
              </div>

              <div className="space-y-3 text-xs text-slate-700 font-medium">
                <div className="pb-2 border-b border-pink-100">
                  <span className="font-extrabold text-slate-900 block mb-0.5">Monday – Friday</span>
                  <div className="flex justify-between text-pink-900 font-bold">
                    <span>Evening consultation:</span>
                    <span>{config.hours.weekdays}</span>
                  </div>
                </div>

                <div className="pb-2 border-b border-pink-100">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Saturday:</span>
                    <span className="text-pink-900">{config.hours.saturday}</span>
                  </div>
                </div>

                <div className="pb-2 border-b border-pink-100">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Sunday:</span>
                    <span className="text-rose-700 font-extrabold">{config.hours.sunday}</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-300 text-amber-950 font-semibold leading-relaxed text-[11px]">
                  <span className="font-extrabold block text-amber-900 mb-1">Festivals & special occasions</span>
                  {config.hours.festivalNotice}
                </div>

                <div className="p-3 bg-pink-100/70 rounded-2xl border border-pink-200 text-pink-950 font-semibold leading-relaxed text-[11px]">
                  <span className="font-extrabold block text-pink-900">24/7 Maternity Emergency:</span>
                  {config.hours.urgentCare} via phone line or registered patient triage.
                </div>
              </div>
            </div>

            {/* Direct Contact Extensions */}
            <div className="bg-white p-6 rounded-3xl border border-pink-200 shadow-xs space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Phone className="w-5 h-5 text-rose-500" />
                Clinic Contact Lines
              </h3>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Reception Landline:</span>
                  <a href={`tel:${config.phone}`} className="font-bold text-pink-700 hover:underline">{config.phone}</a>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Mobile / WhatsApp:</span>
                  <a href={`tel:${config.mobile}`} className="font-bold text-pink-700 hover:underline">{config.mobile}</a>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Alternate mobile:</span>
                  <a href={`tel:${config.mobileAlt}`} className="font-bold text-pink-700 hover:underline">{config.mobileAlt}</a>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Emergency Line:</span>
                  <span className="font-bold text-rose-600">{config.emergencyHotline}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-medium">Email Desk:</span>
                  <span className="font-semibold text-slate-800">{config.email}</span>
                </div>
              </div>
            </div>

            {/* Parking & Accessibility */}
            <div className="p-4 bg-pink-50/60 rounded-3xl border border-pink-200 space-y-1.5 text-xs text-slate-700">
              <div className="flex items-center gap-2 font-extrabold text-slate-900">
                <Car className="w-4 h-4 text-pink-600" /> Dedicated Patient Parking
              </div>
              <p className="text-slate-600 leading-relaxed font-medium">
                Ample parking space available directly in front of the clinic premises on Shettihalli Main Road.
              </p>
            </div>

          </div>

          {/* Right Column: Address Map Card & FAQs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Map Preview Card */}
            <div className="bg-slate-100 rounded-3xl border border-pink-200 overflow-hidden relative shadow-md h-80 group">
              <img 
                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1200"
                alt="Tumakuru Map Location"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent" />

              {/* Location Marker Overlay */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="w-12 h-12 bg-pink-600 text-white rounded-full flex items-center justify-center shadow-2xl border-4 border-white animate-bounce">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="mt-2 bg-slate-900/90 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-lg border border-pink-400">
                  {config.name}
                </span>
              </div>

              {/* Get Directions Overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-pink-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
                <div>
                  <span className="font-extrabold text-slate-900 text-xs block">{config.name}</span>
                  <span className="text-[11px] font-medium text-slate-600">{config.address}, {config.cityStatePincode}</span>
                </div>
                <a
                  href={config.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Google Maps & Live Reviews
                </a>
              </div>
            </div>

            {/* Frequently Asked Questions */}
            <div className="space-y-3 pt-2">
              <h3 className="text-lg font-extrabold text-slate-900">Patient FAQs</h3>
              
              <div className="space-y-2">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="bg-pink-50/40 rounded-2xl border border-pink-200/80 overflow-hidden">
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between hover:bg-pink-50 transition-colors cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      {openFaq === idx ? <ChevronUp className="w-4 h-4 text-pink-600" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>
                    {openFaq === idx && (
                      <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-pink-100 pt-3 bg-white font-medium">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
