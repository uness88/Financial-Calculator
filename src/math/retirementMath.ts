import { CURRENT_RULES, IRS_UNIFORM_LIFETIME_TABLE } from '../config/financialRules';
import { calculateCompoundInterest } from './financeMath';

/**
 * 401(k) Contribution & Employer Match Calculator
 */
export function calculate401k(
  currentSalary: number,
  employeeContributionPct: number,
  employerMatchPct: number, // e.g. 50% match
  employerMatchLimitPct: number, // up to 6% of salary
  currentAge: number,
  retirementAge: number,
  currentBalance: number,
  annualSalaryIncreasePct: number,
  annualReturnPct: number
) {
  const years = Math.max(1, retirementAge - currentAge);
  let salary = currentSalary;
  let balance = currentBalance;
  let totalEmployeeContrib = 0;
  let totalEmployerContrib = 0;
  const yearlyData = [];

  for (let year = 1; year <= years; year++) {
    const age = currentAge + year;
    const maxIrsLimit = age >= 50 ? CURRENT_RULES.limit401k + CURRENT_RULES.catchUp401k : CURRENT_RULES.limit401k;

    // Employee contribution capped by IRS annual limit
    const rawEmployeeContrib = salary * (employeeContributionPct / 100);
    const employeeContrib = Math.min(maxIrsLimit, rawEmployeeContrib);

    // Employer match
    const matchedSalaryBase = Math.min(salary * (employerMatchLimitPct / 100), rawEmployeeContrib);
    const employerContrib = matchedSalaryBase * (employerMatchPct / 100);

    const totalYearContrib = employeeContrib + employerContrib;
    totalEmployeeContrib += employeeContrib;
    totalEmployerContrib += employerContrib;

    // Investment growth
    const growth = balance * (annualReturnPct / 100) + totalYearContrib * (annualReturnPct / 100 / 2);
    balance = balance + totalYearContrib + growth;

    yearlyData.push({
      year,
      age,
      salary: Math.round(salary),
      employeeContrib: Math.round(employeeContrib),
      employerContrib: Math.round(employerContrib),
      growth: Math.round(growth),
      balance: Math.round(balance),
    });

    // Salary increase for next year
    salary *= 1 + annualSalaryIncreasePct / 100;
  }

  return {
    endingBalance: balance,
    totalEmployeeContrib,
    totalEmployerContrib,
    totalGrowth: Math.max(0, balance - currentBalance - totalEmployeeContrib - totalEmployerContrib),
    yearlyData,
  };
}

/**
 * Traditional IRA vs Roth IRA
 */
export function calculateTraditionalVsRoth(
  annualContribution: number,
  yearsToRetirement: number,
  annualReturnPct: number,
  currentTaxRatePct: number,
  retirementTaxRatePct: number
) {
  const r = annualReturnPct / 100;
  const t = yearsToRetirement;
  const tCurrent = currentTaxRatePct / 100;
  const tRetire = retirementTaxRatePct / 100;

  // Traditional IRA: Pre-tax contribution, fully taxed at withdrawal
  const tradFuturePreTax = annualContribution * ((Math.pow(1 + r, t) - 1) / r);
  const tradAfterTaxValue = tradFuturePreTax * (1 - tRetire);

  // Roth IRA: After-tax contribution today, tax-free at withdrawal
  // If user invests the same pre-tax amount, Roth contribution is annualContribution * (1 - tCurrent)
  const rothContribution = annualContribution * (1 - tCurrent);
  const rothAfterTaxValue = rothContribution * ((Math.pow(1 + r, t) - 1) / r);

  // If user maxes out Roth with full limit and invests tax savings of Trad in a taxable account:
  const taxSavingsToday = annualContribution * tCurrent;
  const taxableGrowth = taxSavingsToday * ((Math.pow(1 + r * (1 - 0.15), t) - 1) / (r * (1 - 0.15)));
  const tradPlusTaxable = tradAfterTaxValue + taxableGrowth;

  const advantage = rothAfterTaxValue > tradAfterTaxValue ? 'Roth IRA' : 'Traditional IRA';
  const diff = Math.abs(rothAfterTaxValue - tradAfterTaxValue);

  return {
    traditionalAfterTax: tradAfterTaxValue,
    rothAfterTax: rothAfterTaxValue,
    tradPlusTaxableSideFund: tradPlusTaxable,
    advantage,
    difference: diff,
  };
}

