import React from 'react';

interface ParameterControlProps {
  label: string;
  symbol: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (val: number) => void;
  accentColor?: 'sky' | 'amber' | 'emerald' | 'slate';
  helperText?: string;
  isPresentationMode?: boolean;
}

export const ParameterControl: React.FC<ParameterControlProps> = ({
  label,
  symbol,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
  accentColor = 'sky',
  helperText,
  isPresentationMode = false,
}) => {
  const accentClasses = {
    sky: 'accent-sky-600 focus:ring-sky-500 border-sky-200',
    amber: 'accent-amber-600 focus:ring-amber-500 border-amber-200',
    emerald: 'accent-emerald-600 focus:ring-emerald-500 border-emerald-200',
    slate: 'accent-slate-700 focus:ring-slate-500 border-slate-200',
  }[accentColor];

  const symbolBadgeColor = {
    sky: 'text-sky-700',
    amber: 'text-amber-700',
    emerald: 'text-emerald-700',
    slate: 'text-slate-700',
  }[accentColor];

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseFloat(e.target.value);
    if (!Number.isNaN(parsed)) {
      onChange(parsed);
    }
  };

  return (
    <div className="py-2.5 border-b border-slate-100 last:border-b-0">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <label className={`font-medium text-slate-800 ${isPresentationMode ? 'text-base' : 'text-sm'}`}>
          {label}{' '}
          <span className={`font-mono font-semibold ${symbolBadgeColor}`}>
            ({symbol})
          </span>
        </label>
        <div className="flex items-center gap-1.5 shrink-0">
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={handleNumberInput}
            aria-label={`${label} (${symbol}) en ${unit}`}
            className={`w-20 px-2 py-1 text-right font-mono font-semibold text-slate-900 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-2 ${accentClasses} tabular-nums ${
              isPresentationMode ? 'text-base' : 'text-xs'
            }`}
          />
          <span className={`font-mono text-slate-500 w-5 ${isPresentationMode ? 'text-sm' : 'text-xs'}`}>
            {unit}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[11px] font-mono text-slate-400 tabular-nums shrink-0">
          {min}{unit}
        </span>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={Math.min(Math.max(value, min), max)}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          aria-label={`Deslizador ${label}`}
          className={`w-full h-2 bg-slate-200 rounded-lg cursor-pointer ${accentClasses}`}
        />
        <span className="text-[11px] font-mono text-slate-400 tabular-nums shrink-0">
          {max}{unit}
        </span>
      </div>

      {helperText && (
        <p className="mt-1 text-xs text-slate-500">{helperText}</p>
      )}
    </div>
  );
};
