export type CategorySlug = 
  | 'finance-investment'
  | 'retirement-calculators'
  | 'loan-mortgage-calculators'
  | 'stock-calculators';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'JPY' | 'CHF';

export interface CategoryInfo {
  id: CategorySlug;
  title: string;
  shortTitle: string;
  description: string;
  iconName: string;
  color: string;
  metaTitle: string;
  metaDescription: string;
}

export type InputFieldType = 
  | 'currency' 
  | 'percentage' 
  | 'number' 
  | 'integer' 
  | 'select' 
  | 'years' 
  | 'months'
  | 'date'
  | 'boolean'
  | 'cashflows';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface InputFieldDef {
  id: string;
  label: string;
  type: InputFieldType;
  defaultValue: number | string | boolean | number[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  helpText?: string;
  placeholder?: string;
  options?: SelectOption[];
  conditionalShow?: (inputs: Record<string, any>) => boolean;
}

export interface CalculationResultMetric {
  id: string;
  label: string;
  value: number | string;
  format: 'currency' | 'percentage' | 'number' | 'text' | 'years';
  isPrimary?: boolean;
  helpText?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

export interface ChartDataPoint {
  label: string;
  [key: string]: string | number;
}

export interface AmortizationRow {
  period: number;
  date?: string;
  payment: number;
  principal: number;
  interest: number;
  extraPayment?: number;
  remainingBalance: number;
  totalInterestPaid: number;
}

export interface CalculationOutput {
  primaryResult: CalculationResultMetric;
  metrics: CalculationResultMetric[];
  summaryText: string;
  chartData?: {
    type: 'pie' | 'bar' | 'area' | 'line';
    title: string;
    data: ChartDataPoint[];
    series: { key: string; name: string; color: string }[];
  };
  amortizationSchedule?: AmortizationRow[];
  yearlySchedule?: AmortizationRow[];
  breakdownItems?: { label: string; amount: number; percentage?: number; color?: string }[];
  insights?: { type: 'tip' | 'warning' | 'info'; title: string; message: string }[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FormulaStep {
  formula: string;
  explanation: string;
  variables: { symbol: string; name: string; description: string }[];
}

export interface ExampleCalculation {
  scenarioTitle: string;
  description: string;
  inputs: Record<string, string | number>;
  stepByStep: string[];
  finalOutcome: string;
}

export interface CalculatorDefinition {
  slug: string; // e.g. "compound-interest-calculator"
  name: string;
  h1Title: string;
  category: CategorySlug;
  badge?: string;
  shortDescription: string;
  longDescription: string;
  seoTitle: string;
  metaDescription: string;
  keywords: string[];
  inputs: InputFieldDef[];
  calculate: (inputs: Record<string, any>) => CalculationOutput;
  formula: FormulaStep;
  howItWorks: string[];
  example: ExampleCalculation;
  whatItMeans: string;
  factorsToConsider: string[];
  faqs: FAQItem[];
  relatedCalculatorSlugs: string[];
  lastUpdated: string;
  methodologyReview: string;
}

export interface GuideItem {
  slug: string;
  title: string;
  category: CategorySlug;
  readingTime: string;
  publishDate: string;
  lastUpdated: string;
  metaTitle: string;
  metaDescription: string;
  summary: string;
  contentMarkdown?: string;
  keyTakeaways: string[];
  relatedCalculatorSlugs: string[];
  relatedGuideSlugs: string[];
}
