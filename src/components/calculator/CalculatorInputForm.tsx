import React from 'react';
import { InputFieldDef } from '../../types/calculator';
import { HelpCircle, RefreshCw, Plus, Minus, DollarSign, Percent } from 'lucide-react';

interface CalculatorInputFormProps {
  inputsConfig: InputFieldDef[];
  values: Record<string, any>;
  onChange: (id: string, value: any) => void;
  onReset: () => void;
}

export const CalculatorInputForm: React.FC<CalculatorInputFormProps> = ({
  inputsConfig,
  values,
  onChange,
  onReset,
}) => {
  const handleNumberChange = (id: string, rawVal: string, min?: number, max?: number) => {
    if (rawVal === '') {
      onChange(id, '');
      return;
    }
    let num = parseFloat(rawVal.replace(/,/g, ''));
    if (isNaN(num)) return;
    if (min !== undefined && num < min) num = min;
    if (max !== undefined && num > max) num = max;
    onChange(id, num);
  };

  const handleStep = (id: string, currentVal: number, step: number, min?: number, max?: number) => {
    let next = (Number(currentVal) || 0) + step;
    if (min !== undefined && next < min) next = min;
    if (max !== undefined && next > max) next = max;
    onChange(id, Math.round(next * 100) / 100);
  };

  const getStepForInput = (config: InputFieldDef): number => {
    if (config.step) return config.step;
    if (config.type === 'currency') {
      const val = Number(values[config.id]) || 0;
      if (val >= 100000) return 5000;
      if (val >= 10000) return 1000;
      if (val >= 1000) return 100;
      return 10;
    }
    if (config.type === 'percentage') return 0.25;
    if (config.type === 'years') return 1;
    if (config.type === 'months') return 6;
    return 1;
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-5 sm:p-6 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div>
          <h2 className="text-base font-bold text-stone-900 tracking-tight">Parameters & Inputs</h2>
          <p className="text-xs text-stone-600">Adjust values to recalculate in real time</p>
        </div>
        <button
          id="btn-reset-inputs"
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 px-2.5 py-1 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
          title="Reset to default values"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      <div className="space-y-4">
        {inputsConfig.map((config) => {
          if (config.conditionalShow && !config.conditionalShow(values)) {
            return null;
          }

          const val = values[config.id] !== undefined ? values[config.id] : config.defaultValue;
          const step = getStepForInput(config);

          return (
            <div key={config.id} className="space-y-1.5 group">
              {/* Input Label & Help */}
              <div className="flex items-center justify-between text-xs">
                <label
                  htmlFor={`input-${config.id}`}
                  className="font-semibold text-stone-700 flex items-center gap-1.5"
                >
                  {config.label}
                  {config.helpText && (
                    <span
                      className="text-stone-400 hover:text-stone-600 cursor-help"
                      title={config.helpText}
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </span>
                  )}
                </label>
              </div>

              {/* Input Field Control */}
              {config.type === 'select' ? (
                <select
                  id={`input-${config.id}`}
                  value={val}
                  onChange={(e) => onChange(config.id, e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50/80 border border-stone-300 rounded-xl text-stone-900 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-all cursor-pointer"
                >
                  {config.options?.map((opt: { label: string; value: string | number }) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : config.type === 'boolean' ? (
                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => onChange(config.id, !val)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                      val ? 'bg-emerald-600' : 'bg-stone-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        val ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span className="text-xs text-stone-700 font-medium">
                    {val ? 'Enabled / Yes' : 'Disabled / No'}
                  </span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="relative flex items-center rounded-xl shadow-2xs">
                    {/* Left Icon Adornment */}
                    {config.type === 'currency' && (
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                        <DollarSign className="w-4 h-4" />
                      </div>
                    )}
                    {config.type === 'percentage' && (
                      <div className="absolute inset-y-0 right-16 pr-3 flex items-center pointer-events-none text-stone-400">
                        <Percent className="w-3.5 h-3.5" />
                      </div>
                    )}
                    {(config.type === 'years' || config.type === 'months') && (
                      <div className="absolute inset-y-0 right-16 pr-3 flex items-center pointer-events-none text-stone-400 text-xs font-medium">
                        {config.type === 'years' ? 'yrs' : 'mos'}
                      </div>
                    )}

                    <input
                      id={`input-${config.id}`}
                      type="number"
                      step={step}
                      min={config.min}
                      max={config.max}
                      value={val === '' ? '' : val}
                      onChange={(e) => handleNumberChange(config.id, e.target.value, config.min, config.max)}
                      className={`w-full py-2 bg-stone-50/70 border border-stone-300 rounded-xl text-stone-900 text-sm font-semibold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-all ${
                        config.type === 'currency' ? 'pl-8 pr-16' : 'pl-3.5 pr-16'
                      }`}
                    />

                    {/* Step Quick Controls */}
                    <div className="absolute right-1 inset-y-1 flex items-center gap-0.5">
                      <button
                        type="button"
                        onClick={() => handleStep(config.id, Number(val) || 0, -step, config.min, config.max)}
                        className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-200/80 transition-colors cursor-pointer"
                        title={`Decrease by ${step}`}
                        aria-label={`Decrease ${config.label} by ${step}`}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStep(config.id, Number(val) || 0, step, config.min, config.max)}
                        className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-200/80 transition-colors cursor-pointer"
                        title={`Increase by ${step}`}
                        aria-label={`Increase ${config.label} by ${step}`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Slider Control for standard ranges */}
                  {config.min !== undefined && config.max !== undefined && (
                    <div className="pt-0.5 px-1">
                      <input
                        type="range"
                        min={config.min}
                        max={config.max}
                        step={step}
                        value={Number(val) || config.min}
                        onChange={(e) => onChange(config.id, parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                      />
                      <div className="flex justify-between text-[10px] text-stone-600 font-mono">
                        <span>{config.type === 'currency' ? `$${config.min.toLocaleString('en-US')}` : `${config.min}${config.type === 'percentage' ? '%' : ''}`}</span>
                        <span>{config.type === 'currency' ? `$${config.max.toLocaleString('en-US')}` : `${config.max}${config.type === 'percentage' ? '%' : ''}`}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
