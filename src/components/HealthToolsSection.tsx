import React, { useState } from 'react';
import { Calculator, Baby, Calendar, Heart, CheckCircle2, AlertCircle, Sparkles, ShieldCheck, ChevronRight, Clock } from 'lucide-react';

interface HealthToolsSectionProps {
  onOpenBooking: (doctorId?: string, serviceId?: string) => void;
}

export const HealthToolsSection: React.FC<HealthToolsSectionProps> = ({ onOpenBooking }) => {
  const [activeTab, setActiveTab] = useState<'edd' | 'vaccine'>('edd');

  // Pregnancy Calculator State
  const [lmpDate, setLmpDate] = useState<string>('');
  const [eddResult, setEddResult] = useState<{
    eddDate: string;
    weeks: number;
    trimester: number;
    babySize: string;
    ntScanDate: string;
    anomalyScanDate: string;
    growthScanDate: string;
  } | null>(null);

  const calculateEDD = (dateStr: string) => {
    if (!dateStr) return;
    const lmp = new Date(dateStr);
    
    // Naegele's rule: LMP + 280 days
    const edd = new Date(lmp.getTime() + 280 * 24 * 60 * 60 * 1000);
    
    // Calculate current weeks
    const today = new Date();
    const diffMs = today.getTime() - lmp.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const weeks = Math.max(0, Math.floor(diffDays / 7));
    
    let trimester = 1;
    if (weeks >= 13 && weeks <= 26) trimester = 2;
    if (weeks > 26) trimester = 3;

    // Baby size estimations
    const babySizes = [
      'Poppy Seed', 'Sesame Seed', 'Lentil', 'Blueberry', 'Raspberry', 'Olive', 
      'Fig', 'Lime', 'Pea Pod', 'Lemon', 'Apple', 'Avocado', 'Turnip', 
      'Sweet Potato', 'Mango', 'Banana', 'Carrot', 'Papaya', 'Eggplant', 
      'Grapefruit', 'Cantaloupe', 'Cauliflower', 'Lettuce', 'Rutabaga', 'Pineapple', 
      'Acorn Squash', 'Honeydew Melon', 'Cternut Squash', 'Durian', 'Watermelon'
    ];
    const babySize = weeks < babySizes.length ? babySizes[weeks] : 'Full Term Baby';

    // Milestone Scan Dates
    const ntScan = new Date(lmp.getTime() + 12 * 7 * 24 * 60 * 60 * 1000);
    const anomalyScan = new Date(lmp.getTime() + 20 * 7 * 24 * 60 * 60 * 1000);
    const growthScan = new Date(lmp.getTime() + 32 * 7 * 24 * 60 * 60 * 1000);

    const formatDate = (d: Date) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    setEddResult({
      eddDate: formatDate(edd),
      weeks,
      trimester,
      babySize,
      ntScanDate: formatDate(ntScan),
      anomalyScanDate: formatDate(anomalyScan),
      growthScanDate: formatDate(growthScan)
    });
  };

  // Vaccination Schedule Data
  const vaccineSchedule = [
    { age: 'At Birth', vaccines: ['BCG (Tuberculosis)', 'OPV-0 (Oral Polio)', 'Hepatitis B - 1st dose'], description: 'Protects newborn against TB, Polio, and Hepatitis B.' },
    { age: '6 Weeks', vaccines: ['DTwP/DTaP-1', 'IPV-1 (Polio)', 'Hepatitis B-2', 'Hib-1', 'Rotavirus-1', 'PCV-1 (Pneumococcal)'], description: 'Primary childhood immunization series begins.' },
    { age: '10 Weeks', vaccines: ['DTwP/DTaP-2', 'IPV-2', 'Hib-2', 'Rotavirus-2', 'PCV-2'], description: 'Second booster dose for immunity building.' },
    { age: '14 Weeks', vaccines: ['DTwP/DTaP-3', 'IPV-3', 'Hib-3', 'Rotavirus-3', 'PCV-3'], description: 'Completes the primary infant immunization series.' },
    { age: '6 Months', vaccines: ['Influenza (Flu) - 1st Dose', 'Oral Typhoid/OPV'], description: 'Seasonal Protection and Pediatric Checkup.' },
    { age: '9 Months', vaccines: ['Measles & Rubella (MR-1)', 'JE (Japanese Encephalitis)', 'OPV-1'], description: 'Protection against Measles, Mumps & Rubella.' },
    { age: '12 Months', vaccines: ['Hepatitis A - 1st Dose', 'PCV Booster'], description: 'Jaundice and pneumococcal extended protection.' },
    { age: '15 Months', vaccines: ['MMR-1 Booster', 'Varicella (Chickenpox-1)'], description: 'Essential toddlers viral disease defense.' },
    { age: '18 Months', vaccines: ['DTP Booster-1', 'IPV Booster-1', 'Hib Booster'], description: 'Toddler immunity reinforcement.' },
    { age: '5 Years', vaccines: ['DTP Booster-2', 'MMR-2', 'Typhoid Booster'], description: 'School entry immunization readiness.' }
  ];

  return (
    <section id="health-tools" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-pink-800 bg-pink-50 px-3.5 py-1 rounded-full border border-pink-200/80 inline-flex items-center gap-1.5">
            <Calculator className="w-3.5 h-3.5 text-pink-600" />
            Interactive Patient Tools
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Mother & Child Health Trackers
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Calculate your pregnancy estimated due date and explore your child's complete pediatric vaccination roadmap.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center">
          <div className="bg-white p-1.5 rounded-2xl border border-pink-200 shadow-sm inline-flex gap-2">
            <button
              onClick={() => setActiveTab('edd')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'edd'
                  ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-md'
                  : 'text-slate-700 hover:text-pink-700 hover:bg-pink-50'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Pregnancy Due Date (EDD) Calculator</span>
            </button>

            <button
              onClick={() => setActiveTab('vaccine')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'vaccine'
                  ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-md'
                  : 'text-slate-700 hover:text-pink-700 hover:bg-pink-50'
              }`}
            >
              <Baby className="w-4 h-4" />
              <span>Baby Immunization Schedule</span>
            </button>
          </div>
        </div>

        {/* TAB 1: Pregnancy EDD Calculator */}
        {activeTab === 'edd' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-200 shadow-xl max-w-4xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* Left Column Input */}
              <div className="md:col-span-5 space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-pink-700 uppercase tracking-wider block">Obstetric Tool</span>
                  <h3 className="text-xl font-extrabold text-slate-900">Calculate Expected Due Date</h3>
                  <p className="text-xs text-slate-600">Enter the first day of your last menstrual period (LMP) to estimate your delivery timeline.</p>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-bold text-slate-700">First Day of Last Period (LMP) *</label>
                  <input
                    type="date"
                    value={lmpDate}
                    onChange={(e) => {
                      setLmpDate(e.target.value);
                      calculateEDD(e.target.value);
                    }}
                    className="w-full p-3 bg-pink-50/50 border border-pink-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                  />
                </div>

                {!eddResult && (
                  <button
                    onClick={() => lmpDate && calculateEDD(lmpDate)}
                    disabled={!lmpDate}
                    className="w-full py-3 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-colors"
                  >
                    Calculate Delivery Date
                  </button>
                )}

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                  <span className="font-bold text-slate-900 block flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-pink-600 inline" /> Clinical Accuracy Note
                  </span>
                  <span>Ultrasound scans at Dr. Shilpa's clinic provide the most exact gestational age confirmation.</span>
                </div>
              </div>

              {/* Right Column Results */}
              <div className="md:col-span-7">
                {eddResult ? (
                  <div className="bg-gradient-to-br from-pink-50 via-rose-50/30 to-white p-6 rounded-2xl border border-pink-200/90 space-y-5 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between border-b border-pink-200 pb-3">
                      <div>
                        <span className="text-[11px] font-bold text-pink-700 uppercase">Estimated Due Date (EDD)</span>
                        <h4 className="text-2xl sm:text-3xl font-black text-slate-900">{eddResult.eddDate}</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">Current Timeline</span>
                        <span className="text-sm font-extrabold text-pink-800 bg-pink-100 px-3 py-1 rounded-full border border-pink-200 inline-block">
                          Week {eddResult.weeks} • Trimester {eddResult.trimester}
                        </span>
                      </div>
                    </div>

                    {/* Baby Size Visual */}
                    <div className="p-3 bg-white rounded-xl border border-pink-100 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-lg">
                        👶
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Estimated Baby Size</span>
                        <span className="text-xs font-extrabold text-slate-800">
                          Approx. size of a <strong className="text-pink-700">{eddResult.babySize}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Milestone Scans Timeline */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">
                        Recommended Ultrasound Scans:
                      </span>
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="p-2 bg-white rounded-xl border border-pink-100">
                          <span className="text-[10px] text-pink-700 font-bold block">NT Scan</span>
                          <span className="font-extrabold text-slate-900 text-[11px]">{eddResult.ntScanDate}</span>
                          <span className="text-[9px] text-slate-500 block">11-13 Wks</span>
                        </div>
                        <div className="p-2 bg-white rounded-xl border border-pink-100">
                          <span className="text-[10px] text-pink-700 font-bold block">Anomaly Scan</span>
                          <span className="font-extrabold text-slate-900 text-[11px]">{eddResult.anomalyScanDate}</span>
                          <span className="text-[9px] text-slate-500 block">18-22 Wks</span>
                        </div>
                        <div className="p-2 bg-white rounded-xl border border-pink-100">
                          <span className="text-[10px] text-pink-700 font-bold block">Growth Scan</span>
                          <span className="font-extrabold text-slate-900 text-[11px]">{eddResult.growthScanDate}</span>
                          <span className="text-[9px] text-slate-500 block">28-32 Wks</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenBooking('dr-shilpa', 'obs-antenatal')}
                      className="w-full py-2.5 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Book Antenatal Consultation & Scan with Dr. Shilpa</span>
                    </button>

                  </div>
                ) : (
                  <div className="bg-pink-50/50 rounded-2xl p-8 border border-dashed border-pink-200 text-center space-y-3">
                    <Heart className="w-10 h-10 text-pink-300 mx-auto" />
                    <h4 className="text-sm font-bold text-slate-700">Enter your Last Menstrual Period Date</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Get an instant delivery date estimate, trimester calculation, and key scan milestone reminders.
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: Baby Immunization Schedule */}
        {activeTab === 'vaccine' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-200 shadow-xl max-w-4xl mx-auto space-y-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-pink-100">
              <div>
                <span className="text-xs font-bold text-pink-700 uppercase tracking-wider block">Pediatric Care</span>
                <h3 className="text-2xl font-extrabold text-slate-900">Child Immunization Calendar</h3>
                <p className="text-xs text-slate-600 mt-0.5">Recommended vaccines according to Indian Academy of Pediatrics (IAP) guidelines.</p>
              </div>

              <button
                onClick={() => onOpenBooking('dr-pediatrician', 'ped-vaccine')}
                className="px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-500 text-white font-bold text-xs rounded-xl shadow-sm hover:from-pink-700 hover:to-rose-600 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule Baby Vaccination</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vaccineSchedule.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-50/80 hover:bg-pink-50/40 rounded-2xl border border-slate-200 hover:border-pink-200 transition-all space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-pink-800 bg-pink-100 px-3 py-1 rounded-full border border-pink-200">
                      📅 {item.age}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Pediatric Approved
                    </span>
                  </div>

                  <div className="space-y-1 pt-1">
                    {item.vaccines.map((v, vIdx) => (
                      <div key={vIdx} className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-pink-600 flex-shrink-0" />
                        <span>{v}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-500 font-medium pt-1 border-t border-slate-200/60">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-pink-50 rounded-2xl border border-pink-200 text-xs text-pink-950 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-pink-700 flex-shrink-0" />
                <span>Cold chain maintained vaccinations administered by experienced pediatric nursing staff.</span>
              </div>
              <button
                onClick={() => onOpenBooking('dr-pediatrician', 'ped-vaccine')}
                className="px-4 py-2 bg-pink-700 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-pink-800 cursor-pointer whitespace-nowrap"
              >
                Book Pediatric Visit
              </button>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
