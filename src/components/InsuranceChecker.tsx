import React, { useState } from 'react';
import { ShieldCheck, Search, CheckCircle2, AlertCircle, HelpCircle, PhoneCall, ChevronRight, Flower2 } from 'lucide-react';
import { INSURANCE_PROVIDERS_DATA } from '../data/clinicData';
import { useClinicConfig } from '../context/ClinicConfigContext';

export const InsuranceChecker: React.FC = () => {
  const { config } = useClinicConfig();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredInsurance = INSURANCE_PROVIDERS_DATA.filter((ins) => {
    const matchesCat = selectedCategory === 'All' || ins.category === selectedCategory;
    const matchesSearch = 
      ins.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ins.popularPlans.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCat && matchesSearch;
  });

  return (
    <section id="insurance" className="py-16 bg-white border-b border-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-pink-800 bg-pink-100 px-3.5 py-1 rounded-full border border-pink-200 inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-pink-600" />
            INSURANCE & CASHLESS MATERNITY TPA
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive TPA & Insurance Support
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
            {config.name} assists with insurance pre-authorization, TPA claim reimbursement, and cashless maternity options across major health schemes.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-gradient-to-r from-pink-50/70 to-rose-50/70 p-4 sm:p-5 rounded-3xl border border-pink-200/80 space-y-4 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative sm:col-span-2">
              <Search className="w-4 h-4 text-pink-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search insurance provider or TPA (e.g. Star Health, Care, HDFC ERGO)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-pink-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 bg-white border border-pink-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="All">Category: All Health Plans</option>
                <option value="Commercial Health Insurance">Commercial Health Insurance</option>
                <option value="Government & TPA Schemes">Government & TPA Schemes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filteredInsurance.map((ins) => (
            <div 
              key={ins.id}
              className="bg-white rounded-3xl p-6 border border-pink-200/90 hover:border-pink-400 hover:shadow-lg transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-950 to-pink-900 text-pink-200 flex items-center justify-center font-black text-xs tracking-wider border border-pink-800">
                    {ins.logoText}
                  </div>
                  <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-pink-50 text-pink-900 border border-pink-200">
                    {ins.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{ins.name}</h3>
                  <p className="text-xs font-semibold text-pink-700">{ins.category}</p>
                </div>

                <div className="p-3 bg-pink-50/60 rounded-2xl border border-pink-100 text-xs text-slate-700 space-y-1 font-medium">
                  <span className="font-extrabold text-slate-900 block">Maternity & Delivery Coverage</span>
                  <span className="text-pink-900 font-bold">{ins.copayEstimate}</span>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-500 block mb-1">Supported Plans:</span>
                  <div className="flex flex-wrap gap-1">
                    {ins.popularPlans.map((plan, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded-lg font-semibold">
                        {plan}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-pink-100 text-xs text-slate-500 flex items-center justify-between">
                <span className="flex items-center gap-1 text-pink-800 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-pink-600" /> TPA Desk Assistance
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Self-Pay & Financial Counselor */}
        <div className="p-6 bg-slate-950 text-slate-200 rounded-3xl max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-rose-950">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-extrabold text-white flex items-center justify-center sm:justify-start gap-2">
              <ShieldCheck className="w-5 h-5 text-pink-400" />
              Transparent Consultation & Delivery Packages
            </h3>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed font-medium">
              We offer clear, affordable pricing for normal deliveries, LSCS caesarean care, and gynaecological procedures.
            </p>
          </div>
          <a
            href={`tel:${config.phone}`}
            className="px-5 py-3 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white text-xs font-bold rounded-2xl shadow-md transition-colors flex items-center gap-2 cursor-pointer flex-shrink-0"
          >
            <PhoneCall className="w-4 h-4" />
            Contact Clinic Reception ({config.phone})
          </a>
        </div>

      </div>
    </section>
  );
};
