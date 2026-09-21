import { CalculatorDefinition } from '../types/calculator';
import { FINANCE_CALCULATORS } from './calculators/financeCalculators';
import { RETIREMENT_CALCULATORS } from './calculators/retirementCalculators';
import { LOAN_CALCULATORS } from './calculators/loanCalculators';
import { STOCK_CALCULATORS } from './calculators/stockCalculators';

// All 56 financial calculators combined
export const ALL_CALCULATORS: CalculatorDefinition[] = [
  ...FINANCE_CALCULATORS,
  ...RETIREMENT_CALCULATORS,
  ...LOAN_CALCULATORS,
  ...STOCK_CALCULATORS,
];

// Lookup map by slug for O(1) retrieval
export const CALCULATOR_MAP: Record<string, CalculatorDefinition> = ALL_CALCULATORS.reduce(
  (acc, calc) => {
    acc[calc.slug] = calc;
    return acc;
  },
  {} as Record<string, CalculatorDefinition>
);

export function getCalculatorBySlug(slug: string): CalculatorDefinition | undefined {
  return CALCULATOR_MAP[slug];
}

export function getCalculatorsByCategory(categorySlug: string): CalculatorDefinition[] {
  return ALL_CALCULATORS.filter((c) => c.category === categorySlug);
}

export function getRelatedCalculators(calc: CalculatorDefinition): CalculatorDefinition[] {
  if (!calc.relatedCalculatorSlugs || calc.relatedCalculatorSlugs.length === 0) {
    return getCalculatorsByCategory(calc.category)
      .filter((c) => c.slug !== calc.slug)
      .slice(0, 4);
  }

  const related = calc.relatedCalculatorSlugs
    .map((slug) => CALCULATOR_MAP[slug])
    .filter((c): c is CalculatorDefinition => Boolean(c));

  if (related.length < 4) {
    const fallback = getCalculatorsByCategory(calc.category)
      .filter((c) => c.slug !== calc.slug && !calc.relatedCalculatorSlugs.includes(c.slug));
    return [...related, ...fallback].slice(0, 4);
  }

  return related;
}

export function searchCalculators(query: string): CalculatorDefinition[] {
  if (!query || query.trim() === '') return ALL_CALCULATORS;
  const q = query.toLowerCase().trim();

  return ALL_CALCULATORS.filter((calc) => {
    return (
      calc.name.toLowerCase().includes(q) ||
      calc.shortDescription.toLowerCase().includes(q) ||
      calc.keywords.some((k) => k.toLowerCase().includes(q)) ||
      calc.slug.toLowerCase().includes(q)
    );
  });
}
