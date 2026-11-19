'use client';

import React from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, CheckCircle } from 'lucide-react';

export interface WizardNavProps {
  currentStep: 1 | 2 | 3;
  canProceed: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onReset: () => void;
}

export default function WizardNav({
  currentStep,
  canProceed,
  onNext,
  onPrevious,
  onReset,
}: WizardNavProps) {
  return (
    <div className="pt-6 border-t border-slate-100 flex flex-col-reverse sm:flex-row justify-between items-center gap-3">
      {/* Reset & Back Buttons */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={onPrevious}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold text-xs sm:text-sm hover:bg-slate-50 transition shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại
          </button>
        ) : (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition py-2"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Đặt lại mặc định
          </button>
        )}

        {currentStep > 1 && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition"
          >
            <RotateCcw className="w-3 h-3" /> Đặt lại
          </button>
        )}
      </div>

      {/* Next / Submit Button */}
      <button
        type="button"
        disabled={!canProceed}
        onClick={onNext}
        className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm sm:text-base transition shadow-md ${
          canProceed
            ? 'bg-blue-700 text-white hover:bg-blue-800 hover:shadow-lg cursor-pointer active:scale-[0.98]'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
        }`}
      >
        {currentStep === 3 ? (
          <>
            <span>Xem kết quả phân tích rủi ro & Stress-test</span>
            <CheckCircle className="w-4 h-4 stroke-[2.5]" />
          </>
        ) : (
          <>
            <span>Tiếp tục sang bước {currentStep + 1}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </>
        )}
      </button>
    </div>
  );
}
