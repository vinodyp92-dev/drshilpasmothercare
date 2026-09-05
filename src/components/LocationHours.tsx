import React from 'react';
import { MapPin, Phone, Navigation } from 'lucide-react';
import { useClinicConfig } from '../context/ClinicConfigContext';
import { formatTelHref } from '../utils/phone';

export const LocationHours: React.FC = () => {
  const { config } = useClinicConfig();

  return (
    <section id="location" className="py-16 sm:py-20 bg-white border-t border-slate-200/80 scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-pink-800 bg-pink-50 px-3.5 py-1 rounded-full border border-pink-200/80 inline-flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-pink-600" />
            Location
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Visit Our Clinic in Tumakuru
          </h2>
          <p className="text-slate-800 text-sm sm:text-base font-semibold leading-relaxed flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2">
            <MapPin className="w-4 h-4 text-pink-600 flex-shrink-0" />
            <span>
              {config.address}, {config.landmark}, {config.cityStatePincode}
            </span>
          </p>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Conveniently located on Shettihalli Main Road with comfortable facilities for expecting mothers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-pink-200 shadow-xs space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Phone className="w-5 h-5 text-rose-500" />
                Clinic Contact Details
              </h3>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Reception Landline:</span>
                  <a href={`tel:${config.phone}`} className="font-bold text-pink-700 hover:underline">{config.phone}</a>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Mobile / WhatsApp:</span>
                  <a
                    href={formatTelHref(config.receptionistWhatsapp)}
                    className="font-bold text-pink-700 hover:underline"
                  >
                    {config.receptionistWhatsapp}
                  </a>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Emergency Line:</span>
                  <a
                    href={formatTelHref(config.emergencyHotline)}
                    className="font-bold text-rose-600 hover:underline"
                  >
                    {config.emergencyHotline}
                  </a>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-medium">Email Desk:</span>
                  <a
                    href={`mailto:${config.email}`}
                    className="font-semibold text-pink-700 hover:underline break-all text-right max-w-[60%]"
                  >
                    {config.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-slate-100 rounded-3xl border border-pink-200 overflow-hidden relative shadow-md h-80 sm:h-[22rem]">
              <iframe
                title={`${config.name} location map`}
                src={config.googleMapsEmbedUrl}
                className="absolute inset-0 w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />

              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-pink-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg pointer-events-none sm:pointer-events-auto">
                <div className="pointer-events-none">
                  <span className="font-extrabold text-slate-900 text-xs block">{config.name}</span>
                  <span className="text-[11px] font-medium text-slate-600">{config.address}, {config.cityStatePincode}</span>
                </div>
                <a
                  href={config.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer pointer-events-auto"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Google Maps Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
