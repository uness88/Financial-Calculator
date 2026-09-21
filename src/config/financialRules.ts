/**
 * Configurable Financial Rules, Contribution Limits, and Tax Thresholds
 * Easily updateable for tax years (2025, 2026, 2027+) without altering core calculator logic.
 */

export interface TaxYearConfig {
  year: number;
  iraContributionLimit: number;
  iraCatchUpLimit: number; // Age 50+
  limit401k: number;
  catchUp401k: number; // Age 50-59 & 64+
  superCatchUp401k: number; // SECURE 2.0: Age 60, 61, 62, 63
  hsaSingleLimit: number;
  hsaFamilyLimit: number;
  hsaCatchUpLimit: number; // Age 55+
  standardDeductionSingle: number;
  standardDeductionMarriedJoint: number;
  standardDeductionHeadOfHousehold: number;
  socialSecurityWageBase: number;
  fullRetirementAgeMonths: number; // For people born 1960 or later = 67 (804 months)
  rmdStartingAge: number; // 73 for born 1951-1959; 75 for born 1960+
}

export const FINANCIAL_RULES_BY_YEAR: Record<number, TaxYearConfig> = {
  2025: {
    year: 2025,
    iraContributionLimit: 7000,
    iraCatchUpLimit: 1000,
    limit401k: 23500,
    catchUp401k: 7500,
    superCatchUp401k: 11250,
    hsaSingleLimit: 4300,
    hsaFamilyLimit: 8550,
    hsaCatchUpLimit: 1000,
    standardDeductionSingle: 15000,
    standardDeductionMarriedJoint: 30000,
    standardDeductionHeadOfHousehold: 22500,
    socialSecurityWageBase: 176100,
    fullRetirementAgeMonths: 67 * 12,
    rmdStartingAge: 73,
  },
  2026: {
    year: 2026,
    iraContributionLimit: 7000,
    iraCatchUpLimit: 1000,
    limit401k: 23500,
    catchUp401k: 7500,
    superCatchUp401k: 11250,
    hsaSingleLimit: 4300,
    hsaFamilyLimit: 8550,
    hsaCatchUpLimit: 1000,
    standardDeductionSingle: 15700,
    standardDeductionMarriedJoint: 31400,
    standardDeductionHeadOfHousehold: 23550,
    socialSecurityWageBase: 181800,
    fullRetirementAgeMonths: 67 * 12,
    rmdStartingAge: 73,
  },
  2027: {
    year: 2027,
    iraContributionLimit: 7500,
    iraCatchUpLimit: 1000,
    limit401k: 24000,
    catchUp401k: 8000,
    superCatchUp401k: 12000,
    hsaSingleLimit: 4450,
    hsaFamilyLimit: 8850,
    hsaCatchUpLimit: 1000,
    standardDeductionSingle: 16200,
    standardDeductionMarriedJoint: 32400,
    standardDeductionHeadOfHousehold: 24300,
    socialSecurityWageBase: 188000,
    fullRetirementAgeMonths: 67 * 12,
    rmdStartingAge: 75,
  },
};

export const CURRENT_TAX_YEAR = 2026;
export const CURRENT_RULES = FINANCIAL_RULES_BY_YEAR[CURRENT_TAX_YEAR];

/**
 * IRS Uniform Lifetime Table (Table III) for calculating RMDs
 * Maps owner age to distribution period (life expectancy factor in years)
 */
export const IRS_UNIFORM_LIFETIME_TABLE: Record<number, number> = {
  72: 27.4,
  73: 26.5,
  74: 25.5,
  75: 24.6,
  76: 23.7,
  77: 22.9,
  78: 22.0,
  79: 21.1,
  80: 20.2,
  81: 19.4,
  82: 18.5,
  83: 17.7,
  84: 16.8,
  85: 16.0,
  86: 15.2,
  87: 14.4,
  88: 13.7,
  89: 12.9,
  90: 12.2,
  91: 11.5,
  92: 10.8,
  93: 10.1,
  94: 9.5,
  95: 8.9,
  96: 8.4,
  97: 7.8,
  98: 7.3,
  99: 6.8,
  100: 6.4,
  101: 6.0,
  102: 5.6,
  103: 5.2,
  104: 4.9,
  105: 4.6,
  106: 4.3,
  107: 4.1,
  108: 3.9,
  109: 3.7,
  110: 3.5,
  111: 3.4,
  112: 3.3,
  113: 3.1,
  114: 3.0,
  115: 2.9,
  120: 2.0,
};

/**
 * Common fiat currency exchange rates (against USD baseline).
 * Kept resilient with live-updating fallback timestamp.
 */
export const INITIAL_CURRENCY_RATES: Record<string, { rate: number; name: string; symbol: string }> = {
  USD: { rate: 1.0, name: 'US Dollar', symbol: '$' },
  EUR: { rate: 0.92, name: 'Euro', symbol: '€' },
  GBP: { rate: 0.79, name: 'British Pound', symbol: '£' },
  CAD: { rate: 1.36, name: 'Canadian Dollar', symbol: 'CA$' },
  AUD: { rate: 1.52, name: 'Australian Dollar', symbol: 'A$' },
  JPY: { rate: 154.5, name: 'Japanese Yen', symbol: '¥' },
  CHF: { rate: 0.89, name: 'Swiss Franc', symbol: 'CHF' },
  INR: { rate: 83.9, name: 'Indian Rupee', symbol: '₹' },
  NZD: { rate: 1.64, name: 'New Zealand Dollar', symbol: 'NZ$' },
  SGD: { rate: 1.34, name: 'Singapore Dollar', symbol: 'S$' },
  HKD: { rate: 7.81, name: 'Hong Kong Dollar', symbol: 'HK$' },
  MXN: { rate: 18.2, name: 'Mexican Peso', symbol: 'Mex$' },
};
