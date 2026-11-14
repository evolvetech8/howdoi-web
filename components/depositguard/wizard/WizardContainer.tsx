'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSimulation } from '@/lib/depositguard/context';
import { trackEvent } from '@/lib/depositguard/telemetry';
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

      {/* Main Wizard Form Card */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-8 space-y-6"
      >
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

        {/* Step Forms */}
        <div className="pt-2">
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
      </form>
    </div>
  );
}
