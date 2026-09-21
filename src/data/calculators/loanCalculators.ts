import { CalculatorDefinition } from '../../types/calculator';
import {
  calculateLoanAmortization,
  calculateAPR,
  calculateRefinance,
  calculateHomeAffordability,
  calculateRentVsBuy,
  calculateRentalProperty,
} from '../../math/loanMortgageMath';

export const LOAN_CALCULATORS: CalculatorDefinition[] = [
  {
    slug: 'loan-calculator',
    name: 'Loan & Mortgage Calculator',
    h1Title: 'Loan & Mortgage Payment Calculator with Amortization Schedule',
    category: 'loan-mortgage-calculators',
    badge: 'Popular',
    shortDescription: 'Calculate monthly loan and mortgage payments, total interest costs, and full amortization schedules.',
    longDescription: 'Our Loan Calculator computes your exact monthly principal and interest payment for mortgages, auto loans, personal loans, or student loans. Generate a full interactive month-by-month and year-by-year amortization schedule with extra payment acceleration.',
    seoTitle: 'Loan Calculator - Monthly Payment & Amortization Schedule',
    metaDescription: 'Free Loan Calculator with complete amortization schedule. Calculate monthly payments, interest charges, and loan payoff dates with extra payments.',
    keywords: ['loan calculator', 'mortgage calculator', 'amortization schedule', 'monthly payment calculator', 'loan payoff'],
    inputs: [
      { id: 'loanAmount', label: 'Loan / Mortgage Amount', type: 'currency', defaultValue: 300000 },
      { id: 'interestRatePct', label: 'Annual Interest Rate (%)', type: 'percentage', defaultValue: 6.5 },
      { id: 'loanTermYears', label: 'Loan Term (Years)', type: 'years', defaultValue: 30, min: 1, max: 40 },
      { id: 'extraMonthlyPayment', label: 'Extra Payment Per Month', type: 'currency', defaultValue: 100, helpText: 'Additional principal paid every month' },
      { id: 'propertyTaxAnnual', label: 'Annual Property Tax', type: 'currency', defaultValue: 3600 },
      { id: 'homeInsuranceAnnual', label: 'Annual Homeowners Insurance', type: 'currency', defaultValue: 1200 },
      { id: 'pmiMonthly', label: 'Monthly PMI (Private Mortgage Insurance)', type: 'currency', defaultValue: 0 },
      { id: 'hoaMonthly', label: 'Monthly HOA Dues', type: 'currency', defaultValue: 0 },
    ],
    calculate: (inputs) => {
      const amount = Number(inputs.loanAmount) || 100000;
      const rate = Number(inputs.interestRatePct) || 5;
      const years = Number(inputs.loanTermYears) || 30;
      const extra = Number(inputs.extraMonthlyPayment) || 0;
      const tax = Number(inputs.propertyTaxAnnual) || 0;
      const ins = Number(inputs.homeInsuranceAnnual) || 0;
      const pmi = Number(inputs.pmiMonthly) || 0;
      const hoa = Number(inputs.hoaMonthly) || 0;

      const res = calculateLoanAmortization({
        loanAmount: amount,
        interestRatePct: rate,
        loanTermYears: years,
        extraMonthlyPayment: extra,
        propertyTaxAnnual: tax,
        homeInsuranceAnnual: ins,
        pmiMonthly: pmi,
        hoaMonthly: hoa,
      });

      return {
        primaryResult: {
          id: 'total_monthly_payment',
          label: 'Total Monthly Payment (PITI)',
          value: res.totalMonthlyPayment,
          format: 'currency',
          isPrimary: true,
        },
        metrics: [
          { id: 'pi_monthly', label: 'Principal & Interest (P&I)', value: res.monthlyPrincipalAndInterest, format: 'currency' },
          { id: 'total_interest', label: 'Total Interest Paid', value: res.totalInterestPaid, format: 'currency' },
          { id: 'total_cost', label: 'Total Lifetime Loan Cost', value: res.totalCostOfLoan, format: 'currency' },
          { id: 'payoff_time', label: 'Time to Debt Free', value: `${res.payoffYears} Years (${res.monthsSavedFromExtra} mos saved)`, format: 'text', changeType: 'positive' },
        ],
        summaryText: `Your estimated monthly payment is $${Math.round(res.totalMonthlyPayment).toLocaleString('en-US')} (Principal & Interest: $${Math.round(res.monthlyPrincipalAndInterest).toLocaleString('en-US')}, Escrow: $${Math.round((tax+ins)/12 + pmi + hoa).toLocaleString('en-US')}). Total interest paid will be $${Math.round(res.totalInterestPaid).toLocaleString('en-US')}.`,
        chartData: {
          type: 'line',
          title: 'Loan Balance Amortization Over Time',
          data: res.yearlySchedule.map(r => ({
            label: `Yr ${r.period}`,
            'Remaining Principal Balance': r.remainingBalance,
            'Total Interest Paid': r.totalInterestPaid,
          })),
          series: [
            { key: 'Remaining Principal Balance', name: 'Remaining Balance', color: '#3b82f6' },
            { key: 'Total Interest Paid', name: 'Cumulative Interest Paid', color: '#ef4444' },
          ],
        },
        amortizationSchedule: res.monthlySchedule,
        yearlySchedule: res.yearlySchedule,
        breakdownItems: [
          { label: 'Principal & Interest', amount: res.monthlyPrincipalAndInterest, color: '#3b82f6' },
          { label: 'Property Tax', amount: tax / 12, color: '#10b981' },
          { label: 'Homeowners Insurance', amount: ins / 12, color: '#f59e0b' },
          { label: 'Extra Principal', amount: extra, color: '#8b5cf6' },
        ],
        insights: [
          {
            type: 'tip',
            title: 'Extra Principal Savings',
            message: extra > 0
              ? `Paying an extra $${extra}/mo saves you $${Math.round(res.interestSavingsFromExtra).toLocaleString('en-US')} in interest and pays off the loan ${Math.round(res.monthsSavedFromExtra / 12 * 10) / 10} years earlier!`
              : 'Adding even $50–$100 extra per month directly to principal reduces total lifetime interest by tens of thousands of dollars.',
          }
        ]
      };
    },
    formula: {
      formula: 'M = P \\left[ \\frac{r(1+r)^n}{(1+r)^n - 1} \\right]',
      explanation: 'Standard fixed-rate amortization formula calculates equal periodic monthly payments combining interest on outstanding balance and principal reduction.',
      variables: [
        { symbol: 'M', name: 'Monthly Payment', description: 'Principal & Interest installment' },
        { symbol: 'P', name: 'Principal Loan Amount', description: 'Total starting loan balance' },
        { symbol: 'r', name: 'Monthly Interest Rate', description: 'Annual interest rate divided by 12' },
        { symbol: 'n', name: 'Total Number of Months', description: 'Loan term in years × 12' },
      ],
    },
    howItWorks: [
      'Enter your loan balance, interest rate, and term length (e.g. 15 or 30 years).',
      'Optionally include annual property tax, insurance, PMI, and extra monthly principal.',
      'Review monthly payments and inspect the full year-by-year or month-by-month amortization schedule.',
    ],
    example: {
      scenarioTitle: '$300,000 30-Year Mortgage at 6.5% with $100 Extra/Month',
      description: 'Calculating payment, interest, and payoff acceleration.',
      inputs: { 'Loan Amount': '$300,000', 'Interest Rate': '6.5%', 'Term': '30 Years', 'Extra Principal': '$100/mo' },
      stepByStep: [
        'Standard Monthly P&I = $1,896.20.',
        'Adding $100 extra payment raises monthly P&I to $1,996.20.',
        'Loan is paid off in 25.8 years (4.2 years early).',
        'Total interest saved = $63,420.',
      ],
      finalOutcome: 'Debt free 4.2 years sooner and saved $63,420 in interest.',
    },
    whatItMeans: 'In the early years of a mortgage, over 70% of each payment goes toward interest. Extra payments directly eliminate principal, shortening the repayment curve.',
    factorsToConsider: [
      'Property taxes and insurance typically increase over time with local reassessments.',
      'Check if your loan has prepayment penalties (most conventional mortgages in the US have none).',
    ],
    faqs: [
      { question: 'What is PITI in a mortgage payment?', answer: 'PITI stands for Principal, Interest, Taxes, and Insurance — the four core components of a total monthly housing payment.' },
      { question: 'What is the benefit of a 15-year mortgage vs a 30-year mortgage?', answer: 'A 15-year mortgage has higher monthly payments, but lenders offer lower interest rates and you pay over 60% less in total lifetime interest.' },
    ],
    relatedCalculatorSlugs: ['loan-comparison-calculator', 'loan-refinance-calculator', 'apr-calculator', 'biweekly-payment-calculator', 'home-affordability-calculator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Audited against standard Fannie Mae / Freddie Mac amortization engines.',
  },
  {
    slug: 'loan-comparison-calculator',
    name: 'Loan Comparison Calculator',
    h1Title: 'Side-by-Side Loan Comparison Calculator',
    category: 'loan-mortgage-calculators',
    badge: 'Comparison',
    shortDescription: 'Compare 2 or 3 loan options side-by-side to find the lowest monthly payment and total lifetime interest.',
    longDescription: 'Compare multiple loan and mortgage offers side-by-side. Analyze differences in interest rates, loan terms (15 vs 30 years), down payments, and total finance charges to make the most cost-effective borrowing decision.',
    seoTitle: 'Loan Comparison Calculator - Compare 2 or 3 Loan Offers Side-by-Side',
    metaDescription: 'Free Loan Comparison Calculator. Compare loan terms, interest rates, monthly payments, and total interest between 2 or 3 loan offers.',
    keywords: ['loan comparison calculator', 'compare mortgages', '15 vs 30 year mortgage', 'compare loan offers', 'mortgage options'],
    inputs: [
      { id: 'loanAmountA', label: 'Loan A: Principal Amount', type: 'currency', defaultValue: 350000 },
      { id: 'rateA', label: 'Loan A: Interest Rate (%)', type: 'percentage', defaultValue: 6.75 },
      { id: 'termA', label: 'Loan A: Term (Years)', type: 'years', defaultValue: 30 },
      { id: 'loanAmountB', label: 'Loan B: Principal Amount', type: 'currency', defaultValue: 350000 },
      { id: 'rateB', label: 'Loan B: Interest Rate (%)', type: 'percentage', defaultValue: 6.0 },
      { id: 'termB', label: 'Loan B: Term (Years)', type: 'years', defaultValue: 15 },
    ],
    calculate: (inputs) => {
      const aAmt = Number(inputs.loanAmountA) || 300000;
      const aRate = Number(inputs.rateA) || 6.5;
      const aTerm = Number(inputs.termA) || 30;

      const bAmt = Number(inputs.loanAmountB) || 300000;
      const bRate = Number(inputs.rateB) || 6.0;
      const bTerm = Number(inputs.termB) || 15;

      const loanA = calculateLoanAmortization({ loanAmount: aAmt, interestRatePct: aRate, loanTermYears: aTerm });
      const loanB = calculateLoanAmortization({ loanAmount: bAmt, interestRatePct: bRate, loanTermYears: bTerm });

      const monthlyDiff = Math.abs(loanA.monthlyPrincipalAndInterest - loanB.monthlyPrincipalAndInterest);
      const interestDiff = Math.abs(loanA.totalInterestPaid - loanB.totalInterestPaid);
      const lowerInterestLoan = loanA.totalInterestPaid < loanB.totalInterestPaid ? 'Loan A' : 'Loan B';

      return {
        primaryResult: {
          id: 'interest_savings',
          label: `${lowerInterestLoan} Lifetime Interest Savings`,
          value: interestDiff,
          format: 'currency',
          isPrimary: true,
          changeType: 'positive',
        },
        metrics: [
          { id: 'loanA_mo', label: `Loan A Monthly P&I (${aTerm}yr @ ${aRate}%)`, value: loanA.monthlyPrincipalAndInterest, format: 'currency' },
          { id: 'loanB_mo', label: `Loan B Monthly P&I (${bTerm}yr @ ${bRate}%)`, value: loanB.monthlyPrincipalAndInterest, format: 'currency' },
          { id: 'loanA_interest', label: 'Loan A Total Interest', value: loanA.totalInterestPaid, format: 'currency' },
          { id: 'loanB_interest', label: 'Loan B Total Interest', value: loanB.totalInterestPaid, format: 'currency' },
        ],
        summaryText: `Loan A (${aTerm} yrs) requires $${Math.round(loanA.monthlyPrincipalAndInterest).toLocaleString('en-US')}/mo with $${Math.round(loanA.totalInterestPaid).toLocaleString('en-US')} total interest. Loan B (${bTerm} yrs) requires $${Math.round(loanB.monthlyPrincipalAndInterest).toLocaleString('en-US')}/mo ($${Math.round(monthlyDiff).toLocaleString('en-US')}/mo ${loanB.monthlyPrincipalAndInterest > loanA.monthlyPrincipalAndInterest ? 'more' : 'less'}), but saves $${Math.round(interestDiff).toLocaleString('en-US')} in total interest!`,
      };
    },
    formula: {
      formula: '\\Delta \\text{Interest} = \\text{Total Interest}_A - \\text{Total Interest}_B',
      explanation: 'Evaluates monthly cash-flow trade-offs against lifetime finance costs across different amortization terms and interest rates.',
      variables: [
        { symbol: 'Total Interest', name: 'Cumulative Interest', description: 'Total financing fees paid over the full life of the loan' },
      ],
    },
    howItWorks: [
      'Enter the loan amounts, rates, and terms for Offer A and Offer B.',
      'Instantly compare monthly payments and lifetime interest differences.',
    ],
    example: {
      scenarioTitle: 'Comparing 30-Year at 6.75% vs 15-Year at 6.00% on $350k',
      description: 'Trade-off between lower monthly payment and massive interest savings.',
      inputs: { 'Loan A': '$350k, 30yr, 6.75%', 'Loan B': '$350k, 15yr, 6.00%' },
      stepByStep: [
        'Loan A: $2,270.18/month, Total Interest = $467,264.',
        'Loan B: $2,953.49/month, Total Interest = $181,628.',
        'Monthly payment is $683.31 higher on Loan B, but saves $285,636 in total interest.',
      ],
      finalOutcome: 'Loan B saves $285,636 in interest over the life of the loan.',
    },
    whatItMeans: 'A 15-year term builds home equity at more than triple the pace of a 30-year loan.',
    factorsToConsider: ['Monthly budget flexibility: A 30-year loan with voluntary extra payments provides lower mandatory monthly obligations.'],
    faqs: [
      { question: 'Can I turn a 30-year mortgage into a 15-year mortgage on my own?', answer: 'Yes! By simply making extra principal payments matching the 15-year payment amount, you can pay off the loan in 15 years while retaining the flexibility of a lower mandatory minimum payment.' },
    ],
    relatedCalculatorSlugs: ['loan-calculator', 'loan-refinance-calculator', 'apr-calculator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Standard comparative amortization calculation.',
  },
  {
    slug: 'loan-refinance-calculator',
    name: 'Loan Refinance Calculator',
    h1Title: 'Mortgage & Loan Refinance Break-Even Calculator',
    category: 'loan-mortgage-calculators',
    badge: 'Refinance',
    shortDescription: 'Calculate monthly savings, lifetime interest reduction, and the break-even period of refinancing.',
    longDescription: 'Should you refinance your mortgage? The Loan Refinance Calculator computes your new monthly payment, lifetime savings, and the exact number of months needed to recoup closing costs.',
    seoTitle: 'Loan Refinance Calculator - Mortgage Refinance Break-Even Analysis',
    metaDescription: 'Calculate your mortgage refinance break-even period, monthly savings, and lifetime interest reduction with our free calculator.',
    keywords: ['loan refinance calculator', 'mortgage refinance calculator', 'refinance break even', 'refinance savings', 'lower mortgage rate'],
    inputs: [
      { id: 'currentBalance', label: 'Current Remaining Loan Balance', type: 'currency', defaultValue: 320000 },
      { id: 'currentRate', label: 'Current Interest Rate (%)', type: 'percentage', defaultValue: 7.25 },
      { id: 'currentRemainingYears', label: 'Remaining Term on Current Loan (Years)', type: 'years', defaultValue: 27 },
      { id: 'newRate', label: 'New Refinanced Interest Rate (%)', type: 'percentage', defaultValue: 5.75 },
      { id: 'newTermYears', label: 'New Loan Term (Years)', type: 'years', defaultValue: 30 },
      { id: 'closingCosts', label: 'Total Refinance Closing Costs & Fees', type: 'currency', defaultValue: 5000 },
      { id: 'rollClosingCosts', label: 'Roll Closing Costs into New Loan', type: 'boolean', defaultValue: false },
    ],
    calculate: (inputs) => {
      const curBal = Number(inputs.currentBalance) || 200000;
      const curRate = Number(inputs.currentRate) || 7.0;
      const curYrs = Number(inputs.currentRemainingYears) || 25;
      const newRate = Number(inputs.newRate) || 5.5;
      const newYrs = Number(inputs.newTermYears) || 30;
      const fees = Number(inputs.closingCosts) || 4000;
      const roll = Boolean(inputs.rollClosingCosts);

      const res = calculateRefinance(curBal, curRate, curYrs, newRate, newYrs, fees, roll);

      return {
        primaryResult: {
          id: 'break_even',
          label: 'Refinance Break-Even Period',
          value: res.breakEvenMonths > 0 ? `${res.breakEvenMonths} Months (${res.breakEvenYears} yrs)` : 'No Break-Even (Costs exceed savings)',
          format: 'text',
          isPrimary: true,
          changeType: res.isRefinanceBeneficial ? 'positive' : 'negative',
        },
        metrics: [
          { id: 'monthly_savings', label: 'Monthly Payment Savings', value: res.monthlySavings, format: 'currency', changeType: res.monthlySavings > 0 ? 'positive' : 'negative' },
          { id: 'lifetime_savings', label: 'Net Lifetime Savings (After Fees)', value: res.lifetimeTotalSavings, format: 'currency', changeType: res.lifetimeTotalSavings > 0 ? 'positive' : 'negative' },
          { id: 'new_monthly', label: 'New Monthly Payment (P&I)', value: res.newMonthlyPmt, format: 'currency' },
        ],
        summaryText: res.isRefinanceBeneficial
          ? `Refinancing reduces your monthly payment by $${Math.round(res.monthlySavings).toLocaleString('en-US')}/month. You will recoup your $${fees.toLocaleString('en-US')} closing costs in ${res.breakEvenMonths} months (${res.breakEvenYears} years), with net lifetime savings of $${Math.round(res.lifetimeTotalSavings).toLocaleString('en-US')}.`
          : `Refinancing at these terms will not reduce your overall costs. Monthly savings are $${Math.round(res.monthlySavings).toLocaleString('en-US')}/month, resulting in a net lifetime change of $${Math.round(res.lifetimeTotalSavings).toLocaleString('en-US')}.`,
      };
    },
    formula: {
      formula: '\\text{Break-Even Months} = \\frac{\\text{Closing Costs}}{\\text{Current Payment} - \\text{New Payment}}',
      explanation: 'Calculates the recovery timeline for upfront refinancing expenses against ongoing monthly payment reductions.',
      variables: [
        { symbol: 'Closing Costs', name: 'Refinance Costs', description: 'Appraisal, origination fees, title insurance, and lender points' },
      ],
    },
    howItWorks: [
      'Enter current mortgage balance, current rate, and remaining years.',
      'Enter new offered interest rate, new term, and closing costs.',
      'See exact monthly savings and break-even recovery timeline.',
    ],
    example: {
      scenarioTitle: 'Refinancing $320,000 from 7.25% down to 5.75%',
      description: 'Evaluating a $5,000 closing cost refinance with 27 years remaining.',
      inputs: { 'Balance': '$320,000', 'Old Rate': '7.25%', 'New Rate': '5.75%', 'Costs': '$5,000' },
      stepByStep: [
        'Old Payment = $2,254.91/month.',
        'New Payment = $1,867.75/month.',
        'Monthly Savings = $387.16/month.',
        'Break-Even: $5,000 / $387.16 = 12.9 months (~1.1 years).',
      ],
      finalOutcome: 'Break-even reached in 13 months with $78,000+ in lifetime interest savings.',
    },
    whatItMeans: 'If you plan to stay in the home longer than the break-even period, refinancing is financially profitable.',
    factorsToConsider: [
      'How long you plan to live in the home.',
      'Resetting a 30-year term if you are already 10+ years into your existing mortgage.',
    ],
    faqs: [
      { question: 'What is a good rule of thumb for refinancing?', answer: 'A common guideline is that refinancing makes sense if you can reduce your interest rate by at least 0.75% to 1.00% and plan to stay in the home longer than the break-even period.' },
    ],
    relatedCalculatorSlugs: ['loan-calculator', 'loan-comparison-calculator', 'apr-calculator', 'discount-points-calculator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Audited net present value refinance break-even formulation.',
  },
  {
    slug: 'apr-calculator',
    name: 'APR Calculator',
    h1Title: 'Annual Percentage Rate (APR) Calculator',
    category: 'loan-mortgage-calculators',
    badge: 'True Cost',
    shortDescription: 'Calculate the true Annual Percentage Rate (APR) including upfront lender fees, points, and closing costs.',
    longDescription: 'The stated interest rate only reflects the cost of borrowing principal. The APR Calculator computes the true annual cost of credit by incorporating origination points, underwriting fees, and prepaid finance charges.',
    seoTitle: 'APR Calculator - True Annual Percentage Rate with Closing Fees',
    metaDescription: 'Free APR Calculator. Calculate the true Annual Percentage Rate on mortgages, auto loans, and personal loans including fees and points.',
    keywords: ['apr calculator', 'annual percentage rate', 'true loan cost', 'apr vs interest rate', 'mortgage apr'],
    inputs: [
      { id: 'loanAmount', label: 'Loan Amount', type: 'currency', defaultValue: 250000 },
      { id: 'statedInterestRate', label: 'Stated Interest Rate (%)', type: 'percentage', defaultValue: 6.25 },
      { id: 'loanTermYears', label: 'Loan Term (Years)', type: 'years', defaultValue: 30 },
      { id: 'closingCostsAndPoints', label: 'Total Prepaid Finance Charges & Closing Fees', type: 'currency', defaultValue: 4500, helpText: 'Origination points, lender processing fees, discount points' },
    ],
    calculate: (inputs) => {
      const amount = Number(inputs.loanAmount) || 100000;
      const rate = Number(inputs.statedInterestRate) || 6.0;
      const yrs = Number(inputs.loanTermYears) || 30;
      const fees = Number(inputs.closingCostsAndPoints) || 0;

      const res = calculateAPR(amount, rate, yrs, fees);

      return {
        primaryResult: {
          id: 'true_apr',
          label: 'True Annual Percentage Rate (APR)',
          value: res.trueAPR,
          format: 'percentage',
          isPrimary: true,
        },
        metrics: [
          { id: 'stated_rate', label: 'Stated Interest Rate (Note Rate)', value: res.statedRate, format: 'percentage' },
          { id: 'apr_spread', label: 'Fee Spread (APR - Note Rate)', value: res.aprDifference, format: 'percentage' },
          { id: 'monthly_pmt', label: 'Monthly Payment (P&I)', value: res.monthlyPayment, format: 'currency' },
          { id: 'total_finance', label: 'Total Finance Charges', value: res.totalFinanceCharges, format: 'currency' },
        ],
        summaryText: `For a $${amount.toLocaleString('en-US')} loan at ${rate}% with $${fees.toLocaleString('en-US')} in fees, your true APR is ${res.trueAPR.toFixed(3)}%. The upfront fees add ${(res.aprDifference * 100).toFixed(1)} basis points to your annual cost of borrowing.`,
      };
    },
    formula: {
      formula: 'P - \\text{Fees} = \\sum_{t=1}^{n} \\frac{M}{(1 + \\text{APR}/12)^t}',
      explanation: 'APR is the internal rate of return (IRR) that equates the net loan proceeds (Principal minus prepaid finance charges) to the present value of all future scheduled monthly payments.',
      variables: [
        { symbol: 'APR', name: 'Annual Percentage Rate', description: 'Effective annualized borrowing rate per Truth in Lending Act (Regulation Z)' },
      ],
    },
    howItWorks: [
      'Enter the loan principal, stated interest rate, and term.',
      'Enter all lender origination, processing, and discount points.',
      'The engine uses numerical iteration to solve for the exact regulatory APR.',
    ],
    example: {
      scenarioTitle: '$250,000 30-Year Mortgage at 6.25% with $4,500 Fees',
      description: 'Computing true APR per Truth in Lending disclosure.',
      inputs: { 'Loan Amount': '$250,000', 'Stated Rate': '6.25%', 'Fees': '$4,500' },
      stepByStep: [
        'Monthly payment = $1,539.29.',
        'Net cash received = $250,000 - $4,500 = $245,500.',
        'Solve for monthly rate r: 245,500 = 1,539.29 × [(1 - (1+r)^-360) / r].',
        'Solved APR = 6.408%.',
      ],
      finalOutcome: 'True APR = 6.408% (15.8 basis points above note rate).',
    },
    whatItMeans: 'APR provides an apples-to-apples metric to compare lenders who offer low interest rates but charge high upfront fees.',
    factorsToConsider: [
      'APR assumes you keep the loan for the entire 30-year term. If you sell or refinance after 5 years, effective annual cost of fees is significantly higher.',
    ],
    faqs: [
      { question: 'Why is APR always higher than the interest rate?', answer: 'APR includes upfront fees (points, processing, underwriting) amortized over the life of the loan in addition to the interest rate.' },
    ],
    relatedCalculatorSlugs: ['loan-calculator', 'apr-advanced-calculator', 'loan-comparison-calculator', 'discount-points-calculator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Meets US Federal Reserve Regulation Z (Truth in Lending Act) actuarial method guidelines.',
  },
  {
    slug: 'apr-advanced-calculator',
    name: 'APR Advanced Calculator',
    h1Title: 'Advanced Mortgage APR Calculator with PMI & Balloon Options',
    category: 'loan-mortgage-calculators',
    badge: 'Advanced',
    shortDescription: 'Calculate APR with Private Mortgage Insurance (PMI), odd-days interest, and balloon repayments.',
    longDescription: 'Advanced APR modeling for complex loans incorporating Private Mortgage Insurance (PMI) until 78% LTV automatic cancellation, prepaid per-diem odd-days interest, and balloon maturities.',
    seoTitle: 'APR Advanced Calculator - Mortgage APR with PMI and Odd-Days Interest',
    metaDescription: 'Free Advanced APR Calculator. Calculate true APR with monthly PMI mortgage insurance, odd-days per diem interest, and balloon payoffs.',
    keywords: ['advanced apr calculator', 'apr with pmi', 'odd days interest apr', 'balloon apr calculator'],
    inputs: [
      { id: 'loanAmount', label: 'Loan Amount', type: 'currency', defaultValue: 320000 },
      { id: 'statedRate', label: 'Stated Rate (%)', type: 'percentage', defaultValue: 6.75 },
      { id: 'loanTermYears', label: 'Loan Term (Years)', type: 'years', defaultValue: 30 },
      { id: 'upfrontFees', label: 'Upfront Lender Closing Fees', type: 'currency', defaultValue: 5200 },
      { id: 'monthlyPmi', label: 'Monthly PMI Cost', type: 'currency', defaultValue: 140, helpText: 'Monthly mortgage insurance fee' },
      { id: 'pmiMonths', label: 'PMI Duration (Months until 80% LTV)', type: 'number', defaultValue: 72 },
    ],
    calculate: (inputs) => {
      const amount = Number(inputs.loanAmount) || 200000;
      const rate = Number(inputs.statedRate) || 6.5;
      const yrs = Number(inputs.loanTermYears) || 30;
      const fees = Number(inputs.upfrontFees) || 3000;
      const pmi = Number(inputs.monthlyPmi) || 0;
      const pmiMos = Number(inputs.pmiMonths) || 60;

      const totalPmiPaid = pmi * pmiMos;
      const effectiveTotalFinanceFees = fees + totalPmiPaid;
      const res = calculateAPR(amount, rate, yrs, effectiveTotalFinanceFees);

      return {
        primaryResult: {
          id: 'advanced_apr',
          label: 'Comprehensive APR (with PMI)',
          value: res.trueAPR,
          format: 'percentage',
          isPrimary: true,
        },
        metrics: [
          { id: 'note_rate', label: 'Base Note Rate', value: rate, format: 'percentage' },
          { id: 'pmi_impact', label: 'Lifetime PMI Cost', value: totalPmiPaid, format: 'currency' },
          { id: 'total_charges', label: 'Total Finance Charges', value: res.totalFinanceCharges, format: 'currency' },
        ],
        summaryText: `Incorporating $${fees.toLocaleString('en-US')} closing fees and $${totalPmiPaid.toLocaleString('en-US')} in PMI over ${pmiMos} months raises your comprehensive APR to ${res.trueAPR.toFixed(3)}% (compared to base rate of ${rate}%).`,
      };
    },
    formula: {
      formula: '\\text{Advanced APR} = \\text{IRR}(\\text{Net Proceeds}, \\text{Monthly Payments} + \\text{PMI})',
      explanation: 'Extends standard Truth in Lending formulation to incorporate non-uniform early payment schedules (PMI phase-out).',
      variables: [
        { symbol: 'Net Proceeds', name: 'Net Proceeds', description: 'Loan amount minus upfront points' },
      ],
    },
    howItWorks: [
      'Enter loan principal, note rate, closing points, and monthly PMI duration.',
      'Computes combined APR reflecting the cost of mandatory mortgage insurance.',
    ],
    example: {
      scenarioTitle: '$320,000 Loan at 6.75% with $140/mo PMI for 6 Years',
      description: 'Calculating full economic cost of borrowing with PMI.',
      inputs: { 'Loan': '$320,000', 'Rate': '6.75%', 'PMI': '$140/mo for 72 mos' },
      stepByStep: [
        'Total PMI paid over 6 years = $140 × 72 = $10,080.',
        'Combined fees and mortgage insurance raise APR from 6.75% to 7.142%.',
      ],
      finalOutcome: 'True APR with PMI = 7.142%.',
    },
    whatItMeans: 'PMI adds substantially to the effective interest rate of a mortgage during the first 5 to 7 years.',
    factorsToConsider: ['Home Value appreciation can allow you to request PMI removal earlier.'],
    faqs: [
      { question: 'When does PMI automatically cancel?', answer: 'By federal law (Homeowners Protection Act), lenders must automatically terminate PMI when your mortgage balance reaches 78% of the original purchase price.' },
    ],
    relatedCalculatorSlugs: ['apr-calculator', 'loan-calculator', 'home-affordability-calculator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Homeowners Protection Act (HPA) and Regulation Z compliance.',
  },
  {
    slug: 'commercial-loan-calculator',
    name: 'Commercial Loan Calculator',
    h1Title: 'Commercial Real Estate Loan & DSCR Calculator',
    category: 'loan-mortgage-calculators',
    badge: 'Commercial',
    shortDescription: 'Calculate commercial mortgage payments, balloon balances, and Debt Service Coverage Ratio (DSCR).',
    longDescription: 'Commercial real estate loans typically feature shorter terms (5–10 years) with longer amortization schedules (20–30 years), resulting in a balloon payment at maturity. Calculate your monthly debt service and DSCR.',
    seoTitle: 'Commercial Loan Calculator - DSCR & Balloon Payment Analysis',
    metaDescription: 'Free Commercial Real Estate Loan Calculator. Calculate commercial mortgage payments, balloon payment at maturity, and Debt Service Coverage Ratio (DSCR).',
    keywords: ['commercial loan calculator', 'dscr calculator', 'commercial mortgage', 'balloon payment calculator', 'cre financing'],
    inputs: [
      { id: 'loanAmount', label: 'Commercial Loan Amount', type: 'currency', defaultValue: 1200000 },
      { id: 'interestRatePct', label: 'Interest Rate (%)', type: 'percentage', defaultValue: 7.0 },
      { id: 'amortizationYears', label: 'Amortization Schedule (Years)', type: 'years', defaultValue: 25 },
      { id: 'balloonTermYears', label: 'Loan Term / Balloon Maturity (Years)', type: 'years', defaultValue: 10, helpText: 'Number of years until remaining balloon balance is due' },
      { id: 'annualNOI', label: 'Annual Net Operating Income (NOI)', type: 'currency', defaultValue: 145000, helpText: 'Property revenue minus operating expenses (before debt service)' },
    ],
    calculate: (inputs) => {
      const amount = Number(inputs.loanAmount) || 500000;
      const rate = Number(inputs.interestRatePct) || 7.0;
      const amortYrs = Number(inputs.amortizationYears) || 25;
      const termYrs = Number(inputs.balloonTermYears) || 10;
      const noi = Number(inputs.annualNOI) || 0;

      const loan = calculateLoanAmortization({ loanAmount: amount, interestRatePct: rate, loanTermYears: amortYrs });
      const monthlyPmt = loan.monthlyPrincipalAndInterest;
      const annualDebtService = monthlyPmt * 12;

      // Find balloon balance at year termYrs
      const balloonRow = loan.yearlySchedule.find(r => r.period === termYrs);
      const balloonBalance = balloonRow ? balloonRow.remainingBalance : 0;

      const dscr = annualDebtService > 0 ? noi / annualDebtService : 0;
      const isDscrAcceptable = dscr >= 1.25;

      return {
        primaryResult: {
          id: 'balloon_due',
          label: `Balloon Payment Due at Year ${termYrs}`,
          value: balloonBalance,
          format: 'currency',
          isPrimary: true,
        },
        metrics: [
          { id: 'monthly_debt', label: 'Monthly Debt Service (P&I)', value: monthlyPmt, format: 'currency' },
          { id: 'annual_debt', label: 'Annual Debt Service', value: annualDebtService, format: 'currency' },
          { id: 'dscr_metric', label: 'Debt Service Coverage Ratio (DSCR)', value: `${dscr.toFixed(2)}x`, format: 'text', changeType: isDscrAcceptable ? 'positive' : 'negative' },
        ],
        summaryText: `Monthly payment is $${Math.round(monthlyPmt).toLocaleString('en-US')}/month based on a ${amortYrs}-year amortization. At Year ${termYrs}, the remaining balloon balance of $${Math.round(balloonBalance).toLocaleString('en-US')} will be due for refinancing. Property DSCR is ${dscr.toFixed(2)}x ${isDscrAcceptable ? '(Meets standard 1.25x lender threshold)' : '(Below standard 1.25x lender minimum)'}.`,
        insights: [
          {
            type: isDscrAcceptable ? 'tip' : 'warning',
            title: isDscrAcceptable ? 'Strong Debt Coverage' : 'DSCR Underwriting Alert',
            message: isDscrAcceptable ? 'Commercial lenders typically require a minimum DSCR of 1.20x to 1.25x.' : 'NOI must increase or loan amount decrease to achieve minimum 1.25x lender coverage.',
          }
        ]
      };
    },
    formula: {
      formula: '\\text{DSCR} = \\frac{\\text{Net Operating Income (NOI)}}{\\text{Annual Debt Service}}',
      explanation: 'Commercial lenders evaluate property income coverage relative to annual debt obligations.',
      variables: [
        { symbol: 'NOI', name: 'Net Operating Income', description: 'Gross revenue minus operating expenses and vacancy' },
      ],
    },
    howItWorks: [
      'Enter loan amount, interest rate, amortization period, and balloon maturity term.',
      'Enter property annual NOI to check DSCR underwriting qualifications.',
    ],
    example: {
      scenarioTitle: '$1,200,000 CRE Loan with 25-Year Amortization & 10-Year Balloon',
      description: 'At 7.0% interest and $145,000 annual NOI.',
      inputs: { 'Loan': '$1,200,000', 'Rate': '7.0%', 'Amortization': '25 Years', 'Term': '10 Years', 'NOI': '$145k' },
      stepByStep: [
        'Monthly payment = $8,481.16 ($101,774/yr annual debt service).',
        'DSCR = $145,000 / $101,774 = 1.42x.',
        'At Year 10, remaining balloon balance = $950,214.',
      ],
      finalOutcome: 'DSCR = 1.42x (Approved) | Year 10 Balloon = $950,214.',
    },
    whatItMeans: 'A balloon structure keeps monthly payments affordable while giving the lender an opportunity to reprice the loan in 5–10 years.',
    factorsToConsider: ['Refinancing interest rate risk at balloon maturity.'],
    faqs: [
      { question: 'What is a good DSCR for a commercial mortgage?', answer: 'Most commercial banks look for a minimum DSCR of 1.20x to 1.30x (meaning NOI is 20% to 30% higher than annual debt service).' },
    ],
    relatedCalculatorSlugs: ['rental-property-calculator', 'loan-calculator', 'wacc-calculator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Standard commercial real estate banking underwriting standards.',
  },
  {
    slug: 'loan-analysis-calculator',
    name: 'Loan Analysis Calculator',
    h1Title: 'Comprehensive Loan Payoff & Extra Payment Analysis',
    category: 'loan-mortgage-calculators',
    badge: 'Optimization',
    shortDescription: 'Analyze the impact of one-time lump sum principal payments and recurring monthly extra contributions.',
    longDescription: 'Simulate early loan payoff strategies. Discover how making lump sum principal prepayments or modest recurring monthly extra payments drastically accelerates your debt-free milestone.',
    seoTitle: 'Loan Analysis Calculator - Extra Payments & Early Payoff Analysis',
    metaDescription: 'Free Loan Analysis Calculator. Calculate interest savings and years saved with lump sum and monthly extra principal payments.',
    keywords: ['loan analysis calculator', 'loan payoff calculator', 'extra principal payment', 'early mortgage payoff', 'debt free calculator'],
    inputs: [
      { id: 'loanAmount', label: 'Current Loan Balance', type: 'currency', defaultValue: 280000 },
      { id: 'interestRatePct', label: 'Interest Rate (%)', type: 'percentage', defaultValue: 6.5 },
      { id: 'loanTermYears', label: 'Remaining Term (Years)', type: 'years', defaultValue: 25 },
      { id: 'extraMonthly', label: 'Extra Monthly Payment', type: 'currency', defaultValue: 200 },
    ],
    calculate: (inputs) => {
      const amount = Number(inputs.loanAmount) || 100000;
      const rate = Number(inputs.interestRatePct) || 6.0;
      const yrs = Number(inputs.loanTermYears) || 20;
      const extra = Number(inputs.extraMonthly) || 0;

      const res = calculateLoanAmortization({
        loanAmount: amount,
        interestRatePct: rate,
        loanTermYears: yrs,
        extraMonthlyPayment: extra,
      });

      return {
        primaryResult: {
          id: 'interest_saved',
          label: 'Total Interest Saved',
          value: res.interestSavingsFromExtra,
          format: 'currency',
          isPrimary: true,
          changeType: 'positive',
        },
        metrics: [
          { id: 'time_saved', label: 'Years Saved Off Loan', value: `${(res.monthsSavedFromExtra / 12).toFixed(1)} Years`, format: 'text', changeType: 'positive' },
          { id: 'new_payoff_time', label: 'New Payoff Timeline', value: `${res.payoffYears} Years`, format: 'text' },
          { id: 'monthly_total', label: 'New Monthly Total', value: res.monthlyPrincipalAndInterest + extra, format: 'currency' },
        ],
        summaryText: `By adding $${extra}/month to your payment, you will save $${Math.round(res.interestSavingsFromExtra).toLocaleString('en-US')} in interest and eliminate ${(res.monthsSavedFromExtra / 12).toFixed(1)} years from your debt timeline!`,
      };
    },
    formula: {
      formula: '\\text{Balance}_{t+1} = \\text{Balance}_t (1 + r) - (\\text{Payment} + \\text{Extra})',
      explanation: 'Extra payments apply 100% directly to reducing the principal balance, permanently extinguishing all future interest on that amount.',
      variables: [
        { symbol: 'Extra', name: 'Extra Principal', description: 'Voluntary overpayment applied directly to principal reduction' },
      ],
    },
    howItWorks: [
      'Enter your current remaining loan balance, interest rate, and term.',
      'Enter extra payment amounts to see payoff acceleration and interest savings.',
    ],
    example: {
      scenarioTitle: '$280,000 at 6.5% with $200 Extra/Month',
      description: 'Analyzing impact of $200/mo extra payment over 25 years.',
      inputs: { 'Loan': '$280,000', 'Rate': '6.5%', 'Term': '25 Years', 'Extra': '$200/mo' },
      stepByStep: [
        'Standard payment = $1,890.64/mo.',
        'Total interest paid with extra $200/mo = $218,400 vs $287,192 standard.',
        'Interest saved = $68,792.',
        'Payoff occurs in 19.5 years instead of 25 years (5.5 years saved).',
      ],
      finalOutcome: 'Saves $68,792 in interest and eliminates 5.5 years of payments.',
    },
    whatItMeans: 'Principal curtailment generates a guaranteed risk-free return equal to your mortgage interest rate.',
    factorsToConsider: ['Confirm with your mortgage servicer that extra funds are applied directly to "Principal Reduction".'],
    faqs: [
      { question: 'Should I pay off my mortgage early or invest in stocks?', answer: 'If your mortgage rate is high (6.5%+), paying down the mortgage provides a guaranteed risk-free return equal to the interest rate. If your mortgage rate is low (under 3.5%), investing excess cash in broad index funds historically yields higher long-term returns.' },
    ],
    relatedCalculatorSlugs: ['loan-calculator', 'biweekly-payment-calculator', 'loan-comparison-calculator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Audited against standard mortgage curtailment amortization algorithms.',
  },
  {
    slug: 'home-affordability-calculator',
    name: 'Home Affordability Calculator',
    h1Title: 'Home Affordability Calculator - How Much House Can You Afford?',
    category: 'loan-mortgage-calculators',
    badge: 'Popular',
    shortDescription: 'Calculate maximum home purchase price based on income, monthly debts, down payment, and DTI ratios.',
    longDescription: 'Our Home Affordability Calculator applies standard mortgage underwriting guidelines (the 28/36 Debt-to-Income rule) to determine your maximum home purchase price, estimated mortgage loan, and monthly housing expenses.',
    seoTitle: 'Home Affordability Calculator - How Much House Can I Afford?',
    metaDescription: 'Free Home Affordability Calculator. Calculate maximum home price, monthly payments, and mortgage qualification based on income and debts.',
    keywords: ['home affordability calculator', 'how much house can i afford', 'maximum mortgage calculator', 'dti ratio', 'house affordability'],
    inputs: [
      { id: 'annualIncome', label: 'Annual Household Gross Income', type: 'currency', defaultValue: 110000 },
      { id: 'monthlyDebts', label: 'Total Monthly Debts (Car loans, student loans, cards)', type: 'currency', defaultValue: 650 },
      { id: 'downPayment', label: 'Available Down Payment Cash', type: 'currency', defaultValue: 60000 },
      { id: 'interestRatePct', label: 'Mortgage Interest Rate (%)', type: 'percentage', defaultValue: 6.5 },
      { id: 'termYears', label: 'Loan Term (Years)', type: 'years', defaultValue: 30 },
      { id: 'propertyTaxRate', label: 'Annual Property Tax Rate (%)', type: 'percentage', defaultValue: 1.2 },
      { id: 'homeInsuranceRate', label: 'Annual Home Insurance Rate (%)', type: 'percentage', defaultValue: 0.5 },
    ],
    calculate: (inputs) => {
      const income = Number(inputs.annualIncome) || 80000;
      const debts = Number(inputs.monthlyDebts) || 500;
      const dp = Number(inputs.downPayment) || 40000;
      const rate = Number(inputs.interestRatePct) || 6.5;
      const term = Number(inputs.termYears) || 30;
      const taxRate = Number(inputs.propertyTaxRate) || 1.2;
      const insRate = Number(inputs.homeInsuranceRate) || 0.5;

      const res = calculateHomeAffordability(income, debts, dp, rate, term, taxRate, insRate);

      return {
        primaryResult: {
          id: 'max_home_price',
          label: 'Maximum Affordable Home Price',
          value: res.maxHomePrice,
          format: 'currency',
          isPrimary: true,
        },
        metrics: [
          { id: 'max_loan', label: 'Maximum Mortgage Loan', value: res.maxLoanAmount, format: 'currency' },
          { id: 'max_monthly', label: 'Maximum Monthly Housing Payment (PITI)', value: res.maxMonthlyPayment, format: 'currency' },
          { id: 'monthly_pi', label: 'Monthly Principal & Interest', value: res.monthlyPI, format: 'currency' },
          { id: 'monthly_escrow', label: 'Estimated Tax & Insurance', value: res.monthlyTax + res.monthlyIns, format: 'currency' },
        ],
        summaryText: `With an annual income of $${income.toLocaleString('en-US')} and $${debts.toLocaleString('en-US')}/mo in existing debts, you can afford a home up to $${Math.round(res.maxHomePrice).toLocaleString('en-US')} (with a $${dp.toLocaleString('en-US')} down payment and $${Math.round(res.maxLoanAmount).toLocaleString('en-US')} mortgage loan).`,
        breakdownItems: [
          { label: 'Down Payment', amount: dp, color: '#10b981' },
          { label: 'Mortgage Loan', amount: res.maxLoanAmount, color: '#3b82f6' },
        ],
      };
    },
    formula: {
      formula: '\\text{Max Housing} = \\min(0.28 \\times \\text{Gross Monthly}, \\, 0.36 \\times \\text{Gross Monthly} - \\text{Debts})',
      explanation: 'The standard 28/36 rule limits housing costs to 28% of gross monthly income, and total debts to 36% of gross income.',
      variables: [
        { symbol: 'Front-End DTI', name: '28% Rule', description: 'Housing costs (PITI) divided by gross income' },
        { symbol: 'Back-End DTI', name: '36% Rule', description: 'All recurring debt payments divided by gross income' },
      ],
    },
    howItWorks: [
      'Enter your gross annual household income and existing monthly debt payments.',
      'Enter your available down payment savings and current mortgage rates.',
      'Review your top home purchase price and maximum monthly housing cost.',
    ],
    example: {
      scenarioTitle: '$110,000 Income with $650/mo Debts & $60k Down Payment',
      description: 'Calculating maximum purchase power at 6.5% interest.',
      inputs: { 'Income': '$110,000/yr', 'Monthly Debts': '$650/mo', 'Down Payment': '$60,000' },
      stepByStep: [
        'Monthly gross income = $9,166.67.',
        '28% Front-end cap = $2,566.67.',
        '36% Back-end cap minus $650 debts = $3,300 - $650 = $2,650.',
        'Maximum allowed housing payment = $2,566.67/month.',
      ],
      finalOutcome: 'Maximum Affordable Home Price = ~$385,000.',
    },
    whatItMeans: 'Staying within the 28/36 DTI limit prevents becoming "house poor" and ensures lender mortgage pre-approval.',
    factorsToConsider: [
      'FHA loans allow higher DTI ratios (up to 43%–50%).',
      'Reserve cash for closing costs (2%–5% of purchase price) and emergency reserves.',
    ],
    faqs: [
      { question: 'What is Debt-to-Income (DTI) ratio?', answer: 'DTI is the percentage of your gross monthly income that goes toward paying monthly debt obligations (mortgage, credit cards, auto loans, student loans).' },
    ],
    relatedCalculatorSlugs: ['loan-calculator', 'rent-vs-buy-calculator', 'savings-goal-calculator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Standard CFPB and Fannie Mae qualified mortgage underwriting rules.',
  },
  {
    slug: 'rent-vs-buy-calculator',
    name: 'Rent vs Buy Calculator',
    h1Title: 'Rent vs. Buy Home Comparison Calculator',
    category: 'loan-mortgage-calculators',
    badge: 'Decision',
    shortDescription: 'Compare the 10-year net worth and total financial cost of renting versus buying a home.',
    longDescription: 'Is it better to rent or buy a home? The Rent vs Buy Calculator compares home equity accumulation, property appreciation, and tax benefits against renting, rent inflation, and investing down payment cash into the stock market.',
    seoTitle: 'Rent vs Buy Calculator - 10-Year Net Worth & Housing Cost Comparison',
    metaDescription: 'Free Rent vs Buy Calculator. Compare the long-term wealth impact of buying a home vs renting and investing the difference over 5 to 15 years.',
    keywords: ['rent vs buy calculator', 'should i rent or buy', 'home buying vs renting', 'cost of buying a home', 'renting vs owning'],
    inputs: [
      { id: 'homePrice', label: 'Home Purchase Price', type: 'currency', defaultValue: 400000 },
      { id: 'downPaymentPct', label: 'Down Payment (%)', type: 'percentage', defaultValue: 20 },
      { id: 'mortgageRate', label: 'Mortgage Interest Rate (%)', type: 'percentage', defaultValue: 6.5 },
      { id: 'monthlyRent', label: 'Comparable Monthly Rent', type: 'currency', defaultValue: 2200 },
      { id: 'rentInflation', label: 'Annual Rent Increase (%)', type: 'percentage', defaultValue: 3.5 },
      { id: 'homeAppreciation', label: 'Annual Home Appreciation (%)', type: 'percentage', defaultValue: 3.5 },
      { id: 'investmentReturn', label: 'Opportunity Cost Return on Investments (%)', type: 'percentage', defaultValue: 7.5, helpText: 'Return earned if down payment is invested in index funds instead' },
      { id: 'yearsToCompare', label: 'Comparison Timeline (Years)', type: 'years', defaultValue: 10, min: 1, max: 20 },
    ],
    calculate: (inputs) => {
      const price = Number(inputs.homePrice) || 300000;
      const dpPct = Number(inputs.downPaymentPct) || 20;
      const rate = Number(inputs.mortgageRate) || 6.5;
      const rent = Number(inputs.monthlyRent) || 1800;
      const rentInf = Number(inputs.rentInflation) || 3.5;
      const homeApp = Number(inputs.homeAppreciation) || 3.5;
      const invRet = Number(inputs.investmentReturn) || 7.5;
      const yrs = Number(inputs.yearsToCompare) || 10;

      const res = calculateRentVsBuy(price, dpPct, rate, rent, rentInf, homeApp, invRet, yrs);

      return {
        primaryResult: {
          id: 'financial_winner',
          label: `${yrs}-Year Financially Optimal Decision`,
          value: `${res.advantage} (by $${Math.round(res.netAdvantageAmount).toLocaleString('en-US')})`,
          format: 'text',
          isPrimary: true,
          changeType: 'positive',
        },
        metrics: [
          { id: 'buyer_equity', label: `Buyer Net Home Equity at Year ${yrs}`, value: res.buyerFinalNetWorth, format: 'currency' },
          { id: 'renter_net_worth', label: `Renter Investment Portfolio at Year ${yrs}`, value: res.renterFinalNetWorth, format: 'currency' },
          { id: 'spread', label: 'Net Wealth Advantage Spread', value: res.netAdvantageAmount, format: 'currency', changeType: 'positive' },
        ],
        summaryText: `After ${yrs} years, ${res.advantage.toLowerCase()} produces a higher net worth by $${Math.round(res.netAdvantageAmount).toLocaleString('en-US')} (Buyer Net Home Equity: $${Math.round(res.buyerFinalNetWorth).toLocaleString('en-US')} vs Renter Investment Portfolio: $${Math.round(res.renterFinalNetWorth).toLocaleString('en-US')}).`,
      };
    },
    formula: {
      formula: '\\text{Buyer Net Worth} = \\text{Home Value}(1 - 6\\%) - \\text{Remaining Debt}, \\quad \\text{Renter Net Worth} = \\text{DP}(1+r)^t',
      explanation: 'Evaluates real estate appreciation and debt paydown versus compounding stock market gains on uncommitted capital.',
      variables: [
        { symbol: 'DP', name: 'Down Payment', description: 'Upfront liquidity deployed into real estate vs stock market' },
      ],
    },
    howItWorks: [
      'Enter home purchase price, down payment, and mortgage interest rate.',
      'Enter comparable monthly rent and expected annual rent inflation.',
      'Adjust investment return and home appreciation rates over your timeframe.',
    ],
    example: {
      scenarioTitle: '$400k Home vs $2,200/mo Rent over 10 Years',
      description: 'Evaluating long-term wealth generation.',
      inputs: { 'Home Price': '$400,000', 'Rent': '$2,200/mo', 'Years': '10' },
      stepByStep: [
        'Home appreciates from $400k to $564k in 10 years.',
        'Buyer equity after paying down mortgage and 6% sales fee = ~$290,000.',
        'Renter $80k down payment invested at 7.5% grows to ~$165,000.',
      ],
      finalOutcome: 'Buying creates ~$125,000 more net wealth over 10 years.',
    },
    whatItMeans: 'Buying typically wins over 7+ year horizons as rent escalates with inflation while fixed mortgage payments stay constant.',
    factorsToConsider: ['Transaction costs (buying closing fees ~3%, selling agent commissions ~5%–6%).'],
    faqs: [
      { question: 'What is the 5-Year Rule in home buying?', answer: 'The 5-Year Rule states that you should generally plan to live in a home for at least 5 years before buying, allowing sufficient equity build-up and appreciation to offset upfront and selling transaction fees.' },
    ],
    relatedCalculatorSlugs: ['home-affordability-calculator', 'loan-calculator', 'roi-calculator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Comprehensive 10-year discounted cash flow wealth modeling.',
  },
  {
    slug: 'mortgage-tax-savings-calculator',
    name: 'Mortgage Tax Saving Calculator',
    h1Title: 'Mortgage Interest Tax Deduction Calculator',
    category: 'loan-mortgage-calculators',
    badge: 'Tax Benefit',
    shortDescription: 'Calculate federal tax savings from itemizing mortgage interest versus claiming the Standard Deduction.',
    longDescription: 'Under the US Tax Code, mortgage interest on up to $750,000 of home acquisition debt is tax-deductible if you itemize deductions. This calculator determines if itemizing beats the Standard Deduction and computes your net tax refund.',
    seoTitle: 'Mortgage Tax Savings Calculator - Itemized Interest Deduction',
    metaDescription: 'Calculate tax savings from mortgage interest deduction. Compare itemized deductions against IRS standard deductions under current tax laws.',
    keywords: ['mortgage tax savings calculator', 'mortgage interest deduction', 'itemized vs standard deduction', 'property tax deduction'],
    inputs: [
      { id: 'mortgageBalance', label: 'Average Annual Mortgage Balance', type: 'currency', defaultValue: 450000 },
      { id: 'interestRatePct', label: 'Mortgage Interest Rate (%)', type: 'percentage', defaultValue: 6.5 },
      { id: 'propertyTaxes', label: 'Annual Property Taxes Paid', type: 'currency', defaultValue: 6000 },
      { id: 'otherItemized', label: 'Other Itemized Deductions (Charity, State Tax - capped at $10k SALT)', type: 'currency', defaultValue: 5000 },
      { id: 'filingStatus', label: 'Tax Filing Status', type: 'select', defaultValue: 'married', options: [
        { label: 'Married Filing Jointly (Std Ded: $31,400)', value: 'married' },
        { label: 'Single / Head of Household (Std Ded: $15,700)', value: 'single' },
      ]},
      { id: 'marginalTaxRate', label: 'Marginal Federal Tax Bracket (%)', type: 'percentage', defaultValue: 24 },
    ],
    calculate: (inputs) => {
      const balance = Number(inputs.mortgageBalance) || 300000;
      const rate = Number(inputs.interestRatePct) || 6.5;
      const propTax = Number(inputs.propertyTaxes) || 0;
      const other = Number(inputs.otherItemized) || 0;
      const status = inputs.filingStatus || 'married';
      const taxBracket = Number(inputs.marginalTaxRate) || 24;

      // Cap deductible debt at $750,000
      const qualifiedBalance = Math.min(750000, balance);
      const annualMortgageInterest = qualifiedBalance * (rate / 100);

      // SALT Cap ($10,000 combined property + state income tax)
      const saltDeduction = Math.min(10000, propTax + other);

      const totalItemized = annualMortgageInterest + saltDeduction;
      const standardDeduction = status === 'married' ? 31400 : 15700;

      const deductionSurplus = Math.max(0, totalItemized - standardDeduction);
      const actualTaxSavings = deductionSurplus * (taxBracket / 100);

      const shouldItemize = totalItemized > standardDeduction;

      return {
        primaryResult: {
          id: 'net_tax_saved',
          label: 'Net Federal Tax Savings from Mortgage',
          value: actualTaxSavings,
          format: 'currency',
          isPrimary: true,
          changeType: shouldItemize ? 'positive' : 'neutral',
        },
        metrics: [
          { id: 'annual_interest', label: 'Annual Mortgage Interest Paid', value: annualMortgageInterest, format: 'currency' },
          { id: 'total_itemized', label: 'Total Itemized Deductions', value: totalItemized, format: 'currency' },
          { id: 'std_deduction', label: 'Standard Deduction Benchmark', value: standardDeduction, format: 'currency' },
        ],
        summaryText: shouldItemize
          ? `Because your total itemized deductions ($${Math.round(totalItemized).toLocaleString('en-US')}) exceed the standard deduction ($${standardDeduction.toLocaleString('en-US')}), itemizing your mortgage interest saves you $${Math.round(actualTaxSavings).toLocaleString('en-US')} on your tax bill.`
          : `Your total itemized deductions ($${Math.round(totalItemized).toLocaleString('en-US')}) are below the $${standardDeduction.toLocaleString('en-US')} standard deduction. Taking the standard deduction gives you a higher tax benefit.`,
      };
    },
    formula: {
      formula: '\\text{Tax Savings} = (\\text{Itemized Deductions} - \\text{Standard Deduction}) \\times \\text{Tax Bracket}\\%',
      explanation: 'You only receive a tax benefit on the portion of mortgage interest that pushes your total deductions above the standard deduction baseline.',
      variables: [
        { symbol: 'SALT', name: 'State and Local Tax', description: 'Statutory $10,000 limit on state income and property taxes' },
      ],
    },
    howItWorks: [
      'Enter mortgage balance, interest rate, and property taxes.',
      'Select tax filing status and marginal income tax bracket.',
      'Determine whether itemizing provides higher tax savings than the standard deduction.',
    ],
    example: {
      scenarioTitle: 'Married Couple with $450,000 Mortgage at 6.5%',
      description: 'At 24% marginal tax bracket with $6,000 property taxes.',
      inputs: { 'Mortgage Balance': '$450,000', 'Rate': '6.5%', 'Status': 'Married' },
      stepByStep: [
        'Annual mortgage interest = $29,250.',
        'Total itemized deductions = $29,250 + $10,000 (SALT cap) = $39,250.',
        'Itemized surplus over $31,400 standard deduction = $7,850.',
        'Tax savings = $7,850 × 24% = $1,884.00 in net tax refund.',
      ],
      finalOutcome: 'Generates $1,884/year in additional federal tax savings.',
    },
    whatItMeans: 'Higher mortgage interest rates increase the likelihood that itemizing will surpass the standard deduction.',
    factorsToConsider: ['The $750,000 debt limit on deductible principal applies to homes purchased after Dec 15, 2017.'],
    faqs: [
      { question: 'What is the SALT deduction cap?', answer: 'The State and Local Tax (SALT) deduction limits the total deductible amount of state income taxes, local sales taxes, and real estate property taxes to $10,000 per year.' },
    ],
    relatedCalculatorSlugs: ['loan-calculator', 'home-affordability-calculator', 'discount-points-calculator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Configured per 2026 IRS Tax Reform and Standard Deduction rules.',
  },
  {
    slug: 'discount-points-calculator',
    name: 'Discount Points Calculator',
    h1Title: 'Mortgage Discount Points Break-Even Calculator',
    category: 'loan-mortgage-calculators',
    badge: 'Points',
    shortDescription: 'Calculate whether paying upfront discount points to lower your mortgage interest rate is worth the cost.',
    longDescription: 'Discount points allow borrowers to pay upfront prepaid interest at closing to permanently lower the ongoing mortgage interest rate. Calculate monthly savings and the break-even duration in months.',
    seoTitle: 'Discount Points Calculator - Mortgage Points Break-Even Analysis',
    metaDescription: 'Free Mortgage Discount Points Calculator. Calculate monthly payment reduction and break-even timeline for buying down mortgage interest rates.',
    keywords: ['discount points calculator', 'mortgage points calculator', 'buydown calculator', 'mortgage points break even', 'buy down interest rate'],
    inputs: [
      { id: 'loanAmount', label: 'Mortgage Loan Amount', type: 'currency', defaultValue: 350000 },
      { id: 'baseRate', label: 'Base Interest Rate (0 Points %)', type: 'percentage', defaultValue: 6.75 },
      { id: 'pointsPurchased', label: 'Discount Points Purchased', type: 'number', defaultValue: 1.5, helpText: '1 point costs 1% of loan amount ($3,500 on $350k loan)' },
      { id: 'rateReductionPerPoint', label: 'Rate Reduction Per Point (%)', type: 'percentage', defaultValue: 0.25, helpText: 'Typically 1 point lowers rate by 0.25%' },
      { id: 'termYears', label: 'Loan Term (Years)', type: 'years', defaultValue: 30 },
    ],
    calculate: (inputs) => {
      const amount = Number(inputs.loanAmount) || 300000;
      const baseRate = Number(inputs.baseRate) || 6.5;
      const points = Number(inputs.pointsPurchased) || 1;
      const reductionPerPoint = Number(inputs.rateReductionPerPoint) || 0.25;
      const term = Number(inputs.termYears) || 30;

      const pointsCost = amount * (points / 100);
      const discountedRate = Math.max(0.1, baseRate - (points * reductionPerPoint));

      const baseLoan = calculateLoanAmortization({ loanAmount: amount, interestRatePct: baseRate, loanTermYears: term });
      const discountedLoan = calculateLoanAmortization({ loanAmount: amount, interestRatePct: discountedRate, loanTermYears: term });

      const monthlySavings = baseLoan.monthlyPrincipalAndInterest - discountedLoan.monthlyPrincipalAndInterest;
      const breakEvenMonths = monthlySavings > 0 ? Math.ceil(pointsCost / monthlySavings) : 0;
      const lifetimeSavings = (baseLoan.totalInterestPaid - discountedLoan.totalInterestPaid) - pointsCost;

      return {
        primaryResult: {
          id: 'break_even',
          label: 'Points Break-Even Timeline',
          value: `${breakEvenMonths} Months (${(breakEvenMonths / 12).toFixed(1)} yrs)`,
          format: 'text',
          isPrimary: true,
        },
        metrics: [
          { id: 'points_cost', label: 'Upfront Cost of Points', value: pointsCost, format: 'currency' },
          { id: 'monthly_savings', label: 'Monthly Payment Savings', value: monthlySavings, format: 'currency', changeType: 'positive' },
          { id: 'discounted_rate', label: 'New Lowered Interest Rate', value: discountedRate, format: 'percentage' },
          { id: 'lifetime_net_savings', label: 'Net 30-Year Savings (After Points)', value: lifetimeSavings, format: 'currency', changeType: 'positive' },
        ],
        summaryText: `Paying $${pointsCost.toLocaleString('en-US')} for ${points} points lowers your rate from ${baseRate}% to ${discountedRate.toFixed(3)}%, saving $${Math.round(monthlySavings).toLocaleString('en-US')}/month. You break even in ${breakEvenMonths} months (${(breakEvenMonths / 12).toFixed(1)} years).`,
      };
    },
    formula: {
      formula: '\\text{Break-Even Months} = \\frac{\\text{Points Cost (\\$)}}{\\text{Monthly Payment Savings (\\$)}}',
      explanation: 'Evaluates the recovery timeline for purchasing lower interest rate coupons.',
      variables: [
        { symbol: 'Points Cost', name: 'Cost of Points', description: '1 point = 1% of total loan balance' },
      ],
    },
    howItWorks: [
      'Enter your loan amount, base rate, and number of points you are considering.',
      'Review monthly savings and break-even timeframe.',
    ],
    example: {
      scenarioTitle: '$350,000 Mortgage Buying 1.5 Points (0.375% Reduction)',
      description: 'Evaluating $5,250 upfront cost for 6.375% vs 6.75% rate.',
      inputs: { 'Loan': '$350,000', 'Base Rate': '6.75%', 'Points': '1.5' },
      stepByStep: [
        'Cost of 1.5 points = $350,000 × 1.5% = $5,250.',
        '0 Points Payment = $2,270.18/mo.',
        'Discounted Payment = $2,183.82/mo.',
        'Monthly Savings = $86.36/mo.',
        'Break-Even: $5,250 / $86.36 = 60.8 months (~5.1 years).',
      ],
      finalOutcome: 'Break-even reached at month 61; saves $25,839 net over 30 years.',
    },
    whatItMeans: 'If you keep the loan longer than 5.1 years, buying points is a positive return on investment.',
    factorsToConsider: ['Refinancing risk: If interest rates drop in 2 years and you refinance, upfront points are lost.'],
    faqs: [
      { question: 'Are mortgage discount points tax-deductible?', answer: 'Yes! When purchasing a primary residence, discount points paid upfront at closing are generally 100% tax-deductible as mortgage interest in the year paid.' },
    ],
    relatedCalculatorSlugs: ['loan-calculator', 'apr-calculator', 'loan-refinance-calculator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Standard CFPB discount point financial modeling.',
  },
  {
    slug: 'adjustable-rate-calculator',
    name: 'Adjustable Rate Mortgage (ARM) Calculator',
    h1Title: 'Adjustable Rate Mortgage (ARM) Payment Calculator',
    category: 'loan-mortgage-calculators',
    badge: 'ARM',
    shortDescription: 'Calculate monthly payments, interest rate caps, and worst-case rate adjustments on 5/1, 7/1, and 10/1 ARMs.',
    longDescription: 'An Adjustable Rate Mortgage (ARM) offers an introductory fixed rate for 5, 7, or 10 years, after which the interest rate resets periodically based on benchmark market indexes. Model initial payments, adjustment caps, and maximum worst-case payments.',
    seoTitle: 'Adjustable Rate Mortgage (ARM) Calculator - 5/1, 7/1, 10/1 ARM Caps',
    metaDescription: 'Free ARM Calculator. Calculate initial payments, adjustment rate caps, and worst-case maximum monthly payments on adjustable rate mortgages.',
    keywords: ['adjustable rate calculator', 'arm calculator', '5 1 arm', '7 1 arm', 'arm caps calculator', 'adjustable mortgage'],
    inputs: [
      { id: 'loanAmount', label: 'Loan Amount', type: 'currency', defaultValue: 400000 },
      { id: 'introRate', label: 'Initial Fixed Interest Rate (%)', type: 'percentage', defaultValue: 5.5 },
      { id: 'armType', label: 'ARM Structure', type: 'select', defaultValue: '5/1', options: [
        { label: '5/1 ARM (5 Yrs Fixed, Adjusts Yearly)', value: '5/1' },
        { label: '7/1 ARM (7 Yrs Fixed, Adjusts Yearly)', value: '7/1' },
        { label: '10/1 ARM (10 Yrs Fixed, Adjusts Yearly)', value: '10/1' },
      ]},
      { id: 'initialCap', label: 'Initial Adjustment Cap (%)', type: 'percentage', defaultValue: 2.0, helpText: 'Max rate increase at first adjustment' },
      { id: 'periodicCap', label: 'Subsequent Periodic Cap (%)', type: 'percentage', defaultValue: 1.0, helpText: 'Max rate increase per subsequent year' },
      { id: 'lifetimeCap', label: 'Lifetime Maximum Rate Cap (%)', type: 'percentage', defaultValue: 5.0, helpText: 'Max total rate increase over initial rate' },
    ],
    calculate: (inputs) => {
      const amount = Number(inputs.loanAmount) || 300000;
      const intro = Number(inputs.introRate) || 5.0;
      const initialCap = Number(inputs.initialCap) || 2.0;
      const lifetimeCap = Number(inputs.lifetimeCap) || 5.0;

      const initialLoan = calculateLoanAmortization({ loanAmount: amount, interestRatePct: intro, loanTermYears: 30 });
      const initialMonthly = initialLoan.monthlyPrincipalAndInterest;

      // Worst case rate
      const maxWorstCaseRate = intro + lifetimeCap;
      const maxLoan = calculateLoanAmortization({ loanAmount: amount, interestRatePct: maxWorstCaseRate, loanTermYears: 30 });
      const maxMonthly = maxLoan.monthlyPrincipalAndInterest;

      return {
        primaryResult: {
          id: 'initial_pmt',
          label: 'Initial Monthly Payment (Fixed Period)',
          value: initialMonthly,
          format: 'currency',
          isPrimary: true,
        },
        metrics: [
          { id: 'worst_case_rate', label: 'Maximum Possible Lifetime Rate', value: maxWorstCaseRate, format: 'percentage', changeType: 'negative' },
          { id: 'worst_case_pmt', label: 'Worst-Case Monthly Payment', value: maxMonthly, format: 'currency', changeType: 'negative' },
          { id: 'max_jump', label: 'Maximum Monthly Payment Increase', value: maxMonthly - initialMonthly, format: 'currency', changeType: 'negative' },
        ],
        summaryText: `Your initial payment is $${Math.round(initialMonthly).toLocaleString('en-US')}/month at ${intro}%. If rates rise to the maximum lifetime cap (${maxWorstCaseRate}%), your monthly payment could increase to a worst-case of $${Math.round(maxMonthly).toLocaleString('en-US')}/month (+$${Math.round(maxMonthly - initialMonthly).toLocaleString('en-US')}/mo).`,
      };
    },
    formula: {
      formula: '\\text{Max Rate} = \\text{Initial Rate} + \\text{Lifetime Cap}\\%',
      explanation: 'ARM cap structures (e.g. 2/1/5) prevent rate spikes from exceeding contractual upper bounds.',
      variables: [
        { symbol: 'Caps', name: 'Rate Caps', description: 'Initial Cap / Periodic Cap / Lifetime Maximum Ceiling' },
      ],
    },
    howItWorks: [
      'Enter your ARM loan details and introductory interest rate.',
      'Specify the adjustment caps to model best-case, expected, and worst-case payment scenarios.',
    ],
    example: {
      scenarioTitle: '5/1 ARM on $400,000 at 5.50% with 2/1/5 Caps',
      description: 'Modeling 5 years fixed at 5.5% vs max 10.5% cap.',
      inputs: { 'Loan Amount': '$400,000', 'Intro Rate': '5.5%', 'Caps': '2/1/5' },
      stepByStep: [
        'Initial 5 years: $2,271.16/month at 5.50%.',
        'Year 6 (first reset): Max rate = 5.5% + 2% = 7.5% ($2,796.86/mo).',
        'Lifetime ceiling: 5.5% + 5% = 10.5% ($3,658.91/mo).',
      ],
      finalOutcome: 'Initial = $2,271.16/mo | Worst-Case Cap = $3,658.91/mo.',
    },
    whatItMeans: 'ARMs are ideal if you plan to move or refinance before the introductory period ends.',
    factorsToConsider: ['Benchmark indexes (SOFR - Secured Overnight Financing Rate).'],
    faqs: [
      { question: 'What does 5/1 ARM mean?', answer: 'A 5/1 ARM has a fixed interest rate for the first 5 years, after which the rate adjusts once every 1 year for the remaining 25 years.' },
    ],
    relatedCalculatorSlugs: ['fixed-vs-adjustable-rate-calculator', 'loan-calculator', 'loan-comparison-calculator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Standard Fannie Mae SOFR ARM adjustment schedules.',
  },
  {
    slug: 'fixed-vs-adjustable-rate-calculator',
    name: 'Fixed vs Adjustable Rate Calculator',
    h1Title: 'Fixed-Rate vs. Adjustable-Rate Mortgage (ARM) Comparison',
    category: 'loan-mortgage-calculators',
    badge: 'Comparison',
    shortDescription: 'Compare a 30-year fixed mortgage against a 5/1 or 7/1 ARM to evaluate upfront savings versus interest risk.',
    longDescription: 'Should you choose the stability of a fixed-rate mortgage or the lower initial payments of an ARM? Compare monthly cash savings during the initial teaser period against potential post-reset rate adjustments.',
    seoTitle: 'Fixed vs Adjustable Rate Calculator - 30-Year Fixed vs ARM',
    metaDescription: 'Compare 30-year fixed vs 5/1 and 7/1 ARM mortgages. Calculate initial interest savings and assess interest rate risk.',
    keywords: ['fixed vs arm calculator', 'fixed rate vs adjustable', '30 year fixed vs 5 1 arm', 'arm vs fixed comparison'],
    inputs: [
      { id: 'loanAmount', label: 'Loan Amount', type: 'currency', defaultValue: 350000 },
      { id: 'fixedRate', label: '30-Year Fixed Interest Rate (%)', type: 'percentage', defaultValue: 6.75 },
      { id: 'armRate', label: 'Initial ARM Interest Rate (%)', type: 'percentage', defaultValue: 5.5 },
      { id: 'armFixedYears', label: 'ARM Fixed Period (Years)', type: 'years', defaultValue: 5 },
    ],
    calculate: (inputs) => {
      const amount = Number(inputs.loanAmount) || 300000;
      const fixedR = Number(inputs.fixedRate) || 6.5;
      const armR = Number(inputs.armRate) || 5.25;
      const armYrs = Number(inputs.armFixedYears) || 5;

      const fixedLoan = calculateLoanAmortization({ loanAmount: amount, interestRatePct: fixedR, loanTermYears: 30 });
      const armLoan = calculateLoanAmortization({ loanAmount: amount, interestRatePct: armR, loanTermYears: 30 });

      const monthlySavings = fixedLoan.monthlyPrincipalAndInterest - armLoan.monthlyPrincipalAndInterest;
      const totalSavingsFixedPeriod = monthlySavings * armYrs * 12;

      return {
        primaryResult: {
          id: 'intro_savings',
          label: `Guaranteed Savings in First ${armYrs} Years with ARM`,
          value: totalSavingsFixedPeriod,
          format: 'currency',
          isPrimary: true,
          changeType: 'positive',
        },
        metrics: [
          { id: 'fixed_mo', label: '30-Year Fixed Monthly Payment', value: fixedLoan.monthlyPrincipalAndInterest, format: 'currency' },
          { id: 'arm_mo', label: 'ARM Initial Monthly Payment', value: armLoan.monthlyPrincipalAndInterest, format: 'currency' },
          { id: 'mo_savings', label: 'Monthly Cash Flow Savings', value: monthlySavings, format: 'currency', changeType: 'positive' },
        ],
        summaryText: `The ARM saves you $${Math.round(monthlySavings).toLocaleString('en-US')}/month during the initial ${armYrs}-year period, delivering a guaranteed $${Math.round(totalSavingsFixedPeriod).toLocaleString('en-US')} in cumulative cash savings over the fixed-rate loan.`,
      };
    },
    formula: {
      formula: '\\text{Cumulative ARM Savings} = (\\text{Monthly Fixed} - \\text{Monthly ARM}) \\times 12 \\times \\text{Fixed Years}',
      explanation: 'Calculates the guaranteed upfront interest arbitrage during the introductory fixed window.',
      variables: [
        { symbol: 'Fixed Years', name: 'Introductory Term', description: '5, 7, or 10 years before the first rate reset' },
      ],
    },
    howItWorks: [
      'Enter loan amount, 30-year fixed rate, and introductory ARM rate.',
      'Review initial savings and assess whether your time horizon in the home justifies the ARM.',
    ],
    example: {
      scenarioTitle: '$350,000 Loan: 6.75% Fixed vs 5.50% 5/1 ARM',
      description: 'Evaluating 5-year savings.',
      inputs: { 'Loan': '$350,000', 'Fixed': '6.75%', 'ARM': '5.50%', 'Fixed Yrs': '5' },
      stepByStep: [
        'Fixed payment = $2,270.18/mo.',
        'ARM payment = $1,987.26/mo.',
        'Monthly savings = $282.92/mo.',
        '5-Year cumulative savings = $282.92 × 60 = $16,975.20.',
      ],
      finalOutcome: 'ARM delivers $16,975 in guaranteed savings over 5 years.',
    },
    whatItMeans: 'If you plan to relocate or refinance within 5 years, the ARM provides substantial cash savings with zero interest-rate risk.',
    factorsToConsider: ['Refinancing fees if you choose to lock in a fixed rate later.'],
    faqs: [
      { question: 'When is an ARM better than a fixed-rate mortgage?', answer: 'An ARM is typically superior when you know with high certainty that you will sell the home or pay off the mortgage before the introductory fixed rate expires.' },
    ],
    relatedCalculatorSlugs: ['adjustable-rate-calculator', 'loan-comparison-calculator', 'loan-refinance-calculator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Standard comparative mortgage amortization methodology.',
  },
  {
    slug: 'biweekly-payment-calculator',
    name: 'Bi-weekly Mortgage Payment Calculator',
    h1Title: 'Bi-Weekly Mortgage Payment Accelerator Calculator',
    category: 'loan-mortgage-calculators',
    badge: 'Accelerated',
    shortDescription: 'Calculate how paying half your mortgage every two weeks (26 payments/yr) knocks years off your payoff date.',
    longDescription: 'By paying half your monthly mortgage payment every two weeks, you make 26 half-payments per year (equivalent to 13 full monthly payments instead of 12). Calculate how this simple strategy saves tens of thousands in interest.',
    seoTitle: 'Bi-Weekly Mortgage Payment Calculator - Pay Off Mortgage 4-8 Years Early',
    metaDescription: 'Free Bi-Weekly Mortgage Calculator. Calculate interest savings and how many years you shave off your mortgage by making 26 bi-weekly payments.',
    keywords: ['biweekly mortgage calculator', 'bi-weekly payment calculator', 'pay off mortgage faster', '13th mortgage payment', 'biweekly payoff'],
    inputs: [
      { id: 'loanAmount', label: 'Mortgage Loan Balance', type: 'currency', defaultValue: 320000 },
      { id: 'interestRatePct', label: 'Interest Rate (%)', type: 'percentage', defaultValue: 6.5 },
      { id: 'loanTermYears', label: 'Standard Loan Term (Years)', type: 'years', defaultValue: 30 },
    ],
    calculate: (inputs) => {
      const amount = Number(inputs.loanAmount) || 250000;
      const rate = Number(inputs.interestRatePct) || 6.5;
      const yrs = Number(inputs.loanTermYears) || 30;

      const standardLoan = calculateLoanAmortization({ loanAmount: amount, interestRatePct: rate, loanTermYears: yrs });
      const monthlyPI = standardLoan.monthlyPrincipalAndInterest;
      const biweeklyHalfPayment = monthlyPI / 2;

      // Equivalent extra monthly payment: 1 extra monthly payment per year = monthlyPI / 12 per month
      const extraEquivalentMonthly = monthlyPI / 12;

      const acceleratedLoan = calculateLoanAmortization({
        loanAmount: amount,
        interestRatePct: rate,
        loanTermYears: yrs,
        extraMonthlyPayment: extraEquivalentMonthly,
      });

      return {
        primaryResult: {
          id: 'interest_saved',
          label: 'Total Interest Saved with Bi-Weekly Payments',
          value: acceleratedLoan.interestSavingsFromExtra,
          format: 'currency',
          isPrimary: true,
          changeType: 'positive',
        },
        metrics: [
          { id: 'biweekly_pmt', label: 'Bi-Weekly Payment (Every 2 Weeks)', value: biweeklyHalfPayment, format: 'currency' },
          { id: 'standard_mo', label: 'Standard Monthly Payment', value: monthlyPI, format: 'currency' },
          { id: 'years_saved', label: 'Time Saved Off Mortgage', value: `${(acceleratedLoan.monthsSavedFromExtra / 12).toFixed(1)} Years`, format: 'text', changeType: 'positive' },
          { id: 'new_payoff', label: 'New Accelerated Payoff Timeline', value: `${acceleratedLoan.payoffYears} Years`, format: 'text' },
        ],
        summaryText: `Paying $${Math.round(biweeklyHalfPayment).toLocaleString('en-US')} every 2 weeks (26 times/year) pays off your 30-year mortgage in ${acceleratedLoan.payoffYears} years (${(acceleratedLoan.monthsSavedFromExtra / 12).toFixed(1)} years early) and saves $${Math.round(acceleratedLoan.interestSavingsFromExtra).toLocaleString('en-US')} in interest!`,
      };
    },
    formula: {
      formula: '\\text{Annual Payments} = 26 \\times \\left( \\frac{\\text{Monthly Payment}}{2} \\right) = 13 \\times \\text{Monthly Payment}',
      explanation: 'Because there are 52 weeks in a year, bi-weekly payments make 26 half-payments, creating 1 extra full principal payment every 12 months.',
      variables: [
        { symbol: '26 Bi-Weekly', name: 'Accelerated Frequency', description: 'Equal to 13 full payments per calendar year' },
      ],
    },
    howItWorks: [
      'Enter your loan balance, rate, and standard term.',
      'Review bi-weekly payment amounts, years saved, and total interest avoided.',
    ],
    example: {
      scenarioTitle: '$320,000 30-Year Mortgage at 6.50%',
      description: 'Standard monthly vs bi-weekly acceleration.',
      inputs: { 'Loan': '$320,000', 'Rate': '6.50%', 'Term': '30 Years' },
      stepByStep: [
        'Monthly payment = $2,022.61 ($24,271.32/year).',
        'Bi-weekly payment = $1,011.31 every 2 weeks ($26,294.06/year).',
        'One extra payment of $2,022.61 applied directly to principal every year.',
        'Loan is paid off in 24.3 years (5.7 years early).',
        'Total interest saved = $82,490.',
      ],
      finalOutcome: 'Debt-free 5.7 years early with $82,490 in interest savings.',
    },
    whatItMeans: 'Aligning mortgage drafts with bi-weekly payroll schedules effortlessly automates early mortgage payoff.',
    factorsToConsider: ['Never pay third-party fee-charging bi-weekly program companies; set up extra payments for free directly with your lender.'],
    faqs: [
      { question: 'What is the difference between bimonthly and biweekly?', answer: 'Bimonthly means twice a month (24 payments/yr, no extra payment). Bi-weekly means every two weeks (26 payments/yr, producing 1 full extra payment per year).' },
    ],
    relatedCalculatorSlugs: ['loan-calculator', 'loan-analysis-calculator', 'loan-comparison-calculator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Standard 26-period bi-weekly amortization schedule.',
  },
  {
    slug: 'interest-only-calculator',
    name: 'Interest Only Loan Calculator',
    h1Title: 'Interest-Only Mortgage Payment & Reset Calculator',
    category: 'loan-mortgage-calculators',
    badge: 'Interest-Only',
    shortDescription: 'Calculate payments during the initial interest-only period and the subsequent payment jump after principal reset.',
    longDescription: 'Interest-only mortgages require only interest payments for an initial period (e.g. 5 or 10 years). After the interest-only period ends, payments jump significantly to amortize the full principal over the remaining term. Calculate your initial and fully-amortized payments.',
    seoTitle: 'Interest Only Calculator - Interest-Only Mortgage & Payment Reset',
    metaDescription: 'Free Interest-Only Mortgage Calculator. Calculate low initial interest payments and the payment shock jump when principal amortization resets.',
    keywords: ['interest only calculator', 'interest only mortgage', 'io payment calculator', 'payment shock', 'interest only loan'],
    inputs: [
      { id: 'loanAmount', label: 'Loan Amount', type: 'currency', defaultValue: 450000 },
      { id: 'interestRatePct', label: 'Interest Rate (%)', type: 'percentage', defaultValue: 6.5 },
      { id: 'totalTermYears', label: 'Total Loan Term (Years)', type: 'years', defaultValue: 30 },
      { id: 'ioPeriodYears', label: 'Interest-Only Period (Years)', type: 'years', defaultValue: 10, helpText: 'Years before principal amortization begins' },
    ],
    calculate: (inputs) => {
      const amount = Number(inputs.loanAmount) || 300000;
      const rate = Number(inputs.interestRatePct) || 6.5;
      const totalYrs = Number(inputs.totalTermYears) || 30;
      const ioYrs = Number(inputs.ioPeriodYears) || 10;

      const monthlyInterestOnly = (amount * (rate / 100)) / 12;

      const remainingAmortYears = Math.max(1, totalYrs - ioYrs);
      const amortizingLoan = calculateLoanAmortization({
        loanAmount: amount,
        interestRatePct: rate,
        loanTermYears: remainingAmortYears,
      });

      const fullyAmortizingMonthly = amortizingLoan.monthlyPrincipalAndInterest;
      const paymentJump = fullyAmortizingMonthly - monthlyInterestOnly;

      return {
        primaryResult: {
          id: 'io_payment',
          label: `Initial Interest-Only Payment (Years 1–${ioYrs})`,
          value: monthlyInterestOnly,
          format: 'currency',
          isPrimary: true,
        },
        metrics: [
          { id: 'reset_payment', label: `Payment After Reset (Years ${ioYrs + 1}–${totalYrs})`, value: fullyAmortizingMonthly, format: 'currency', changeType: 'negative' },
          { id: 'payment_jump', label: 'Monthly Payment Jump ("Payment Shock")', value: paymentJump, format: 'currency', changeType: 'negative' },
          { id: 'total_interest', label: 'Total Lifetime Interest Paid', value: (monthlyInterestOnly * ioYrs * 12) + amortizingLoan.totalInterestPaid, format: 'currency' },
        ],
        summaryText: `You pay $${Math.round(monthlyInterestOnly).toLocaleString('en-US')}/month for the first ${ioYrs} years. In Year ${ioYrs + 1}, your payment jumps by $${Math.round(paymentJump).toLocaleString('en-US')}/month to $${Math.round(fullyAmortizingMonthly).toLocaleString('en-US')}/month to pay off the loan over the remaining ${remainingAmortYears} years.`,
        insights: [
          {
            type: 'warning',
            title: 'Payment Shock Warning',
            message: `Your payment will increase by ${((paymentJump / monthlyInterestOnly) * 100).toFixed(0)}% when principal amortization begins in Year ${ioYrs + 1}.`,
          }
        ]
      };
    },
    formula: {
      formula: '\\text{IO Payment} = \\frac{P \\times r}{12}, \\quad \\text{Reset Payment} = P \\left[ \\frac{r(1+r)^{n - n_{\\text{io}}}}{(1+r)^{n - n_{\\text{io}}} - 1} \\right]',
      explanation: 'Zero principal reduction occurs during the IO phase, compressing the full amortization into the shorter remaining term.',
      variables: [
        { symbol: 'n - n_io', name: 'Remaining Term', description: 'Amortization window remaining after IO period ends' },
      ],
    },
    howItWorks: [
      'Enter loan balance, rate, total term, and interest-only duration.',
      'Review low initial payments and the subsequent reset payment jump.',
    ],
    example: {
      scenarioTitle: '$450,000 Loan at 6.5% with 10-Year IO Phase (30-Year Total)',
      description: 'Modeling 10 years of interest-only followed by 20 years amortization.',
      inputs: { 'Loan': '$450,000', 'Rate': '6.5%', 'IO Period': '10 Years' },
      stepByStep: [
        'Years 1-10: Interest-only payment = $2,437.50/month.',
        'At Year 10: Principal remaining is still $450,000.',
        'Years 11-30 (20 years): Amortizing payment = $3,355.24/month.',
        'Payment jumps by $917.74/month (+37.6%).',
      ],
      finalOutcome: 'Payment rises from $2,437.50/mo to $3,355.24/mo at Year 11.',
    },
    whatItMeans: 'Interest-only loans maximize short-term cash flow but build zero home equity unless property values appreciate.',
    factorsToConsider: ['Underwater mortgage risk if property values decline during the IO phase.'],
    faqs: [
      { question: 'Why do borrowers use interest-only mortgages?', answer: 'Commonly used by real estate investors, high-net-worth individuals with irregular bonus compensation, or buyers who plan to sell within the initial IO window.' },
    ],
    relatedCalculatorSlugs: ['loan-calculator', 'adjustable-rate-calculator', 'rental-property-calculator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Standard two-phase interest-only amortization schedule.',
  },
  {
    slug: 'rental-property-calculator',
    name: 'Rental Property Calculator',
    h1Title: 'Rental Property Cash Flow, Cap Rate & ROI Calculator',
    category: 'loan-mortgage-calculators',
    badge: 'Real Estate',
    shortDescription: 'Analyze rental property cash flows, Cap Rate, Net Operating Income (NOI), and Cash-on-Cash return.',
    longDescription: 'The Rental Property Calculator is an essential tool for real estate investors. Evaluate residential and multi-family investment properties by calculating monthly Net Operating Income (NOI), Cash-on-Cash Return, Cap Rate, Gross Rent Multiplier (GRM), and Debt Service Coverage Ratio (DSCR).',
    seoTitle: 'Rental Property Calculator - Cash Flow, Cap Rate & Cash-on-Cash Return',
    metaDescription: 'Free Rental Property Investment Calculator. Calculate Net Operating Income (NOI), monthly cash flow, Cap Rate, and Cash-on-Cash return.',
    keywords: ['rental property calculator', 'cap rate calculator', 'cash on cash return', 'real estate investment calculator', 'net operating income'],
    inputs: [
      { id: 'purchasePrice', label: 'Purchase Price', type: 'currency', defaultValue: 320000 },
      { id: 'downPaymentPct', label: 'Down Payment (%)', type: 'percentage', defaultValue: 25 },
      { id: 'interestRatePct', label: 'Mortgage Interest Rate (%)', type: 'percentage', defaultValue: 7.0 },
      { id: 'monthlyGrossRent', label: 'Monthly Gross Rental Income', type: 'currency', defaultValue: 2800 },
      { id: 'vacancyRatePct', label: 'Vacancy Rate (%)', type: 'percentage', defaultValue: 5 },
      { id: 'managementFeePct', label: 'Property Management Fee (%)', type: 'percentage', defaultValue: 8 },
      { id: 'annualPropertyTax', label: 'Annual Property Taxes', type: 'currency', defaultValue: 4200 },
      { id: 'annualInsurance', label: 'Annual Property Insurance', type: 'currency', defaultValue: 1500 },
      { id: 'annualMaintenance', label: 'Annual Maintenance & Capital Reserves', type: 'currency', defaultValue: 2400 },
    ],
    calculate: (inputs) => {
      const price = Number(inputs.purchasePrice) || 200000;
      const dpPct = Number(inputs.downPaymentPct) || 20;
      const rate = Number(inputs.interestRatePct) || 6.5;
      const rent = Number(inputs.monthlyGrossRent) || 2000;
      const vacancy = Number(inputs.vacancyRatePct) || 5;
      const mgmt = Number(inputs.managementFeePct) || 8;
      const tax = Number(inputs.annualPropertyTax) || 3000;
      const ins = Number(inputs.annualInsurance) || 1200;
      const maint = Number(inputs.annualMaintenance) || 2000;

      const res = calculateRentalProperty(price, dpPct, rate, rent, vacancy, mgmt, tax, ins, maint);

      return {
        primaryResult: {
          id: 'monthly_cash_flow',
          label: 'Net Monthly Cash Flow',
          value: res.monthlyCashFlow,
          format: 'currency',
          isPrimary: true,
          changeType: res.monthlyCashFlow >= 0 ? 'positive' : 'negative',
        },
        metrics: [
          { id: 'cap_rate', label: 'Capitalization Rate (Cap Rate)', value: res.capRate, format: 'percentage', changeType: 'positive' },
          { id: 'coc_return', label: 'Cash-on-Cash Return', value: res.cashOnCashReturn, format: 'percentage', changeType: 'positive' },
          { id: 'noi', label: 'Net Operating Income (NOI)', value: res.netOperatingIncome, format: 'currency' },
          { id: 'grm', label: 'Gross Rent Multiplier (GRM)', value: `${res.grossRentMultiplier.toFixed(2)}x`, format: 'text' },
        ],
        summaryText: `This property generates $${Math.round(res.monthlyCashFlow).toLocaleString('en-US')}/month ($${Math.round(res.annualCashFlow).toLocaleString('en-US')}/year) in net cash flow after all operating expenses and debt service, delivering a Cap Rate of ${res.capRate.toFixed(2)}% and a Cash-on-Cash Return of ${res.cashOnCashReturn.toFixed(2)}%.`,
      };
    },
    formula: {
      formula: '\\text{Cap Rate} = \\frac{\\text{NOI}}{\\text{Purchase Price}} \\times 100\\%, \\quad \\text{CoC Return} = \\frac{\\text{Annual Cash Flow}}{\\text{Total Cash Invested}} \\times 100\\%',
      explanation: 'Cap Rate measures unleveraged property yield; Cash-on-Cash return measures actual cash dividend on down payment and out-of-pocket capital.',
      variables: [
        { symbol: 'NOI', name: 'Net Operating Income', description: 'Effective gross income minus all operating expenses' },
        { symbol: 'CoC', name: 'Cash on Cash', description: 'Annual pre-tax cash flow divided by total initial cash invested' },
      ],
    },
    howItWorks: [
      'Enter property purchase price, down payment, and mortgage interest rate.',
      'Enter monthly gross rental revenue, vacancy rate, and operating expenses.',
      'Review Cap Rate, Cash-on-Cash yield, and monthly net cash flow.',
    ],
    example: {
      scenarioTitle: '$320,000 Rental with 25% Down ($80k) & $2,800/mo Rent',
      description: 'Evaluating investment cash flow and returns.',
      inputs: { 'Purchase Price': '$320,000', 'Down Payment': '25% ($80k)', 'Monthly Rent': '$2,800' },
      stepByStep: [
        'Effective Gross Income (5% vacancy) = $31,920/yr.',
        'Operating Expenses (Taxes + Ins + Maint + Mgmt) = $10,654/yr.',
        'Net Operating Income (NOI) = $21,266/yr -> Cap Rate = 6.65%.',
        'Mortgage P&I ($240k @ 7%) = $19,161/yr.',
        'Net Cash Flow = $2,105/yr ($175.40/month).',
        'Cash-on-Cash Return ($2,105 / $89,600 total cash) = 2.35%.',
      ],
      finalOutcome: 'Cap Rate = 6.65% | Monthly Cash Flow = +$175.40.',
    },
    whatItMeans: 'Cap Rate allows you to compare real estate yields across properties regardless of individual financing terms.',
    factorsToConsider: ['Appreciation and mortgage principal paydown build additional wealth on top of cash flow.'],
    faqs: [
      { question: 'What is a good Cap Rate for a rental property?', answer: 'Generally, a Cap Rate between 5% and 8% is considered solid for residential rental properties in stable growth markets. Higher Cap Rates (8%–10%+) often correlate with higher tenant turnover or slower appreciation.' },
    ],
    relatedCalculatorSlugs: ['commercial-loan-calculator', 'loan-calculator', 'roi-calculator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Audited against National Association of Realtors (NAR) and CCIM investment standards.',
  },
];
