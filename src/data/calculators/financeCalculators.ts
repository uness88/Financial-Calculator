import { CalculatorDefinition } from '../../types/calculator';
import {
  calculateCompoundInterest,
  calculateTVM,
  calculateROI,
  calculateNPV,
  calculateIRR,
  calculateBond,
  calculateTaxEquivalentYield,
  calculateRuleOf72,
  calculateCollegeSavings,
  calculateMutualFundFeeImpact,
} from '../../math/financeMath';
import { INITIAL_CURRENCY_RATES } from '../../config/financialRules';

export const FINANCE_CALCULATORS: CalculatorDefinition[] = [
  {
    slug: 'tvm-calculator',
    name: 'Time Value of Money (TVM) Calculator',
    h1Title: 'Time Value of Money (TVM) Calculator',
    category: 'finance-investment',
    badge: 'Core Finance',
    shortDescription: 'Solve for Future Value (FV), Present Value (PV), Payment (PMT), Number of Periods (NPER), or Interest Rate.',
    longDescription: 'The Time Value of Money (TVM) calculator is a fundamental financial modeling tool used by financial analysts, investors, and planners to evaluate how monetary values fluctuate over time due to compounding interest, inflation, and periodic cash flows.',
    seoTitle: 'TVM Calculator - Time Value of Money (PV, FV, PMT, Rate)',
    metaDescription: 'Calculate Time Value of Money (TVM) with our free financial tool. Solve for Present Value (PV), Future Value (FV), Payment (PMT), Rate, and Periods.',
    keywords: ['tvm calculator', 'time value of money', 'present value', 'future value', 'pmt calculator', 'financial calculator'],
    inputs: [
      { id: 'mode', label: 'Solve For', type: 'select', defaultValue: 'FV', options: [
        { label: 'Future Value (FV)', value: 'FV' },
        { label: 'Present Value (PV)', value: 'PV' },
        { label: 'Payment (PMT)', value: 'PMT' },
        { label: 'Number of Periods (NPER)', value: 'NPER' },
        { label: 'Interest Rate per Period (RATE)', value: 'RATE' },
      ]},
      { id: 'pv', label: 'Present Value (PV)', type: 'currency', defaultValue: 10000, helpText: 'Initial lump sum (cash outflow is typically negative or positive depending on viewpoint)' },
      { id: 'fv', label: 'Future Value (FV)', type: 'currency', defaultValue: 25000, conditionalShow: (i) => i.mode !== 'FV' },
      { id: 'pmt', label: 'Periodic Payment (PMT)', type: 'currency', defaultValue: 200, conditionalShow: (i) => i.mode !== 'PMT' },
      { id: 'rate', label: 'Annual Interest Rate (%)', type: 'percentage', defaultValue: 7, conditionalShow: (i) => i.mode !== 'RATE' },
      { id: 'nper', label: 'Periods / Years (N)', type: 'number', defaultValue: 10, conditionalShow: (i) => i.mode !== 'NPER' },
      { id: 'timing', label: 'Payment Timing', type: 'select', defaultValue: 0, options: [
        { label: 'End of Period (Ordinary Annuity)', value: 0 },
        { label: 'Beginning of Period (Annuity Due)', value: 1 },
      ]},
    ],
    calculate: (inputs) => {
      const mode = inputs.mode as 'FV' | 'PV' | 'PMT' | 'NPER' | 'RATE';
      const pv = Number(inputs.pv) || 0;
      const fv = Number(inputs.fv) || 0;
      const pmt = Number(inputs.pmt) || 0;
      const rate = Number(inputs.rate) || 0;
      const nper = Number(inputs.nper) || 0;
      const timing = (Number(inputs.timing) || 0) as 0 | 1;

      const solved = calculateTVM(mode, pv, fv, pmt, rate, nper, timing);

      return {
        primaryResult: {
          id: 'solved',
          label: `Calculated ${mode}`,
          value: mode === 'RATE' ? solved : Math.abs(solved),
          format: mode === 'RATE' ? 'percentage' : mode === 'NPER' ? 'number' : 'currency',
          isPrimary: true,
        },
        metrics: [
          { id: 'pv_m', label: 'Present Value', value: mode === 'PV' ? Math.abs(solved) : pv, format: 'currency' },
          { id: 'fv_m', label: 'Future Value', value: mode === 'FV' ? Math.abs(solved) : fv, format: 'currency' },
          { id: 'pmt_m', label: 'Periodic Payment', value: mode === 'PMT' ? Math.abs(solved) : pmt, format: 'currency' },
          { id: 'rate_m', label: 'Interest Rate', value: mode === 'RATE' ? solved : rate, format: 'percentage' },
          { id: 'nper_m', label: 'Total Periods', value: mode === 'NPER' ? solved : nper, format: 'number' },
        ],
        summaryText: `Based on your parameters, the solved ${mode} is ${mode === 'RATE' ? solved.toFixed(2) + '%' : mode === 'NPER' ? solved.toFixed(1) + ' periods' : '$' + Math.abs(solved).toLocaleString('en-US', { minimumFractionDigits: 2 })}.`,
        insights: [
          { type: 'info', title: 'Compounding Impact', message: 'Money available at the present time is worth more than the identical sum in the future due to its potential earning capacity.' }
        ]
      };
    },
    formula: {
      formula: 'FV = PV \\times (1 + r)^n + PMT \\times \\left[ \\frac{(1 + r)^n - 1}{r} \\right]',
      explanation: 'The fundamental TVM formula relates the present value of cash flows to future value under compound interest and periodic stream of equal annuities.',
      variables: [
        { symbol: 'PV', name: 'Present Value', description: 'The starting lump sum amount or today’s purchasing power' },
        { symbol: 'FV', name: 'Future Value', description: 'The value of the asset at a future date after interest growth' },
        { symbol: 'r', name: 'Periodic Rate', description: 'Interest rate per compounding timeframe' },
        { symbol: 'n', name: 'Periods', description: 'Total number of compounding cycles' },
        { symbol: 'PMT', name: 'Payment', description: 'Regular periodic cash inflow or outflow' },
      ],
    },
    howItWorks: [
      'Select the target variable you want to solve for (FV, PV, PMT, NPER, or RATE).',
      'Enter the known values for the remaining financial variables.',
      'Specify payment timing (Ordinary Annuity paid at end vs Annuity Due paid at start).',
      'Instant algebraic and numerical solver determines the exact mathematical result.',
    ],
    example: {
      scenarioTitle: '10-Year Growth on Initial Deposit with Monthly Contributions',
      description: 'An investor deposits $10,000 upfront and adds $200 each year at an expected 7% annual interest over 10 years.',
      inputs: { 'Present Value': '$10,000', 'Annual Payment': '$200', 'Interest Rate': '7%', 'Periods': '10 Years' },
      stepByStep: [
        'Compute future value of initial principal: $10,000 × (1.07)^10 = $19,671.51',
        'Compute future value of annuity: $200 × [((1.07)^10 - 1) / 0.07] = $2,763.29',
        'Sum together: $19,671.51 + $2,763.29 = $22,434.80',
      ],
      finalOutcome: 'Total accumulated balance after 10 years equals $22,434.80.',
    },
    whatItMeans: 'The result represents the exact mathematical equivalence between lump sums and cash flow streams across time horizons.',
    factorsToConsider: [
      'Inflation erodes future purchasing power; consider real (inflation-adjusted) vs nominal rates.',
      'Taxes on interest, dividends, or capital gains will reduce net compounded returns.',
      'Compounding frequency (annual, monthly, continuous) alters effective annual yields.',
    ],
    faqs: [
      { question: 'What is the difference between Annuity Due and Ordinary Annuity?', answer: 'An Ordinary Annuity has payments made at the end of each period (like most mortgage and bond coupons), whereas an Annuity Due has payments made at the beginning (like rent or lease payments).' },
      { question: 'Why does money have time value?', answer: 'Money has time value because of opportunity cost, risk/uncertainty, and inflation. A dollar today can be invested to earn interest and grow.' },
    ],
    relatedCalculatorSlugs: ['compound-interest-calculator', 'roi-calculator', 'irr-npv-calculator', 'savings-goal-calculator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Verified against standard CFA Institute financial mathematics curriculum.',
  },
  {
    slug: 'currency-converter',
    name: 'Currency Converter',
    h1Title: 'Real-Time Currency Converter',
    category: 'finance-investment',
    badge: 'Global Exchange',
    shortDescription: 'Convert between world currencies with exchange rates, cross-rates, and reverse conversions.',
    longDescription: 'Our Currency Converter provides cross-currency conversions across major international currencies (USD, EUR, GBP, CAD, AUD, JPY, CHF, etc.) with transparent rate timestamps and spread estimations.',
    seoTitle: 'Currency Converter - Free Foreign Exchange & FX Calculator',
    metaDescription: 'Free real-time currency converter for USD, EUR, GBP, CAD, AUD, JPY, and global currencies. Calculate exchange rates and conversion fees.',
    keywords: ['currency converter', 'exchange rates', 'forex converter', 'usd to eur', 'gbp to usd', 'cad to usd'],
    inputs: [
      { id: 'amount', label: 'Amount to Convert', type: 'number', defaultValue: 1000 },
      { id: 'from', label: 'From Currency', type: 'select', defaultValue: 'USD', options: Object.keys(INITIAL_CURRENCY_RATES).map(k => ({ label: `${k} - ${INITIAL_CURRENCY_RATES[k].name}`, value: k })) },
      { id: 'to', label: 'To Currency', type: 'select', defaultValue: 'EUR', options: Object.keys(INITIAL_CURRENCY_RATES).map(k => ({ label: `${k} - ${INITIAL_CURRENCY_RATES[k].name}`, value: k })) },
      { id: 'feePct', label: 'Bank / Transfer Fee (%)', type: 'percentage', defaultValue: 0, helpText: 'Optional bank markup or credit card foreign exchange fee' },
    ],
    calculate: (inputs) => {
      const amount = Math.max(0, Number(inputs.amount) || 0);
      const from = String(inputs.from || 'USD');
      const to = String(inputs.to || 'EUR');
      const feePct = Number(inputs.feePct) || 0;

      const rateFromUsd = INITIAL_CURRENCY_RATES[from]?.rate || 1.0;
      const rateToUsd = INITIAL_CURRENCY_RATES[to]?.rate || 1.0;

      // Rate from base currency to target
      const exchangeRate = rateToUsd / rateFromUsd;
      const convertedBeforeFee = amount * exchangeRate;
      const feeAmount = convertedBeforeFee * (feePct / 100);
      const netReceived = convertedBeforeFee - feeAmount;

      return {
        primaryResult: {
          id: 'converted',
          label: `Converted Amount (${to})`,
          value: `${INITIAL_CURRENCY_RATES[to]?.symbol || ''}${netReceived.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          format: 'text',
          isPrimary: true,
        },
        metrics: [
          { id: 'rate', label: `Exchange Rate (1 ${from} = )`, value: `${exchangeRate.toFixed(4)} ${to}`, format: 'text' },
          { id: 'reverse_rate', label: `Inverse Rate (1 ${to} = )`, value: `${(1 / exchangeRate).toFixed(4)} ${from}`, format: 'text' },
          { id: 'fee', label: 'Estimated Transaction Fee', value: `${INITIAL_CURRENCY_RATES[to]?.symbol || ''}${feeAmount.toFixed(2)}`, format: 'text' },
        ],
        summaryText: `${amount.toLocaleString('en-US')} ${from} converts to approximately ${netReceived.toLocaleString('en-US', { minimumFractionDigits: 2 })} ${to} at an exchange rate of 1 ${from} = ${exchangeRate.toFixed(4)} ${to}.`,
        insights: [
          { type: 'info', title: 'Rate Disclaimer', message: 'Exchange rates are updated daily from interbank benchmarks. Consumer banks and money transfer providers frequently add a 1%–3% markup.' }
        ]
      };
    },
    formula: {
      formula: '\\text{Converted Amount} = \\text{Amount} \\times \\left( \\frac{\\text{Rate}_{\\text{Target}}}{\\text{Rate}_{\\text{Source}}} \\right) \\times (1 - \\text{Fee}\\%)',
      explanation: 'Cross-rate conversion maps the source currency into the standard USD baseline and subsequently converts into the destination currency.',
      variables: [
        { symbol: 'Rate_Source', name: 'Source Rate', description: 'Base units relative to standard global reserve currency' },
        { symbol: 'Rate_Target', name: 'Target Rate', description: 'Destination currency units per base dollar' },
      ],
    },
    howItWorks: [
      'Enter the currency amount you wish to exchange.',
      'Select your source currency and destination currency.',
      'Enter any known bank card foreign transaction fee percentage (typically 0% - 3%).',
      'View immediate cross rates, converted totals, and reverse rates.',
    ],
    example: {
      scenarioTitle: 'Converting $1,000 USD to Euros (EUR)',
      description: 'Converting $1,000 US Dollars to Euros at an exchange rate of 1 USD = 0.92 EUR with a 1% bank exchange fee.',
      inputs: { 'Amount': '$1,000 USD', 'Target Currency': 'EUR', 'Fee': '1.0%' },
      stepByStep: [
        'Gross conversion: 1,000 × 0.92 = 920.00 EUR',
        'Deduct 1% bank spread: 920.00 × 0.01 = 9.20 EUR',
        'Net amount delivered: 920.00 - 9.20 = 910.80 EUR',
      ],
      finalOutcome: 'Recipient receives €910.80 EUR.',
    },
    whatItMeans: 'The converted total indicates what you will receive after standard midpoint forex exchange.',
    factorsToConsider: [
      'Credit card foreign transaction fees (often 1%–3% on non-travel cards).',
      'Weekend Forex market spreads.',
      'Wire transfer flat fees and intermediary bank charges.',
    ],
    faqs: [
      { question: 'What is the midpoint exchange rate?', answer: 'The midpoint rate (or interbank rate) is the exact midpoint between the buy and sell rates on global foreign exchange markets. It is the fairest exchange rate before consumer markups.' },
      { question: 'Why do retail exchange booths give worse rates?', answer: 'Airport kiosks and high-street currency exchanges have physical overheads and charge wider spreads (sometimes 5% to 15%) compared to digital interbank transfers.' },
    ],
    relatedCalculatorSlugs: ['tvm-calculator', 'compound-interest-calculator', 'savings-goal-calculator'],
    lastUpdated: '2026-03-15',
    methodologyReview: 'Cross-referenced against ECB and IMF international benchmark datasets.',
  },
  {
    slug: 'compound-interest-calculator',
    name: 'Compound Interest Calculator',
    h1Title: 'Compound Interest Calculator - Calculate Your Investment Growth',
    category: 'finance-investment',
    badge: 'Popular',
    shortDescription: 'Calculate how your initial investment and regular deposits grow exponentially over time with compound interest.',
    longDescription: 'Use our free Compound Interest Calculator to estimate how your savings or investments can grow over time. See the breakdown between your initial principal, recurring monthly contributions, and compounding interest with visual interactive charts.',
    seoTitle: 'Compound Interest Calculator - Calculate Investment Growth Over Time',
    metaDescription: 'Use our free Compound Interest Calculator to estimate how your savings or investments can grow over time with compound interest, regular deposits, and reinvestment.',
    keywords: ['compound interest calculator', 'investment growth calculator', 'compounding interest', 'interest calculator', 'wealth growth'],
    inputs: [
      { id: 'principal', label: 'Initial Principal', type: 'currency', defaultValue: 10000, helpText: 'Initial lump sum investment' },
      { id: 'monthlyDeposit', label: 'Monthly Contribution', type: 'currency', defaultValue: 500, helpText: 'Amount added every month' },
      { id: 'annualRate', label: 'Estimated Annual Return (%)', type: 'percentage', defaultValue: 8, helpText: 'Historical S&P 500 average is ~8-10% before inflation' },
      { id: 'years', label: 'Investment Time Horizon (Years)', type: 'years', defaultValue: 20, min: 1, max: 60 },
      { id: 'compoundFrequency', label: 'Compounding Frequency', type: 'select', defaultValue: 12, options: [
        { label: 'Annually (1x / year)', value: 1 },
        { label: 'Semi-Annually (2x / year)', value: 2 },
        { label: 'Quarterly (4x / year)', value: 4 },
        { label: 'Monthly (12x / year)', value: 12 },
        { label: 'Daily (365x / year)', value: 365 },
      ]},
    ],
    calculate: (inputs) => {
      const p = Math.max(0, Number(inputs.principal) || 0);
      const pmt = Math.max(0, Number(inputs.monthlyDeposit) || 0);
      const r = Number(inputs.annualRate) || 0;
      const yrs = Math.max(1, Number(inputs.years) || 1);
      const freq = Number(inputs.compoundFrequency) || 12;

      const res = calculateCompoundInterest({
        principal: p,
        monthlyDeposit: pmt,
        annualRate: r,
        years: yrs,
        compoundFrequency: freq,
        depositFrequency: 12,
      });

      return {
        primaryResult: {
          id: 'future_value',
          label: 'Total Future Balance',
          value: res.futureValue,
          format: 'currency',
          isPrimary: true,
        },
        metrics: [
          { id: 'total_principal', label: 'Initial Principal', value: res.totalPrincipal, format: 'currency' },
          { id: 'total_deposits', label: 'Total Contributions', value: res.totalContributions, format: 'currency' },
          { id: 'total_interest', label: 'Total Interest Earned', value: res.totalInterestEarned, format: 'currency', changeType: 'positive' },
        ],
        summaryText: `In ${yrs} years, your investment will grow to $${Math.round(res.futureValue).toLocaleString('en-US')}. You contributed $${Math.round(res.totalPrincipal + res.totalContributions).toLocaleString('en-US')}, earning $${Math.round(res.totalInterestEarned).toLocaleString('en-US')} in compound growth.`,
        chartData: {
          type: 'area',
          title: 'Growth Trajectory Over Time',
          data: res.yearlyData.map(d => ({
            label: `Yr ${d.year}`,
            'Principal & Deposits': d.principalTotal,
            'Total Balance': d.balance,
          })),
          series: [
            { key: 'Principal & Deposits', name: 'Total Deposits', color: '#3b82f6' },
            { key: 'Total Balance', name: 'Total Balance (With Interest)', color: '#10b981' },
          ],
        },
        breakdownItems: [
          { label: 'Initial Principal', amount: res.totalPrincipal, color: '#94a3b8' },
          { label: 'Monthly Contributions', amount: res.totalContributions, color: '#3b82f6' },
          { label: 'Compound Interest', amount: res.totalInterestEarned, color: '#10b981' },
        ],
        insights: [
          {
            type: 'tip',
            title: 'The Snowball Effect',
            message: `Compound interest generates ${( (res.totalInterestEarned / (res.totalPrincipal + res.totalContributions)) * 100 ).toFixed(1)}% on top of your deposited money over this period.`,
          }
        ]
      };
    },
    formula: {
      formula: 'A = P \\left(1 + \\frac{r}{n}\\right)^{nt} + PMT \\times \\left[ \\frac{\\left(1 + \\frac{r}{n}\\right)^{nt} - 1}{\\frac{r}{n}} \\right]',
      explanation: 'Compounding works by continuously reinvesting the interest earnings into the principal, so subsequent interest is calculated on an ever-larger base balance.',
      variables: [
        { symbol: 'A', name: 'Final Accumulated Amount', description: 'The total value of your investment at maturity' },
        { symbol: 'P', name: 'Principal', description: 'The initial lump sum deposit' },
        { symbol: 'PMT', name: 'Periodic Contribution', description: 'Regular recurring monthly or periodic savings' },
        { symbol: 'r', name: 'Annual Interest Rate', description: 'Nominal percentage return per annum (as a decimal)' },
        { symbol: 'n', name: 'Compounding Frequency', description: 'Number of times interest is applied per year' },
        { symbol: 't', name: 'Time', description: 'Number of years the money is invested' },
      ],
    },
    howItWorks: [
      'Enter your starting principal balance.',
      'Specify your monthly deposit amount and your expected annual rate of return.',
      'Choose the investment horizon in years and compounding frequency.',
      'Review the year-by-year growth table and asset breakdown.',
    ],
    example: {
      scenarioTitle: 'Saving $500/Month for 20 Years at 8% Return',
      description: 'Starting with $10,000 and depositing $500 each month for 20 years at an 8% annual return compounded monthly.',
      inputs: { 'Starting Amount': '$10,000', 'Monthly Contribution': '$500', 'Annual Return': '8%', 'Years': '20' },
      stepByStep: [
        'Total amount deposited by you: $10,000 + ($500 × 240 months) = $130,000.',
        'Initial $10,000 grows to: $10,000 × (1 + 0.08/12)^240 = $49,268.03.',
        'Monthly $500 contributions grow to: $500 × [((1 + 0.08/12)^240 - 1) / (0.08/12)] = $294,510.21.',
        'Total final portfolio value = $49,268.03 + $294,510.21 = $343,778.24.',
      ],
      finalOutcome: 'Total Portfolio = $343,778.24 ($213,778.24 pure interest earned).',
    },
    whatItMeans: 'Compound growth accelerates as time increases. In later years, the annual interest earned will vastly exceed your annual contributions.',
    factorsToConsider: [
      'Inflation: Real returns equal nominal return minus annual inflation.',
      'Taxes: Holding assets in tax-advantaged accounts (401k, Roth IRA) avoids annual drag from dividend taxes.',
      'Volatility: Stock markets fluctuate year to year; calculations reflect geometric compound averages.',
    ],
    faqs: [
      { question: 'What is the Rule of 72 in compound interest?', answer: 'The Rule of 72 is a quick mental shortcut: divide 72 by your annual interest rate to find the approximate number of years required to double your money (e.g., at 8%, 72 ÷ 8 = 9 years to double).' },
      { question: 'How does daily compounding compare to monthly compounding?', answer: 'More frequent compounding increases returns, but with diminishing returns. On a $10,000 balance at 8% over 10 years, daily compounding yields $22,253 vs $22,196 for monthly compounding (a $57 difference).' },
    ],
    relatedCalculatorSlugs: ['roi-calculator', 'savings-goal-calculator', 'cd-calculator', 'college-savings-calculator', 'investment-income-calculator'],
    lastUpdated: '2026-03-10',
    methodologyReview: 'Audited against standard actuarial compound interest formulas.',
  },
  {
    slug: 'roi-calculator',
    name: 'Return on Investment (ROI) Calculator',
    h1Title: 'Return on Investment (ROI) Calculator',
    category: 'finance-investment',
    badge: 'Popular',
    shortDescription: 'Calculate total ROI, annualized rate of return, and net profit across real estate, businesses, and stocks.',
    longDescription: 'The Return on Investment (ROI) Calculator measures the profitability and financial efficiency of an investment. It calculates net profit, simple percentage ROI, and Compound Annual Growth Rate (CAGR / Annualized ROI).',
    seoTitle: 'ROI Calculator - Return on Investment & Annualized ROI (CAGR)',
    metaDescription: 'Free ROI Calculator to calculate return on investment, net profit, and annualized rate of return. Compare investments easily.',
    keywords: ['roi calculator', 'return on investment', 'annualized return', 'cagr calculator', 'profitability calculator'],
    inputs: [
      { id: 'initialInvestment', label: 'Initial Amount Invested', type: 'currency', defaultValue: 25000 },
      { id: 'finalValue', label: 'Final Value / Sale Price', type: 'currency', defaultValue: 45000 },
      { id: 'additionalCosts', label: 'Additional Costs / Maintenance', type: 'currency', defaultValue: 2000, helpText: 'Commissions, renovations, holding fees, or taxes' },
      { id: 'yearsHeld', label: 'Investment Duration (Years)', type: 'number', defaultValue: 5, min: 0.1, max: 100 },
    ],
    calculate: (inputs) => {
      const initial = Math.max(0, Number(inputs.initialInvestment) || 0);
      const finalVal = Math.max(0, Number(inputs.finalValue) || 0);
      const costs = Math.max(0, Number(inputs.additionalCosts) || 0);
      const years = Math.max(0.01, Number(inputs.yearsHeld) || 1);

      const res = calculateROI(initial, finalVal, costs, years);

      return {
        primaryResult: {
          id: 'simple_roi',
          label: 'Total ROI',
          value: res.simpleROI,
          format: 'percentage',
          isPrimary: true,
          changeType: res.simpleROI >= 0 ? 'positive' : 'negative',
        },
        metrics: [
          { id: 'annualized_roi', label: 'Annualized ROI (CAGR)', value: res.annualizedROI, format: 'percentage', changeType: res.annualizedROI >= 0 ? 'positive' : 'negative' },
          { id: 'net_profit', label: 'Net Profit', value: res.netProfit, format: 'currency', changeType: res.netProfit >= 0 ? 'positive' : 'negative' },
          { id: 'total_cost', label: 'Total Invested Capital', value: res.totalCost, format: 'currency' },
        ],
        summaryText: `Your investment generated a net profit of $${res.netProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })} on a total cost of $${res.totalCost.toLocaleString('en-US')}, representing a total ROI of ${res.simpleROI.toFixed(2)}% (${res.annualizedROI.toFixed(2)}% annualized over ${years} years).`,
        breakdownItems: [
          { label: 'Initial Capital', amount: initial, color: '#3b82f6' },
          { label: 'Additional Expenses', amount: costs, color: '#ef4444' },
          { label: 'Net Gain / Profit', amount: Math.max(0, res.netProfit), color: '#10b981' },
        ]
      };
    },
    formula: {
      formula: '\\text{ROI} = \\left( \\frac{\\text{Final Value} - \\text{Total Cost}}{\\text{Total Cost}} \\right) \\times 100\\%, \\quad \\text{Annualized ROI} = \\left[ \\left( \\frac{\\text{Final Value}}{\\text{Total Cost}} \\right)^{1/t} - 1 \\right] \\times 100\\%',
      explanation: 'Total ROI measures overall percentage gain or loss, while Annualized ROI (CAGR) standardizes performance on a per-year basis for fair comparison.',
      variables: [
        { symbol: 'Final Value', name: 'Returned Capital', description: 'Proceeds collected upon sale or current valuation' },
        { symbol: 'Total Cost', name: 'Invested Capital + Costs', description: 'Initial purchase price plus ongoing capital expenses' },
        { symbol: 't', name: 'Holding Period (Years)', description: 'Length of time the investment was maintained' },
      ],
    },
    howItWorks: [
      'Enter the starting capital deployed into the asset or venture.',
      'Enter the final liquidation value or current market price.',
      'Include any extra maintenance, management, or transaction costs.',
      'Set the holding duration in years to see the annualized return (CAGR).',
    ],
    example: {
      scenarioTitle: 'Real Estate Flip or Stock Position',
      description: '$25,000 invested, sold for $45,000 after 5 years with $2,000 in transaction expenses.',
      inputs: { 'Initial Investment': '$25,000', 'Sale Value': '$45,000', 'Costs': '$2,000', 'Years': '5' },
      stepByStep: [
        'Total Cost Basis = $25,000 + $2,000 = $27,000.',
        'Net Profit = $45,000 - $27,000 = $18,000.',
        'Total Simple ROI = ($18,000 / $27,000) × 100% = 66.67%.',
        'Annualized CAGR = [($45,000 / $27,000)^(1/5) - 1] × 100% = 10.76% per year.',
      ],
      finalOutcome: 'Total ROI = 66.67% | Annualized Return = 10.76%/year.',
    },
    whatItMeans: 'ROI provides a universal standard to compare disparate investments (e.g. comparing buying rental real estate vs investing in an index fund).',
    factorsToConsider: [
      'Opportunity Cost: Could the capital have earned risk-free return in Treasuries?',
      'Risk-Adjusted Return: Higher ROI usually entails higher volatility or downside risk.',
      'Inflation Adjustment: 10% nominal return during 4% inflation produces 5.77% real return.',
    ],
    faqs: [
      { question: 'What is the difference between Simple ROI and Annualized ROI?', answer: 'Simple ROI does not take holding time into account (e.g. 50% over 10 years vs 50% over 1 year). Annualized ROI measures geometric compound growth per year, allowing direct comparison.' },
      { question: 'What is a good ROI?', answer: 'Generally, stock market index funds historically yield 8%–10% annualized ROI. Real estate investments target 8%–15% cash-on-cash ROI.' },
    ],
    relatedCalculatorSlugs: ['compound-interest-calculator', 'irr-npv-calculator', 'holding-period-return-calculator', 'stock-return-capital-gain-calculator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Verified against standard CFA Institute and corporate finance metrics.',
  },
  {
    slug: 'irr-npv-calculator',
    name: 'IRR & NPV Calculator',
    h1Title: 'Net Present Value (NPV) and Internal Rate of Return (IRR) Calculator',
    category: 'finance-investment',
    badge: 'Corporate Finance',
    shortDescription: 'Evaluate capital investments and multi-year project cash flows using Net Present Value and Internal Rate of Return.',
    longDescription: 'The IRR & NPV Calculator assists corporate managers and real estate investors in capital budgeting. Determine whether an investment yields positive economic profit at your hurdle discount rate and calculate the exact internal rate of return.',
    seoTitle: 'IRR NPV Calculator - Net Present Value & Internal Rate of Return',
    metaDescription: 'Free online IRR and NPV calculator. Calculate Net Present Value, Internal Rate of Return, and profitability index for project cash flows.',
    keywords: ['irr calculator', 'npv calculator', 'net present value', 'internal rate of return', 'capital budgeting calculator'],
    inputs: [
      { id: 'discountRate', label: 'Discount Rate / Hurdle Rate (%)', type: 'percentage', defaultValue: 10, helpText: 'Cost of capital or required minimum rate of return' },
      { id: 'initialOutlay', label: 'Initial Outlay / Investment (Year 0)', type: 'currency', defaultValue: 50000, helpText: 'Starting capital expenditure' },
      { id: 'cf1', label: 'Cash Flow Year 1', type: 'currency', defaultValue: 15000 },
      { id: 'cf2', label: 'Cash Flow Year 2', type: 'currency', defaultValue: 18000 },
      { id: 'cf3', label: 'Cash Flow Year 3', type: 'currency', defaultValue: 20000 },
      { id: 'cf4', label: 'Cash Flow Year 4', type: 'currency', defaultValue: 22000 },
      { id: 'cf5', label: 'Cash Flow Year 5', type: 'currency', defaultValue: 25000 },
    ],
    calculate: (inputs) => {
      const discountRate = Number(inputs.discountRate) || 0;
      const outlay = Math.abs(Number(inputs.initialOutlay) || 0);
      const cashFlows = [
        Number(inputs.cf1) || 0,
        Number(inputs.cf2) || 0,
        Number(inputs.cf3) || 0,
        Number(inputs.cf4) || 0,
        Number(inputs.cf5) || 0,
      ];

      const npv = calculateNPV(discountRate, outlay, cashFlows);
      const irr = calculateIRR(outlay, cashFlows);
      const totalInflows = cashFlows.reduce((a, b) => a + b, 0);
      const profitabilityIndex = outlay > 0 ? (npv + outlay) / outlay : 1;

      return {
        primaryResult: {
          id: 'npv',
          label: 'Net Present Value (NPV)',
          value: npv,
          format: 'currency',
          isPrimary: true,
          changeType: npv >= 0 ? 'positive' : 'negative',
        },
        metrics: [
          { id: 'irr', label: 'Internal Rate of Return (IRR)', value: irr, format: 'percentage', changeType: irr >= discountRate ? 'positive' : 'negative' },
          { id: 'pi', label: 'Profitability Index (PI)', value: profitabilityIndex.toFixed(2), format: 'text', changeType: profitabilityIndex >= 1 ? 'positive' : 'negative' },
          { id: 'total_inflow', label: 'Total Undiscounted Inflows', value: totalInflows, format: 'currency' },
          { id: 'net_cash', label: 'Net Nominal Cash Flow', value: totalInflows - outlay, format: 'currency' },
        ],
        summaryText: npv >= 0
          ? `Project is economically attractive. At a ${discountRate}% hurdle rate, NPV is +$${npv.toLocaleString('en-US', { minimumFractionDigits: 2 })} and IRR is ${irr.toFixed(2)}%, exceeding the cost of capital.`
          : `Project creates economic deficit. NPV is -$${Math.abs(npv).toLocaleString('en-US', { minimumFractionDigits: 2 })} and IRR is ${irr.toFixed(2)}%, which is below the ${discountRate}% hurdle rate.`,
        insights: [
          {
            type: npv >= 0 ? 'tip' : 'warning',
            title: npv >= 0 ? 'Decision: Accept Project' : 'Decision: Reject Project',
            message: npv >= 0 ? 'A positive NPV indicates the project adds net wealth to the firm.' : 'A negative NPV destroys shareholder value relative to investing at the discount rate.',
          }
        ]
      };
    },
    formula: {
      formula: '\\text{NPV} = -C_0 + \\sum_{t=1}^{n} \\frac{C_t}{(1 + r)^t}, \\quad \\sum_{t=0}^{n} \\frac{C_t}{(1 + \\text{IRR})^t} = 0',
      explanation: 'NPV discounts all future cash inflows to present value and subtracts initial cost. IRR is the discount rate that sets NPV exactly equal to zero.',
      variables: [
        { symbol: 'C_0', name: 'Initial Outlay', description: 'Year 0 capital investment' },
        { symbol: 'C_t', name: 'Cash Flow at Year t', description: 'Net periodic cash flow received at period t' },
        { symbol: 'r', name: 'Discount Rate', description: 'Cost of capital / hurdle rate' },
        { symbol: 'IRR', name: 'Internal Rate of Return', description: 'Break-even rate of return of the project' },
      ],
    },
    howItWorks: [
      'Enter your firm or personal hurdle discount rate (cost of capital).',
      'Enter the initial cash expenditure in Year 0.',
      'Enter expected net cash inflows for each subsequent operating year.',
      'Review NPV, IRR, and Profitability Index (PI).',
    ],
    example: {
      scenarioTitle: '5-Year Equipment Purchase or Solar Installation',
      description: '$50,000 initial investment generating $15k, $18k, $20k, $22k, $25k in years 1-5 with a 10% discount rate.',
      inputs: { 'Initial Cost': '$50,000', 'Discount Rate': '10%', 'Cash Flows': '$15k, $18k, $20k, $22k, $25k' },
      stepByStep: [
        'Discount Year 1: $15,000 / (1.10)^1 = $13,636.36',
        'Discount Year 2: $18,000 / (1.10)^2 = $14,876.03',
        'Discount Year 3: $20,000 / (1.10)^3 = $15,026.30',
        'Discount Year 4: $22,000 / (1.10)^4 = $15,026.30',
        'Discount Year 5: $25,000 / (1.10)^5 = $15,523.03',
        'Sum of PV of inflows = $74,088.02. Subtract $50,000 = NPV of +$24,088.02.',
        'Solve for IRR using polynomial root finder: IRR = 27.65%.',
      ],
      finalOutcome: 'NPV = +$24,088.02 | IRR = 27.65% (Project is highly lucrative).',
    },
    whatItMeans: 'Positive NPV means the investment outperforms putting the funds into an alternative asset with similar risk.',
    factorsToConsider: [
      'Reinvestment rate assumption: IRR assumes interim cash flows are reinvested at the IRR rate.',
      'Multiple sign changes in cash flows can generate multiple IRRs.',
      'Sensitivity to discount rate fluctuations.',
    ],
    faqs: [
      { question: 'When should I choose NPV over IRR?', answer: 'NPV is generally preferred over IRR when choosing between mutually exclusive projects of different scale or timing, because NPV directly reflects dollar value added to wealth.' },
      { question: 'What is a typical hurdle rate?', answer: 'Corporate hurdle rates typically range from 8% to 15% depending on industry risk and Weighted Average Cost of Capital (WACC).' },
    ],
    relatedCalculatorSlugs: ['roi-calculator', 'tvm-calculator', 'wacc-calculator', 'commercial-loan-calculator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Computed via robust Newton-Raphson polynomial iteration.',
  },
  {
    slug: 'bond-calculator',
    name: 'Bond Calculator',
    h1Title: 'Bond Valuation & Yield to Maturity (YTM) Calculator',
    category: 'finance-investment',
    badge: 'Fixed Income',
    shortDescription: 'Calculate bond pricing, Yield to Maturity (YTM), current yield, and Macaulay duration.',
    longDescription: 'The Bond Calculator allows fixed-income investors to price corporate, municipal, and government bonds, calculate exact Yield to Maturity (YTM), and gauge interest rate risk through duration analysis.',
    seoTitle: 'Bond Calculator - Bond Price, Yield to Maturity (YTM) & Duration',
    metaDescription: 'Free Bond Calculator to calculate bond price, Yield to Maturity (YTM), current yield, Macaulay duration, and modified duration.',
    keywords: ['bond calculator', 'yield to maturity', 'ytm calculator', 'bond price calculator', 'macaulay duration'],
    inputs: [
      { id: 'faceValue', label: 'Face Value / Par Value', type: 'currency', defaultValue: 1000 },
      { id: 'couponRate', label: 'Annual Coupon Rate (%)', type: 'percentage', defaultValue: 5 },
      { id: 'marketPrice', label: 'Current Market Price', type: 'currency', defaultValue: 950, helpText: 'Price of the bond in today\'s secondary market' },
      { id: 'yearsToMaturity', label: 'Years to Maturity', type: 'years', defaultValue: 10, min: 0.5, max: 50 },
      { id: 'frequency', label: 'Payment Frequency', type: 'select', defaultValue: 2, options: [
        { label: 'Semi-Annual (2x / yr - Standard)', value: 2 },
        { label: 'Annual (1x / yr)', value: 1 },
        { label: 'Quarterly (4x / yr)', value: 4 },
      ]},
    ],
    calculate: (inputs) => {
      const face = Math.max(1, Number(inputs.faceValue) || 1000);
      const couponRate = Number(inputs.couponRate) || 0;
      const price = Math.max(1, Number(inputs.marketPrice) || 1000);
      const years = Math.max(0.1, Number(inputs.yearsToMaturity) || 1);
      const freq = Number(inputs.frequency) || 2;

      const res = calculateBond(face, couponRate, price, years, freq);

      return {
        primaryResult: {
          id: 'ytm',
          label: 'Yield to Maturity (YTM)',
          value: res.exactYTM,
          format: 'percentage',
          isPrimary: true,
        },
        metrics: [
          { id: 'current_yield', label: 'Current Yield', value: res.currentYield, format: 'percentage' },
          { id: 'annual_coupon', label: 'Annual Coupon Payment', value: res.couponPaymentYearly, format: 'currency' },
          { id: 'macaulay', label: 'Macaulay Duration', value: `${res.macaulayDuration.toFixed(2)} Years`, format: 'text' },
          { id: 'mod_duration', label: 'Modified Duration', value: `${res.modifiedDuration.toFixed(2)}%`, format: 'text', helpText: 'Expected price change for 1% shift in interest rates' },
        ],
        summaryText: `This bond priced at $${price.toLocaleString('en-US')} (a ${price < face ? 'discount' : price > face ? 'premium' : 'par'} bond) provides an annual coupon of $${res.couponPaymentYearly.toFixed(2)}, yielding an exact YTM of ${res.exactYTM.toFixed(2)}% per year.`,
        insights: [
          {
            type: 'info',
            title: price < face ? 'Discount Bond' : 'Premium Bond',
            message: price < face ? 'Because the market price is below par, YTM is higher than the coupon rate.' : 'Because market price is above par, YTM is lower than coupon rate.',
          }
        ]
      };
    },
    formula: {
      formula: 'P = \\sum_{t=1}^{n} \\frac{C}{(1 + y)^t} + \\frac{F}{(1 + y)^n}',
      explanation: 'Bond pricing equates the market price to the discounted present value of all future periodic coupon payments plus the face value at maturity.',
      variables: [
        { symbol: 'P', name: 'Market Price', description: 'Current trading price of the bond' },
        { symbol: 'C', name: 'Periodic Coupon', description: 'Coupon payment per cycle (Face Value × Coupon Rate ÷ Frequency)' },
        { symbol: 'F', name: 'Face / Par Value', description: 'Principal returned at maturity (typically $1,000)' },
        { symbol: 'y', name: 'Yield to Maturity', description: 'Internal rate of return on the bond per period' },
        { symbol: 'n', name: 'Total Periods', description: 'Years to maturity × payment frequency' },
      ],
    },
    howItWorks: [
      'Enter the face value (par) of the bond (normally $1,000).',
      'Enter the stated annual coupon rate and the current market price.',
      'Specify the remaining years to maturity and payout frequency.',
      'Review YTM, Current Yield, and Duration interest-rate sensitivity.',
    ],
    example: {
      scenarioTitle: '10-Year Corporate Bond Trading at a Discount',
      description: '$1,000 par bond with a 5% semi-annual coupon trading at $950 with 10 years to maturity.',
      inputs: { 'Par Value': '$1,000', 'Coupon Rate': '5.0%', 'Market Price': '$950', 'Maturity': '10 Years' },
      stepByStep: [
        'Annual coupon received = $1,000 × 5% = $50 ($25 semi-annually).',
        'Current Yield = $50 / $950 = 5.26%.',
        'YTM considers both coupon payments and the $50 capital gain realized at maturity.',
        'Iterative numerical solution yields YTM = 5.67%.',
      ],
      finalOutcome: 'YTM = 5.67% | Current Yield = 5.26% | Macaulay Duration = 7.94 years.',
    },
    whatItMeans: 'YTM is the total annualized return anticipated if the bond is held until maturity and all coupon payments are reinvested at the same rate.',
    factorsToConsider: [
      'Credit risk and default probability of issuer.',
      'Call provisions: callable bonds may be redeemed early by the issuer if market interest rates drop.',
      'Inflation risk over long maturities.',
    ],
    faqs: [
      { question: 'What is the difference between coupon rate and YTM?', answer: 'The coupon rate is the fixed interest rate the issuer contracted to pay on the face value. YTM is your actual annual rate of return based on what you paid for the bond in the secondary market.' },
      { question: 'What does Modified Duration tell an investor?', answer: 'Modified Duration approximates the percentage change in bond price for a 1% change in prevailing interest rates (e.g. duration of 7 means price drops ~7% if interest rates rise by 100 bps).' },
    ],
    relatedCalculatorSlugs: ['tax-equivalent-yield-calculator', 'tvm-calculator', 'compound-interest-calculator', 'cd-calculator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Standard Securities Industry and Financial Markets Association (SIFMA) conventions.',
  },
  {
    slug: 'tax-equivalent-yield-calculator',
    name: 'Tax Equivalent Yield Calculator',
    h1Title: 'Tax Equivalent Yield (TEY) Calculator',
    category: 'finance-investment',
    badge: 'Tax Optimization',
    shortDescription: 'Compare tax-free municipal bond yields against taxable corporate bonds based on your tax bracket.',
    longDescription: 'Municipal bonds issued by state and local governments are often exempt from federal (and sometimes state) income taxes. The Tax Equivalent Yield Calculator calculates what yield a taxable bond must offer to match a tax-free muni bond.',
    seoTitle: 'Tax Equivalent Yield Calculator - Muni Bond vs Taxable Yield',
    metaDescription: 'Free Tax Equivalent Yield (TEY) Calculator. Compare municipal bonds to corporate bonds based on your federal and state tax brackets.',
    keywords: ['tax equivalent yield calculator', 'tey calculator', 'municipal bond calculator', 'muni yield', 'tax exempt yield'],
    inputs: [
      { id: 'muniYield', label: 'Tax-Exempt Municipal Bond Yield (%)', type: 'percentage', defaultValue: 3.8 },
      { id: 'federalTaxBracket', label: 'Federal Marginal Tax Bracket (%)', type: 'select', defaultValue: 32, options: [
        { label: '10% Bracket', value: 10 },
        { label: '12% Bracket', value: 12 },
        { label: '22% Bracket', value: 22 },
        { label: '24% Bracket', value: 24 },
        { label: '32% Bracket', value: 32 },
        { label: '35% Bracket', value: 35 },
        { label: '37% Top Bracket', value: 37 },
      ]},
      { id: 'stateTaxBracket', label: 'State Income Tax Bracket (%)', type: 'percentage', defaultValue: 5, helpText: 'Enter 0% if state does not tax or bond is in-state exempt' },
    ],
    calculate: (inputs) => {
      const muni = Number(inputs.muniYield) || 0;
      const fed = Number(inputs.federalTaxBracket) || 0;
      const state = Number(inputs.stateTaxBracket) || 0;

      const res = calculateTaxEquivalentYield(muni, fed, state);

      return {
        primaryResult: {
          id: 'tey',
          label: 'Tax Equivalent Yield (TEY)',
          value: res.taxEquivalentYield,
          format: 'percentage',
          isPrimary: true,
          changeType: 'positive',
        },
        metrics: [
          { id: 'muni_base', label: 'Tax-Exempt Muni Yield', value: muni, format: 'percentage' },
          { id: 'combined_tax', label: 'Combined Marginal Tax Rate', value: res.combinedTaxRate, format: 'percentage' },
          { id: 'spread', label: 'Tax Advantage Spread', value: res.taxSavingsSpread, format: 'percentage', changeType: 'positive' },
        ],
        summaryText: `For an investor facing a ${res.combinedTaxRate.toFixed(1)}% combined marginal tax rate, a ${muni.toFixed(2)}% tax-free municipal bond provides the exact same after-tax cash yield as a taxable bond paying ${res.taxEquivalentYield.toFixed(2)}%.`,
      };
    },
    formula: {
      formula: '\\text{TEY} = \\frac{\\text{Tax-Exempt Yield}}{1 - (\\text{Federal Tax Rate} + \\text{State Tax Rate})}',
      explanation: 'Dividing the tax-free yield by the complement of your marginal tax rate normalizes the return into a pre-tax equivalent.',
      variables: [
        { symbol: 'TEY', name: 'Tax Equivalent Yield', description: 'The gross pre-tax yield required on a taxable bond' },
        { symbol: 'Muni Yield', name: 'Tax-Exempt Yield', description: 'Stated yield on municipal bond' },
      ],
    },
    howItWorks: [
      'Input the stated yield of the municipal bond.',
      'Select your current marginal federal income tax bracket.',
      'Add your state income tax rate if applicable.',
      'Compare the calculated TEY against corporate or treasury bond yields.',
    ],
    example: {
      scenarioTitle: 'High-Earner in 35% Federal + 5% State Bracket',
      description: 'Evaluating a 4.0% municipal bond with a 40% combined marginal tax rate.',
      inputs: { 'Muni Yield': '4.0%', 'Combined Tax': '40%' },
      stepByStep: [
        'Complement of tax rate: 1 - 0.40 = 0.60.',
        'Calculate TEY: 4.0% / 0.60 = 6.67%.',
      ],
      finalOutcome: 'A taxable bond must yield at least 6.67% to match the 4.0% municipal bond.',
    },
    whatItMeans: 'If available corporate bonds yield less than your TEY, the municipal bond delivers higher net spendable income.',
    factorsToConsider: [
      'Net Investment Income Tax (NIIT) 3.8% for high earners.',
      'Alternative Minimum Tax (AMT) on private-activity municipal bonds.',
    ],
    faqs: [
      { question: 'Are all municipal bonds 100% tax free?', answer: 'Most are exempt from federal taxes. To be state-tax exempt, you typically must live in the state that issued the bond.' },
    ],
    relatedCalculatorSlugs: ['bond-calculator', 'investment-income-calculator', 'dividend-tax-calculator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Reviewed per IRS publication 550 investment income tax guidelines.',
  },
  {
    slug: 'rule-of-72-calculator',
    name: 'Rule of 72 Calculator',
    h1Title: 'Rule of 72 Calculator - Investment Doubling Time',
    category: 'finance-investment',
    badge: 'Quick Rule',
    shortDescription: 'Calculate how many years it will take to double your money at any given rate of return.',
    longDescription: 'The Rule of 72 is a classic mental math rule of thumb in finance. It estimates the number of years needed for an investment to double in value given a fixed annual rate of interest.',
    seoTitle: 'Rule of 72 Calculator - How Fast Will Your Money Double?',
    metaDescription: 'Calculate how long it takes to double your money with our Rule of 72 Calculator. Compare Rule of 72, Rule of 69.3, and exact compound doubling times.',
    keywords: ['rule of 72 calculator', 'doubling time calculator', 'rule of 72', 'compound doubling', 'finance rules'],
    inputs: [
      { id: 'rate', label: 'Annual Rate of Return (%)', type: 'percentage', defaultValue: 7.2 },
    ],
    calculate: (inputs) => {
      const r = Number(inputs.rate) || 1;
      const res = calculateRuleOf72(r);

      return {
        primaryResult: {
          id: 'years_to_double',
          label: 'Estimated Doubling Time',
          value: `${res.rule72Years.toFixed(1)} Years`,
          format: 'text',
          isPrimary: true,
        },
        metrics: [
          { id: 'exact_years', label: 'Exact Mathematical Doubling Time', value: `${res.exactYears.toFixed(2)} Years`, format: 'text' },
          { id: 'rule_69', label: 'Continuous Compounding (Rule of 69.3)', value: `${res.rule69Years.toFixed(2)} Years`, format: 'text' },
          { id: 'accuracy_diff', label: 'Estimation Variance', value: `${res.difference.toFixed(2)} Years`, format: 'text' },
        ],
        summaryText: `At an annual return of ${r}%, your money will double in approximately ${res.rule72Years.toFixed(1)} years (exact compound doubling time: ${res.exactYears.toFixed(2)} years).`,
      };
    },
    formula: {
      formula: 'T_{\\text{approx}} = \\frac{72}{r}, \\quad T_{\\text{exact}} = \\frac{\\ln(2)}{\\ln(1 + r/100)}',
      explanation: '72 is chosen because it has many divisors (2, 3, 4, 6, 8, 9, 12) and closely tracks ln(2) for interest rates between 5% and 12%.',
      variables: [
        { symbol: 'r', name: 'Interest Rate (%)', description: 'Annual percentage rate of return' },
        { symbol: 'T', name: 'Time to Double', description: 'Years required for 100% portfolio capital growth' },
      ],
    },
    howItWorks: [
      'Enter your anticipated annual percentage rate of return.',
      'View instant doubling times calculated via Rule of 72, Rule of 69.3, and natural logarithms.',
    ],
    example: {
      scenarioTitle: 'Investments growing at 8% vs 10%',
      description: 'Comparing doubling velocity across typical equity portfolio returns.',
      inputs: { 'Annual Rate': '8.0%' },
      stepByStep: [
        'Rule of 72: 72 / 8 = 9.0 years.',
        'Exact formula: ln(2) / ln(1.08) = 0.6931 / 0.07696 = 9.006 years.',
      ],
      finalOutcome: 'Money doubles every ~9 years at 8%. Over a 36-year career, capital doubles 4 times (16x starting amount).',
    },
    whatItMeans: 'Every doubling cycle multiplies your net worth exponentially ($10k -> $20k -> $40k -> $80k -> $160k).',
    factorsToConsider: [
      'Rule of 72 assumes interest is reinvested and rate remains constant.',
      'Inflation: To calculate time to halve purchasing power, divide 72 by annual inflation rate.',
    ],
    faqs: [
      { question: 'Why is 72 used instead of 69.3?', answer: '69.3 is mathematically exact for continuous compounding, but 72 is easily divisible by whole numbers in mental calculations without decimals.' },
    ],
    relatedCalculatorSlugs: ['compound-interest-calculator', 'roi-calculator', 'savings-goal-calculator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Verified against logarithmic exponential growth models.',
  },
  {
    slug: 'college-savings-calculator',
    name: 'College Savings Calculator',
    h1Title: 'College Savings & 529 Plan Calculator',
    category: 'finance-investment',
    badge: 'Education',
    shortDescription: 'Plan and project future university tuition costs and determine the monthly 529 plan savings needed.',
    longDescription: 'The College Savings Calculator forecasts future college tuition with education inflation, projects 529 plan growth, and calculates the exact monthly contribution needed to graduate debt-free.',
    seoTitle: 'College Savings Calculator - 529 Plan & Tuition Cost Estimator',
    metaDescription: 'Free 529 College Savings Calculator. Estimate future tuition inflation, compare savings goals, and calculate monthly contributions required.',
    keywords: ['college savings calculator', '529 calculator', 'tuition calculator', 'university cost calculator', 'education savings'],
    inputs: [
      { id: 'currentSavings', label: 'Current College Savings', type: 'currency', defaultValue: 5000 },
      { id: 'childCurrentAge', label: 'Child’s Current Age', type: 'number', defaultValue: 5, min: 0, max: 18 },
      { id: 'collegeStartAge', label: 'Age Starting College', type: 'number', defaultValue: 18, min: 14, max: 25 },
      { id: 'yearsInCollege', label: 'Years in College', type: 'number', defaultValue: 4, min: 1, max: 8 },
      { id: 'currentAnnualTuition', label: 'Today’s Annual College Cost (Tuition + Room & Board)', type: 'currency', defaultValue: 28000 },
      { id: 'tuitionInflation', label: 'Tuition Inflation Rate (%)', type: 'percentage', defaultValue: 5, helpText: 'Historical higher education inflation is ~4-6%' },
      { id: 'investmentReturn', label: 'Expected Investment Return (%)', type: 'percentage', defaultValue: 7 },
      { id: 'monthlyContribution', label: 'Planned Monthly Contribution', type: 'currency', defaultValue: 300 },
    ],
    calculate: (inputs) => {
      const currentSav = Number(inputs.currentSavings) || 0;
      const childAge = Number(inputs.childCurrentAge) || 0;
      const startAge = Number(inputs.collegeStartAge) || 18;
      const collegeYrs = Number(inputs.yearsInCollege) || 4;
      const tuitionNow = Number(inputs.currentAnnualTuition) || 25000;
      const inflation = Number(inputs.tuitionInflation) || 5;
      const ret = Number(inputs.investmentReturn) || 7;
      const monthly = Number(inputs.monthlyContribution) || 0;

      const res = calculateCollegeSavings(
        currentSav,
        childAge,
        startAge,
        collegeYrs,
        tuitionNow,
        inflation,
        ret,
        monthly
      );

      return {
        primaryResult: {
          id: 'total_cost',
          label: 'Projected Total College Cost',
          value: res.totalCollegeCost,
          format: 'currency',
          isPrimary: true,
        },
        metrics: [
          { id: 'projected_savings', label: 'Projected 529 Savings at Age 18', value: res.savingsAtStart, format: 'currency' },
          { id: 'required_monthly', label: 'Monthly Deposit to 100% Fund', value: res.requiredMonthlyDeposit, format: 'currency' },
          { id: 'funding_pct', label: 'Current Funding Pace', value: res.fundingPercent, format: 'percentage', changeType: res.fundingPercent >= 100 ? 'positive' : 'negative' },
          { id: 'gap', label: res.surplusOrShortfall >= 0 ? 'Projected Surplus' : 'Projected Shortfall', value: Math.abs(res.surplusOrShortfall), format: 'currency', changeType: res.surplusOrShortfall >= 0 ? 'positive' : 'negative' },
        ],
        summaryText: `Your child will need approximately $${Math.round(res.totalCollegeCost).toLocaleString('en-US')} for 4 years of college. At $${monthly}/mo, you will save $${Math.round(res.savingsAtStart).toLocaleString('en-US')} (${res.fundingPercent.toFixed(0)}% of the goal). Contributing $${Math.round(res.requiredMonthlyDeposit)}/mo would fully cover costs.`,
      };
    },
    formula: {
      formula: '\\text{Cost}_{t} = \\text{Cost}_0 \\times (1 + i_{\\text{college}})^t',
      explanation: 'Future college tuition compound escalates annually under higher-education specific inflation.',
      variables: [
        { symbol: 'Cost_0', name: 'Today Tuition', description: 'Current published sticker price for tuition, fees, and room & board' },
        { symbol: 'i_college', name: 'Tuition Inflation', description: 'Annual percentage increase in tuition' },
      ],
    },
    howItWorks: [
      'Enter your child\'s current age and current college fund balance.',
      'Enter today’s annual cost for your target university.',
      'Adjust tuition inflation and 529 expected investment rate of return.',
      'Review whether your current monthly contribution covers the projected gap.',
    ],
    example: {
      scenarioTitle: 'Saving for a 5-Year-Old for 4-Year In-State University',
      description: 'Starting with $5,000 for a 5-year-old facing $28,000/yr tuition growing at 5% inflation.',
      inputs: { 'Current Age': '5', 'Tuition Today': '$28,000/yr', 'Monthly': '$300/mo' },
      stepByStep: [
        'Years until college: 18 - 5 = 13 years.',
        'Freshman year tuition: $28,000 × (1.05)^13 = $52,800.',
        'Total 4-year tuition sum = ~$230,000.',
        'Projected savings at $300/mo = ~$94,000.',
      ],
      finalOutcome: 'Requires ~$745/month to 100% fund all 4 years without student loans.',
    },
    whatItMeans: '529 plans allow tax-free investment growth and tax-free withdrawals when used for qualified education expenses.',
    factorsToConsider: [
      'State income tax deductions on 529 plan contributions.',
      'Financial aid formulas (FAFSA treats parent-owned 529 assets favorably at max 5.64% inclusion).',
    ],
    faqs: [
      { question: 'What happens to unused 529 funds?', answer: 'Under SECURE 2.0, up to $35,000 of leftover 529 funds can be rolled over tax-free and penalty-free into the beneficiary\'s Roth IRA (subject to annual IRA limits and a 15-year account seasoning requirement).' },
    ],
    relatedCalculatorSlugs: ['compound-interest-calculator', 'savings-goal-calculator', 'tvm-calculator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Grounded in College Board annual trends in college pricing data.',
  },
  {
    slug: 'investment-income-calculator',
    name: 'Investment Income Calculator',
    h1Title: 'Investment Income & Dividend Cash Flow Calculator',
    category: 'finance-investment',
    badge: 'Cash Flow',
    shortDescription: 'Calculate monthly and annual dividend yields, interest distributions, and portfolio living cash flows.',
    longDescription: 'The Investment Income Calculator estimates how much passive cash flow your portfolio generates through dividend yields, bond interest, and real estate distributions without liquidating underlying principal.',
    seoTitle: 'Investment Income Calculator - Dividend & Interest Cash Flow',
    metaDescription: 'Calculate annual and monthly passive investment income from stocks, dividend ETFs, bonds, and savings with our free calculator.',
    keywords: ['investment income calculator', 'dividend income calculator', 'passive income calculator', 'portfolio yield', 'dividend cash flow'],
    inputs: [
      { id: 'portfolioBalance', label: 'Total Portfolio Balance', type: 'currency', defaultValue: 500000 },
      { id: 'dividendYield', label: 'Average Portfolio Yield / Dividend Rate (%)', type: 'percentage', defaultValue: 4.2 },
      { id: 'annualGrowth', label: 'Expected Annual Capital Growth (%)', type: 'percentage', defaultValue: 5.0 },
      { id: 'reinvestPct', label: 'Income Reinvestment Rate (%)', type: 'percentage', defaultValue: 0, helpText: '0% = withdraw all income to live on; 100% = reinvest all' },
    ],
    calculate: (inputs) => {
      const balance = Number(inputs.portfolioBalance) || 0;
      const yieldPct = Number(inputs.dividendYield) || 0;
      const growthPct = Number(inputs.annualGrowth) || 0;
      const reinvestPct = Number(inputs.reinvestPct) || 0;

      const grossAnnualIncome = balance * (yieldPct / 100);
      const grossMonthlyIncome = grossAnnualIncome / 12;
      const grossDailyIncome = grossAnnualIncome / 365;

      const withdrawnAnnual = grossAnnualIncome * (1 - reinvestPct / 100);
      const withdrawnMonthly = withdrawnAnnual / 12;

      const nextYearBalance = balance * (1 + growthPct / 100) + (grossAnnualIncome * (reinvestPct / 100));

      return {
        primaryResult: {
          id: 'monthly_income',
          label: 'Monthly Passive Income',
          value: withdrawnMonthly,
          format: 'currency',
          isPrimary: true,
        },
        metrics: [
          { id: 'annual_income', label: 'Annual Cash Flow', value: withdrawnAnnual, format: 'currency' },
          { id: 'daily_income', label: 'Daily Cash Flow', value: grossDailyIncome, format: 'currency' },
          { id: 'portfolio_yield', label: 'Dividend Yield', value: yieldPct, format: 'percentage' },
          { id: 'projected_balance', label: 'Projected Balance Next Year', value: nextYearBalance, format: 'currency' },
        ],
        summaryText: `A $${balance.toLocaleString('en-US')} portfolio yielding ${yieldPct}% delivers $${withdrawnMonthly.toLocaleString('en-US', { minimumFractionDigits: 2 })}/month ($${withdrawnAnnual.toLocaleString('en-US', { minimumFractionDigits: 2 })}/year) in passive income.`,
      };
    },
    formula: {
      formula: '\\text{Annual Income} = \\text{Portfolio Balance} \\times \\left( \\frac{\\text{Yield}\\%}{100} \\right)',
      explanation: 'Passive cash flow is directly proportional to your portfolio capital balance and dividend/interest distribution yields.',
      variables: [
        { symbol: 'Portfolio Balance', name: 'Principal Capital', description: 'Total value of dividend stocks, REITs, or bonds' },
        { symbol: 'Yield', name: 'Distribution Yield', description: 'Weighted dividend and interest payout rate' },
      ],
    },
    howItWorks: [
      'Enter your total investment capital.',
      'Enter the weighted dividend yield of your assets (e.g. S&P 500 is ~1.5%, high dividend ETFs ~3.5%–5%).',
      'Choose whether you are withdrawing 100% or reinvesting a portion.',
      'Review monthly, annual, and daily cash flow distributions.',
    ],
    example: {
      scenarioTitle: '$500,000 Dividend Portfolio at 4.2% Yield',
      description: 'Living off dividend distributions without touching share principal.',
      inputs: { 'Portfolio': '$500,000', 'Dividend Yield': '4.2%' },
      stepByStep: [
        'Annual income = $500,000 × 0.042 = $21,000.',
        'Monthly income = $21,000 / 12 = $1,750 per month.',
      ],
      finalOutcome: 'Provides $1,750/month in passive spendable income.',
    },
    whatItMeans: 'Living off yields prevents the need to sell shares during market downturns, eliminating sequence of returns risk.',
    factorsToConsider: [
      'Dividend cuts during severe economic recessions.',
      'Qualified dividend tax rates (0%, 15%, or 20%) vs ordinary income bond interest rates.',
    ],
    faqs: [
      { question: 'Can dividend yield alone sustain retirement?', answer: 'Yes, if your portfolio is large enough. A $1,000,000 portfolio at a 4% yield produces $40,000/year without consuming any underlying share principal.' },
    ],
    relatedCalculatorSlugs: ['retirement-income-calculator', 'dividend-tax-calculator', 'compound-interest-calculator', 'annuity-calculator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Cross-checked against standard equity income distribution schedules.',
  },
  {
    slug: 'mutual-fund-fee-calculator',
    name: 'Mutual Fund Fee Calculator',
    h1Title: 'Mutual Fund & ETF Expense Ratio Fee Calculator',
    category: 'finance-investment',
    badge: 'Fee Analysis',
    shortDescription: 'Calculate how mutual fund expense ratios, management fees, and 12b-1 charges drain long-term wealth.',
    longDescription: 'Investment management fees and high expense ratios can erode over 30%–40% of your total lifetime retirement savings. This calculator illustrates the compounding drag of fees on portfolio balances over 10 to 40 years.',
    seoTitle: 'Mutual Fund Fee Calculator - Expense Ratio Impact on Returns',
    metaDescription: 'Calculate how mutual fund fees, expense ratios, and management costs reduce your investment returns over time with our free tool.',
    keywords: ['mutual fund fee calculator', 'expense ratio calculator', 'fund fee impact', 'etf fee calculator', 'investment fees'],
    inputs: [
      { id: 'initialAmount', label: 'Initial Investment', type: 'currency', defaultValue: 20000 },
      { id: 'monthlyDeposit', label: 'Monthly Deposit', type: 'currency', defaultValue: 500 },
      { id: 'grossReturn', label: 'Gross Annual Return Before Fees (%)', type: 'percentage', defaultValue: 8.5 },
      { id: 'expenseRatio', label: 'Fund Expense Ratio + Advisor Fee (%)', type: 'percentage', defaultValue: 1.25, helpText: 'Low-cost index funds are ~0.03%-0.15%; actively managed funds average 0.8%-1.5%' },
      { id: 'years', label: 'Investment Time Horizon (Years)', type: 'years', defaultValue: 25 },
    ],
    calculate: (inputs) => {
      const init = Number(inputs.initialAmount) || 0;
      const mo = Number(inputs.monthlyDeposit) || 0;
      const gross = Number(inputs.grossReturn) || 0;
      const fee = Number(inputs.expenseRatio) || 0;
      const yrs = Number(inputs.years) || 1;

      const res = calculateMutualFundFeeImpact(init, mo, gross, fee, yrs);

      return {
        primaryResult: {
          id: 'lost_fees',
          label: 'Total Wealth Lost to Fees',
          value: res.totalLostToFees,
          format: 'currency',
          isPrimary: true,
          changeType: 'negative',
        },
        metrics: [
          { id: 'final_with_fees', label: 'Ending Portfolio Balance (With Fees)', value: res.finalBalanceWithFees, format: 'currency' },
          { id: 'final_without_fees', label: 'Potential Balance (0% Fees)', value: res.finalBalanceWithoutFees, format: 'currency' },
          { id: 'pct_lost', label: 'Percentage of Potential Wealth Lost', value: res.percentLostToFees, format: 'percentage', changeType: 'negative' },
        ],
        summaryText: `Over ${yrs} years, an ongoing ${fee}% fee reduces your ending balance from $${Math.round(res.finalBalanceWithoutFees).toLocaleString('en-US')} down to $${Math.round(res.finalBalanceWithFees).toLocaleString('en-US')} — costing you $${Math.round(res.totalLostToFees).toLocaleString('en-US')} (${res.percentLostToFees.toFixed(1)}% of potential wealth).`,
        insights: [
          {
            type: 'warning',
            title: 'Compounding Fee Drag',
            message: 'You don\'t just lose the fee; you lose all the compound interest that money would have earned for decades.',
          }
        ]
      };
    },
    formula: {
      formula: '\\text{Net Return} = \\text{Gross Return} - \\text{Expense Ratio}\\%',
      explanation: 'Compounded fee drag follows exponential curve because every dollar paid in fees reduces future compounding base.',
      variables: [
        { symbol: 'Gross Return', name: 'Market Return', description: 'Underlying asset performance before costs' },
        { symbol: 'Expense Ratio', name: 'Annual Fee', description: 'Percentage charged annually by fund managers' },
      ],
    },
    howItWorks: [
      'Enter your portfolio principal and regular monthly savings.',
      'Enter your anticipated gross market return (e.g. 8.5%).',
      'Enter the fund’s expense ratio (and financial advisor percentage if applicable).',
      'See total dollar cost and final balance comparison.',
    ],
    example: {
      scenarioTitle: '1.25% Active Mutual Fund vs 0.05% Low-Cost Index Fund',
      description: 'Starting with $20,000 and saving $500/month over 25 years at 8.5% market return.',
      inputs: { 'Gross Return': '8.5%', 'Fee': '1.25%', 'Years': '25' },
      stepByStep: [
        'Balance with 0% fees = $656,870.',
        'Balance with 1.25% fees (7.25% net) = $509,920.',
        'Total lost to fees = $146,950.',
      ],
      finalOutcome: 'Over $146,000 lost to a seemingly small 1.25% annual fee.',
    },
    whatItMeans: 'Every 1% reduction in fees translates to hundreds of thousands of dollars in extra retirement security.',
    factorsToConsider: [
      'Trading commissions, bid-ask spreads, and 12b-1 marketing fees.',
      'Tax inefficiency of actively managed mutual funds distributing high capital gains.',
    ],
    faqs: [
      { question: 'What is a reasonable expense ratio?', answer: 'Broad index ETFs (like VOO or VTI) have expense ratios of 0.03%–0.05% ($3–$5 per $10,000 invested). Anything over 0.50% requires strong quantitative justification.' },
    ],
    relatedCalculatorSlugs: ['compound-interest-calculator', 'roi-calculator', '401k-contribution-calculator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Verified using continuous compounding fee differential models.',
  },
  {
    slug: 'hsa-calculator',
    name: 'US Health Savings Account (HSA) Calculator',
    h1Title: 'Health Savings Account (HSA) Growth & Tax Calculator',
    category: 'finance-investment',
    badge: 'Tax Advantage',
    shortDescription: 'Calculate the triple tax advantage and long-term investment growth of a US Health Savings Account (HSA).',
    longDescription: 'Health Savings Accounts (HSAs) offer an unmatched triple tax advantage: tax-deductible contributions, tax-free investment growth, and tax-free withdrawals for qualified medical expenses. Calculate your balance at retirement.',
    seoTitle: 'HSA Calculator - Health Savings Account Growth & Tax Savings',
    metaDescription: 'Free Health Savings Account (HSA) Calculator. Calculate triple-tax-advantaged growth, tax savings, and future healthcare funds.',
    keywords: ['hsa calculator', 'health savings account', 'hsa growth calculator', 'triple tax advantage', 'hsa tax savings'],
    inputs: [
      { id: 'coverageType', label: 'Coverage Type', type: 'select', defaultValue: 'single', options: [
        { label: 'Self-Only Coverage (Max $4,300)', value: 'single' },
        { label: 'Family Coverage (Max $8,550)', value: 'family' },
      ]},
      { id: 'annualContribution', label: 'Your Annual Contribution', type: 'currency', defaultValue: 4300 },
      { id: 'currentBalance', label: 'Current HSA Balance', type: 'currency', defaultValue: 3000 },
      { id: 'marginalTaxRate', label: 'Marginal Income Tax Rate (%)', type: 'percentage', defaultValue: 24 },
      { id: 'ficaTaxRate', label: 'Payroll FICA Tax Savings (%)', type: 'percentage', defaultValue: 7.65, helpText: '7.65% Social Security & Medicare savings when contributed via payroll deduction' },
      { id: 'annualReturn', label: 'Expected Investment Return (%)', type: 'percentage', defaultValue: 7.5 },
      { id: 'yearsToGrow', label: 'Years Until Retirement / Withdrawal', type: 'years', defaultValue: 20 },
    ],
    calculate: (inputs) => {
      const contrib = Number(inputs.annualContribution) || 0;
      const current = Number(inputs.currentBalance) || 0;
      const fedTax = Number(inputs.marginalTaxRate) || 0;
      const fica = Number(inputs.ficaTaxRate) || 0;
      const rate = Number(inputs.annualReturn) || 0;
      const yrs = Number(inputs.yearsToGrow) || 1;

      const totalTaxRate = (fedTax + fica) / 100;
      const annualTaxSavings = contrib * totalTaxRate;
      const lifetimeTaxSavings = annualTaxSavings * yrs;

      const growth = calculateCompoundInterest({
        principal: current,
        monthlyDeposit: contrib / 12,
        annualRate: rate,
        years: yrs,
        compoundFrequency: 12,
        depositFrequency: 12,
      });

      return {
        primaryResult: {
          id: 'future_hsa',
          label: 'Future HSA Balance',
          value: growth.futureValue,
          format: 'currency',
          isPrimary: true,
        },
        metrics: [
          { id: 'annual_tax_saved', label: 'Annual Tax Savings', value: annualTaxSavings, format: 'currency', changeType: 'positive' },
          { id: 'lifetime_tax_saved', label: 'Lifetime Tax Deductions', value: lifetimeTaxSavings, format: 'currency', changeType: 'positive' },
          { id: 'interest_earned', label: 'Tax-Free Investment Growth', value: growth.totalInterestEarned, format: 'currency', changeType: 'positive' },
        ],
        summaryText: `By maxing your HSA over ${yrs} years, your account will grow to $${Math.round(growth.futureValue).toLocaleString('en-US')}, while saving you $${Math.round(annualTaxSavings).toLocaleString('en-US')} every year in federal and FICA taxes.`,
      };
    },
    formula: {
      formula: '\\text{Tax Saved} = \\text{Contribution} \\times (\\text{Fed Tax}\\% + \\text{FICA}\\%), \\quad \\text{FV} = P(1+r)^t + \\text{PMT}\\left[\\frac{(1+r)^t-1}{r}\\right]',
      explanation: 'HSAs avoid income tax and FICA payroll tax on the way in, compound tax-free, and withdraw tax-free for healthcare.',
      variables: [
        { symbol: 'Contribution', name: 'Annual HSA Deposit', description: 'Pre-tax contribution up to annual statutory IRS limits' },
        { symbol: 'FICA', name: 'Payroll Tax', description: '7.65% Social Security + Medicare deduction' },
      ],
    },
    howItWorks: [
      'Select your High Deductible Health Plan (HDHP) coverage tier (Single vs Family).',
      'Enter your annual contribution amount.',
      'Enter your marginal federal tax bracket and expected investment return.',
      'Review your accumulated nest egg and lifetime tax savings.',
    ],
    example: {
      scenarioTitle: 'Maxing Individual HSA for 20 Years at 24% Tax Bracket',
      description: 'Contributing $4,300/year invested at 7.5% return over 20 years.',
      inputs: { 'Annual Contribution': '$4,300', 'Tax Bracket': '24% + 7.65% FICA', 'Return': '7.5%' },
      stepByStep: [
        'Annual tax savings: $4,300 × 31.65% = $1,360.95/yr.',
        'Lifetime tax savings: $1,360.95 × 20 = $27,219.',
        'Total contributions = $86,000.',
        'HSA balance at Year 20 = ~$215,000 (tax-free for healthcare or ordinary income after age 65).',
      ],
      finalOutcome: 'HSA balance = ~$215,000 + $27,219 tax savings.',
    },
    whatItMeans: 'After age 65, HSA funds can be withdrawn for non-medical expenses penalty-free (taxed identically to a Traditional IRA).',
    factorsToConsider: [
      'Must be enrolled in an HSA-eligible High Deductible Health Plan (HDHP).',
      'Save receipts: You can reimburse yourself years later for medical expenses incurred today.',
    ],
    faqs: [
      { question: 'Do HSA funds expire at the end of the year?', answer: 'No! Unlike Flexible Spending Accounts (FSAs), HSA funds never expire. They roll over indefinitely and can be invested in index funds.' },
    ],
    relatedCalculatorSlugs: ['compound-interest-calculator', '401k-contribution-calculator', 'traditional-ira-vs-roth-ira'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Configured with 2026 IRS Revenue Procedure 2024-25 inflation adjustments.',
  },
  {
    slug: 'savings-goal-calculator',
    name: 'Savings Goal Calculator',
    h1Title: 'Savings Goal Calculator - Plan Your Target Date',
    category: 'finance-investment',
    badge: 'Goals',
    shortDescription: 'Calculate how much money you need to set aside each month to achieve your financial goal.',
    longDescription: 'Whether saving for an emergency fund, a house down payment, a dream vacation, or a new vehicle, this calculator shows the exact monthly deposit required to reach your target by your deadline.',
    seoTitle: 'Savings Goal Calculator - Calculate Monthly Savings to Reach a Target',
    metaDescription: 'Free Savings Goal Calculator. Find out how much you need to save each month or year to reach your financial target on time.',
    keywords: ['savings goal calculator', 'target savings calculator', 'monthly savings goal', 'emergency fund calculator', 'down payment savings'],
    inputs: [
      { id: 'targetAmount', label: 'Target Savings Goal', type: 'currency', defaultValue: 50000 },
      { id: 'currentAmount', label: 'Current Savings on Hand', type: 'currency', defaultValue: 5000 },
      { id: 'timeHorizonYears', label: 'Time Horizon (Years)', type: 'years', defaultValue: 3, min: 0.5, max: 30 },
      { id: 'interestRate', label: 'Annual Interest Rate / APY (%)', type: 'percentage', defaultValue: 4.5, helpText: 'High-Yield Savings Account (HYSA) rates are typically ~4-5%' },
    ],
    calculate: (inputs) => {
      const target = Number(inputs.targetAmount) || 0;
      const current = Number(inputs.currentAmount) || 0;
      const years = Number(inputs.timeHorizonYears) || 1;
      const rate = Number(inputs.interestRate) || 0;

      const months = Math.round(years * 12);
      const r = rate / 100 / 12;

      const fvCurrent = current * Math.pow(1 + r, months);
      const gap = Math.max(0, target - fvCurrent);

      let requiredMonthly = 0;
      if (r === 0) {
        requiredMonthly = gap / months;
      } else {
        requiredMonthly = gap / ((Math.pow(1 + r, months) - 1) / r);
      }

      const totalDeposited = current + (requiredMonthly * months);
      const interestEarned = Math.max(0, target - totalDeposited);

      return {
        primaryResult: {
          id: 'required_monthly',
          label: 'Required Monthly Deposit',
          value: requiredMonthly,
          format: 'currency',
          isPrimary: true,
        },
        metrics: [
          { id: 'total_needed', label: 'Goal Target', value: target, format: 'currency' },
          { id: 'interest_boost', label: 'Interest Contributed by Bank', value: interestEarned, format: 'currency', changeType: 'positive' },
          { id: 'total_out_of_pocket', label: 'Total Out-of-Pocket Cost', value: totalDeposited, format: 'currency' },
        ],
        summaryText: `To reach your $${target.toLocaleString('en-US')} goal in ${years} years, save $${Math.round(requiredMonthly).toLocaleString('en-US')}/month. Bank interest will contribute $${Math.round(interestEarned).toLocaleString('en-US')}.`,
      };
    },
    formula: {
      formula: '\\text{PMT} = \\frac{\\text{Target} - P(1+r)^n}{\\frac{(1+r)^n - 1}{r}}',
      explanation: 'Sinking fund formula determines uniform periodic payments required to accumulate a predetermined future sum.',
      variables: [
        { symbol: 'Target', name: 'Future Goal Amount', description: 'The target nest egg desired' },
        { symbol: 'P', name: 'Starting Balance', description: 'Initial funds already saved' },
        { symbol: 'r', name: 'Monthly Interest Rate', description: 'Annual APY divided by 12' },
        { symbol: 'n', name: 'Total Months', description: 'Time horizon in months' },
      ],
    },
    howItWorks: [
      'Enter your target savings dollar amount.',
      'Enter how much money you currently have set aside.',
      'Specify your deadline in years and your account APY.',
      'Instantly get the monthly savings figure required.',
    ],
    example: {
      scenarioTitle: 'Saving $50,000 Down Payment in 3 Years at 4.5% APY',
      description: 'Starting with $5,000 saved, aiming for $50,000 in 36 months.',
      inputs: { 'Target': '$50,000', 'Current': '$5,000', 'Years': '3', 'APY': '4.5%' },
      stepByStep: [
        'Starting $5,000 grows to $5,721 in 36 months at 4.5%.',
        'Remaining needed from monthly deposits = $44,279.',
        'Required monthly payment into HYSA = $1,152.48/mo.',
      ],
      finalOutcome: 'Save $1,152.48/month to hit $50,000 on schedule.',
    },
    whatItMeans: 'Having an automated monthly transfer makes hitting personal finance milestones disciplined and predictable.',
    factorsToConsider: [
      'Keep short-term savings (< 3-5 years) in FDIC-insured HYSAs or CDs, not volatile stocks.',
    ],
    faqs: [
      { question: 'What is a High Yield Savings Account (HYSA)?', answer: 'An HYSA is an FDIC-insured savings account offering 10x-15x higher interest than traditional brick-and-mortar checking accounts, with zero market risk.' },
    ],
    relatedCalculatorSlugs: ['compound-interest-calculator', 'cd-calculator', 'tvm-calculator', 'home-affordability-calculator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Standard sinking fund annuity formula.',
  },
  {
    slug: 'cd-calculator',
    name: 'Certificate of Deposit (CD) Calculator',
    h1Title: 'Certificate of Deposit (CD) Calculator',
    category: 'finance-investment',
    badge: 'Fixed Savings',
    shortDescription: 'Calculate APY compound interest earnings and early withdrawal penalty impacts on Certificates of Deposit.',
    longDescription: 'Certificates of Deposit (CDs) lock in fixed interest rates for a specified maturity term. This calculator computes total interest earned at maturity and simulates the financial impact of early withdrawal penalties.',
    seoTitle: 'CD Calculator - Certificate of Deposit Interest & APY Earnings',
    metaDescription: 'Free CD Calculator. Calculate Certificate of Deposit interest, maturity payout, APY earnings, and early withdrawal penalty costs.',
    keywords: ['cd calculator', 'certificate of deposit calculator', 'cd interest calculator', 'cd apy calculator', 'bank cd'],
    inputs: [
      { id: 'depositAmount', label: 'Initial CD Deposit', type: 'currency', defaultValue: 10000 },
      { id: 'cdTermMonths', label: 'CD Term Length (Months)', type: 'select', defaultValue: 12, options: [
        { label: '3 Months', value: 3 },
        { label: '6 Months', value: 6 },
        { label: '12 Months (1 Year)', value: 12 },
        { label: '18 Months', value: 18 },
        { label: '24 Months (2 Years)', value: 24 },
        { label: '36 Months (3 Years)', value: 36 },
        { label: '60 Months (5 Years)', value: 60 },
      ]},
      { id: 'apy', label: 'Annual Percentage Yield (APY %)', type: 'percentage', defaultValue: 4.8 },
      { id: 'compounding', label: 'Compounding Frequency', type: 'select', defaultValue: 12, options: [
        { label: 'Daily (365x / yr)', value: 365 },
        { label: 'Monthly (12x / yr)', value: 12 },
        { label: 'Semi-Annually (2x / yr)', value: 2 },
        { label: 'Annually (1x / yr)', value: 1 },
      ]},
      { id: 'penaltyMonths', label: 'Early Withdrawal Penalty (Months of Interest)', type: 'number', defaultValue: 3, helpText: 'Standard penalty is 3 to 6 months of interest if broken early' },
    ],
    calculate: (inputs) => {
      const p = Number(inputs.depositAmount) || 0;
      const termMonths = Number(inputs.cdTermMonths) || 12;
      const apyPct = Number(inputs.apy) || 0;
      const penaltyMo = Number(inputs.penaltyMonths) || 0;

      const tYears = termMonths / 12;
      const r = apyPct / 100;

      // FV with APY formula: P * (1 + APY)^t
      const futureValue = p * Math.pow(1 + r, tYears);
      const totalInterest = Math.max(0, futureValue - p);

      const monthlyInterestApprox = totalInterest / termMonths;
      const earlyPenaltyCost = monthlyInterestApprox * penaltyMo;
      const netPayoutIfBrokenEarly = Math.max(p - earlyPenaltyCost, futureValue - earlyPenaltyCost);

      return {
        primaryResult: {
          id: 'total_interest',
          label: 'Total Interest at Maturity',
          value: totalInterest,
          format: 'currency',
          isPrimary: true,
          changeType: 'positive',
        },
        metrics: [
          { id: 'maturity_value', label: 'Ending Balance at Maturity', value: futureValue, format: 'currency' },
          { id: 'monthly_rate', label: 'Average Monthly Interest', value: monthlyInterestApprox, format: 'currency' },
          { id: 'penalty_cost', label: `Early Penalty (${penaltyMo} mos)`, value: earlyPenaltyCost, format: 'currency', changeType: 'negative' },
        ],
        summaryText: `Your $${p.toLocaleString('en-US')} deposit will earn $${totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2 })} over ${termMonths} months, maturing at $${futureValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}.`,
      };
    },
    formula: {
      formula: 'A = P \\left(1 + \\frac{\\text{APY}}{100}\\right)^{\\frac{\\text{Months}}{12}}',
      explanation: 'APY incorporates compounding to represent the true annualized percentage yield earned on your fixed deposit.',
      variables: [
        { symbol: 'A', name: 'Maturity Balance', description: 'Total payout when the CD term completes' },
        { symbol: 'P', name: 'Principal Deposit', description: 'Initial cash locked in the CD' },
      ],
    },
    howItWorks: [
      'Select your CD deposit amount and fixed maturity term.',
      'Enter the promised bank APY.',
      'Review maturity totals and simulated early withdrawal penalty fees.',
    ],
    example: {
      scenarioTitle: '$10,000 in a 12-Month CD at 4.80% APY',
      description: 'Locking $10,000 for 1 full year with a 3-month interest penalty for early withdrawal.',
      inputs: { 'Principal': '$10,000', 'Term': '12 Months', 'APY': '4.80%' },
      stepByStep: [
        'Total interest at maturity = $10,000 × 0.048 = $480.00.',
        'Maturity payout = $10,480.00.',
        'If withdrawn early at month 6 with 3-month penalty: ($480/12) × 3 = $120 penalty deducted.',
      ],
      finalOutcome: 'Net profit at full maturity = $480.00 (Guaranteed FDIC insured).',
    },
    whatItMeans: 'CDs provide guaranteed interest immunity against central bank rate cuts during the locked term.',
    factorsToConsider: [
      'CD Ladders: Staggering maturities across 1, 2, 3, 4, and 5 years provides regular liquidity while maximizing rates.',
      'FDIC insurance limits: $250,000 per depositor per insured bank.',
    ],
    faqs: [
      { question: 'What is a CD Ladder?', answer: 'A CD Ladder is an investment strategy where you divide your cash into equal portions across CDs with different maturity dates (e.g. 6-mo, 1-yr, 2-yr, 3-yr), ensuring a portion of your money matures and becomes available on a continuous cycle.' },
    ],
    relatedCalculatorSlugs: ['savings-goal-calculator', 'compound-interest-calculator', 'bond-calculator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Standard Federal Reserve Truth in Savings Act (Regulation DD) calculation methods.',
  },
];
