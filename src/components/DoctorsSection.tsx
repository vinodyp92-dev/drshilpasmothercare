import React, { useState } from 'react';
import { Star, Award, Calendar, Clock, CheckCircle2, MapPin, Sparkles, Heart, ChevronRight, UserCheck } from 'lucide-react';
import { DOCTORS_DATA } from '../data/clinicData';
import { Doctor } from '../types/clinic';
import { useClinicConfig } from '../context/ClinicConfigContext';

interface DoctorsSectionProps {
  onSelectDoctor: (doctorId: string) => void;
}

export const DoctorsSection: React.FC<DoctorsSectionProps> = ({ onSelectDoctor }) => {
  const { config } = useClinicConfig();
  const [selectedDoc, setSelectedDoc] = useState<Doctor>(DOCTORS_DATA[0]);

  return (
    <section id="doctors" className="py-16 sm:py-24 bg-white relative overflow-hidden">
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 bg-pink-100/40 blur-3xl rounded-full -translate-y-1/3 translate-x-1/4" aria-hidden />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="section-eyebrow">
            <Heart className="w-3.5 h-3.5 fill-pink-600 text-pink-600" />
            Know Our Doctors
          </span>
          <h2 className="font-aesthetic text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight text-balance">
            Trusted specialists for mother &amp; baby care
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Led by Dr. Shilpa Rani G R, MS (OBG), DNB (OBG) — warm, evidence-based maternity and women&apos;s health care.
          </p>
        </div>

        {/* Doctor Spotlight Showcase */}
        <div className="bg-gradient-to-br from-slate-50 via-white to-rose-50/40 rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[var(--shadow-soft)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Doctor Photo & Rating Badge */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative max-w-sm w-full">
                <div className="absolute -inset-2 rounded-[2rem] bg-gradient-to-br from-pink-300/30 to-transparent blur-lg" aria-hidden />
                <img
                  src={selectedDoc.imageUrl}
                  alt={selectedDoc.name}
                  className="relative w-full h-80 sm:h-96 object-cover rounded-3xl shadow-xl border-4 border-white"
                  loading="lazy"
                />
                
                {/* Floating Experience Badge */}
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-pink-200 shadow-lg flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-600 text-white font-extrabold text-sm flex items-center justify-center">
                    {selectedDoc.experienceYears}+
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 block">Years Experience</span>
                    <span className="text-[10px] font-bold text-pink-700 uppercase">Obstetrics & Speciality</span>
                  </div>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-pink-200 shadow-md flex items-center gap-1 text-xs font-bold text-slate-900">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>{selectedDoc.rating} ({selectedDoc.reviewCount} Reviews)</span>
                </div>
              </div>
            </div>

            {/* Right Column: Bio & Specialties */}
            <div className="lg:col-span-7 space-y-6">
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-extrabold text-pink-700 uppercase tracking-wider bg-pink-100 px-3 py-0.5 rounded-full border border-pink-200">
                    {selectedDoc.department}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Accepting New Patients
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {selectedDoc.name}
                </h3>
                <p className="text-sm font-bold text-pink-900 mt-1">
                  {selectedDoc.qualification}
                </p>
                <p className="text-xs font-semibold text-pink-800 mt-0.5">
                  {selectedDoc.title}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium bg-white p-4 rounded-2xl border border-pink-100 shadow-2xs">
                {selectedDoc.bio}
              </p>

              {/* Specialties List */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Clinical Focus & Expertise
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedDoc.specialties.map((spec, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-white text-slate-800 px-3 py-1.5 rounded-xl border border-pink-200 font-semibold shadow-2xs flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-pink-600" />
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Languages & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-700 pt-2 border-t border-pink-100">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Languages Spoken</span>
                  <span className="text-slate-900 font-bold">{selectedDoc.languages.join(', ')}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Consultation Suite</span>
                  <span className="text-slate-900 font-bold">{config.address}</span>
                </div>
              </div>

              {/* Book Action Button */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => onSelectDoctor(selectedDoc.id)}
                  className="px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Visit with {selectedDoc.name.split(',')[0]}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* Doctor Selector Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          {DOCTORS_DATA.map((doc) => (
            <button
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3.5 ${
                selectedDoc.id === doc.id
                  ? 'bg-pink-50 border-pink-400 shadow-md ring-2 ring-pink-400/50'
                  : 'bg-white border-slate-200 hover:border-pink-200 hover:bg-pink-50/30'
              }`}
            >
              <img
                src={doc.imageUrl}
                alt={doc.name}
                className="w-12 h-12 rounded-xl object-cover border border-pink-200 shadow-2xs"
              />
              <div className="text-xs">
                <span className="font-extrabold text-slate-900 block leading-tight">{doc.name}</span>
                <span className="text-[11px] text-pink-700 font-bold block">{doc.title}</span>
                <span className="text-[10px] text-slate-500 font-medium block mt-0.5">{doc.experienceYears}+ Yrs Exp</span>
              </div>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};
