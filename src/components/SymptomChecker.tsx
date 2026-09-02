import React, { useState } from 'react';
import { Sparkles, AlertCircle, CheckCircle2, Stethoscope, Clock, ShieldAlert, ArrowRight, RotateCcw, Heart, Calendar, Baby, Flower2 } from 'lucide-react';
import { useClinicConfig } from '../context/ClinicConfigContext';

interface SymptomCheckerProps {
  onNavigateToBooking: (serviceName?: string, doctorId?: string) => void;
  onOpenEmergency: () => void;
}

export const SymptomChecker: React.FC<SymptomCheckerProps> = ({ onNavigateToBooking, onOpenEmergency }) => {
  const { config } = useClinicConfig();
  const [symptomInput, setSymptomInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [severity, setSeverity] = useState<'Mild' | 'Moderate' | 'Severe'>('Moderate');
  const [trimester, setTrimester] = useState<'Not Pregnant' | '1st Trimester' | '2nd Trimester' | '3rd Trimester'>('Not Pregnant');
  const [hasRedFlags, setHasRedFlags] = useState<boolean>(false);
  const [isAnalyzed, setIsAnalyzed] = useState<boolean>(false);

  const commonSymptomPresets = [
    { label: 'Routine Prenatal / Antenatal Checkup', category: 'Maternity', recommendedService: 'Antenatal Checkup', icon: '🤰' },
    { label: 'Decreased Fetal Movement or Abdominal Cramp', category: 'Obstetric Warning', recommendedService: 'High Risk Pregnancy', isRedFlag: true, icon: '👶' },
    { label: 'Irregular Periods / Missing Cycle', category: 'Menstrual', recommendedService: 'PCOS Management', icon: '📅' },
    { label: 'Difficulty Conceiving / Trying for Baby', category: 'Fertility', recommendedService: 'Fertility Treatment', icon: '✨' },
    { label: 'Painful Periods or Pelvic Pain', category: 'Gynaecological', recommendedService: 'Fibroids / Ovarian Cysts / Endometriosis Treatment', icon: '🌸' },
    { label: 'Pre-Conception Planning Guidance', category: 'Counseling', recommendedService: 'Pre-Pregnancy Counseling', icon: '💕' }
  ];

  const handlePresetSelect = (preset: typeof commonSymptomPresets[0]) => {
    setSelectedCategory(preset.label);
    setSymptomInput(preset.label);
    if (preset.isRedFlag) {
      setHasRedFlags(true);
    } else {
      setHasRedFlags(false);
    }
  };

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomInput) return;

    const lower = symptomInput.toLowerCase();
    const criticalKeywords = ['bleeding', 'leak', 'fluid leak', 'decreased movement', 'no movement', 'severe pain', 'high bp', 'blurred vision'];
    
    if (criticalKeywords.some(k => lower.includes(k)) || (severity === 'Severe' && (trimester !== 'Not Pregnant' || selectedCategory.includes('Decreased')))) {
      setHasRedFlags(true);
    } else {
      setHasRedFlags(false);
    }

    setIsAnalyzed(true);
  };

  const resetChecker = () => {
    setSymptomInput('');
    setSelectedCategory('');
    setSeverity('Moderate');
    setTrimester('Not Pregnant');
    setIsAnalyzed(false);
    setHasRedFlags(false);
  };

  const getRecommendation = () => {
    if (hasRedFlags) {
      return {
        level: 'Obstetric Emergency Alert',
        title: 'Immediate Clinical Evaluation Needed',
        badgeColor: 'bg-rose-600 text-white',
        boxBg: 'bg-rose-50 border-rose-300 text-rose-950',
        description: 'Your reported symptoms indicate potential pregnancy risk or acute pelvic discomfort that requires immediate clinical evaluation by Dr. Shilpa.',
        actionText: 'Open Emergency Hotline',
        isEmergency: true
      };
    }

    const preset = commonSymptomPresets.find(p => p.label === selectedCategory);
    const service = preset ? preset.recommendedService : 'Antenatal Checkup';

    return {
      level: 'Specialist Visit Recommended',
      title: 'Dr. Shilpa Consultation Advised',
      badgeColor: 'bg-pink-600 text-white',
      boxBg: 'bg-pink-50 border-pink-200 text-pink-950',
      description: `Based on your symptom inputs, scheduling a visit for "${service}" at ${config.name} is recommended.`,
      actionText: `Schedule Visit for ${service}`,
      recommendedService: service,
      isEmergency: false
    };
  };

  const result = getRecommendation();

  return (
    <section id="symptom-checker" className="py-16 sm:py-20 bg-slate-50/50 border-y border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-pink-800 bg-pink-50 px-3.5 py-1 rounded-full border border-pink-200/80">
            <Sparkles className="w-3.5 h-3.5 text-pink-600" />
            Symptom Care Navigator
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Need Guidance on Maternal or Health Symptoms?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-medium">
            Select your health concern to receive tailored clinical guidance and direct booking recommendations for Dr. Shilpa's clinic.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
          {!isAnalyzed ? (
            <form onSubmit={handleAnalyze} className="space-y-6">
              
              {/* Presets */}
              <div>
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block mb-3">
                  1. Select Primary Concern
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {commonSymptomPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePresetSelect(preset)}
                      className={`p-3.5 rounded-2xl border text-left text-xs transition-all flex items-center gap-3 cursor-pointer ${
                        selectedCategory === preset.label
                          ? 'border-pink-500 bg-pink-50 ring-2 ring-pink-400/40 text-pink-950 font-bold'
                          : 'border-slate-200 bg-slate-50/60 hover:bg-pink-50/40 text-slate-700'
                      }`}
                    >
                      <span className="text-xl">{preset.icon}</span>
                      <span className="leading-snug font-semibold">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Input */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Or Describe Symptoms / Concerns
                </label>
                <textarea
                  rows={3}
                  value={symptomInput}
                  onChange={(e) => setSymptomInput(e.target.value)}
                  placeholder="e.g. 18 weeks pregnant, mild back pain and morning nausea..."
                  className="w-full p-3 bg-pink-50/30 border border-pink-200 rounded-2xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              {/* Pregnancy Status & Severity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Pregnancy Stage</label>
                  <select
                    value={trimester}
                    onChange={(e) => setTrimester(e.target.value as any)}
                    className="w-full p-2.5 bg-pink-50/40 border border-pink-200 rounded-xl text-xs font-bold text-slate-800"
                  >
                    <option value="Not Pregnant">Not Pregnant / General Care</option>
                    <option value="1st Trimester">1st Trimester (Weeks 1-12)</option>
                    <option value="2nd Trimester">2nd Trimester (Weeks 13-27)</option>
                    <option value="3rd Trimester">3rd Trimester (Weeks 28-40)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Discomfort Severity</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Mild', 'Moderate', 'Severe'] as const).map((sev) => (
                      <button
                        key={sev}
                        type="button"
                        onClick={() => setSeverity(sev)}
                        className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                          severity === sev
                            ? 'bg-pink-600 text-white border-pink-600 shadow-xs'
                            : 'bg-white text-slate-700 border-pink-200 hover:bg-pink-50'
                        }`}
                      >
                        {sev}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!symptomInput}
                className="w-full py-3.5 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                Analyze & Recommend Clinical Service
              </button>
            </form>
          ) : (
            /* Result View */
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-pink-100">
                <span className={`text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider ${result.badgeColor}`}>
                  {result.level}
                </span>
                <button
                  onClick={resetChecker}
                  className="text-xs font-bold text-pink-700 hover:text-pink-900 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Start Over
                </button>
              </div>

              <div className={`p-5 rounded-2xl border ${result.boxBg} space-y-3`}>
                <h3 className="text-lg font-extrabold flex items-center gap-2">
                  {result.isEmergency ? <ShieldAlert className="w-6 h-6 text-rose-600 animate-pulse" /> : <CheckCircle2 className="w-6 h-6 text-pink-600" />}
                  {result.title}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed font-medium">
                  {result.description}
                </p>
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                {result.isEmergency ? (
                  <button
                    onClick={onOpenEmergency}
                    className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldAlert className="w-5 h-5" />
                    Open Emergency Hotline & Triage
                  </button>
                ) : (
                  <button
                    onClick={() => onNavigateToBooking(result.recommendedService)}
                    className="w-full py-3.5 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Calendar className="w-5 h-5" />
                    Book Appointment for {result.recommendedService}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
