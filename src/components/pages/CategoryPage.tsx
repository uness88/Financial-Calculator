import React from 'react';
import { CategoryDefinition, CATEGORIES } from '../../config/categories';
import { getCalculatorsByCategory } from '../../data/calculatorRegistry';
import { Breadcrumbs } from '../layout/Breadcrumbs';
import { ArrowRight, Calculator, PiggyBank, Home, Percent, TrendingUp, Sparkles, BookOpen } from 'lucide-react';
import { HowToUseArticleSection } from '../common/HowToUseArticleSection';
import { CATEGORY_GUIDES } from '../../data/pageGuides';

interface CategoryPageProps {
  category: CategoryDefinition;
  onSelectCalculator: (slug: string) => void;
  onSelectCategory: (categorySlug: string) => void;
  onNavigateHome: () => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  category,
  onSelectCalculator,
  onSelectCategory,
  onNavigateHome,
}) => {
  const calculators = getCalculatorsByCategory(category.slug);

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'general-finance-calculators':
        return <Percent className="w-6 h-6 text-emerald-600" />;
      case 'retirement-calculators':
        return <PiggyBank className="w-6 h-6 text-amber-600" />;
      case 'loan-mortgage-calculators':
        return <Home className="w-6 h-6 text-blue-600" />;
      case 'stock-investing-calculators':
        return <TrendingUp className="w-6 h-6 text-indigo-600" />;
      default:
        return <Calculator className="w-6 h-6 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Home', onClick: onNavigateHome },
          { label: category.name },
        ]}
      />

      {/* Category Hero Header */}
      <div className="rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950 text-white p-6 sm:p-10 border border-stone-800 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-white/10 text-emerald-400 border border-white/10">
            {getCategoryIcon(category.id)}
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300">
            {category.calculatorsCount} Financial Models
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
          {category.name}
        </h1>

        <p className="text-sm sm:text-base text-stone-300 max-w-2xl leading-relaxed">
          {category.longDescription}
        </p>
      </div>

      {/* Grid of Calculators in this Category */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-900 tracking-tight">
            All {category.name}
          </h2>
          <span className="text-xs text-stone-500 font-medium">
            Showing {calculators.length} Tools
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {calculators.map((calc) => (
            <button
              key={calc.slug}
              id={`cat-page-calc-${calc.slug}`}
              onClick={() => onSelectCalculator(calc.slug)}
              className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-emerald-400 transition-all text-left flex flex-col justify-between group cursor-pointer"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                    {calc.inputs.length} Parameter{calc.inputs.length !== 1 ? 's' : ''}
                  </span>
                  {calc.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                      {calc.badge}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-stone-900 text-sm group-hover:text-emerald-950 line-clamp-1">
                  {calc.name}
                </h3>
                <p className="text-xs text-stone-500 line-clamp-3 leading-relaxed">
                  {calc.shortDescription}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
                <span>Launch Model</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Comprehensive Category How-To Guide */}
      {CATEGORY_GUIDES[category.slug] && (
        <HowToUseArticleSection article={CATEGORY_GUIDES[category.slug]} />
      )}

      {/* Explore Other Categories */}
      <div className="pt-6 border-t border-stone-200 space-y-4">
        <h3 className="text-sm font-bold text-stone-900 tracking-tight">
          Explore Other Financial Categories
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {CATEGORIES.filter((c) => c.slug !== category.slug).map((c) => (
            <button
              key={c.id}
              onClick={() => onSelectCategory(c.slug)}
              className="p-3.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-left transition-colors cursor-pointer group flex items-center justify-between"
            >
              <span className="text-xs font-semibold text-stone-800 group-hover:text-emerald-900">
                {c.name}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-600 transition-transform" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
