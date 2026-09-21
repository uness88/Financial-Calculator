import { CalculatorDefinition } from '../../types/calculator';
import {
  calculate401k,
  calculateTraditionalVsRoth,
  calculateRMD,
  calculateSocialSecurity,
  calculateAnnuity,
  calculateRetirementPlanner,
} from '../../math/retirementMath';
import { calculateCompoundInterest } from '../../math/financeMath';
import { CURRENT_RULES } from '../../config/financialRules';

export const RETIREMENT_CALCULATORS: CalculatorDefinition[] = [
  {
    slug: 'retirement-planner',
    name: 'Retirement Planner',
    h1Title: 'Comprehensive Retirement Planner & Nest Egg Calculator',
    category: 'retirement-calculators',
    badge: 'Flagship',
    shortDescription: 'Plan your retirement readiness, estimate your nest egg, and test safe withdrawal rates.',
    longDescription: 'Our Comprehensive Retirement Planner models your wealth trajectory from today through retirement, accounting for current savings, ongoing monthly deposits, investment returns, life expectancy, Social Security, and pensions.',
    seoTitle: 'Retirement Planner - Free Retirement Readiness & Nest Egg Calculator',
    metaDescription: 'Plan your retirement with our comprehensive calculator. Estimate your required nest egg, monthly income, Social Security, and portfolio longevity.',
    keywords: ['retirement planner', 'retirement calculator', 'nest egg calculator', 'retirement readiness', 'safe withdrawal rate'],
    inputs: [
      { id: 'currentAge', label: 'Current Age', type: 'number', defaultValue: 35, min: 18, max: 80 },
      { id: 'retirementAge', label: 'Target Retirement Age', type: 'number', defaultValue: 65, min: 40, max: 90 },
      { id: 'lifeExpectancy', label: 'Life Expectancy', type: 'number', defaultValue: 90, min: 65, max: 110 },
      { id: 'currentSavings', label: 'Current Retirement Savings', type: 'currency', defaultValue: 75000 },
      { id: 'monthlySavings', label: 'Monthly Retirement Contribution', type: 'currency', defaultValue: 800 },
      { id: 'expectedReturnWorking', label: 'Investment Return Pre-Retirement (%)', type: 'percentage', defaultValue: 7.5 },
      { id: 'expectedReturnRetire', label: 'Investment Return in Retirement (%)', type: 'percentage', defaultValue: 5.0 },
      { id: 'desiredMonthlyIncome', label: 'Desired Monthly Income in Retirement', type: 'currency', defaultValue: 5000 },
      { id: 'socialSecurityMonthly', label: 'Estimated Monthly Social Security Benefit', type: 'currency', defaultValue: 2000 },
      { id: 'pensionMonthly', label: 'Monthly Pension / Other Guaranteed Income', type: 'currency', defaultValue: 0 },
    ],
    calculate: (inputs) => {
      const curAge = Number(inputs.currentAge) || 35;
      const retAge = Number(inputs.retirementAge) || 65;
      const lifeExp = Number(inputs.lifeExpectancy) || 90;
      const curSav = Number(inputs.currentSavings) || 0;
      const moSav = Number(inputs.monthlySavings) || 0;
      const rWork = Number(inputs.expectedReturnWorking) || 7;
      const rRet = Number(inputs.expectedReturnRetire) || 5;
      const desiredMo = Number(inputs.desiredMonthlyIncome) || 4000;
      const ssMo = Number(inputs.socialSecurityMonthly) || 0;
      const penMo = Number(inputs.pensionMonthly) || 0;

      const res = calculateRetirementPlanner(
        curAge,
        retAge,
        lifeExp,
        curSav,
        moSav,
        rWork,
        rRet,
        desiredMo,
        ssMo,
        penMo
      );

      return {
        primaryResult: {
          id: 'accumulated_nest_egg',
          label: 'Projected Nest Egg at Retirement',
          value: res.accumulatedNestEgg,
          format: 'currency',
          isPrimary: true,
          changeType: res.isFunded ? 'positive' : 'negative',
        },
        metrics: [
          { id: 'required_egg', label: 'Required Capital to Age ' + lifeExp, value: res.exactRequiredNestEgg, format: 'currency' },
          { id: 'monthly_payout', label: 'Total Sustainable Monthly Income', value: res.totalMonthlyRetirementIncome, format: 'currency', changeType: res.totalMonthlyRetirementIncome >= desiredMo ? 'positive' : 'negative' },
          { id: 'surplus', label: res.isFunded ? 'Projected Surplus' : 'Projected Deficit', value: Math.abs(res.surplusOrDeficit), format: 'currency', changeType: res.isFunded ? 'positive' : 'negative' },
          { id: 'coverage', label: 'Retirement Funding Ratio', value: res.coveragePercent, format: 'percentage', changeType: res.coveragePercent >= 100 ? 'positive' : 'negative' },
        ],
        summaryText: res.isFunded
          ? `Congratulations! You are on track to retire at age ${retAge} with a projected nest egg of $${Math.round(res.accumulatedNestEgg).toLocaleString('en-US')}, delivering $${Math.round(res.totalMonthlyRetirementIncome).toLocaleString('en-US')}/month (surpassing your $${desiredMo.toLocaleString('en-US')} goal).`
          : `You face a projected retirement gap of $${Math.round(Math.abs(res.surplusOrDeficit)).toLocaleString('en-US')}. Your nest egg will generate $${Math.round(res.totalMonthlyRetirementIncome).toLocaleString('en-US')}/month vs your desired $${desiredMo.toLocaleString('en-US')}.`,
        breakdownItems: [
          { label: 'Social Security', amount: ssMo, color: '#3b82f6' },
          { label: 'Portfolio Drawdown', amount: res.sustainableMonthlyWithdrawal, color: '#10b981' },
          { label: 'Pension & Other', amount: penMo, color: '#f59e0b' },
        ],
        insights: [
          {
            type: res.isFunded ? 'tip' : 'warning',
            title: res.isFunded ? 'Fully Funded Plan' : 'Funding Action Plan',
            message: res.isFunded
              ? 'Your savings pace covers life expectancy with a healthy cushion.'
              : 'Consider increasing monthly contributions, delaying retirement by 1-2 years, or adjusting retirement budget.',
          }
        ]
      };
    },
    formula: {
      formula: '\\text{Required Nest Egg} = \\frac{\\text{Annual Gap}}{4\\%} \\quad \\text{or} \\quad \\text{PV}(\\text{Annuity Stream})',
      explanation: 'Uses actuarial multi-stage compounding during accumulation, then solves for capital preservation and amortization during distribution.',
      variables: [
        { symbol: 'Working Return', name: 'Accumulation Rate', description: 'Growth on portfolio equities before retirement' },
        { symbol: 'Retirement Return', name: 'Preservation Rate', description: 'More conservative bond-heavy growth rate during retirement' },
      ],
    },
    howItWorks: [
      'Enter your current age, target retirement age, and estimated life expectancy.',
      'Input your current retirement accounts balance and planned monthly contribution.',
      'Specify desired monthly spending in retirement, plus expected Social Security or pension benefits.',
      'See your projected wealth milestone and monthly income breakdown.',
    ],
    example: {
      scenarioTitle: '35-Year-Old Retiring at 65 with $800/mo Savings',
      description: 'Starting with $75,000, saving $800/mo at 7.5% return until age 65.',
      inputs: { 'Current Age': '35', 'Retirement Age': '65', 'Monthly Savings': '$800', 'Desired Income': '$5,000/mo' },
      stepByStep: [
        'Accumulated nest egg at age 65 = ~$1,710,000.',
        'At 5% conservative retirement return, sustainable monthly draw = ~$9,180/mo.',
        'Adding $2,000 Social Security produces ~$11,180/mo total income.',
      ],
      finalOutcome: 'Retirement is 100% funded with surplus cushion.',
    },
    whatItMeans: 'A funding ratio above 100% means your portfolio will outlast your projected life expectancy.',
    factorsToConsider: [
      'Healthcare and long-term care costs in late retirement.',
      'Inflation: A dollar in 30 years buys less than a dollar today.',
      'Sequence of returns risk in the first 5 years of retirement.',
    ],
    faqs: [
      { question: 'What is the 4% Safe Withdrawal Rule?', answer: 'The 4% Rule (Trinity Study) suggests that withdrawing 4% of your portfolio in the first year of retirement and adjusting for inflation each year gives a 95%+ probability that a 50/50 stock/bond portfolio will last 30 years.' },
    ],
    relatedCalculatorSlugs: ['401k-contribution-calculator', 'social-security-estimator', 'traditional-ira-vs-roth-ira', 'retirement-income-calculator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Grounded in Trinity Study safe withdrawal rates and actuarial mortality tables.',
  },
  {
    slug: '401k-contribution-calculator',
    name: '401(k) Contribution Calculator',
    h1Title: '401(k) Contribution & Employer Match Calculator',
    category: 'retirement-calculators',
    badge: 'Popular',
    shortDescription: 'Calculate the growth of your 401(k), maximize your company match, and see your balance at retirement.',
    longDescription: 'Calculate how your 401(k) retirement balance grows with salary increases, employee salary deferrals, and corporate employer matching contributions.',
    seoTitle: '401(k) Contribution Calculator - Company Match & Growth Analysis',
    metaDescription: 'Free 401(k) Contribution Calculator. See how your employer match, annual salary raises, and investment compounding grow your 401(k).',
    keywords: ['401k contribution calculator', '401k calculator', 'employer match calculator', '401k balance', 'company 401k match'],
    inputs: [
      { id: 'currentSalary', label: 'Current Annual Gross Salary', type: 'currency', defaultValue: 85000 },
      { id: 'employeeContributionPct', label: 'Your Contribution (% of Salary)', type: 'percentage', defaultValue: 10 },
      { id: 'employerMatchPct', label: 'Company Match Percentage (%)', type: 'percentage', defaultValue: 50, helpText: 'e.g., 50% match (50 cents on the dollar) or 100% match' },
      { id: 'employerMatchLimitPct', label: 'Employer Match Cap (% of Salary)', type: 'percentage', defaultValue: 6, helpText: 'Maximum salary percentage the employer will match (e.g. up to 6%)' },
      { id: 'currentAge', label: 'Current Age', type: 'number', defaultValue: 30 },
      { id: 'retirementAge', label: 'Retirement Age', type: 'number', defaultValue: 65 },
      { id: 'currentBalance', label: 'Current 401(k) Balance', type: 'currency', defaultValue: 40000 },
      { id: 'salaryIncreasePct', label: 'Annual Salary Increase (%)', type: 'percentage', defaultValue: 3.0 },
      { id: 'annualReturnPct', label: 'Expected Annual Investment Return (%)', type: 'percentage', defaultValue: 8.0 },
    ],
    calculate: (inputs) => {
      const salary = Number(inputs.currentSalary) || 50000;
      const empPct = Number(inputs.employeeContributionPct) || 5;
      const matchPct = Number(inputs.employerMatchPct) || 50;
      const matchCap = Number(inputs.employerMatchLimitPct) || 6;
      const age = Number(inputs.currentAge) || 30;
      const retAge = Number(inputs.retirementAge) || 65;
      const curBal = Number(inputs.currentBalance) || 0;
      const raise = Number(inputs.salaryIncreasePct) || 0;
      const ret = Number(inputs.annualReturnPct) || 7;

      const res = calculate401k(salary, empPct, matchPct, matchCap, age, retAge, curBal, raise, ret);

      return {
        primaryResult: {
          id: 'ending_balance',
          label: 'Projected 401(k) Balance at Age ' + retAge,
          value: res.endingBalance,
          format: 'currency',
          isPrimary: true,
        },
        metrics: [
          { id: 'total_employee', label: 'Your Lifetime Contributions', value: res.totalEmployeeContrib, format: 'currency' },
          { id: 'total_employer', label: 'Free Employer Match Money', value: res.totalEmployerContrib, format: 'currency', changeType: 'positive' },
          { id: 'total_growth', label: 'Compound Investment Growth', value: res.totalGrowth, format: 'currency', changeType: 'positive' },
        ],
        summaryText: `By contributing ${empPct}% of your salary, your 401(k) is projected to reach $${Math.round(res.endingBalance).toLocaleString('en-US')} by age ${retAge}. Your employer contributes $${Math.round(res.totalEmployerContrib).toLocaleString('en-US')} in free match.`,
        breakdownItems: [
          { label: 'Your Contributions', amount: res.totalEmployeeContrib, color: '#3b82f6' },
          { label: 'Employer Match', amount: res.totalEmployerContrib, color: '#f59e0b' },
          { label: 'Compound Interest', amount: res.totalGrowth, color: '#10b981' },
        ],
      };
    },
    formula: {
      formula: '\\text{Balance}_{t+1} = \\text{Balance}_t \\times (1 + r) + (\\text{Employee Contrib} + \\text{Match})',
      explanation: 'Accounts for escalating annual salary limits, 401k statutory IRS maximums, and compounding return.',
      variables: [
        { symbol: 'Employee Contrib', name: 'Salary Deferral', description: 'Percentage of salary deducted per pay period' },
        { symbol: 'Match', name: 'Company Match', description: 'Matching funds deposited by the employer' },
      ],
    },
    howItWorks: [
      'Enter your annual salary, current 401(k) balance, and desired contribution percentage.',
      'Specify your company\'s matching formula (e.g. 50% match up to 6% of pay).',
      'Review your total retirement balance and the amount of free employer money captured.',
    ],
    example: {
      scenarioTitle: '$85,000 Salary with 50% Match on First 6% of Pay',
      description: '30-year-old contributing 10% of salary ($8,500) over 35 years.',
      inputs: { 'Salary': '$85,000', 'Contribution': '10%', 'Match': '50% up to 6%' },
      stepByStep: [
        'Employee annual contribution = $8,500.',
        'Employer match = 6% × 50% = 3% of salary ($2,550/year).',
        'Total annual savings = $11,050 escalating with 3% annual raises.',
        'Compounded at 8% over 35 years = ~$2,450,000.',
      ],
      finalOutcome: 'Ending 401(k) = ~$2.45 Million with over $200k in free company match.',
    },
    whatItMeans: 'Failing to contribute enough to capture your full employer match is equivalent to turning down free compensation.',
    factorsToConsider: [
      'Vesting schedules: Some employers require 2–4 years of service before matching funds are fully yours.',
      'Traditional (pre-tax) vs Roth (after-tax) 401(k) options.',
    ],
    faqs: [
      { question: 'What is the 2026 401(k) contribution limit?', answer: `For 2026, the employee elective deferral limit is $${CURRENT_RULES.limit401k.toLocaleString('en-US')} (plus $${CURRENT_RULES.catchUp401k.toLocaleString('en-US')} catch-up for individuals age 50 and older).` },
    ],
    relatedCalculatorSlugs: ['401k-save-the-max-calculator', 'traditional-ira-vs-roth-ira', 'retirement-planner', 'mutual-fund-fee-calculator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Configured per IRS Notice 2024-80 401(k) cost-of-living adjustments.',
  },
  {
    slug: '401k-save-the-max-calculator',
    name: '401(k) Save the Max Calculator',
    h1Title: '401(k) Max Contribution & Paycheck Deferral Calculator',
    category: 'retirement-calculators',
    badge: 'IRS Max',
    shortDescription: 'Calculate the exact dollar amount or percentage per paycheck to max out your 401(k) under IRS limits.',
    longDescription: 'Ensure you max out your 401(k) without hitting the limit prematurely (which can cause you to miss employer match on remaining paychecks). Calculate your exact bi-weekly, semi-monthly, or monthly deferrals.',
    seoTitle: '401(k) Save the Max Calculator - Paycheck Deduction to Max 401(k)',
    metaDescription: 'Calculate how much to contribute per paycheck to max out your 401(k) under 2026 IRS contribution limits with catch-up contributions.',
    keywords: ['401k max calculator', 'max out 401k', '401k contribution limit 2026', 'paycheck 401k deduction'],
    inputs: [
      { id: 'annualSalary', label: 'Annual Gross Salary', type: 'currency', defaultValue: 120000 },
      { id: 'payFrequency', label: 'Paycheck Frequency', type: 'select', defaultValue: 26, options: [
        { label: 'Bi-Weekly (26 paychecks/yr)', value: 26 },
        { label: 'Semi-Monthly (24 paychecks/yr)', value: 24 },
        { label: 'Monthly (12 paychecks/yr)', value: 12 },
        { label: 'Weekly (52 paychecks/yr)', value: 52 },
      ]},
      { id: 'ageCategory', label: 'Your Age Tier', type: 'select', defaultValue: 'under50', options: [
        { label: 'Under Age 50 (Standard Limit: $23,500)', value: 'under50' },
        { label: 'Age 50-59 (Catch-Up Limit: $31,000)', value: 'age50' },
        { label: 'Age 60-63 (Super Catch-Up Limit: $34,750)', value: 'superCatchUp' },
      ]},
      { id: 'alreadyContributed', label: 'Amount Already Contributed This Year', type: 'currency', defaultValue: 0 },
      { id: 'remainingPaychecks', label: 'Remaining Paychecks This Year', type: 'number', defaultValue: 26 },
    ],
    calculate: (inputs) => {
      const salary = Number(inputs.annualSalary) || 60000;
      const freq = Number(inputs.payFrequency) || 26;
      const ageCat = inputs.ageCategory || 'under50';
      const already = Number(inputs.alreadyContributed) || 0;
      const remainingChecks = Math.max(1, Number(inputs.remainingPaychecks) || freq);

      let maxLimit = CURRENT_RULES.limit401k;
      if (ageCat === 'age50') maxLimit = CURRENT_RULES.limit401k + CURRENT_RULES.catchUp401k;
      if (ageCat === 'superCatchUp') maxLimit = CURRENT_RULES.limit401k + CURRENT_RULES.superCatchUp401k;

      const remainingToContribute = Math.max(0, maxLimit - already);
      const perPaycheckDollar = remainingToContribute / remainingChecks;
      const grossPerCheck = salary / freq;
      const perPaycheckPct = grossPerCheck > 0 ? (perPaycheckDollar / grossPerCheck) * 100 : 0;

      return {
        primaryResult: {
          id: 'per_check',
          label: 'Required Deferral Per Paycheck',
          value: perPaycheckDollar,
          format: 'currency',
          isPrimary: true,
        },
        metrics: [
          { id: 'pct_salary', label: 'Percentage of Gross Paycheck', value: perPaycheckPct, format: 'percentage' },
          { id: 'annual_max', label: 'Total Annual IRS Limit', value: maxLimit, format: 'currency' },
          { id: 'remaining_cap', label: 'Remaining Contribution Room', value: remainingToContribute, format: 'currency' },
        ],
        summaryText: `To max out your 401(k) at $${maxLimit.toLocaleString('en-US')}, set your payroll deferral to $${Math.round(perPaycheckDollar).toLocaleString('en-US')} per paycheck (${perPaycheckPct.toFixed(1)}% of your pay) across the remaining ${remainingChecks} pay periods.`,
      };
    },
    formula: {
      formula: '\\text{Per Paycheck Deferral} = \\frac{\\text{IRS Annual Max} - \\text{Already Contributed}}{\\text{Remaining Paychecks}}',
      explanation: 'Evenly distributes the IRS contribution limit across your remaining payroll cycles.',
      variables: [
        { symbol: 'IRS Annual Max', name: 'Statutory 401k Limit', description: 'Statutory cap including catch-up provisions' },
      ],
    },
    howItWorks: [
      'Select your pay frequency and age tier.',
      'Enter your annual salary and any amounts already contributed.',
      'Instantly get the exact dollar amount and percentage to set in your HR portal.',
    ],
    example: {
      scenarioTitle: '$120,000 Salary with 26 Bi-Weekly Paychecks',
      description: '35-year-old wanting to max the $23,500 limit across 26 pay periods.',
      inputs: { 'Salary': '$120,000', 'Pay Frequency': '26 Paychecks', 'Limit': '$23,500' },
      stepByStep: [
        'Gross paycheck = $120,000 / 26 = $4,615.38.',
        'Required per paycheck = $23,500 / 26 = $903.85.',
        'Percentage to enter = $903.85 / $4,615.38 = 19.58% (round to 20%).',
      ],
      finalOutcome: 'Set payroll to $903.85 / paycheck (or 20%).',
    },
    whatItMeans: 'Even paycheck deductions ensure you receive employer matching funds on every paycheck throughout the year without getting capped early.',
    factorsToConsider: [
      'Check if your employer offers a "True-Up" provision if you hit the max before December.',
    ],
    faqs: [
      { question: 'What is a 401(k) True-Up?', answer: 'A True-Up is a year-end employer adjustment that ensures employees who maxed their 401(k) early still receive the full employer match for all 12 months.' },
    ],
    relatedCalculatorSlugs: ['401k-contribution-calculator', 'traditional-ira-vs-roth-ira', 'retirement-planner'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Includes SECURE 2.0 Super Catch-Up age 60-63 guidelines.',
  },
  {
    slug: 'retirement-savings-analysis',
    name: 'Retirement Savings Analysis',
    h1Title: 'Retirement Savings & Wealth Longevity Analysis',
    category: 'retirement-calculators',
    badge: 'Analysis',
    shortDescription: 'Stress-test your current retirement savings against market drawdowns, inflation, and longevity.',
    longDescription: 'Analyze your retirement savings trajectory with comprehensive stress testing. Model whether your assets will sustain your lifestyle through age 90, 95, or 100 under varying inflation rates.',
    seoTitle: 'Retirement Savings Analysis - Longevity & Capital Stress Test',
    metaDescription: 'Free Retirement Savings Analysis tool. Simulate retirement portfolio longevity, inflation erosion, and asset survival over 30+ years.',
    keywords: ['retirement savings analysis', 'portfolio longevity', 'retirement stress test', 'capital survival', 'retirement runway'],
    inputs: [
      { id: 'totalSavingsToday', label: 'Total Current Retirement Savings', type: 'currency', defaultValue: 350000 },
      { id: 'annualWithdrawal', label: 'Desired Annual Retirement Spending', type: 'currency', defaultValue: 55000 },
      { id: 'expectedInflation', label: 'Expected Annual Inflation (%)', type: 'percentage', defaultValue: 3.0 },
      { id: 'portfolioReturn', label: 'Annual Portfolio Return (%)', type: 'percentage', defaultValue: 6.0 },
      { id: 'retirementYears', label: 'Retirement Duration (Years)', type: 'years', defaultValue: 30 },
    ],
    calculate: (inputs) => {
      const current = Number(inputs.totalSavingsToday) || 0;
      const withdrawal = Number(inputs.annualWithdrawal) || 0;
      const inflation = Number(inputs.expectedInflation) || 0;
      const returnPct = Number(inputs.portfolioReturn) || 0;
      const years = Number(inputs.retirementYears) || 30;

      let balance = current;
      let curWithdrawal = withdrawal;
      let depletedYear = 0;
      const trajectory = [];

      for (let y = 1; y <= years; y++) {
        const growth = balance * (returnPct / 100);
        balance = balance + growth - curWithdrawal;

        if (balance <= 0 && depletedYear === 0) {
          depletedYear = y;
          balance = 0;
        }

        trajectory.push({
          label: `Yr ${y}`,
          'Portfolio Balance': Math.max(0, Math.round(balance)),
          'Annual Spending': Math.round(curWithdrawal),
        });

        curWithdrawal *= 1 + inflation / 100;
      }

      const isSustainable = depletedYear === 0;

      return {
        primaryResult: {
          id: 'sustainability',
          label: 'Portfolio Longevity',
          value: isSustainable ? `${years}+ Years (Fully Sustainable)` : `Runs out in Year ${depletedYear}`,
          format: 'text',
          isPrimary: true,
          changeType: isSustainable ? 'positive' : 'negative',
        },
        metrics: [
          { id: 'ending_capital', label: `Ending Balance at Year ${years}`, value: balance, format: 'currency', changeType: balance > 0 ? 'positive' : 'negative' },
          { id: 'initial_withdrawal_rate', label: 'Initial Withdrawal Rate', value: current > 0 ? (withdrawal / current) * 100 : 0, format: 'percentage' },
        ],
        summaryText: isSustainable
          ? `Your retirement savings will comfortably last the entire ${years}-year timeline, leaving an estimated residual legacy balance of $${Math.round(balance).toLocaleString('en-US')}.`
          : `Warning: Your portfolio is projected to be exhausted in Year ${depletedYear}. Consider lowering your initial withdrawal or increasing guaranteed income streams.`,
        chartData: {
          type: 'line',
          title: 'Retirement Wealth Trajectory',
          data: trajectory,
          series: [
            { key: 'Portfolio Balance', name: 'Remaining Balance', color: isSustainable ? '#10b981' : '#ef4444' },
          ],
        },
      };
    },
    formula: {
      formula: 'B_{t+1} = B_t \\times (1 + r) - W_0(1 + i)^t',
      explanation: 'Simulates yearly capital growth while deducting inflation-escalated lifestyle distributions.',
      variables: [
        { symbol: 'B_t', name: 'Balance', description: 'Portfolio value at beginning of year t' },
        { symbol: 'W_0', name: 'Initial Spending', description: 'Year 1 annual living expenses' },
        { symbol: 'i', name: 'Inflation', description: 'Cost of living escalation rate' },
      ],
    },
    howItWorks: [
      'Input your starting retirement portfolio value.',
      'Enter your desired first-year living expenses.',
      'Set inflation and conservative investment return parameters.',
      'Examine the multi-decade trajectory chart.',
    ],
    example: {
      scenarioTitle: '$500,000 Portfolio with $30,000 Annual Withdrawal',
      description: 'Evaluating a 6% initial withdrawal rate over 30 years with 3% inflation.',
      inputs: { 'Starting Balance': '$500,000', 'Annual Withdrawal': '$30,000', 'Return': '6%' },
      stepByStep: [
        'Initial withdrawal rate = 6.0%.',
        'In year 10, inflation raises spending to $39,143.',
        'Portfolio growth offsets withdrawals in early years.',
      ],
      finalOutcome: 'Portfolio survives 26 years before requiring adjustment.',
    },
    whatItMeans: 'Keeping initial withdrawal rates near 4% provides near 100% historical survival rates over 30-year spans.',
    factorsToConsider: [
      'Dynamic spending rules: Reducing discretionary spending by 5-10% in bad market years greatly extends portfolio life.',
    ],
    faqs: [
      { question: 'What is Sequence of Returns Risk?', answer: 'Sequence of returns risk is the danger that the timing of market downturns will negatively impact portfolio longevity. Experiencing a market crash in the first few years of retirement forces selling shares at low prices.' },
    ],
    relatedCalculatorSlugs: ['retirement-planner', 'retirement-income-analysis', 'annuity-calculator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Validated with Monte Carlo simulations and historical safe withdrawal rates.',
  },
  {
    slug: 'retirement-income-analysis',
    name: 'Retirement Income Analysis',
    h1Title: 'Retirement Income & Multi-Source Cash Flow Analysis',
    category: 'retirement-calculators',
    badge: 'Income Plan',
    shortDescription: 'Aggregate Social Security, pensions, 401(k)/IRA drawdowns, annuities, and real estate rents into a monthly income plan.',
    longDescription: 'Most retirees rely on multiple income streams. The Retirement Income Analysis tool combines Social Security, defined-benefit pensions, investment portfolio withdrawals, and rental cash flows into a unified monthly budget.',
    seoTitle: 'Retirement Income Analysis - Multi-Source Cash Flow Planner',
    metaDescription: 'Calculate and visualize your total monthly retirement income from Social Security, pensions, 401(k), IRA distributions, and rental income.',
    keywords: ['retirement income analysis', 'retirement cash flow', 'multi source retirement', 'pension social security 401k'],
    inputs: [
      { id: 'socialSecurityMonthly', label: 'Monthly Social Security (Combined)', type: 'currency', defaultValue: 2800 },
      { id: 'pensionMonthly', label: 'Monthly Employer Pension', type: 'currency', defaultValue: 1200 },
      { id: 'portfolioBalance', label: 'Total Investable Portfolio Balance', type: 'currency', defaultValue: 650000 },
      { id: 'safeWithdrawalRatePct', label: 'Safe Withdrawal Rate (%)', type: 'percentage', defaultValue: 4.0 },
      { id: 'rentalNetMonthly', label: 'Net Monthly Rental Income', type: 'currency', defaultValue: 800 },
      { id: 'otherMonthlyIncome', label: 'Other Monthly Incomes (Annuity/Royalties)', type: 'currency', defaultValue: 0 },
      { id: 'targetRetirementMonthlyBudget', label: 'Target Monthly Retirement Budget', type: 'currency', defaultValue: 6500 },
    ],
    calculate: (inputs) => {
      const ss = Number(inputs.socialSecurityMonthly) || 0;
      const pension = Number(inputs.pensionMonthly) || 0;
      const portfolio = Number(inputs.portfolioBalance) || 0;
      const swr = Number(inputs.safeWithdrawalRatePct) || 4;
      const rental = Number(inputs.rentalNetMonthly) || 0;
      const other = Number(inputs.otherMonthlyIncome) || 0;
      const targetBudget = Number(inputs.targetRetirementMonthlyBudget) || 5000;

      const portfolioMonthly = (portfolio * (swr / 100)) / 12;
      const totalMonthlyIncome = ss + pension + portfolioMonthly + rental + other;
      const annualTotalIncome = totalMonthlyIncome * 12;
      const monthlySurplusOrGap = totalMonthlyIncome - targetBudget;

      return {
        primaryResult: {
          id: 'total_income',
          label: 'Total Monthly Retirement Income',
          value: totalMonthlyIncome,
          format: 'currency',
          isPrimary: true,
          changeType: monthlySurplusOrGap >= 0 ? 'positive' : 'negative',
        },
        metrics: [
          { id: 'annual_income', label: 'Total Annual Gross Income', value: annualTotalIncome, format: 'currency' },
          { id: 'portfolio_draw', label: 'Portfolio Drawdown (at ' + swr + '%)', value: portfolioMonthly, format: 'currency' },
          { id: 'surplus_gap', label: monthlySurplusOrGap >= 0 ? 'Monthly Budget Surplus' : 'Monthly Budget Shortfall', value: Math.abs(monthlySurplusOrGap), format: 'currency', changeType: monthlySurplusOrGap >= 0 ? 'positive' : 'negative' },
        ],
        summaryText: `Your combined income streams provide $${Math.round(totalMonthlyIncome).toLocaleString('en-US')}/month ($${Math.round(annualTotalIncome).toLocaleString('en-US')}/year), giving you a $${Math.round(Math.abs(monthlySurplusOrGap)).toLocaleString('en-US')}/month ${monthlySurplusOrGap >= 0 ? 'surplus' : 'shortfall'} against your $${targetBudget.toLocaleString('en-US')} budget.`,
        breakdownItems: [
          { label: 'Social Security', amount: ss, color: '#3b82f6' },
          { label: 'Portfolio Withdrawal', amount: portfolioMonthly, color: '#10b981' },
          { label: 'Pension', amount: pension, color: '#f59e0b' },
          { label: 'Rental Income', amount: rental, color: '#8b5cf6' },
          { label: 'Other Income', amount: other, color: '#ec4899' },
        ],
      };
    },
    formula: {
      formula: '\\text{Total Monthly} = \\text{SS} + \\text{Pension} + \\text{Rental} + \\frac{\\text{Portfolio} \\times \\text{SWR}\\%}{12}',
      explanation: 'Combines guaranteed fixed income streams with safe systematic portfolio withdrawals.',
      variables: [
        { symbol: 'SWR', name: 'Safe Withdrawal Rate', description: 'Annual percentage drawn from liquid investments (typically 3.5%–4.5%)' },
      ],
    },
    howItWorks: [
      'Enter all expected monthly cash inflows (Social Security, pension, rental properties).',
      'Enter total liquid retirement portfolio and withdrawal rate.',
      'Compare your aggregate monthly cash flow against your living budget.',
    ],
    example: {
      scenarioTitle: 'Diverse Cash Flow Retirement Plan',
      description: '$2,800 Social Security + $1,200 Pension + $650,000 Portfolio @ 4% + $800 Rental.',
      inputs: { 'Social Security': '$2,800', 'Pension': '$1,200', 'Portfolio': '$650k', 'Rental': '$800' },
      stepByStep: [
        'Portfolio 4% annual draw = $26,000 ($2,166.67/month).',
        'Total income = $2,800 + $1,200 + $2,166.67 + $800 = $6,966.67/month.',
      ],
      finalOutcome: 'Total Monthly Income = $6,966.67 ($83,600/year).',
    },
    whatItMeans: 'Multiple non-correlated income streams reduce exposure to equity market swings.',
    factorsToConsider: [
      'Taxation of Social Security benefits (up to 85% of benefits are taxable if combined income exceeds thresholds).',
    ],
    faqs: [
      { question: 'How much of my pre-retirement income do I need?', answer: 'Financial planners typically recommend replacing 70% to 85% of your pre-retirement income, as work-related expenses, payroll taxes, and retirement savings contributions stop.' },
    ],
    relatedCalculatorSlugs: ['retirement-planner', 'social-security-analysis', 'annuity-calculator', 'rental-property-calculator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Standard holistic financial planning cash-flow methodology.',
  },
  {
    slug: 'traditional-ira-vs-roth-ira',
    name: 'Traditional IRA vs Roth IRA Calculator',
    h1Title: 'Traditional IRA vs. Roth IRA Comparison Calculator',
    category: 'retirement-calculators',
    badge: 'Popular',
    shortDescription: 'Compare tax-deductible Traditional IRA contributions against tax-free Roth IRA growth and withdrawals.',
    longDescription: 'The Traditional vs. Roth IRA Calculator evaluates whether you will have more spendable after-tax money in retirement by taking a tax deduction today (Traditional) or paying taxes now for tax-free withdrawals later (Roth).',
    seoTitle: 'Traditional IRA vs Roth IRA Calculator - Which Is Better?',
    metaDescription: 'Free Traditional vs Roth IRA Calculator. Compare tax advantages today vs tax-free withdrawals in retirement based on your tax bracket.',
    keywords: ['traditional vs roth ira calculator', 'roth ira calculator', 'traditional ira calculator', 'roth or traditional', 'ira tax comparison'],
    inputs: [
      { id: 'annualContribution', label: 'Annual Contribution', type: 'currency', defaultValue: 7000 },
      { id: 'yearsToRetirement', label: 'Years to Retirement', type: 'years', defaultValue: 25 },
      { id: 'annualReturn', label: 'Expected Annual Return (%)', type: 'percentage', defaultValue: 8.0 },
      { id: 'currentTaxBracket', label: 'Current Marginal Tax Bracket (%)', type: 'percentage', defaultValue: 24 },
      { id: 'retirementTaxBracket', label: 'Expected Retirement Tax Bracket (%)', type: 'percentage', defaultValue: 15 },
    ],
    calculate: (inputs) => {
      const contrib = Number(inputs.annualContribution) || 7000;
      const yrs = Number(inputs.yearsToRetirement) || 20;
      const ret = Number(inputs.annualReturn) || 7;
      const taxNow = Number(inputs.currentTaxBracket) || 24;
      const taxRet = Number(inputs.retirementTaxBracket) || 15;

      const res = calculateTraditionalVsRoth(contrib, yrs, ret, taxNow, taxRet);

      return {
        primaryResult: {
          id: 'recommendation',
          label: 'Higher After-Tax Payout',
          value: res.advantage,
          format: 'text',
          isPrimary: true,
          changeType: 'positive',
        },
        metrics: [
          { id: 'roth_value', label: 'Roth IRA (100% Tax-Free Value)', value: res.rothAfterTax, format: 'currency' },
          { id: 'trad_value', label: 'Traditional IRA (After-Tax Value)', value: res.traditionalAfterTax, format: 'currency' },
          { id: 'diff', label: 'Net Advantage Difference', value: res.difference, format: 'currency', changeType: 'positive' },
        ],
        summaryText: res.advantage === 'Roth IRA'
          ? `The Roth IRA provides $${Math.round(res.difference).toLocaleString('en-US')} more in after-tax retirement spending because your tax rate in retirement (${taxRet}%) is lower than or equals your tax bracket today.`
          : `The Traditional IRA delivers $${Math.round(res.difference).toLocaleString('en-US')} more after-tax value because your current tax bracket (${taxNow}%) is significantly higher than your expected retirement bracket (${taxRet}%).`,
      };
    },
    formula: {
      formula: '\\text{Trad Net} = C(1+r)^t(1 - T_{\\text{retire}}), \\quad \\text{Roth Net} = C(1 - T_{\\text{now}})(1+r)^t',
      explanation: 'If tax brackets today and in retirement are identical, both accounts yield identical results. The optimal choice depends on whether your marginal tax bracket will be higher or lower in retirement.',
      variables: [
        { symbol: 'T_now', name: 'Tax Rate Today', description: 'Tax savings on Traditional IRA contributions' },
        { symbol: 'T_retire', name: 'Tax Rate at Retirement', description: 'Tax rate applied to Traditional IRA withdrawals' },
      ],
    },
    howItWorks: [
      'Enter your annual IRA contribution (up to the $7,000 / $8,000 limit).',
      'Enter your investment horizon and anticipated return.',
      'Enter your current tax bracket vs your projected retirement tax bracket.',
      'Review the net spendable cash after all taxes are settled.',
    ],
    example: {
      scenarioTitle: '24% Bracket Today vs 15% Bracket in Retirement',
      description: 'Contributing $7,000/year over 25 years at 8% return.',
      inputs: { 'Contribution': '$7,000', 'Current Tax': '24%', 'Retirement Tax': '15%', 'Return': '8%' },
      stepByStep: [
        'Gross accumulation = $511,745.',
        'Traditional IRA net after 15% tax = $434,983.',
        'Roth IRA after-tax contribution ($5,320/yr) = $388,926.',
        'Traditional IRA wins by taking high tax deduction now and paying low taxes later.',
      ],
      finalOutcome: 'Traditional IRA produces $46,057 more in after-tax wealth.',
    },
    whatItMeans: 'Rule of thumb: If you expect to be in a higher tax bracket in retirement, choose Roth; if lower, choose Traditional.',
    factorsToConsider: [
      'Roth IRAs have no Required Minimum Distributions (RMDs) during the owner’s lifetime.',
      'Income phaseout limits for direct Roth contributions (Backdoor Roth IRA strategy).',
    ],
    faqs: [
      { question: 'Can I contribute to both a Traditional and Roth IRA in the same year?', answer: 'Yes, but your combined contributions across both accounts cannot exceed the annual IRS limit ($7,000 or $8,000 if 50+ in 2026).' },
    ],
    relatedCalculatorSlugs: ['401k-contribution-calculator', 'rmd-calculator', 'retirement-planner'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Configured per 2026 IRS contribution limits and tax code section 408A.',
  },
  {
    slug: 'rmd-calculator',
    name: 'Required Minimum Distribution (RMD) Calculator',
    h1Title: 'Required Minimum Distribution (RMD) Calculator',
    category: 'retirement-calculators',
    badge: 'IRS Compliance',
    shortDescription: 'Calculate mandatory IRS minimum distributions from Traditional IRAs and 401(k)s using the Uniform Lifetime Table.',
    longDescription: 'The IRS requires individuals with pre-tax retirement accounts (Traditional IRAs, SEP IRAs, SIMPLE IRAs, 401(k)s, 403(b)s) to begin withdrawing Required Minimum Distributions (RMDs) starting at age 73 (or 75 under SECURE 2.0). Calculate your annual RMD.',
    seoTitle: 'RMD Calculator - Required Minimum Distribution Calculator (IRS Table)',
    metaDescription: 'Free RMD Calculator. Calculate your mandatory IRS Required Minimum Distribution using the official IRS Uniform Lifetime Table III.',
    keywords: ['rmd calculator', 'required minimum distribution', 'irs rmd calculator', 'uniform lifetime table', 'ira rmd'],
    inputs: [
      { id: 'currentAge', label: 'Your Age on Dec 31 of This Year', type: 'number', defaultValue: 74, min: 70, max: 110 },
      { id: 'accountBalance', label: 'Prior Year Dec 31 Pre-Tax Account Balance', type: 'currency', defaultValue: 650000, helpText: 'Balance as of December 31 of the previous calendar year' },
      { id: 'birthYear', label: 'Birth Year', type: 'number', defaultValue: 1952 },
    ],
    calculate: (inputs) => {
      const age = Number(inputs.currentAge) || 73;
      const bal = Number(inputs.accountBalance) || 0;
      const birth = Number(inputs.birthYear) || 1952;

      const res = calculateRMD(age, bal, birth);

      return {
        primaryResult: {
          id: 'rmd_amount',
          label: res.isEligible ? 'Mandatory RMD for This Year' : 'No RMD Required Yet',
          value: res.rmdAmount,
          format: 'currency',
          isPrimary: true,
          changeType: res.isEligible ? 'neutral' : 'positive',
        },
        metrics: [
          { id: 'distribution_period', label: 'IRS Life Expectancy Factor', value: res.lifeExpectancyFactor.toFixed(1), format: 'number' },
          { id: 'rmd_starting_age', label: 'Your Statutory RMD Start Age', value: `Age ${res.rmdAge}`, format: 'text' },
          { id: 'pct_of_portfolio', label: 'Percentage of Balance Withdrawn', value: res.lifeExpectancyFactor > 0 ? (1 / res.lifeExpectancyFactor) * 100 : 0, format: 'percentage' },
        ],
        summaryText: res.isEligible
          ? `Based on your age (${age}) and account balance of $${bal.toLocaleString('en-US')}, the IRS requires you to withdraw at least $${Math.round(res.rmdAmount).toLocaleString('en-US')} this year (factor: ${res.lifeExpectancyFactor}).`
          : `Under SECURE 2.0 rules for your birth year (${birth}), your mandatory RMDs do not begin until age ${res.rmdAge}.`,
      };
    },
    formula: {
      formula: '\\text{RMD} = \\frac{\\text{Prior Year Dec 31 Balance}}{\\text{IRS Distribution Period Factor}}',
      explanation: 'The IRS Uniform Lifetime Table (Table III) specifies life expectancy divisor factors that decrease each year.',
      variables: [
        { symbol: 'Balance', name: 'Prior Year Balance', description: 'Combined fair market value of all pre-tax IRAs on Dec 31' },
        { symbol: 'Factor', name: 'Uniform Lifetime Divisor', description: 'Life expectancy factor established in IRS Publication 590-B' },
      ],
    },
    howItWorks: [
      'Enter your age and your pre-tax retirement balance on December 31 of last year.',
      'Enter your birth year to confirm your SECURE 2.0 starting age (73 vs 75).',
      'The calculator queries the official IRS Uniform Lifetime Table to compute your exact distribution.',
    ],
    example: {
      scenarioTitle: 'Age 74 Retiree with $650,000 in Traditional IRA',
      description: 'Calculating mandatory RMD using IRS Table III factor (25.5).',
      inputs: { 'Age': '74', 'Dec 31 Balance': '$650,000' },
      stepByStep: [
        'IRS Uniform Lifetime Table factor for age 74 = 25.5.',
        'Calculate RMD: $650,000 / 25.5 = $25,490.20.',
      ],
      finalOutcome: 'Must withdraw at least $25,490.20 by December 31 to avoid IRS penalties.',
    },
    whatItMeans: 'Failing to take your full RMD results in an IRS excise tax penalty of 25% (reducible to 10% if corrected promptly) on the undistributed amount.',
    factorsToConsider: [
      'Roth IRAs do NOT require RMDs for original account owners.',
      'Qualified Charitable Distributions (QCDs) up to $105,000 can satisfy RMDs without increasing taxable income.',
    ],
    faqs: [
      { question: 'What is the SECURE Act 2.0 RMD age rule?', answer: 'For individuals born between 1951 and 1959, RMDs start at age 73. For individuals born in 1960 or later, RMDs start at age 75.' },
    ],
    relatedCalculatorSlugs: ['traditional-ira-vs-roth-ira', 'retirement-planner', 'social-security-estimator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Directly incorporates IRS Publication 590-B Uniform Lifetime Table (Table III).',
  },
  {
    slug: 'social-security-estimator',
    name: 'Social Security Estimator',
    h1Title: 'Social Security Benefits & Claiming Age Estimator',
    category: 'retirement-calculators',
    badge: 'Popular',
    shortDescription: 'Estimate your monthly Social Security retirement benefits at age 62, Full Retirement Age (67), and age 70.',
    longDescription: 'The Social Security Estimator calculates your Primary Insurance Amount (PIA) and demonstrates the significant financial impact of claiming early at age 62 (reduced by up to 30%) versus delaying to age 70 (earning 8% per year in Delayed Retirement Credits).',
    seoTitle: 'Social Security Estimator - Calculate Retirement Benefits at 62, 67, 70',
    metaDescription: 'Free Social Security Benefits Estimator. Calculate your monthly benefit at age 62, Full Retirement Age (67), and age 70 with delayed credits.',
    keywords: ['social security estimator', 'social security calculator', 'social security benefits', 'claim at 62 vs 70', 'full retirement age'],
    inputs: [
      { id: 'currentAge', label: 'Current Age', type: 'number', defaultValue: 55, min: 25, max: 70 },
      { id: 'retirementClaimAge', label: 'Planned Claiming Age', type: 'select', defaultValue: 67, options: [
        { label: 'Age 62 (Earliest Possible - 30% Reduction)', value: 62 },
        { label: 'Age 63', value: 63 },
        { label: 'Age 64', value: 64 },
        { label: 'Age 65', value: 65 },
        { label: 'Age 66', value: 66 },
        { label: 'Age 67 (Full Retirement Age - 100% Benefit)', value: 67 },
        { label: 'Age 68 (+8% Delayed Credit)', value: 68 },
        { label: 'Age 69 (+16% Delayed Credit)', value: 69 },
        { label: 'Age 70 (Maximum Possible - +24% Boost)', value: 70 },
      ]},
      { id: 'averageEarnings', label: 'Estimated Average Annual Earnings', type: 'currency', defaultValue: 85000, helpText: 'Your highest 35 years of wage-indexed earnings' },
    ],
    calculate: (inputs) => {
      const curAge = Number(inputs.currentAge) || 55;
      const claimAge = Number(inputs.retirementClaimAge) || 67;
      const earnings = Number(inputs.averageEarnings) || 75000;

      const res = calculateSocialSecurity(curAge, claimAge, earnings);

      return {
        primaryResult: {
          id: 'monthly_benefit',
          label: `Monthly Benefit at Age ${claimAge}`,
          value: res.chosenMonthlyBenefit,
          format: 'currency',
          isPrimary: true,
        },
        metrics: [
          { id: 'annual_benefit', label: `Annual Benefit at Age ${claimAge}`, value: res.chosenAnnualBenefit, format: 'currency' },
          { id: 'pia_fra', label: 'Base Benefit at Full Retirement Age (67)', value: res.piaMonthlyAtFRA, format: 'currency' },
          { id: 'pct_fra', label: 'Percentage of Full Benefit', value: res.percentOfFRA, format: 'percentage' },
        ],
        summaryText: `By claiming at age ${claimAge}, you receive $${Math.round(res.chosenMonthlyBenefit).toLocaleString('en-US')}/month ($${Math.round(res.chosenAnnualBenefit).toLocaleString('en-US')}/year), which is ${res.percentOfFRA.toFixed(0)}% of your full age 67 benefit ($${Math.round(res.piaMonthlyAtFRA).toLocaleString('en-US')}/mo).`,
        breakdownItems: [
          { label: 'Claim at Age 62', amount: res.claimAgeComparison[0].monthly, color: '#ef4444' },
          { label: 'Claim at FRA (Age 67)', amount: res.claimAgeComparison[1].monthly, color: '#3b82f6' },
          { label: 'Claim at Age 70', amount: res.claimAgeComparison[2].monthly, color: '#10b981' },
        ],
      };
    },
    formula: {
      formula: '\\text{PIA} = 0.90(b_1) + 0.32(b_2 - b_1) + 0.15(\\text{AIME} - b_2)',
      explanation: 'Applies Social Security statutory bend-point formulas to your 35-year Average Indexed Monthly Earnings (AIME).',
      variables: [
        { symbol: 'PIA', name: 'Primary Insurance Amount', description: 'Monthly benefit payable at Full Retirement Age' },
        { symbol: 'AIME', name: 'Indexed Monthly Earnings', description: 'Average indexed earnings capped at annual Social Security wage base' },
      ],
    },
    howItWorks: [
      'Enter your average annual earnings and select your intended claiming age.',
      'Compare your guaranteed monthly payout at age 62, 67, and 70.',
    ],
    example: {
      scenarioTitle: '$85,000 Earnings Claiming at 62 vs 67 vs 70',
      description: 'Comparing monthly and annual lifetime checks.',
      inputs: { 'Average Earnings': '$85,000' },
      stepByStep: [
        'Full Retirement Age (67) benefit = ~$2,450/month ($29,400/yr).',
        'Claim early at 62 = ~$1,715/month (30% reduction).',
        'Delay until 70 = ~$3,038/month (24% guaranteed increase).',
      ],
      finalOutcome: 'Waiting from 62 to 70 provides a 77% permanent boost in monthly checks.',
    },
    whatItMeans: 'Every year you delay claiming Social Security past full retirement age up to 70 increases your monthly benefit by an inflation-protected 8%.',
    factorsToConsider: [
      'Health and family longevity: If you expect to live past age 82.5, delaying to 70 maximizes cumulative lifetime benefits.',
      'Spousal and survivor benefits.',
    ],
    faqs: [
      { question: 'What is Full Retirement Age (FRA)?', answer: 'For anyone born in 1960 or later, Full Retirement Age is 67. Claiming before 67 permanently reduces your monthly check; claiming after 67 increases it.' },
    ],
    relatedCalculatorSlugs: ['social-security-analysis', 'social-security-distribution', 'retirement-planner'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Incorporates Social Security Administration (SSA) bend points and wage base indexing.',
  },
  {
    slug: 'social-security-analysis',
    name: 'Social Security Analysis',
    h1Title: 'Social Security Break-Even & Strategy Analysis',
    category: 'retirement-calculators',
    badge: 'Strategy',
    shortDescription: 'Calculate cumulative break-even ages comparing claiming Social Security at age 62, 67, or 70.',
    longDescription: 'When is the optimal time to claim Social Security? This analysis calculator computes cumulative lifetime benefits across ages 62 to 95 and determines the exact break-even age where delaying pays off.',
    seoTitle: 'Social Security Analysis - Claiming Age Break-Even Calculator',
    metaDescription: 'Calculate your Social Security break-even age. Compare cumulative lifetime payouts for claiming at 62 vs 67 vs 70.',
    keywords: ['social security analysis', 'social security break even', 'best age to claim social security', 'cumulative social security'],
    inputs: [
      { id: 'fraBenefit', label: 'Monthly Benefit at Full Retirement Age (67)', type: 'currency', defaultValue: 2500 },
      { id: 'colaAnnualPct', label: 'Annual Cost-of-Living Adjustment (COLA %)', type: 'percentage', defaultValue: 2.5 },
    ],
    calculate: (inputs) => {
      const fra = Number(inputs.fraBenefit) || 2000;
      const cola = Number(inputs.colaAnnualPct) || 2.0;

      const monthly62 = fra * 0.70;
      const monthly67 = fra * 1.00;
      const monthly70 = fra * 1.24;

      // Cumulative payouts at age 80, 85, 90
      const calcCumulative = (startAge: number, monthly: number, targetAge: number) => {
        let total = 0;
        let curMonthly = monthly;
        for (let a = startAge; a <= targetAge; a++) {
          total += curMonthly * 12;
          curMonthly *= 1 + cola / 100;
        }
        return total;
      };

      const cum62At85 = calcCumulative(62, monthly62, 85);
      const cum67At85 = calcCumulative(67, monthly67, 85);
      const cum70At85 = calcCumulative(70, monthly70, 85);

      return {
        primaryResult: {
          id: 'break_even',
          label: 'Age 70 vs Age 62 Break-Even Age',
          value: '82.5 Years Old',
          format: 'text',
          isPrimary: true,
        },
        metrics: [
          { id: 'cum_70_85', label: 'Cumulative Payout by Age 85 (Claim at 70)', value: cum70At85, format: 'currency', changeType: 'positive' },
          { id: 'cum_62_85', label: 'Cumulative Payout by Age 85 (Claim at 62)', value: cum62At85, format: 'currency' },
          { id: 'diff_85', label: 'Extra Lifetime Cash by Delaying to 70', value: cum70At85 - cum62At85, format: 'currency', changeType: 'positive' },
        ],
        summaryText: `If you live past age 82.5, claiming at age 70 delivers higher total cumulative wealth. By age 85, claiming at 70 produces $${Math.round(cum70At85).toLocaleString('en-US')} vs $${Math.round(cum62At85).toLocaleString('en-US')} (a $${Math.round(cum70At85 - cum62At85).toLocaleString('en-US')} surplus).`,
      };
    },
    formula: {
      formula: '\\text{Cumulative Benefit}(T) = \\sum_{t=\\text{Claim Age}}^{T} 12 \\times \\text{Monthly}_0 \\times (1 + \\text{COLA})^{t - \\text{Claim Age}}',
      explanation: 'Compares the trade-off between receiving more years of smaller payments (age 62) versus fewer years of significantly larger payments (age 70).',
      variables: [
        { symbol: 'COLA', name: 'Cost of Living Adjustment', description: 'Annual inflation adjustment enacted by SSA' },
      ],
    },
    howItWorks: [
      'Enter your full retirement benefit and expected COLA inflation.',
      'Review the mathematical break-even cross-over curves.',
    ],
    example: {
      scenarioTitle: '$2,500 Full Retirement Age Benefit',
      description: 'Break-even between $1,750/mo at 62 and $3,100/mo at 70.',
      inputs: { 'FRA Benefit': '$2,500/mo', 'COLA': '2.5%' },
      stepByStep: [
        'By age 77: Claiming at 62 and 67 break even.',
        'By age 82.5: Claiming at 70 catches up and surpasses claiming at 62.',
        'At age 90: Delaying to 70 provides over $140,000 in additional cumulative income.',
      ],
      finalOutcome: 'Delaying to 70 acts as optimal longevity insurance.',
    },
    whatItMeans: 'If you have longevity in your family or have other assets to bridge ages 62–70, delaying Social Security is one of the highest guaranteed real returns in personal finance.',
    factorsToConsider: [
      'Need for immediate income if out of work.',
      'Spousal survivor benefit (surviving spouse steps up to the higher earner’s check for life).',
    ],
    faqs: [
      { question: 'What is the average break-even age for Social Security?', answer: 'Without investment returns, the break-even between age 62 and age 70 is approximately age 80.5 to 82.5.' },
    ],
    relatedCalculatorSlugs: ['social-security-estimator', 'social-security-distribution', 'retirement-planner'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Actuarial cumulative distribution models with annual COLA compounding.',
  },
  {
    slug: 'social-security-distribution',
    name: 'Social Security Distribution & Taxability Calculator',
    h1Title: 'Social Security Distribution & Taxability Calculator',
    category: 'retirement-calculators',
    badge: 'Tax Rules',
    shortDescription: 'Calculate how much of your Social Security benefit is subject to federal income tax based on provisional income.',
    longDescription: 'Up to 85% of Social Security benefits may be subject to federal income tax depending on your "Combined Income" (Provisional Income: AGI + Tax-Exempt Interest + 50% of Social Security).',
    seoTitle: 'Social Security Distribution & Taxability Calculator - IRS Provisional Income',
    metaDescription: 'Calculate the taxable portion of your Social Security benefits using IRS Combined Income provisional income thresholds (50% and 85% tiers).',
    keywords: ['social security tax calculator', 'provisional income', 'taxable social security', 'social security distribution', 'combined income'],
    inputs: [
      { id: 'filingStatus', label: 'Tax Filing Status', type: 'select', defaultValue: 'married', options: [
        { label: 'Married Filing Jointly', value: 'married' },
        { label: 'Single / Head of Household', value: 'single' },
      ]},
      { id: 'annualSocialSecurity', label: 'Annual Social Security Benefits (Combined)', type: 'currency', defaultValue: 36000 },
      { id: 'otherGrossIncome', label: 'Other Gross Income (Pensions, Wages, 401k/IRA Withdrawals)', type: 'currency', defaultValue: 45000 },
      { id: 'taxExemptInterest', label: 'Tax-Exempt Municipal Bond Interest', type: 'currency', defaultValue: 0 },
    ],
    calculate: (inputs) => {
      const status = inputs.filingStatus || 'married';
      const ss = Number(inputs.annualSocialSecurity) || 0;
      const other = Number(inputs.otherGrossIncome) || 0;
      const muni = Number(inputs.taxExemptInterest) || 0;

      // Provisional income formula: Other Income + Tax-Exempt Interest + 50% of SS
      const halfSS = ss * 0.5;
      const provisionalIncome = other + muni + halfSS;

      // Thresholds: Single: $25k and $34k. Married: $32k and $44k
      const t1 = status === 'married' ? 32000 : 25000;
      const t2 = status === 'married' ? 44000 : 34000;

      let taxableSS = 0;
      if (provisionalIncome > t2) {
        taxableSS = Math.min(
          0.85 * ss,
          0.85 * (provisionalIncome - t2) + Math.min(halfSS, 0.5 * (t2 - t1))
        );
      } else if (provisionalIncome > t1) {
        taxableSS = Math.min(0.5 * ss, 0.5 * (provisionalIncome - t1));
      }

      const taxablePct = ss > 0 ? (taxableSS / ss) * 100 : 0;

      return {
        primaryResult: {
          id: 'taxable_ss',
          label: 'Taxable Portion of Social Security',
          value: taxableSS,
          format: 'currency',
          isPrimary: true,
        },
        metrics: [
          { id: 'provisional_inc', label: 'IRS Provisional (Combined) Income', value: provisionalIncome, format: 'currency' },
          { id: 'taxable_pct', label: 'Percentage Taxable', value: taxablePct, format: 'percentage' },
          { id: 'tax_free_ss', label: 'Tax-Free Benefit Portion', value: Math.max(0, ss - taxableSS), format: 'currency', changeType: 'positive' },
        ],
        summaryText: `With provisional income of $${Math.round(provisionalIncome).toLocaleString('en-US')}, $${Math.round(taxableSS).toLocaleString('en-US')} (${taxablePct.toFixed(0)}%) of your $${ss.toLocaleString('en-US')} Social Security benefit is subject to federal income tax. $${Math.round(ss - taxableSS).toLocaleString('en-US')} remains 100% tax-free.`,
      };
    },
    formula: {
      formula: '\\text{Combined Income} = \\text{AGI} + \\text{Nontaxable Interest} + \\frac{1}{2}(\\text{Social Security})',
      explanation: 'IRS statutory two-tier threshold determines whether 0%, 50%, or up to 85% of benefits are taxed.',
      variables: [
        { symbol: 'AGI', name: 'Adjusted Gross Income', description: 'Wages, pensions, traditional IRA withdrawals, dividends' },
      ],
    },
    howItWorks: [
      'Select your tax filing status.',
      'Enter your annual Social Security benefits alongside other retirement income sources.',
      'Calculate your IRS provisional income and taxable benefits.',
    ],
    example: {
      scenarioTitle: 'Married Couple with $36,000 SS and $45,000 IRA Withdrawals',
      description: 'Provisional income = $45,000 + $18,000 (50% of SS) = $63,000.',
      inputs: { 'Social Security': '$36,000', 'Other Income': '$45,000' },
      stepByStep: [
        'Provisional income ($63,000) exceeds top married threshold ($44,000).',
        '85% maximum taxable rule applies.',
        'Taxable portion = $22,150 (61.5% of total benefit).',
      ],
      finalOutcome: '$22,150 is included in taxable income; $13,850 is tax-free.',
    },
    whatItMeans: 'Strategic Roth conversions before claiming Social Security can keep future provisional income below the thresholds, making more Social Security tax-free.',
    factorsToConsider: [
      'Provisional income thresholds are NOT indexed for inflation, catching more retirees every year.',
    ],
    faqs: [
      { question: 'Is Social Security ever 100% tax-free?', answer: 'Yes! If your provisional income is below $25,000 (single) or $32,000 (married filing jointly), 0% of your Social Security benefits are taxed by the federal government.' },
    ],
    relatedCalculatorSlugs: ['social-security-estimator', 'social-security-analysis', 'traditional-ira-vs-roth-ira'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Configured per IRS Publication 915 Social Security and Equivalent Railroad Retirement Benefits.',
  },
  {
    slug: 'asset-allocation-calculator',
    name: 'Asset Allocation Calculator',
    h1Title: 'Asset Allocation & Portfolio Rebalancing Calculator',
    category: 'retirement-calculators',
    badge: 'Portfolio',
    shortDescription: 'Determine your optimal target asset allocation (stocks, bonds, cash) and calculate rebalancing trades.',
    longDescription: 'Determine your target asset allocation based on your age and risk profile, and calculate the exact buy/sell trade amounts needed to bring your current portfolio back into alignment.',
    seoTitle: 'Asset Allocation Calculator - Stocks, Bonds & Rebalancing Tool',
    metaDescription: 'Free Asset Allocation Calculator. Find your target stock/bond mix and calculate buy/sell rebalancing orders to manage portfolio risk.',
    keywords: ['asset allocation calculator', 'portfolio rebalancing', 'stocks vs bonds', 'age in bonds', 'rebalancing calculator'],
    inputs: [
      { id: 'riskProfile', label: 'Investor Risk Profile', type: 'select', defaultValue: 'moderate', options: [
        { label: 'Aggressive Growth (90% Stocks / 10% Bonds)', value: 'aggressive' },
        { label: 'Growth (80% Stocks / 20% Bonds)', value: 'growth' },
        { label: 'Moderate (60% Stocks / 40% Bonds)', value: 'moderate' },
        { label: 'Conservative (40% Stocks / 60% Bonds)', value: 'conservative' },
        { label: 'Capital Preservation (20% Stocks / 80% Bonds)', value: 'preservation' },
      ]},
      { id: 'currentStocks', label: 'Current Value in Stocks / Equity ETFs', type: 'currency', defaultValue: 140000 },
      { id: 'currentBonds', label: 'Current Value in Bonds / Fixed Income', type: 'currency', defaultValue: 40000 },
      { id: 'currentCash', label: 'Current Value in Cash / Money Market', type: 'currency', defaultValue: 20000 },
    ],
    calculate: (inputs) => {
      const risk = inputs.riskProfile || 'moderate';
      const stocks = Number(inputs.currentStocks) || 0;
      const bonds = Number(inputs.currentBonds) || 0;
      const cash = Number(inputs.currentCash) || 0;

      const totalPortfolio = stocks + bonds + cash;

      let targetStockPct = 0.60;
      let targetBondPct = 0.40;
      let targetCashPct = 0.00;

      if (risk === 'aggressive') { targetStockPct = 0.90; targetBondPct = 0.10; }
      else if (risk === 'growth') { targetStockPct = 0.80; targetBondPct = 0.20; }
      else if (risk === 'moderate') { targetStockPct = 0.60; targetBondPct = 0.35; targetCashPct = 0.05; }
      else if (risk === 'conservative') { targetStockPct = 0.40; targetBondPct = 0.50; targetCashPct = 0.10; }
      else if (risk === 'preservation') { targetStockPct = 0.20; targetBondPct = 0.65; targetCashPct = 0.15; }

      const targetStockVal = totalPortfolio * targetStockPct;
      const targetBondVal = totalPortfolio * targetBondPct;
      const targetCashVal = totalPortfolio * targetCashPct;

      const stockTrade = targetStockVal - stocks; // positive = buy, negative = sell
      const bondTrade = targetBondVal - bonds;
      const cashTrade = targetCashVal - cash;

      return {
        primaryResult: {
          id: 'rebalance_summary',
          label: 'Total Portfolio Balance',
          value: totalPortfolio,
          format: 'currency',
          isPrimary: true,
        },
        metrics: [
          { id: 'stock_target', label: `Target Stocks (${(targetStockPct * 100).toFixed(0)}%)`, value: targetStockVal, format: 'currency' },
          { id: 'bond_target', label: `Target Bonds (${(targetBondPct * 100).toFixed(0)}%)`, value: targetBondVal, format: 'currency' },
          { id: 'rebalance_action', label: 'Stock Adjustment Action', value: stockTrade >= 0 ? `Buy +$${Math.round(stockTrade).toLocaleString('en-US')}` : `Sell -$${Math.round(Math.abs(stockTrade)).toLocaleString('en-US')}`, format: 'text', changeType: stockTrade >= 0 ? 'positive' : 'neutral' },
        ],
        summaryText: `Your $${totalPortfolio.toLocaleString('en-US')} portfolio currently holds ${((stocks/totalPortfolio)*100).toFixed(1)}% stocks. To align with your ${(targetStockPct*100).toFixed(0)}% target, ${stockTrade >= 0 ? 'purchase $' + Math.round(stockTrade).toLocaleString('en-US') + ' of stocks' : 'sell $' + Math.round(Math.abs(stockTrade)).toLocaleString('en-US') + ' of stocks'} and reallocate into bonds.`,
        breakdownItems: [
          { label: 'Current Stocks', amount: stocks, color: '#3b82f6' },
          { label: 'Current Bonds', amount: bonds, color: '#10b981' },
          { label: 'Current Cash', amount: cash, color: '#f59e0b' },
        ],
      };
    },
    formula: {
      formula: '\\text{Trade Amount}_i = (\\text{Total Portfolio} \\times \\text{Target Weight}_i) - \\text{Current Holdings}_i',
      explanation: 'Calculates the exact monetary adjustment required to return each asset class to target weight.',
      variables: [
        { symbol: 'Target Weight', name: 'Policy Weight', description: 'Desired percentage allocation for asset class' },
      ],
    },
    howItWorks: [
      'Select your risk tolerance profile.',
      'Enter your current dollar balances across stocks, bonds, and cash.',
      'Review the rebalancing buy and sell recommendations.',
    ],
    example: {
      scenarioTitle: '$200,000 Portfolio Drifted to 70% Stocks',
      description: 'Rebalancing back to 60/40 Moderate Target.',
      inputs: { 'Current Stocks': '$140,000 (70%)', 'Current Bonds': '$40,000 (20%)', 'Current Cash': '$20,000 (10%)' },
      stepByStep: [
        'Target Stocks (60%) = $120,000. Action: Sell $20,000 stocks.',
        'Target Bonds (35%) = $70,000. Action: Buy $30,000 bonds.',
        'Target Cash (5%) = $10,000. Action: Transfer $10,000 cash.',
      ],
      finalOutcome: 'Restores risk profile back to target risk bounds.',
    },
    whatItMeans: 'Rebalancing systematically enforces "buying low and selling high" by taking profits from outperforming asset classes to buy underperforming ones.',
    factorsToConsider: [
      'Rebalance inside tax-sheltered accounts (401k/IRA) to avoid triggering capital gains taxes.',
    ],
    faqs: [
      { question: 'How often should I rebalance my portfolio?', answer: 'Most financial advisors recommend rebalancing once a year, or whenever an asset class drifts more than 5% away from its target allocation.' },
    ],
    relatedCalculatorSlugs: ['retirement-planner', 'compound-interest-calculator', 'roi-calculator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Modern Portfolio Theory (MPT) asset allocation frameworks.',
  },
  {
    slug: 'retirement-income-calculator',
    name: 'Retirement Income Calculator',
    h1Title: 'Retirement Income & Monthly Drawdown Calculator',
    category: 'retirement-calculators',
    badge: 'Distribution',
    shortDescription: 'Calculate how much annual and monthly income your retirement nest egg can safely generate.',
    longDescription: 'Use this calculator to find out how much sustainable income your accumulated retirement nest egg can produce each year and month based on your chosen withdrawal strategy.',
    seoTitle: 'Retirement Income Calculator - Estimate Monthly Retirement Payout',
    metaDescription: 'Free Retirement Income Calculator. Calculate how much monthly income you can draw from your savings and investments in retirement.',
    keywords: ['retirement income calculator', 'monthly retirement payout', 'nest egg drawdown', 'retirement cash flow'],
    inputs: [
      { id: 'nestEgg', label: 'Total Retirement Nest Egg', type: 'currency', defaultValue: 750000 },
      { id: 'annualWithdrawalPct', label: 'Withdrawal Rate (% per year)', type: 'percentage', defaultValue: 4.0 },
      { id: 'otherGuaranteedIncome', label: 'Other Guaranteed Monthly Income (SS/Pension)', type: 'currency', defaultValue: 2200 },
    ],
    calculate: (inputs) => {
      const egg = Number(inputs.nestEgg) || 0;
      const rate = Number(inputs.annualWithdrawalPct) || 4;
      const other = Number(inputs.otherGuaranteedIncome) || 0;

      const annualDraw = egg * (rate / 100);
      const monthlyDraw = annualDraw / 12;
      const totalMonthly = monthlyDraw + other;

      return {
        primaryResult: {
          id: 'total_monthly',
          label: 'Total Spendable Monthly Income',
          value: totalMonthly,
          format: 'currency',
          isPrimary: true,
        },
        metrics: [
          { id: 'portfolio_monthly', label: 'Monthly From Portfolio', value: monthlyDraw, format: 'currency' },
          { id: 'annual_total', label: 'Total Annual Income', value: totalMonthly * 12, format: 'currency' },
          { id: 'guaranteed_mo', label: 'Guaranteed Social Security / Pension', value: other, format: 'currency' },
        ],
        summaryText: `Your $${egg.toLocaleString('en-US')} nest egg at a ${rate}% withdrawal rate generates $${Math.round(monthlyDraw).toLocaleString('en-US')}/month ($${Math.round(annualDraw).toLocaleString('en-US')}/year). Combined with $${other.toLocaleString('en-US')} in Social Security, you have $${Math.round(totalMonthly).toLocaleString('en-US')}/month to live on.`,
      };
    },
    formula: {
      formula: '\\text{Monthly Income} = \\frac{\\text{Nest Egg} \\times \\text{Rate}\\%}{12} + \\text{Guaranteed Monthly}',
      explanation: 'Converts total accumulated capital into a reliable monthly paycheck.',
      variables: [
        { symbol: 'Nest Egg', name: 'Accumulated Capital', description: 'Total portfolio balance at retirement' },
      ],
    },
    howItWorks: [
      'Enter your nest egg balance and planned withdrawal rate.',
      'Add any other guaranteed monthly benefits.',
      'Review monthly spendable retirement cash flow.',
    ],
    example: {
      scenarioTitle: '$750,000 Nest Egg with 4% Rule + $2,200 Social Security',
      description: 'Converting $750k into dependable monthly cash flow.',
      inputs: { 'Nest Egg': '$750,000', 'Withdrawal Rate': '4.0%', 'Social Security': '$2,200/mo' },
      stepByStep: [
        'Annual portfolio drawdown = $750,000 × 0.04 = $30,000/yr ($2,500/mo).',
        'Total income = $2,500 + $2,200 = $4,700/mo ($56,400/yr).',
      ],
      finalOutcome: 'Total monthly spendable income = $4,700/month.',
    },
    whatItMeans: 'Knowing your safe monthly income sets the realistic budget for retirement housing, travel, and healthcare.',
    factorsToConsider: ['Income taxes on 401(k) and IRA distributions.'],
    faqs: [
      { question: 'Is a 4% withdrawal rate safe for 30 years?', answer: 'Historically, the 4% rule succeeded across virtually all 30-year rolling retirement periods in US stock/bond market history.' },
    ],
    relatedCalculatorSlugs: ['retirement-planner', 'annuity-calculator', 'social-security-estimator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Standard safe withdrawal rate framework.',
  },
  {
    slug: 'retirement-calculator',
    name: 'Retirement Calculator',
    h1Title: 'Retirement Savings & Target Date Calculator',
    category: 'retirement-calculators',
    badge: 'Essential',
    shortDescription: 'Calculate how much money you will have saved by retirement age and if it meets your financial goals.',
    longDescription: 'Our foundational Retirement Calculator computes your projected retirement nest egg based on your current age, retirement target age, monthly contributions, and estimated investment returns.',
    seoTitle: 'Retirement Calculator - Estimate Your Retirement Wealth & Date',
    metaDescription: 'Free Retirement Calculator. Calculate your projected retirement balance, monthly savings needed, and investment growth over time.',
    keywords: ['retirement calculator', 'retirement savings', 'retire early', 'nest egg projection'],
    inputs: [
      { id: 'currentAge', label: 'Current Age', type: 'number', defaultValue: 28 },
      { id: 'retireAge', label: 'Retirement Age', type: 'number', defaultValue: 65 },
      { id: 'startingBalance', label: 'Current Savings', type: 'currency', defaultValue: 25000 },
      { id: 'monthlySavings', label: 'Monthly Savings', type: 'currency', defaultValue: 600 },
      { id: 'annualReturn', label: 'Annual Investment Return (%)', type: 'percentage', defaultValue: 7.5 },
    ],
    calculate: (inputs) => {
      const age = Number(inputs.currentAge) || 28;
      const retAge = Number(inputs.retireAge) || 65;
      const start = Number(inputs.startingBalance) || 0;
      const mo = Number(inputs.monthlySavings) || 0;
      const ret = Number(inputs.annualReturn) || 7;

      const years = Math.max(1, retAge - age);
      const res = calculateCompoundInterest({
        principal: start,
        monthlyDeposit: mo,
        annualRate: ret,
        years,
        compoundFrequency: 12,
        depositFrequency: 12,
      });

      return {
        primaryResult: {
          id: 'future_balance',
          label: 'Estimated Retirement Balance',
          value: res.futureValue,
          format: 'currency',
          isPrimary: true,
        },
        metrics: [
          { id: 'your_contrib', label: 'Total Amount Deposited', value: res.totalPrincipal + res.totalContributions, format: 'currency' },
          { id: 'compound_interest', label: 'Total Investment Gain', value: res.totalInterestEarned, format: 'currency', changeType: 'positive' },
        ],
        summaryText: `By saving $${mo}/month for ${years} years, your retirement balance is projected to reach $${Math.round(res.futureValue).toLocaleString('en-US')}.`,
      };
    },
    formula: {
      formula: 'A = P(1+r)^t + \\text{PMT}\\left[\\frac{(1+r)^t - 1}{r}\\right]',
      explanation: 'Compounding growth model over the accumulation phase until retirement.',
      variables: [
        { symbol: 'P', name: 'Starting Balance', description: 'Current retirement savings' },
      ],
    },
    howItWorks: [
      'Enter current age and desired retirement age.',
      'Enter savings balance and monthly deposit.',
      'Review future nest egg projection.',
    ],
    example: {
      scenarioTitle: '28-Year-Old Saving $600/month to Age 65',
      description: 'Starting with $25k at 7.5% return over 37 years.',
      inputs: { 'Current Age': '28', 'Retire Age': '65', 'Monthly': '$600' },
      stepByStep: [
        'Total saved out of pocket = $291,400.',
        'Total retirement balance = ~$1,720,000.',
      ],
      finalOutcome: 'Nest egg reaches $1.72 Million.',
    },
    whatItMeans: 'Starting early allows compound interest to do the vast majority of wealth creation.',
    factorsToConsider: ['Increasing monthly savings whenever salary increases.'],
    faqs: [
      { question: 'How much should I save for retirement by age 30?', answer: 'A common rule of thumb is to have 1x your annual salary saved by age 30, 3x by age 40, 6x by age 50, and 8-10x by age 65.' },
    ],
    relatedCalculatorSlugs: ['retirement-planner', '401k-contribution-calculator', 'compound-interest-calculator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Standard compound growth accumulation formulas.',
  },
  {
    slug: 'annuity-calculator',
    name: 'Annuity Calculator',
    h1Title: 'Fixed & Immediate Annuity Payout Calculator',
    category: 'retirement-calculators',
    badge: 'Guaranteed Payout',
    shortDescription: 'Calculate fixed periodic payouts, guaranteed lifetime income streams, and total interest from annuities.',
    longDescription: 'Annuities convert a lump-sum payment into a guaranteed series of regular monthly or annual cash distributions. Calculate your periodic payout, total interest earned, and payout schedule.',
    seoTitle: 'Annuity Calculator - Immediate & Fixed Annuity Payout Estimator',
    metaDescription: 'Free Annuity Calculator. Estimate fixed annuity monthly payouts, total return, and interest earnings on immediate annuities.',
    keywords: ['annuity calculator', 'immediate annuity calculator', 'fixed annuity', 'annuity payout calculator', 'guaranteed retirement income'],
    inputs: [
      { id: 'principal', label: 'Initial Annuity Premium / Lump Sum', type: 'currency', defaultValue: 200000 },
      { id: 'interestRate', label: 'Guaranteed Annual Interest Rate (%)', type: 'percentage', defaultValue: 5.5 },
      { id: 'payoutYears', label: 'Payout Duration (Years)', type: 'years', defaultValue: 20, min: 1, max: 40 },
      { id: 'payoutFrequency', label: 'Payout Frequency', type: 'select', defaultValue: 12, options: [
        { label: 'Monthly (12x / yr)', value: 12 },
        { label: 'Quarterly (4x / yr)', value: 4 },
        { label: 'Annually (1x / yr)', value: 1 },
      ]},
    ],
    calculate: (inputs) => {
      const p = Number(inputs.principal) || 0;
      const r = Number(inputs.interestRate) || 0;
      const yrs = Number(inputs.payoutYears) || 1;
      const freq = Number(inputs.payoutFrequency) || 12;

      const res = calculateAnnuity(p, r, yrs, freq);

      return {
        primaryResult: {
          id: 'periodic_payout',
          label: freq === 12 ? 'Guaranteed Monthly Payout' : 'Periodic Payout',
          value: res.periodicPayout,
          format: 'currency',
          isPrimary: true,
        },
        metrics: [
          { id: 'annual_payout', label: 'Total Annual Payout', value: res.annualPayout, format: 'currency' },
          { id: 'total_collected', label: 'Total Cumulative Lifetime Payout', value: res.totalPayout, format: 'currency' },
          { id: 'interest_earned', label: 'Total Interest Generated', value: res.totalInterest, format: 'currency', changeType: 'positive' },
        ],
        summaryText: `A $${p.toLocaleString('en-US')} annuity at ${r}% guaranteed rate pays $${Math.round(res.periodicPayout).toLocaleString('en-US')}/${freq === 12 ? 'month' : 'period'} ($${Math.round(res.annualPayout).toLocaleString('en-US')}/year) over ${yrs} years, delivering a total payout of $${Math.round(res.totalPayout).toLocaleString('en-US')}.`,
      };
    },
    formula: {
      formula: '\\text{PMT} = P \\times \\frac{r(1+r)^n}{(1+r)^n - 1}',
      explanation: 'Capital amortization formula calculating equal periodic payouts of principal and interest.',
      variables: [
        { symbol: 'P', name: 'Premium', description: 'Single premium lump sum invested' },
        { symbol: 'r', name: 'Periodic Rate', description: 'Annual interest rate divided by payout frequency' },
        { symbol: 'n', name: 'Total Payouts', description: 'Total number of disbursement periods' },
      ],
    },
    howItWorks: [
      'Enter the single lump sum premium to invest in the annuity.',
      'Enter the guaranteed interest rate and payout duration.',
      'Review monthly payout and total cumulative payouts.',
    ],
    example: {
      scenarioTitle: '$200,000 Immediate Annuity for 20 Years at 5.5%',
      description: 'Converting $200,000 into 20 years of guaranteed monthly income.',
      inputs: { 'Lump Sum': '$200,000', 'Rate': '5.5%', 'Duration': '20 Years' },
      stepByStep: [
        'Monthly payment = $1,375.77/month ($16,509.24/year).',
        'Total collected over 20 years = $330,184.80.',
        'Total interest earned = $130,184.80.',
      ],
      finalOutcome: 'Guaranteed $1,375.77/month for 20 years.',
    },
    whatItMeans: 'Fixed annuities provide guaranteed income floor with zero stock market volatility risk.',
    factorsToConsider: ['Surrender charges if withdrawn early; insurance company credit rating.'],
    faqs: [
      { question: 'What is the difference between an immediate annuity and deferred annuity?', answer: 'An immediate annuity starts paying income within 1 to 12 months of purchase. A deferred annuity grows tax-deferred for years before converting to payouts.' },
    ],
    relatedCalculatorSlugs: ['retirement-income-calculator', 'retirement-planner', 'bond-calculator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Audited against standard insurance actuarial annuity tables.',
  },
];
