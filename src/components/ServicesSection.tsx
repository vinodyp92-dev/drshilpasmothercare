import React, { useState } from 'react';
import { Heart, Activity, Baby, Sparkles, AlertTriangle, CalendarClock, Sun, UserCheck, ShieldCheck, Users, Stethoscope, Clock, CheckCircle, ChevronRight, Flower2, HeartHandshake, Calendar, ArrowRight, Check } from 'lucide-react';
import { SERVICES_DATA } from '../data/clinicData';
import { MedicalService } from '../types/clinic';

interface ServicesSectionProps {
  onSelectService: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const [selectedServiceId, setSelectedServiceId] = useState<string>(SERVICES_DATA[0].id);
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Maternity' | 'Gynecology' | 'Infertility'>('All');

  const activeService = SERVICES_DATA.find(s => s.id === selectedServiceId) || SERVICES_DATA[0];

  const getServiceIcon = (iconName: string, active: boolean = false) => {
    const iconClass = `w-5 h-5 ${active ? 'text-white' : 'text-pink-600'}`;
    switch (iconName) {
      case 'HeartHandshake': return <HeartHandshake className={iconClass} />;
      case 'Baby': return <Baby className={iconClass} />;
      case 'AlertTriangle': return <AlertTriangle className={iconClass} />;
      case 'Sparkles': return <Sparkles className={iconClass} />;
      case 'Activity': return <Activity className={iconClass} />;
      case 'CalendarClock': return <CalendarClock className={iconClass} />;
      case 'Sun': return <Sun className={iconClass} />;
      case 'UserCheck': return <UserCheck className={iconClass} />;
      case 'ShieldCheck': return <ShieldCheck className={iconClass} />;
      case 'Users': return <Users className={iconClass} />;
      case 'Stethoscope': return <Stethoscope className={iconClass} />;
      default: return <Flower2 className={iconClass} />;
    }
  };

  const filteredServices = SERVICES_DATA.filter(service => {
    if (categoryFilter === 'Maternity') {
      return ['Pre-Pregnancy Counseling', 'Antenatal Checkup', 'High Risk Pregnancy'].includes(service.name);
    }
    if (categoryFilter === 'Infertility') {
      return ['Infertility Treatment', 'PCOS Management'].includes(service.name);
    }
    if (categoryFilter === 'Gynecology') {
      return !['Pre-Pregnancy Counseling', 'Antenatal Checkup', 'High Risk Pregnancy', 'Infertility Treatment'].includes(service.name);
    }
    return true;
  });

  return (
    <section id="services" className="py-16 sm:py-24 bg-slate-50/70 border-y border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="section-eyebrow">
            <Flower2 className="w-3.5 h-3.5 text-pink-600" />
            Our Specialty Services
          </span>
          <h2 className="font-aesthetic text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight text-balance">
            Comprehensive maternity & women&apos;s healthcare
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Select a specialty service from the directory below to explore clinical details and schedule your appointment.
          </p>
        </div>

        {/* Quick Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {(['All', 'Maternity', 'Infertility', 'Gynecology'] as const).map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-pink-700 text-white shadow-sm'
                  : 'bg-white/90 text-slate-700 hover:bg-pink-50 border border-slate-200/90'
              }`}
            >
              {cat === 'All' ? 'All Services (11)' : cat}
            </button>
          ))}
        </div>

        {/* Side-by-Side Main Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (Services List - Side by Side Selector) */}
          <div className="lg:col-span-5 bg-white/90 backdrop-blur-sm p-3 sm:p-4 rounded-3xl border border-slate-200/90 shadow-[var(--shadow-soft)] space-y-2 max-h-[580px] overflow-y-auto custom-scrollbar">
            <div className="px-2 py-1 flex items-center justify-between border-b border-slate-100 mb-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                Specialties List ({filteredServices.length})
              </span>
              <span className="text-[10px] text-pink-700 font-bold bg-pink-50 px-2 py-0.5 rounded-md">
                Click to preview
              </span>
            </div>

            <div className="space-y-1.5">
              {filteredServices.map((service) => {
                const isSelected = service.id === selectedServiceId;
                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setSelectedServiceId(service.id)}
                    className={`w-full text-left p-3 rounded-2xl transition-all flex items-center justify-between group cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md ring-2 ring-pink-500'
                        : 'bg-slate-50/70 hover:bg-pink-50/70 text-slate-800 border border-slate-100 hover:border-pink-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-xl flex-shrink-0 transition-colors ${
                        isSelected ? 'bg-white/20' : 'bg-pink-100/80 group-hover:bg-pink-200/80'
                      }`}>
                        {getServiceIcon(service.iconName, isSelected)}
                      </div>
                      <div className="min-w-0">
                        <h4 className={`text-xs font-extrabold truncate ${isSelected ? 'text-white' : 'text-slate-900 group-hover:text-pink-700'}`}>
                          {service.name}
                        </h4>
                        <p className={`text-[10px] truncate ${isSelected ? 'text-pink-100' : 'text-slate-500'}`}>
                          {service.shortDescription}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                      {isSelected ? (
                        <Check className="w-4 h-4 text-white" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-pink-600" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column (Detailed Active Service Card & SINGLE BOOKING ACTION) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-3xl border-2 border-pink-200 shadow-lg space-y-6 lg:sticky lg:top-24">
            
            {/* Header / Department */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3.5">
                <div className="p-3 bg-gradient-to-br from-pink-600 to-rose-600 text-white rounded-2xl shadow-sm">
                  {getServiceIcon(activeService.iconName, true)}
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-pink-700 bg-pink-50 px-2.5 py-0.5 rounded-md border border-pink-100 inline-block mb-1">
                    {activeService.department}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                    {activeService.name}
                  </h3>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium bg-pink-50/50 p-4 rounded-2xl border border-pink-100">
                {activeService.fullDescription}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Conditions Evaluated */}
                <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                  <h5 className="text-[11px] font-extrabold uppercase tracking-wider text-pink-800 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-pink-600" /> Key Conditions Evaluated
                  </h5>
                  <ul className="space-y-1">
                    {activeService.commonConditions.map((cond, idx) => (
                      <li key={idx} className="text-xs text-slate-700 font-medium flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-pink-500 flex-shrink-0" />
                        <span>{cond}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Included Procedures */}
                <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                  <h5 className="text-[11px] font-extrabold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-rose-600" /> Clinical Procedures Included
                  </h5>
                  <ul className="space-y-1">
                    {activeService.procedures.map((proc, idx) => (
                      <li key={idx} className="text-xs text-slate-700 font-medium flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
                        <span>{proc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* UNIFIED SINGLE BOOKING ACTION BLOCK */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-900 to-pink-950 p-4 rounded-2xl text-white shadow-md">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-pink-300 uppercase tracking-wider block">
                    Ready to book this specialty?
                  </span>
                  <p className="text-xs font-bold text-slate-100">
                    Schedule visit for <span className="text-pink-300">{activeService.name}</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectService(activeService.name)}
                  className="px-5 py-2.5 bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border border-pink-400/30"
                >
                  <Calendar className="w-4 h-4 text-white" />
                  <span>Book {activeService.name} Appointment</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>

              <p className="text-[10px] text-center text-slate-500 font-medium">
                Prefer a general OPD visit? You can also select your doctor and slot directly in the online booking section below.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

