import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Calculator, ArrowRight, Sparkles, TrendingUp, Home, PiggyBank, Percent } from 'lucide-react';
import { ALL_CALCULATORS, searchCalculators } from '../../data/calculatorRegistry';
import { CATEGORIES } from '../../config/categories';
import { CalculatorDefinition } from '../../types/calculator';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCalculator: (slug: string) => void;
  onSelectCategory: (categorySlug: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectCalculator,
  onSelectCategory,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [results, setResults] = useState<CalculatorDefinition[]>(ALL_CALCULATORS.slice(0, 8));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedCategoryFilter('all');
    }
  }, [isOpen]);

  useEffect(() => {
    let filtered = searchCalculators(query);
    if (selectedCategoryFilter !== 'all') {
      filtered = filtered.filter((c) => c.category === selectedCategoryFilter);
    }
    setResults(filtered.slice(0, 10));
  }, [query, selectedCategoryFilter]);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open triggered from outside
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in-50">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-stone-200 gap-3 bg-stone-50/50">
          <Search className="w-5 h-5 text-stone-400 shrink-0" />
          <input
            ref={inputRef}
            id="search-modal-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all 56 financial calculators (e.g. 401k match, compound interest, APR, Black-Scholes)..."
            className="w-full bg-transparent text-stone-900 text-sm placeholder:text-stone-400 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-stone-400 hover:text-stone-600 p-1 rounded-md"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs px-2 py-1 rounded-md bg-stone-200 text-stone-600 hover:bg-stone-300 font-mono"
          >
            ESC
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-stone-100 bg-stone-50 overflow-x-auto text-xs scrollbar-none">
          <button
            onClick={() => setSelectedCategoryFilter('all')}
            className={`px-2.5 py-1 rounded-full font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategoryFilter === 'all'
                ? 'bg-stone-900 text-white'
                : 'bg-stone-200/70 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All (56)
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryFilter(cat.slug)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategoryFilter === cat.slug
                  ? 'bg-emerald-700 text-white'
                  : 'bg-stone-200/70 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {getCategoryIcon(cat.slug)}
              <span>{cat.shortName}</span>
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-1 flex-1">
          {results.length === 0 ? (
            <div className="py-12 text-center text-stone-500 space-y-2">
              <Calculator className="w-8 h-8 mx-auto text-stone-300" />
              <p className="text-sm font-medium">No financial calculators match "{query}"</p>
              <p className="text-xs text-stone-400">Try searching for keywords like "mortgage", "tax", "pension", or "bond".</p>
            </div>
          ) : (
            results.map((calc) => (
              <button
                key={calc.slug}
                id={`search-result-${calc.slug}`}
                onClick={() => {
                  onSelectCalculator(calc.slug);
                  onClose();
                }}
                className="w-full flex items-start justify-between p-3 rounded-xl hover:bg-emerald-50/80 group transition-all text-left cursor-pointer border border-transparent hover:border-emerald-200"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-2 rounded-lg bg-stone-100 group-hover:bg-white text-stone-700 group-hover:text-emerald-700 group-hover:shadow-xs transition-all shrink-0">
                    {getCategoryIcon(calc.category)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-stone-900 group-hover:text-emerald-950">
                        {calc.name}
                      </span>
                      {calc.badge && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-600 group-hover:bg-emerald-100 group-hover:text-emerald-800">
                          {calc.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 line-clamp-1 mt-0.5 group-hover:text-stone-700">
                      {calc.shortDescription}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5 shrink-0 mt-2" />
              </button>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-stone-50 border-t border-stone-200 text-xs text-stone-600 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            Showing {results.length} calculator{results.length !== 1 ? 's' : ''}
          </span>
          <span className="text-[11px] text-stone-600">Press ↵ Enter to select</span>
        </div>
      </div>
    </div>
  );
};
