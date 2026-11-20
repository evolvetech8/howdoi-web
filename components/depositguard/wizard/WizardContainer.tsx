'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock } from 'lucide-react';
import { useSimulation } from '@/lib/depositguard/context';
import { trackEvent } from '@/lib/depositguard/telemetry';
import { formatPercent } from '@/lib/depositguard/formatters';
import StepIndicator from './StepIndicator';
import Step1Property from './Step1Property';
import Step2Household from './Step2Household';
import Step3Loan from './Step3Loan';
import WizardNav from './WizardNav';
import DisclaimerBanner from '../common/DisclaimerBanner';

export default function WizardContainer() {
  const router = useRouter();
  const {
    currentStep,
    setCurrentStep,
    goToNextStep,
    goToPreviousStep,
    isStepComplete,
    step1Validation,
    step2Validation,
    step3Validation,
    resetScenario,
    loan,
  } = useSimulation();

  // Log initial step view on mount
  useEffect(() => {
    trackEvent('wizard_step_viewed', { step: 1, step_name: 'property' });
  }, []);

  const canProceed =
    currentStep === 1
      ? step1Validation.isValid
      : currentStep === 2
      ? step2Validation.isValid
      : step3Validation.isValid;

  const ltvPercent =
    loan.propertyPrice > 0
      ? Math.min(100, Math.max(0, (loan.loanAmount / loan.propertyPrice) * 100))
      : 0;

  const handleNext = () => {
    if (!canProceed) return;

    if (currentStep === 3) {
      const success = goToNextStep();
      if (success) {
        // Ephemeral client navigation: STRICTLY ZERO query parameters
        router.push('/ket-qua');
      }
    } else {
      goToNextStep();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    goToPreviousStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    // Explicitly prevent browser native GET form query string serialization
    e.preventDefault();
    handleNext();
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-6 sm:py-10 px-4 sm:px-6 space-y-6">
      {/* Top Trust Disclaimer */}
      <DisclaimerBanner />

      {/* Main Wizard Editorial Ledger Card */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden transition-all duration-300"
      >
        {/* Institutional Deep Navy Ledger Header Strip */}
        <div className="bg-[#0B1D30] text-white px-5 sm:px-8 py-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-blue-700/90 text-white">
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-blue-300 block">
                DEPOSITGUARD LEDGER • ENGINE v1.1
              </span>
              <span className="text-xs font-semibold text-slate-200">
                Thẩm định dòng tiền & sức bền trả nợ 240 tháng
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-800/90 border border-slate-700/80 px-2.5 py-1 rounded-lg">
              <span className="text-slate-400">Tỷ lệ vay (LTV):</span>
              <span className="font-mono tabular-nums font-bold text-blue-300">
                {formatPercent(ltvPercent, 1)}
              </span>
            </div>
            <div className="inline-flex items-center gap-1 font-mono text-[10px] font-semibold text-emerald-300 bg-emerald-950/70 border border-emerald-800/70 px-2.5 py-1 rounded-lg">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>100% Client-Side</span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-8 space-y-6">
          {/* Step Indicator */}
          <StepIndicator
            currentStep={currentStep}
            onSelectStep={(step) => {
              setCurrentStep(step);
              const stepName = step === 1 ? 'property' : step === 2 ? 'household' : 'loan';
              trackEvent('wizard_step_viewed', { step, step_name: stepName });
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            isStepComplete={isStepComplete}
          />

          {/* Step Forms — Strictly Synchronous Mounting for JSDOM Determinism */}
          <div className="pt-2 transition-all duration-300">
            {currentStep === 1 && <Step1Property />}
            {currentStep === 2 && <Step2Household />}
            {currentStep === 3 && <Step3Loan />}
          </div>

          {/* Wizard Bottom Controls */}
          <WizardNav
            currentStep={currentStep}
            canProceed={canProceed}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onReset={resetScenario}
          />
        </div>
      </form>
    </div>
  );
}
