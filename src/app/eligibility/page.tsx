'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

export default function EligibilityPreCheckPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    stCategory: 'YES',
    educationLevel: 'POST_GRADUATE',
    familyIncome: '240000',
    marksPercentage: '72',
    institutionType: 'IIT_NIT_IIM',
  });
  const [completed, setCompleted] = useState(false);

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      setCompleted(true);
    }
  };

  const incomeNum = parseFloat(formData.familyIncome) || 0;
  const marksNum = parseFloat(formData.marksPercentage) || 0;
  const isST = formData.stCategory === 'YES';

  const isEligibleNFST = isST && incomeNum <= 600000 && marksNum >= 55;
  const isEligibleNOS = isST && incomeNum <= 600000 && marksNum >= 60;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-[#D9DFDC] pb-4">
        <h1 className="page-header-title">
          ST Scholarship Eligibility Pre-Check
        </h1>
        <p className="page-header-subtitle">
          Answer 5 brief questions to evaluate potential eligibility across Ministry of Tribal Affairs schemes.
        </p>
      </div>

      {!completed ? (
        <div className="institutional-card p-6 space-y-6">
          {/* Step Progress Bar */}
          <div className="flex items-center justify-between text-xs font-medium text-[#5E6865] border-b border-[#EBEFEF] pb-3">
            <span>Step {step} of 5</span>
            <div className="w-36 h-1.5 bg-[#EBEFEF] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#075E54] transition-all duration-300"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Question 1: ST Status */}
          {step === 1 && (
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-[#17201F]">
                1. Do you possess a valid Scheduled Tribe (ST) Certificate issued by a competent State Revenue Officer?
              </label>
              <div className="space-y-2">
                <label className={`flex items-center space-x-3 p-3 rounded border text-xs cursor-pointer ${formData.stCategory === 'YES' ? 'bg-[#F0F6F5] border-[#B5CECA] font-medium' : 'border-[#D9DFDC]'}`}>
                  <input
                    type="radio"
                    name="stCategory"
                    value="YES"
                    checked={formData.stCategory === 'YES'}
                    onChange={() => setFormData({ ...formData, stCategory: 'YES' })}
                    className="accent-[#075E54]"
                  />
                  <span>Yes, I hold a valid ST Certificate</span>
                </label>
                <label className={`flex items-center space-x-3 p-3 rounded border text-xs cursor-pointer ${formData.stCategory === 'NO' ? 'bg-[#F0F6F5] border-[#B5CECA] font-medium' : 'border-[#D9DFDC]'}`}>
                  <input
                    type="radio"
                    name="stCategory"
                    value="NO"
                    checked={formData.stCategory === 'NO'}
                    onChange={() => setFormData({ ...formData, stCategory: 'NO' })}
                    className="accent-[#075E54]"
                  />
                  <span>No / Not applicable</span>
                </label>
              </div>
            </div>
          )}

          {/* Question 2: Academic Level */}
          {step === 2 && (
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-[#17201F]">
                2. What is your current level of higher education / target study?
              </label>
              <select
                value={formData.educationLevel}
                onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                className="w-full text-xs p-3 border border-[#D9DFDC] rounded bg-white font-medium text-[#17201F]"
              >
                <option value="UNDER_GRADUATE">Undergraduate (B.Tech, MBBS, B.A, B.Sc)</option>
                <option value="POST_GRADUATE">Postgraduate (M.Sc, M.Tech, M.A, M.Phil)</option>
                <option value="PHD">Ph.D / Doctorate Research</option>
                <option value="OVERSEAS">Foreign Degree / Overseas Studies</option>
              </select>
            </div>
          )}

          {/* Question 3: Income */}
          {step === 3 && (
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-[#17201F]">
                3. What is your total gross annual family income from all sources?
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-[#5E6865] font-bold">₹</span>
                <input
                  type="number"
                  value={formData.familyIncome}
                  onChange={(e) => setFormData({ ...formData, familyIncome: e.target.value })}
                  placeholder="e.g. 240000"
                  className="w-full pl-7 pr-3 py-2.5 border border-[#D9DFDC] rounded text-xs font-mono font-medium text-[#17201F]"
                />
              </div>
              <p className="text-[11px] text-[#5E6865]">
                Must match the official Revenue Department Income Certificate for FY 2025-26.
              </p>
            </div>
          )}

          {/* Question 4: Marks */}
          {step === 4 && (
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-[#17201F]">
                4. What overall percentage did you secure in your last qualifying examination?
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={formData.marksPercentage}
                  onChange={(e) => setFormData({ ...formData, marksPercentage: e.target.value })}
                  placeholder="e.g. 74.5"
                  className="w-full px-3 py-2.5 border border-[#D9DFDC] rounded text-xs font-mono font-medium text-[#17201F]"
                />
                <span className="absolute right-3 top-2.5 text-xs text-[#5E6865] font-bold">%</span>
              </div>
            </div>
          )}

          {/* Question 5: Institution */}
          {step === 5 && (
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-[#17201F]">
                5. What type of institution are you enrolled in or seeking admission into?
              </label>
              <select
                value={formData.institutionType}
                onChange={(e) => setFormData({ ...formData, institutionType: e.target.value })}
                className="w-full text-xs p-3 border border-[#D9DFDC] rounded bg-white font-medium text-[#17201F]"
              >
                <option value="IIT_NIT_IIM">Premier Institute (IIT, NIT, IIM, AIIMS, NLU)</option>
                <option value="GOVT_UNI">Recognized Indian Central / State University</option>
                <option value="FOREIGN_UNI">Top Ranked Foreign University (Overseas)</option>
              </select>
            </div>
          )}

          {/* Nav Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-[#EBEFEF]">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="btn-secondary text-xs py-2 px-3 space-x-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : <div />}

            <button
              onClick={handleNext}
              className="btn-primary text-xs py-2 px-4 space-x-1"
            >
              <span>{step === 5 ? 'Generate Assessment' : 'Continue'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Result Diagnostic Assessment */
        <div className="institutional-card p-6 space-y-6">
          <div className="border-b border-[#D9DFDC] pb-3">
            <h2 className="font-serif font-bold text-lg text-[#17201F]">Eligibility Diagnostic Assessment</h2>
            <p className="text-xs text-[#5E6865]">
              Informational evaluation based on configured scheme rules. Final eligibility is established during formal document verification.
            </p>
          </div>

          <div className="space-y-4">
            {/* NFST Evaluation */}
            <div className={`p-4 rounded border text-xs space-y-2 ${isEligibleNFST ? 'bg-[#F0F6F5] border-[#B5CECA]' : 'bg-[#F3F4F1] border-[#D9DFDC]'}`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#17201F] text-sm">National Fellowship for ST Students (NFST)</span>
                {isEligibleNFST ? (
                  <span className="bg-[#E6F4F1] text-[#075E54] border border-[#B5CECA] px-2 py-0.5 rounded font-medium flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#075E54]" />
                    <span>Likely Eligible</span>
                  </span>
                ) : (
                  <span className="bg-[#EBEFEF] text-[#5E6865] px-2 py-0.5 rounded font-medium">Potentially Ineligible</span>
                )}
              </div>
              <p className="text-[#5E6865]">
                {isEligibleNFST
                  ? 'Based on ST status, income ≤ ₹6L, and academic marks ≥ 55%.'
                  : 'Requires ST category, PG marks ≥ 55%, and income ≤ ₹6,00,000.'}
              </p>
            </div>

            {/* NOS Evaluation */}
            <div className={`p-4 rounded border text-xs space-y-2 ${isEligibleNOS ? 'bg-[#F0F6F5] border-[#B5CECA]' : 'bg-[#F3F4F1] border-[#D9DFDC]'}`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#17201F] text-sm">National Overseas Scholarship (NOS)</span>
                {isEligibleNOS ? (
                  <span className="bg-[#E6F4F1] text-[#075E54] border border-[#B5CECA] px-2 py-0.5 rounded font-medium flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#075E54]" />
                    <span>Likely Eligible</span>
                  </span>
                ) : (
                  <span className="bg-[#EBEFEF] text-[#5E6865] px-2 py-0.5 rounded font-medium">Potentially Ineligible</span>
                )}
              </div>
              <p className="text-[#5E6865]">
                {isEligibleNOS
                  ? 'Qualifies for foreign degree financial assistance subject to unconditional university admission.'
                  : 'Requires minimum 60% marks and income ceiling compliance.'}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#EBEFEF] flex items-center justify-between">
            <button
              onClick={() => { setStep(1); setCompleted(false); }}
              className="text-xs text-[#5E6865] hover:text-[#17201F] font-medium underline"
            >
              Start New Check
            </button>

            <Link
              href="/schemes"
              className="btn-primary text-xs py-2 px-4 space-x-1"
            >
              <span>Explore Schemes & Apply</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

