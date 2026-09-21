import React from 'react';
import { CalculatorDefinition } from '../../types/calculator';
import { ArrowRight, Calculator, TrendingUp, PiggyBank, Home, Percent } from 'lucide-react';

interface RelatedCalculatorsProps {
  calculators: CalculatorDefinition[];
  onSelectCalculator: (slug: string) => void;
}

export const RelatedCalculators: React.FC<RelatedCalculatorsProps> = ({
  calculators,
  onSelectCalculator,
}) => {
  if (!calculators || calculators.length === 0) return null;

  const getCategoryIcon = (categorySlug: string) => {
    switch (categorySlug) {
      case 'general-finance-calculators':
        return <Percent className="w-3.5 h-3.5 text-emerald-600" />;
      case 'retirement-calculators':
        return <PiggyBank className="w-3.5 h-3.5 text-amber-600" />;
      case 'loan-mortgage-calculators':
        return <Home className="w-3.5 h-3.5 text-blue-600" />;
      case 'stock-investing-calculators':
        return <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />;
      default:
        return <Calculator className="w-3.5 h-3.5 text-emerald-600" />;
    }
  };

  return (
    <section className="space-y-4 pt-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-stone-900 tracking-tight">
          Related Financial Planning Tools
        </h3>
        <span className="text-xs text-stone-500 font-medium">Explore adjacent models</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {calculators.map((calc) => (
          <button
            key={calc.slug}
            id={`related-calc-${calc.slug}`}
            onClick={() => onSelectCalculator(calc.slug)}
            className="p-4 rounded-xl bg-white border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all text-left flex flex-col justify-between group cursor-pointer"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-1.5 rounded-lg bg-stone-100 group-hover:bg-emerald-50 text-stone-700 group-hover:text-emerald-700 transition-colors">
                  {getCategoryIcon(calc.category)}
                </div>
                {calc.badge && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 group-hover:bg-emerald-100 group-hover:text-emerald-800 transition-colors">
                    {calc.badge}
                  </span>
                )}
              </div>
              <h4 className="font-bold text-stone-900 text-xs group-hover:text-emerald-900 line-clamp-1">
                {calc.name}
              </h4>
              <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                {calc.shortDescription}
              </p>
            </div>

            <div className="pt-3 mt-2 border-t border-stone-100 flex items-center justify-between text-[11px] font-medium text-emerald-700">
              <span>Open Tool</span>
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
