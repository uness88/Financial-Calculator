import React, { useState } from 'react';
import { CATEGORIES } from '../../config/categories';
import { ALL_CALCULATORS, searchCalculators } from '../../data/calculatorRegistry';
import { CURRENT_RULES } from '../../config/financialRules';
import {
  Calculator,
  Search,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  PiggyBank,
  Home,
  Percent,
  Sparkles,
  BookOpen,
  Filter,
} from 'lucide-react';
import { CalculatorDefinition } from '../../types/calculator';
import { HowToUseArticleSection } from '../common/HowToUseArticleSection';
import { SITEWIDE_PAGE_GUIDES } from '../../data/pageGuides';

interface HomePageProps {
  onSelectCalculator: (slug: string) => void;
  onSelectCategory: (categorySlug: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectCalculator,
  onSelectCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const featuredSlugs = [
    'compound-interest-calculator',
    'mortgage-calculator',
    '401k-calculator',
    'black-scholes-calculator',
    'savings-goal-calculator',
    'extra-payment-calculator',
    'backdoor-roth-calculator',
    'dividend-growth-calculator',
  ];

  const featuredCalculators = featuredSlugs
    .map((s) => ALL_CALCULATORS.find((c) => c.slug === s))
    .filter((c): c is CalculatorDefinition => Boolean(c));

  const filteredCalculators = searchCalculators(searchQuery).filter((c) =>
    selectedCategory === 'all' ? true : c.category === selectedCategory
  );

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'general-finance-calculators':
        return <Percent className="w-5 h-5 text-emerald-600" />;
      case 'retirement-calculators':
        return <PiggyBank className="w-5 h-5 text-amber-600" />;
      case 'loan-mortgage-calculators':
        return <Home className="w-5 h-5 text-blue-600" />;
      case 'stock-investing-calculators':
        return <TrendingUp className="w-5 h-5 text-indigo-600" />;
      default:
        return <Calculator className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Hero Authority Section */}
      <section className="relative rounded-3xl bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 text-white p-6 sm:p-10 lg:p-12 overflow-hidden shadow-xl border border-stone-800">
        <div className="relative z-10 max-w-3xl space-y-5">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Institutional-Grade <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Financial Calculators
            </span>
          </h1>

          <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-2xl">
            Explore 56 mathematically verified financial engines spanning compound interest, retirement planning, mortgages, and equity options. Every model is backed by formulas, variable definitions, and educational breakdowns.
          </p>

