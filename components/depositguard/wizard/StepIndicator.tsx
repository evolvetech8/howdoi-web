'use client';

import React from 'react';
import { Check } from 'lucide-react';

export interface StepIndicatorProps {
  currentStep: 1 | 2 | 3;
  onSelectStep?: (step: 1 | 2 | 3) => void;
  isStepComplete: (step: 1 | 2 | 3) => boolean;
}

const STEPS = [
  { step: 1 as const, title: 'Bất động sản', desc: 'Giá trị & Vốn tự có' },
  { step: 2 as const, title: 'Dòng tiền gia đình', desc: 'Thu nhập & Quỹ đệm' },
  { step: 3 as const, title: 'Gói vay ngân hàng', desc: 'Lãi suất & Thời hạn' },
];

export default function StepIndicator({
  currentStep,
  onSelectStep,
  isStepComplete,
}: StepIndicatorProps) {
  return (
    <div className="w-full">
      {/* Mobile simplified progress bar */}
      <div className="sm:hidden mb-4 space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-emerald-700">
            Bước {currentStep}/3: {STEPS[currentStep - 1].title}
          </span>
          <span className="text-slate-400 font-medium">
            {STEPS[currentStep - 1].desc}
          </span>
        </div>
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-emerald-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop / tablet step breadcrumb */}
      <div className="hidden sm:grid grid-cols-3 gap-3">
        {STEPS.map(({ step, title, desc }) => {
          const isCurrent = currentStep === step;
          const isDone = isStepComplete(step) && currentStep > step;
          const canClick = isStepComplete((step - 1) as 1 | 2) || step <= currentStep;

          return (
            <button
              key={step}
              type="button"
              disabled={!canClick || !onSelectStep}
              onClick={() => onSelectStep && canClick && onSelectStep(step)}
              className={`text-left p-3 rounded-2xl border transition-all text-sm flex items-center gap-3 ${
                isCurrent
                  ? 'bg-emerald-50/70 border-emerald-500 shadow-2xs ring-1 ring-emerald-500/20'
                  : isDone
                  ? 'bg-white border-slate-200 hover:border-slate-300'
                  : 'bg-slate-50/50 border-slate-200/60 opacity-60'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-bold text-xs transition-all ${
                  isDone
                    ? 'bg-emerald-600 text-white'
                    : isCurrent
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {isDone ? <Check className="w-4 h-4 stroke-[2.5]" /> : step}
              </div>
              <div className="min-w-0">
                <p
                  className={`font-semibold truncate text-xs ${
                    isCurrent ? 'text-emerald-900' : 'text-slate-800'
                  }`}
                >
                  {title}
                </p>
                <p className="text-[11px] text-slate-500 truncate">{desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