/**
 * Required Minimum Distribution (RMD) Calculator
 */
export function calculateRMD(currentAge: number, accountBalance: number, birthYear: number) {
  // SECURE Act 2.0: If born before 1960, age 73. If born 1960 or later, age 75.
  const rmdAge = birthYear >= 1960 ? 75 : 73;
  const isEligible = currentAge >= rmdAge;

  const factor = IRS_UNIFORM_LIFETIME_TABLE[currentAge] || (currentAge > 115 ? 2.0 : 27.4);
  const rmdAmount = isEligible ? accountBalance / factor : 0;

  // Multi-year projection for next 10 years
  let projectedBalance = accountBalance;
  const projection = [];
  const assumedReturn = 0.05;

  for (let offset = 0; offset < 10; offset++) {
    const age = currentAge + offset;
    const yearEligible = age >= rmdAge;
    const lifeFactor = IRS_UNIFORM_LIFETIME_TABLE[age] || 2.0;
    const distribution = yearEligible ? projectedBalance / lifeFactor : 0;
    
    projection.push({
      age,
      startingBalance: Math.round(projectedBalance),
      lifeFactor: yearEligible ? lifeFactor : 0,
      rmd: Math.round(distribution),
      endingBalance: Math.round(Math.max(0, projectedBalance - distribution) * (1 + assumedReturn)),
    });

    projectedBalance = (projectedBalance - distribution) * (1 + assumedReturn);
  }

  return {
    rmdAge,
    isEligible,
    lifeExpectancyFactor: factor,
    rmdAmount,
    projection,
  };
}

/**
 * Social Security Estimator (Formula with Primary Insurance Amount bend points)
 */
export function calculateSocialSecurity(
  currentAge: number,
  retirementClaimAge: number,
  averageAnnualEarnings: number
) {
  // Full Retirement Age (FRA) is 67 for born 1960+
  const fullRetirementAge = 67;
  
  // Convert annual to AIME (Average Indexed Monthly Earnings)
  const aime = Math.min(CURRENT_RULES.socialSecurityWageBase / 12, averageAnnualEarnings / 12);

  // Social Security Primary Insurance Amount (PIA) Bend Points
  // 90% of first $1,226, 32% between $1,226 and $7,391, 15% above $7,391
  const b1 = 1226;
  const b2 = 7391;

  let pia = 0;
  if (aime <= b1) {
    pia = aime * 0.9;
  } else if (aime <= b2) {
    pia = b1 * 0.9 + (aime - b1) * 0.32;
  } else {
    pia = b1 * 0.9 + (b2 - b1) * 0.32 + (aime - b2) * 0.15;
  }

  // Adjust for claim age:
  // Early (62-66): reduced by 5/9 of 1% per month for first 36 months, 5/12 of 1% thereafter
  // Late (68-70): increased by 8% per year (2/3 of 1% per month)
  let factor = 1.0;
  const monthsDiff = (retirementClaimAge - fullRetirementAge) * 12;

  if (monthsDiff < 0) {
    const earlyMonths = Math.abs(monthsDiff);
    if (earlyMonths <= 36) {
      factor -= earlyMonths * (5 / 9 / 100);
    } else {
      factor -= 36 * (5 / 9 / 100) + (earlyMonths - 36) * (5 / 12 / 100);
    }
  } else if (monthsDiff > 0) {
    const delayedMonths = Math.min(36, monthsDiff); // Max delay credit up to age 70
    factor += delayedMonths * (2 / 3 / 100);
  }

  const monthlyBenefit = Math.max(0, pia * factor);
  const annualBenefit = monthlyBenefit * 12;

  // Comparison table for claiming at 62, 67, and 70
  const monthlyAt62 = pia * (1 - 36 * (5 / 9 / 100) - 24 * (5 / 12 / 100));
  const monthlyAt67 = pia;
  const monthlyAt70 = pia * (1 + 36 * (2 / 3 / 100));

  return {
    piaMonthlyAtFRA: pia,
    chosenMonthlyBenefit: monthlyBenefit,
    chosenAnnualBenefit: annualBenefit,
    percentOfFRA: factor * 100,
    claimAgeComparison: [
      { age: 62, monthly: Math.round(monthlyAt62), annual: Math.round(monthlyAt62 * 12), pct: 70 },
      { age: 67, monthly: Math.round(monthlyAt67), annual: Math.round(monthlyAt67 * 12), pct: 100 },
      { age: 70, monthly: Math.round(monthlyAt70), annual: Math.round(monthlyAt70 * 12), pct: 124 },
    ],
  };
}

