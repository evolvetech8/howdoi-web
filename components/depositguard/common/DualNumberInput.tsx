'use client';

import React from 'react';

export interface DualNumberPreset {
  label: string;
  value: number;
}

export interface DualNumberInputProps {
  id?: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit: string;
  min: number;
  max: number;
  step?: number;
  presets?: DualNumberPreset[];
  helperText?: string;
  error?: string;
  warning?: string;
  disabled?: boolean;
  className?: string;
  formatDisplay?: (val: number) => string;
}

export default function DualNumberInput({
  id,
  label,
  value,
  onChange,
  unit,
  min,
  max,
  step = 1,
  presets,
  helperText,
  error,
  warning,
  disabled = false,
  className = '',
  formatDisplay,
}: DualNumberInputProps) {
  const displayVal = formatDisplay ? formatDisplay(value) : `${value} ${unit}`;
  const clampedValue = Math.min(Math.max(value, min), max);

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex justify-between items-baseline gap-2">
        <label htmlFor={id} className="text-xs sm:text-sm font-semibold text-slate-800">
          {label}
        </label>
        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200 shadow-2xs">
          {displayVal}
        </span>
      </div>

      {helperText && <p className="text-[11px] text-slate-500 leading-tight">{helperText}</p>}

      <div className="relative">
        <input
          id={id}
          type="number"
          min={min}
          max={max}
          step={step}
          value={isNaN(value) ? '' : value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`w-full pl-3.5 pr-12 py-2.5 rounded-xl border font-semibold text-slate-900 bg-white text-base transition-all focus:outline-none focus:ring-2 ${
            error
              ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-600 bg-rose-50/20'
              : warning
              ? 'border-amber-400 focus:ring-amber-500/20 focus:border-amber-600 bg-amber-50/20'
              : 'border-slate-300 hover:border-slate-400 focus:ring-emerald-500/20 focus:border-emerald-600'
          }`}
        />
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs pointer-events-none select-none">
          {unit}
        </span>
      </div>

      <div className="pt-1.5 px-0.5">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={clampedValue}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={label}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus:outline-none"
        />
        <div className="flex justify-between text-[10px] text-slate-400 pt-1 font-medium">
          <span>{min} {unit}</span>
          <span>{max} {unit}</span>
        </div>
      </div>

      {presets && presets.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {presets.map((p) => {
            const isSelected = value === p.value;
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => onChange(p.value)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      )}

      {error && <p className="text-xs text-rose-600 font-medium pt-0.5">✕ {error}</p>}
      {warning && !error && (
        <p className="text-xs text-amber-800 bg-amber-50/80 border border-amber-200/80 rounded-lg p-2 font-medium">
          ⚠️ {warning}
        </p>
      )}
    </div>
  );
}