          {/* Search Box inside Hero */}
          <div className="pt-2 max-w-xl">
            <div className="relative flex items-center bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-inner p-1.5 focus-within:bg-white focus-within:text-stone-900 focus-within:border-emerald-500 transition-all">
              <Search className="w-5 h-5 text-stone-400 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search calculators (e.g., 401k, Amortization, Black-Scholes, Roth IRA)..."
                className="w-full bg-transparent px-3 py-2 text-sm text-white focus:text-stone-900 placeholder:text-stone-400 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* 2. Four Core Categories Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">
            Browse by Financial Category
          </h2>
          <span className="text-xs text-stone-500 font-medium">56 Total Planning Engines</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              id={`home-cat-card-${cat.slug}`}
              onClick={() => onSelectCategory(cat.slug)}
              className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-emerald-400 transition-all text-left flex flex-col justify-between group cursor-pointer"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-stone-50 group-hover:bg-emerald-50 text-stone-700 group-hover:text-emerald-700 transition-colors">
                    {getCategoryIcon(cat.id)}
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 group-hover:bg-emerald-100 group-hover:text-emerald-800">
                    {cat.calculatorsCount} Tools
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-stone-900 text-sm group-hover:text-emerald-950">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
                <span>View Category</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Featured & High-Volume Engines */}
      {!searchQuery && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Featured Financial Tools
              </h2>
              <p className="text-xs text-stone-500">Most utilized planning & valuation calculators</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredCalculators.map((calc) => (
              <button
                key={calc.slug}
                id={`featured-calc-${calc.slug}`}
                onClick={() => onSelectCalculator(calc.slug)}
                className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-emerald-400 transition-all text-left flex flex-col justify-between group cursor-pointer"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                      {calc.category.split('-')[0]}
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
                  <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                    {calc.shortDescription}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
                  <span>Calculate Now</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 4. Complete 56 Calculator Directory with Filters */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
          <div>
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">
              {searchQuery ? `Search Results (${filteredCalculators.length})` : 'Full Financial Suite Directory'}
            </h2>
            <p className="text-xs text-stone-500">
              Browse all 56 calculators across general finance, retirement, debt, and equities
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              All Tools (56)
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.slug
                    ? 'bg-emerald-700 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat.shortName}
              </button>
            ))}
          </div>
        </div>

        {filteredCalculators.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-stone-200 space-y-3">
            <Calculator className="w-10 h-10 text-stone-300 mx-auto" />
            <p className="text-sm font-semibold text-stone-800">No calculators found matching your query.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-xs font-semibold text-emerald-700 underline cursor-pointer"
            >
              Reset filters & search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredCalculators.map((calc) => (
              <button
                key={calc.slug}
                id={`dir-calc-${calc.slug}`}
                onClick={() => onSelectCalculator(calc.slug)}
                className="p-4 rounded-xl bg-white border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all text-left flex items-start justify-between gap-3 group cursor-pointer"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-stone-900 text-xs group-hover:text-emerald-950">
                      {calc.name}
                    </h3>
                    {calc.badge && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-stone-100 text-stone-600">
                        {calc.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                    {calc.shortDescription}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5 shrink-0 mt-1" />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Comprehensive Platform User Guide Article */}
      <HowToUseArticleSection article={SITEWIDE_PAGE_GUIDES.home} />

      {/* 5. 2026 IRS Rules & Planning Reference Card */}
      <section className="bg-stone-50 rounded-2xl border border-stone-200/90 p-6 space-y-4">
        <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>2026 Key Financial & IRS Planning Thresholds</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="p-3 bg-white rounded-xl border border-stone-200">
            <span className="text-stone-500 block text-[11px]">401(k) Employee Max</span>
            <strong className="text-stone-900 text-sm font-extrabold">${CURRENT_RULES.limit401k.toLocaleString('en-US')}</strong>
          </div>
          <div className="p-3 bg-white rounded-xl border border-stone-200">
            <span className="text-stone-500 block text-[11px]">401(k) Age 50+ Catch-up</span>
            <strong className="text-stone-900 text-sm font-extrabold">+${CURRENT_RULES.catchUp401k.toLocaleString('en-US')}</strong>
          </div>
          <div className="p-3 bg-white rounded-xl border border-stone-200">
            <span className="text-stone-500 block text-[11px]">IRA Contribution Limit</span>
            <strong className="text-stone-900 text-sm font-extrabold">${CURRENT_RULES.iraContributionLimit.toLocaleString('en-US')}</strong>
          </div>
          <div className="p-3 bg-white rounded-xl border border-stone-200">
            <span className="text-stone-500 block text-[11px]">HSA Family Contribution</span>
            <strong className="text-stone-900 text-sm font-extrabold">${CURRENT_RULES.hsaFamilyLimit.toLocaleString('en-US')}</strong>
          </div>
          <div className="p-3 bg-white rounded-xl border border-stone-200">
            <span className="text-stone-500 block text-[11px]">Standard Deduction (Joint)</span>
            <strong className="text-stone-900 text-sm font-extrabold">${CURRENT_RULES.standardDeductionMarriedJoint.toLocaleString('en-US')}</strong>
          </div>
          <div className="p-3 bg-white rounded-xl border border-stone-200">
            <span className="text-stone-500 block text-[11px]">RMD Starting Age</span>
            <strong className="text-stone-900 text-sm font-extrabold">Age {CURRENT_RULES.rmdStartingAge}</strong>
          </div>
        </div>
      </section>
    </div>
  );
};
