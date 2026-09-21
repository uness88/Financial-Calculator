/**
 * Core Financial Mathematics Engine - Investments & General Finance
 */

export interface CompoundInterestInput {
  principal: number;
  monthlyDeposit: number;
  annualRate: number; // in %
  years: number;
  compoundFrequency: number; // 12=monthly, 1=yearly, 4=quarterly, 365=daily
  depositFrequency: number; // 12=monthly, 1=yearly, 26=biweekly
}

export interface CompoundInterestOutput {
  futureValue: number;
  totalPrincipal: number;
  totalContributions: number;
  totalInterestEarned: number;
  yearlyData: {
    year: number;
    principalTotal: number;
    interestTotal: number;
    balance: number;
  }[];
}

export function calculateCompoundInterest(input: CompoundInterestInput): CompoundInterestOutput {
  const p = Math.max(0, input.principal);
  const pmt = Math.max(0, input.monthlyDeposit);
  const r = (input.annualRate || 0) / 100;
  const t = Math.max(0.1, input.years);
  const n = input.compoundFrequency || 12;
  const m = input.depositFrequency || 12;

  const totalMonths = Math.round(t * 12);
  const yearlyData: CompoundInterestOutput['yearlyData'] = [];

  let currentBalance = p;
  let totalDeposited = p;

  const monthlyRateEffective = Math.pow(1 + r / n, n / 12) - 1;

  yearlyData.push({
    year: 0,
    principalTotal: Math.round(p),
    interestTotal: 0,
    balance: Math.round(p),
  });

  for (let month = 1; month <= totalMonths; month++) {
    // Add monthly interest
    const interestThisMonth = currentBalance * monthlyRateEffective;
    currentBalance += interestThisMonth;

    // Add monthly deposit (assuming monthly deposit timing)
    const depositThisMonth = pmt;
    currentBalance += depositThisMonth;
    totalDeposited += depositThisMonth;

    if (month % 12 === 0 || month === totalMonths) {
      const yearNum = Math.floor(month / 12) + (month % 12 !== 0 ? month / 12 : 0);
      yearlyData.push({
        year: Math.round(yearNum * 10) / 10,
        principalTotal: Math.round(totalDeposited),
        interestTotal: Math.round(Math.max(0, currentBalance - totalDeposited)),
        balance: Math.round(currentBalance),
      });
    }
  }

  const futureValue = currentBalance;
  const totalContributions = totalDeposited - p;
  const totalInterestEarned = Math.max(0, futureValue - totalDeposited);

  return {
    futureValue,
    totalPrincipal: p,
    totalContributions,
    totalInterestEarned,
    yearlyData,
  };
}

/**
 * TVM Calculator (Time Value of Money)
 * Solves for PV, FV, PMT, NPER, or Rate
 */
export function calculateTVM(
  mode: 'FV' | 'PV' | 'PMT' | 'NPER' | 'RATE',
  pv: number,
  fv: number,
  pmt: number,
  ratePct: number,
  nper: number,
  type: 0 | 1 = 0 // 0 = end of period, 1 = beginning
) {
  const r = ratePct / 100;
  
  if (mode === 'FV') {
    if (r === 0) {
      return -(pv + pmt * nper);
    }
    const factor = Math.pow(1 + r, nper);
    const pmtTerm = pmt * (1 + r * type) * ((factor - 1) / r);
    return -(pv * factor + pmtTerm);
  }

  if (mode === 'PV') {
    if (r === 0) {
      return -(fv + pmt * nper);
    }
    const factor = Math.pow(1 + r, nper);
    const pmtTerm = pmt * (1 + r * type) * ((factor - 1) / r);
    return -(fv + pmtTerm) / factor;
  }

  if (mode === 'PMT') {
    if (r === 0) {
      return nper === 0 ? 0 : -(pv + fv) / nper;
    }
    const factor = Math.pow(1 + r, nper);
    const denom = (1 + r * type) * ((factor - 1) / r);
    return -(pv * factor + fv) / denom;
  }

  if (mode === 'NPER') {
    if (r === 0) {
      return pmt === 0 ? 0 : -(pv + fv) / pmt;
    }
    const pmtAdjusted = pmt * (1 + r * type);
    const num = -fv * r + pmtAdjusted;
    const den = pv * r + pmtAdjusted;
    if (num <= 0 || den <= 0) return 0;
    return Math.log(num / den) / Math.log(1 + r);
  }

  // Rate estimation using Newton-Raphson
  if (mode === 'RATE') {
    let rateGuess = 0.05;
    const maxIter = 100;
    const tol = 1e-7;

    for (let i = 0; i < maxIter; i++) {
      const f = pv * Math.pow(1 + rateGuess, nper) + 
                pmt * (1 + rateGuess * type) * ((Math.pow(1 + rateGuess, nper) - 1) / rateGuess) + 
                fv;
      
      // Numerical derivative
      const delta = 1e-5;
      const fPlus = pv * Math.pow(1 + rateGuess + delta, nper) + 
                    pmt * (1 + (rateGuess + delta) * type) * ((Math.pow(1 + rateGuess + delta, nper) - 1) / (rateGuess + delta)) + 
                    fv;
      const df = (fPlus - f) / delta;

      if (Math.abs(df) < 1e-12) break;
      const nextGuess = rateGuess - f / df;
      if (Math.abs(nextGuess - rateGuess) < tol) {
        return nextGuess * 100;
      }
      rateGuess = nextGuess;
      if (rateGuess < -0.99) rateGuess = -0.5;
    }
    return rateGuess * 100;
  }

  return 0;
}