/**
 * Annuity Calculator
 */
export function calculateAnnuity(
  principal: number,
  interestRatePct: number,
  payoutYears: number,
  frequency: number = 12 // 12=monthly
) {
  const r = interestRatePct / 100 / frequency;
  const n = payoutYears * frequency;

  let periodicPayout = 0;
  if (r === 0) {
    periodicPayout = principal / n;
  } else {
    periodicPayout = (principal * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
  }

  const totalPayout = periodicPayout * n;
  const totalInterest = Math.max(0, totalPayout - principal);

  return {
    periodicPayout,
    annualPayout: periodicPayout * frequency,
    totalPayout,
    totalInterest,
  };
}

/**
 * Retirement Planner & Safe Withdrawal Rate
 */
export function calculateRetirementPlanner(
  currentAge: number,
  retirementAge: number,
  lifeExpectancy: number,
  currentSavings: number,
  monthlySavings: number,
  expectedReturnWorkingPct: number,
  expectedReturnRetirementPct: number,
  desiredMonthlyIncomeRetirement: number,
  socialSecurityMonthly: number = 0,
  pensionMonthly: number = 0
) {
  const yearsWorking = Math.max(1, retirementAge - currentAge);
  const yearsRetirement = Math.max(1, lifeExpectancy - retirementAge);

  // Growth to retirement
  const accumulatedNestEgg = calculateCompoundInterest({
    principal: currentSavings,
    monthlyDeposit: monthlySavings,
    annualRate: expectedReturnWorkingPct,
    years: yearsWorking,
    compoundFrequency: 12,
    depositFrequency: 12,
  }).futureValue;

  // Monthly gap in retirement to cover from savings
  const totalGuaranteedIncome = socialSecurityMonthly + pensionMonthly;
  const monthlyNeedFromSavings = Math.max(0, desiredMonthlyIncomeRetirement - totalGuaranteedIncome);
  const annualNeedFromSavings = monthlyNeedFromSavings * 12;

  // Required nest egg using 4% rule and exact annuity formula
  const requiredNestEgg4PctRule = annualNeedFromSavings * 25; // 4% rule

  const rRetire = expectedReturnRetirementPct / 100 / 12;
  const nRetireMonths = yearsRetirement * 12;
  const exactRequiredNestEgg =
    rRetire > 0
      ? (monthlyNeedFromSavings * (1 - Math.pow(1 + rRetire, -nRetireMonths))) / rRetire
      : monthlyNeedFromSavings * nRetireMonths;

  const surplusOrDeficit = accumulatedNestEgg - exactRequiredNestEgg;
  const isFunded = surplusOrDeficit >= 0;

  // Sustainable safe monthly withdrawal from accumulated nest egg
  const sustainableMonthly =
    rRetire > 0
      ? (accumulatedNestEgg * (rRetire * Math.pow(1 + rRetire, nRetireMonths))) /
        (Math.pow(1 + rRetire, nRetireMonths) - 1)
      : accumulatedNestEgg / nRetireMonths;

  return {
    accumulatedNestEgg,
    exactRequiredNestEgg,
    requiredNestEgg4PctRule,
    surplusOrDeficit,
    isFunded,
    sustainableMonthlyWithdrawal: sustainableMonthly,
    totalMonthlyRetirementIncome: sustainableMonthly + totalGuaranteedIncome,
    coveragePercent: exactRequiredNestEgg > 0 ? (accumulatedNestEgg / exactRequiredNestEgg) * 100 : 100,
  };
}
