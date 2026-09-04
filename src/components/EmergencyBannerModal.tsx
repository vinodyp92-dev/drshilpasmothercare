import React from 'react';
import { AlertTriangle, Phone, ShieldAlert, X, Heart, Activity, Baby } from 'lucide-react';
import { useClinicConfig } from '../context/ClinicConfigContext';
import { formatTelHref } from '../utils/phone';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyBannerModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  const { config } = useClinicConfig();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-rose-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-700 to-rose-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/80 flex items-center justify-center text-white font-bold animate-pulse">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold">Maternity & Medical Emergency Alert</h3>
              <p className="text-xs text-rose-100">Immediate Obstetric Action Guidance</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-xl text-rose-100 hover:text-white hover:bg-rose-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-950 text-xs space-y-2">
            <p className="font-extrabold flex items-center gap-2 text-rose-800 text-sm">
              <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0" />
              Experiencing severe pregnancy complications?
            </p>
            <p className="text-xs text-rose-800 leading-relaxed font-medium">
              Do not wait for an online appointment.contact {config.name}'s emergency triage line immediately if you experience any of the following:
            </p>
          </div>

          {/* Critical Symptoms Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-pink-50/50 rounded-2xl border border-pink-100 flex items-start gap-2.5">
              <Baby className="w-4 h-4 text-pink-600 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-extrabold text-slate-900 block">Decreased Fetal Movement</span>
                <span className="text-slate-600 text-[11px] font-medium">Significant reduction or absence of baby kicks.</span>
              </div>
            </div>

            <div className="p-3 bg-pink-50/50 rounded-2xl border border-pink-100 flex items-start gap-2.5">
              <Activity className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-extrabold text-slate-900 block">Sudden Vaginal Bleeding / Leak</span>
                <span className="text-slate-600 text-[11px] font-medium">Heavy spotting, bright red bleeding, or amniotic fluid leak.</span>
              </div>
            </div>

            <div className="p-3 bg-pink-50/50 rounded-2xl border border-pink-100 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-extrabold text-slate-900 block">Severe Abdominal / Pelvic Pain</span>
                <span className="text-slate-600 text-[11px] font-medium">Persistent sharp uterine cramping or severe pain.</span>
              </div>
            </div>

            <div className="p-3 bg-pink-50/50 rounded-2xl border border-pink-100 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-extrabold text-slate-900 block">Severe Headache & Blurred Vision</span>
                <span className="text-slate-600 text-[11px] font-medium">Signs of severe preeclampsia or extreme high blood pressure.</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
            <a 
              href={formatTelHref(config.mobile)}
              className="flex-1 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-center flex items-center justify-center gap-2 transition-colors text-xs"
            >
              <Phone className="w-4 h-4 text-pink-400" />
              Call Clinic Desk ({config.mobile})
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