/**
 * Net Present Value (NPV) & Internal Rate of Return (IRR)
 */
export function calculateNPV(discountRatePct: number, initialOutlay: number, cashFlows: number[]): number {
  const r = discountRatePct / 100;
  let npv = -Math.abs(initialOutlay);
  for (let t = 0; t < cashFlows.length; t++) {
    npv += cashFlows[t] / Math.pow(1 + r, t + 1);
  }
  return npv;
}

export function calculateIRR(initialOutlay: number, cashFlows: number[]): number {
  const allFlows = [-Math.abs(initialOutlay), ...cashFlows];
  let guess = 0.1;
  const maxIter = 1000;
  const tol = 1e-7;

  for (let i = 0; i < maxIter; i++) {
    let npv = 0;
    let dNpv = 0;

    for (let t = 0; t < allFlows.length; t++) {
      const denom = Math.pow(1 + guess, t);
      npv += allFlows[t] / denom;
      if (t > 0) {
        dNpv -= (t * allFlows[t]) / Math.pow(1 + guess, t + 1);
      }
    }

    if (Math.abs(dNpv) < 1e-10) break;
    const nextGuess = guess - npv / dNpv;
    if (Math.abs(nextGuess - guess) < tol) {
      return nextGuess * 100;
    }
    guess = nextGuess;
    if (guess <= -0.999) guess = -0.5;
  }

  return guess * 100;
}

/**
 * Return on Investment (ROI) & Annualized ROI
 */
export function calculateROI(initialInvestment: number, finalValue: number, additionalCosts: number = 0, yearsHeld: number = 1) {
  const totalCost = initialInvestment + additionalCosts;
  const netProfit = finalValue - totalCost;
  const simpleROI = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;
  
  const years = Math.max(0.01, yearsHeld);
  const annualizedROI = totalCost > 0 && finalValue > 0 
    ? (Math.pow(finalValue / totalCost, 1 / years) - 1) * 100 
    : 0;

  return {
    netProfit,
    simpleROI,
    annualizedROI,
    totalCost,
  };
}

/**
 * Bond Price, Yield to Maturity (YTM), and Current Yield
 */
export function calculateBond(
  faceValue: number,
  annualCouponRatePct: number,
  marketPrice: number,
  yearsToMaturity: number,
  frequency: number = 2 // 2 = semi-annual
) {
  const n = yearsToMaturity * frequency;
  const couponPayment = (faceValue * (annualCouponRatePct / 100)) / frequency;
  const currentYield = marketPrice > 0 ? ((couponPayment * frequency) / marketPrice) * 100 : 0;

  // Approximate YTM formula: [C + (F - P)/n] / [(F + P)/2]
  const approxYTM =
    ((couponPayment * frequency + (faceValue - marketPrice) / yearsToMaturity) /
      ((faceValue + marketPrice) / 2)) *
    100;

  // Exact iterative YTM
  let ytmGuess = (approxYTM || 5) / 100 / frequency;
  for (let i = 0; i < 50; i++) {
    let p = 0;
    let dp = 0;
    for (let t = 1; t <= n; t++) {
      p += couponPayment / Math.pow(1 + ytmGuess, t);
      dp -= (t * couponPayment) / Math.pow(1 + ytmGuess, t + 1);
    }
    p += faceValue / Math.pow(1 + ytmGuess, n);
    dp -= (n * faceValue) / Math.pow(1 + ytmGuess, n + 1);

    const diff = p - marketPrice;
    if (Math.abs(diff) < 0.001 || Math.abs(dp) < 1e-8) break;
    ytmGuess = ytmGuess - diff / dp;
  }

  const exactYTM = Math.max(0, ytmGuess * frequency * 100);

  // Macaulay Duration
  let weightedTimeSum = 0;
  const y = exactYTM / 100 / frequency;
  for (let t = 1; t <= n; t++) {
    const pvCashFlow = (t === n ? couponPayment + faceValue : couponPayment) / Math.pow(1 + y, t);
    weightedTimeSum += (t / frequency) * pvCashFlow;
  }
  const macaulayDuration = marketPrice > 0 ? weightedTimeSum / marketPrice : yearsToMaturity;
  const modifiedDuration = macaulayDuration / (1 + y);

  return {
    couponPaymentYearly: couponPayment * frequency,
    currentYield,
    approxYTM,
    exactYTM,
    macaulayDuration,
    modifiedDuration,
  };
}

