import React, { useState, useEffect, useMemo } from 'react';
import { CalculatorDefinition, CalculationOutput } from '../../types/calculator';
import { getCategoryBySlug } from '../../config/categories';
import { getRelatedCalculators } from '../../data/calculatorRegistry';
import { Breadcrumbs } from '../layout/Breadcrumbs';
import { CalculatorInputForm } from '../calculator/CalculatorInputForm';
import { CalculatorResults } from '../calculator/CalculatorResults';
import { AmortizationTable } from '../calculator/AmortizationTable';
import { FormulaExplanation } from '../calculator/FormulaExplanation';
import { RelatedCalculators } from '../calculator/RelatedCalculators';
import { HowToUseArticleSection } from '../common/HowToUseArticleSection';
import { getCalculatorHowToUseArticle } from '../../data/calculatorHowToUse';
import { updateDocumentSEO } from '../../utils/seo';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface CalculatorPageProps {
  calculator: CalculatorDefinition;
  onNavigateHome: () => void;
  onNavigateCategory: (categorySlug: string) => void;
  onSelectCalculator: (slug: string) => void;
  onSaveScenario: (calcSlug: string, calcName: string, inputs: Record<string, any>, output: CalculationOutput) => void;
  isSaved?: boolean;
}

export const CalculatorPage: React.FC<CalculatorPageProps> = ({
  calculator,
  onNavigateHome,
  onNavigateCategory,
  onSelectCalculator,
  onSaveScenario,
  isSaved = false,
}) => {
  const category = getCategoryBySlug(calculator.category);
  const related = useMemo(() => getRelatedCalculators(calculator), [calculator]);

  // Initialize input state from default values
  const defaultValues = useMemo(() => {
    return calculator.inputs.reduce((acc, input) => {
      acc[input.id] = input.defaultValue;
      return acc;
    }, {} as Record<string, any>);
  }, [calculator]);

  const [inputValues, setInputValues] = useState<Record<string, any>>(defaultValues);

  // When calculator changes, reset inputs
  useEffect(() => {
    setInputValues(defaultValues);
  }, [calculator.slug, defaultValues]);

  // Update dynamic SEO tags & JSON-LD
  useEffect(() => {
    updateDocumentSEO(calculator);
  }, [calculator]);

  // Compute live calculation output
  const output: CalculationOutput = useMemo(() => {
    try {
      return calculator.calculate(inputValues);
    } catch (err) {
      console.error('Calculation error for', calculator.slug, err);
      return {
        primaryResult: { id: 'err', label: 'Error', value: 0, format: 'number' },
        metrics: [],
        summaryText: 'An error occurred during calculation. Please check your parameter inputs.',
      };
    }
  }, [calculator, inputValues]);

  const handleInputChange = (id: string, value: any) => {
    setInputValues((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleResetInputs = () => {
    setInputValues(defaultValues);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          { label: 'Home', onClick: onNavigateHome },
          { label: category?.name || 'Category', onClick: () => onNavigateCategory(calculator.category) },
          { label: calculator.name },
        ]}
      />

      {/* Calculator Header / SEO Title Area */}
      <div className="space-y-2 pb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onNavigateCategory(calculator.category)}
            className="text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors cursor-pointer"
          >
            {category?.name}
          </button>
          {calculator.badge && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              {calculator.badge}
            </span>
          )}
          <span className="text-xs text-stone-600 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            2026 Financial Verified
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
          {calculator.h1Title || calculator.name}
        </h1>

        <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-3xl">
          {calculator.longDescription || calculator.shortDescription}
        </p>
      </div>

      {/* Main Interactive Grid: Inputs (Left) & Results (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-5 space-y-4">
          <CalculatorInputForm
            inputsConfig={calculator.inputs}
            values={inputValues}
            onChange={handleInputChange}
            onReset={handleResetInputs}
          />
        </div>

        {/* Right Column: Live Results & Charts */}
        <div className="lg:col-span-7 space-y-4">
          <CalculatorResults
            output={output}
            calculatorName={calculator.name}
            onSaveScenario={() => onSaveScenario(calculator.slug, calculator.name, inputValues, output)}
            isSaved={isSaved}
          />
        </div>
      </div>

      {/* Optional Full-width Amortization / Breakdown Schedule */}
      {(output.amortizationSchedule || output.yearlySchedule) && (
        <AmortizationTable
          monthlySchedule={output.amortizationSchedule}
          yearlySchedule={output.yearlySchedule}
          title={calculator.name.includes('Mortgage') || calculator.name.includes('Loan') ? 'Complete Loan Amortization Schedule' : 'Annual Growth & Compounding Schedule'}
        />
      )}

      {/* Comprehensive Human-Written How-To User Guide */}
      <HowToUseArticleSection article={getCalculatorHowToUseArticle(calculator)} />

      {/* Deep Educational & Formula Breakdown Section */}
      <FormulaExplanation calculator={calculator} />

      {/* Cross-linking Internal Related Calculators */}
      <RelatedCalculators
        calculators={related}
        onSelectCalculator={onSelectCalculator}
      />
    </div>
  );
};
