import { CategorySlug } from '../types/calculator';

export interface CategoryDefinition {
  id: CategorySlug;
  slug: CategorySlug;
  name: string;
  shortName: string;
  description: string;
  longDescription: string;
  calculatorsCount: number;
  iconName: string;
  color: string;
  metaTitle: string;
  metaDescription: string;
  popularCalculatorSlugs: string[];
}

export const CATEGORIES: CategoryDefinition[] = [
  {
    id: 'finance-investment',
    slug: 'finance-investment',
    name: 'General Finance & Investment',
    shortName: 'Finance',
    description: 'Master wealth growth, compound interest, ROI, NPV, IRR, bond valuations, and savings goals.',
    longDescription: 'Comprehensive financial modeling tools for time value of money, compound interest, discounted cash flow (NPV/IRR), bond yields, inflation adjustments, and college savings growth.',
    calculatorsCount: 14,
    iconName: 'TrendingUp',
    color: 'emerald',
    metaTitle: 'Finance & Investment Calculators - Free Wealth & Growth Tools',
    metaDescription: 'Free online financial and investment calculators for compound interest, ROI, NPV, IRR, bonds, TVM, savings goals, CDs, and wealth accumulation.',
    popularCalculatorSlugs: [
      'compound-interest-calculator',
      'tvm-calculator',
      'roi-calculator',
      'npv-irr-calculator',
      'bond-yield-calculator',
      'savings-goal-calculator',
    ],
  },
  {
    id: 'retirement-calculators',
    slug: 'retirement-calculators',
    name: 'Retirement & Pension',
    shortName: 'Retirement',
    description: '401(k) employer matches, Roth IRA conversions, Social Security optimization, and RMD schedules.',
    longDescription: 'Plan your retirement runway with institutional precision. Model 401(k) compounding, employer matching tiers, Roth vs Traditional IRA tax advantages, Social Security distribution strategies, and SECURE 2.0 RMDs.',
    calculatorsCount: 14,
    iconName: 'ShieldCheck',
    color: 'amber',
    metaTitle: 'Retirement Calculators - 401(k), IRA, Social Security & RMD Tools',
    metaDescription: 'Calculate retirement readiness, 401(k) employer matches, Roth vs Traditional IRA advantages, Social Security distribution, and RMD schedules.',
    popularCalculatorSlugs: [
      '401k-calculator',
      'roth-vs-traditional-calculator',
      'social-security-calculator',
      'rmd-calculator',
      'backdoor-roth-calculator',
      'fire-calculator',
    ],
  },
  {
    id: 'loan-mortgage-calculators',
    slug: 'loan-mortgage-calculators',
    name: 'Loans & Mortgages',
    shortName: 'Mortgages & Loans',
    description: 'Mortgage payments, amortization tables, refinance savings, true APR, and debt payoffs.',
    longDescription: 'Make informed borrowing decisions with interactive amortization schedules, refinance break-even models, APR comparisons under Truth in Lending Act (TILA), and debt avalanche/snowball payoff engines.',
    calculatorsCount: 16,
    iconName: 'Home',
    color: 'blue',
    metaTitle: 'Loan & Mortgage Calculators - Amortization, Refinance & APR Tools',
    metaDescription: 'Free loan and mortgage calculators with interactive amortization schedules, refinance analysis, APR breakdowns, and rent vs buy evaluations.',
    popularCalculatorSlugs: [
      'mortgage-calculator',
      'amortization-schedule-calculator',
      'refinance-calculator',
      'extra-payment-calculator',
      'apr-loan-calculator',
      'debt-payoff-calculator',
    ],
  },
  {
    id: 'stock-calculators',
    slug: 'stock-calculators',
    name: 'Stocks & Equities',
    shortName: 'Stocks & Trading',
    description: 'Black-Scholes option pricing, CAPM expected return, WACC hurdle rates, and technical pivots.',
    longDescription: 'Quantitative equity valuation and trading tools. Calculate Black-Scholes European option pricing with all five Greeks, CAPM required returns, Gordon growth dividend models, corporate WACC, and Fibonacci retracements.',
    calculatorsCount: 12,
    iconName: 'LineChart',
    color: 'indigo',
    metaTitle: 'Stock Calculators - CAPM, Black-Scholes, WACC & Return Models',
    metaDescription: 'Quantitative stock calculators for option valuation (Black-Scholes), Capital Asset Pricing Model (CAPM), WACC, dividend growth, and technical levels.',
    popularCalculatorSlugs: [
      'black-scholes-calculator',
      'stock-calculator',
      'capm-calculator',
      'wacc-calculator',
      'dividend-growth-calculator',
      'pivot-point-calculator',
    ],
  },
];

export function getCategoryBySlug(slug: string): CategoryDefinition | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