/**
 * Tax Equivalent Yield (TEY)
 */
export function calculateTaxEquivalentYield(muniYieldPct: number, marginalTaxRatePct: number, stateTaxRatePct: number = 0) {
  const combinedTax = (marginalTaxRatePct + stateTaxRatePct) / 100;
  const effectiveDenom = Math.max(0.01, 1 - combinedTax);
  const tey = muniYieldPct / effectiveDenom;
  return {
    taxEquivalentYield: tey,
    combinedTaxRate: combinedTax * 100,
    taxSavingsSpread: tey - muniYieldPct,
  };
}

/**
 * Rule of 72 & Exact Doubling Time
 */
export function calculateRuleOf72(ratePct: number) {
  const r = Math.max(0.01, ratePct);
  const rule72Years = 72 / r;
  const rule69Years = 69.3 / r;
  const exactYears = Math.log(2) / Math.log(1 + r / 100);

  return {
    rule72Years,
    rule69Years,
    exactYears,
    difference: Math.abs(rule72Years - exactYears),
  };
}

/**
 * College Savings Calculator
 */
export function calculateCollegeSavings(
  currentSavings: number,
  childCurrentAge: number,
  collegeStartAge: number,
  yearsInCollege: number,
  currentAnnualTuition: number,
  tuitionInflationPct: number,
  investmentReturnPct: number,
  monthlyContribution: number
) {
  const yearsUntilCollege = Math.max(1, collegeStartAge - childCurrentAge);
  const inflation = tuitionInflationPct / 100;
  const rReturn = investmentReturnPct / 100;
  const monthlyReturn = Math.pow(1 + rReturn, 1 / 12) - 1;

  // Future tuition costs per year
  let totalCollegeCost = 0;
  const yearlyTuitionProjected: number[] = [];
  for (let i = 0; i < yearsInCollege; i++) {
    const cost = currentAnnualTuition * Math.pow(1 + inflation, yearsUntilCollege + i);
    yearlyTuitionProjected.push(cost);
    totalCollegeCost += cost;
  }

  // Accumulated savings at college start
  const months = yearsUntilCollege * 12;
  const savingsAtStart =
    currentSavings * Math.pow(1 + rReturn, yearsUntilCollege) +
    monthlyContribution * ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn);

  // Required monthly contribution to fully fund
  const fvTarget = totalCollegeCost;
  const fvOfCurrentSavings = currentSavings * Math.pow(1 + rReturn, yearsUntilCollege);
  const remainingNeeded = Math.max(0, fvTarget - fvOfCurrentSavings);
  const requiredMonthlyDeposit =
    monthlyReturn > 0
      ? remainingNeeded / ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn)
      : remainingNeeded / months;

  const surplusOrShortfall = savingsAtStart - totalCollegeCost;

  return {
    totalCollegeCost,
    savingsAtStart,
    surplusOrShortfall,
    requiredMonthlyDeposit: Math.max(0, requiredMonthlyDeposit),
    yearlyTuitionProjected,
    fundingPercent: totalCollegeCost > 0 ? (savingsAtStart / totalCollegeCost) * 100 : 100,
  };
}

/**
 * Mutual Fund Fee & Expense Ratio Impact
 */
export function calculateMutualFundFeeImpact(
  initialAmount: number,
  monthlyDeposit: number,
  grossReturnPct: number,
  expenseRatioPct: number,
  years: number
) {
  const netReturnPct = Math.max(0, grossReturnPct - expenseRatioPct);
  
  const withoutFees = calculateCompoundInterest({
    principal: initialAmount,
    monthlyDeposit,
    annualRate: grossReturnPct,
    years,
    compoundFrequency: 12,
    depositFrequency: 12,
  });

  const withFees = calculateCompoundInterest({
    principal: initialAmount,
    monthlyDeposit,
    annualRate: netReturnPct,
    years,
    compoundFrequency: 12,
    depositFrequency: 12,
  });

  const totalLostToFees = Math.max(0, withoutFees.futureValue - withFees.futureValue);
  const percentLostToFees = withoutFees.futureValue > 0 ? (totalLostToFees / withoutFees.futureValue) * 100 : 0;

  return {
    finalBalanceWithoutFees: withoutFees.futureValue,
    finalBalanceWithFees: withFees.futureValue,
    totalLostToFees,
    percentLostToFees,
  };
}
