import { AmortizationRow } from '../types/calculator';

/**
 * Standard Loan / Mortgage Amortization Calculator
 */
export interface LoanCalculationInput {
  loanAmount: number;
  interestRatePct: number;
  loanTermYears: number;
  extraMonthlyPayment?: number;
  propertyTaxAnnual?: number;
  homeInsuranceAnnual?: number;
  pmiMonthly?: number;
  hoaMonthly?: number;
  startDate?: string;
}

export interface LoanCalculationOutput {
  monthlyPrincipalAndInterest: number;
  totalMonthlyPayment: number;
  totalInterestPaid: number;
  totalPrincipal: number;
  totalCostOfLoan: number;
  payoffMonths: number;
  payoffYears: number;
  monthlySchedule: AmortizationRow[];
  yearlySchedule: AmortizationRow[];
  interestSavingsFromExtra: number;
  monthsSavedFromExtra: number;
}

export function calculateLoanAmortization(input: LoanCalculationInput): LoanCalculationOutput {
  const principal = Math.max(0, input.loanAmount);
  const annualRate = (input.interestRatePct || 0) / 100;
  const monthlyRate = annualRate / 12;
  const totalMonthsNominal = Math.round(Math.max(1, input.loanTermYears) * 12);
  const extraPmt = Math.max(0, input.extraMonthlyPayment || 0);

  // Standard Monthly Principal & Interest Payment (P&I)
  let standardMonthlyPI = 0;
  if (monthlyRate === 0) {
    standardMonthlyPI = principal / totalMonthsNominal;
  } else {
    standardMonthlyPI =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonthsNominal))) /
      (Math.pow(1 + monthlyRate, totalMonthsNominal) - 1);
  }

  // Monthly escrow items (Taxes, Insurance, PMI, HOA)
  const propTaxMo = (input.propertyTaxAnnual || 0) / 12;
  const insMo = (input.homeInsuranceAnnual || 0) / 12;
  const pmiMo = input.pmiMonthly || 0;
  const hoaMo = input.hoaMonthly || 0;
  const totalMonthlyEscrow = propTaxMo + insMo + pmiMo + hoaMo;

  const totalMonthlyPayment = standardMonthlyPI + totalMonthlyEscrow + extraPmt;

  // Generate Amortization Schedule
  let remainingBalance = principal;
  let totalInterestPaid = 0;
  const monthlySchedule: AmortizationRow[] = [];
  const yearlySchedule: AmortizationRow[] = [];

  let curYearInterest = 0;
  let curYearPrincipal = 0;
  let curYearPayment = 0;

  let actualMonths = 0;

  for (let month = 1; month <= totalMonthsNominal && remainingBalance > 0.001; month++) {
    actualMonths = month;
    const interest = remainingBalance * monthlyRate;
    let scheduledPrincipal = standardMonthlyPI - interest;
    let effectiveExtra = extraPmt;

    let totalPrincipalPaid = scheduledPrincipal + effectiveExtra;

    if (totalPrincipalPaid >= remainingBalance) {
      totalPrincipalPaid = remainingBalance;
      scheduledPrincipal = Math.min(scheduledPrincipal, remainingBalance);
      effectiveExtra = Math.max(0, remainingBalance - scheduledPrincipal);
      remainingBalance = 0;
    } else {
      remainingBalance -= totalPrincipalPaid;
    }

    const actualTotalPaymentThisMonth = scheduledPrincipal + interest + effectiveExtra;
    totalInterestPaid += interest;

    curYearInterest += interest;
    curYearPrincipal += totalPrincipalPaid;
    curYearPayment += actualTotalPaymentThisMonth;

    monthlySchedule.push({
      period: month,
      payment: Math.round(actualTotalPaymentThisMonth * 100) / 100,
      principal: Math.round(totalPrincipalPaid * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      extraPayment: Math.round(effectiveExtra * 100) / 100,
      remainingBalance: Math.max(0, Math.round(remainingBalance * 100) / 100),
      totalInterestPaid: Math.round(totalInterestPaid * 100) / 100,
    });

    if (month % 12 === 0 || remainingBalance <= 0.001) {
      const yearNum = Math.ceil(month / 12);
      yearlySchedule.push({
        period: yearNum,
        payment: Math.round(curYearPayment * 100) / 100,
        principal: Math.round(curYearPrincipal * 100) / 100,
        interest: Math.round(curYearInterest * 100) / 100,
        remainingBalance: Math.max(0, Math.round(remainingBalance * 100) / 100),
        totalInterestPaid: Math.round(totalInterestPaid * 100) / 100,
      });
      curYearInterest = 0;
      curYearPrincipal = 0;
      curYearPayment = 0;
    }
  }

  // Baseline without extra payments
  const baselineTotalInterest = standardMonthlyPI * totalMonthsNominal - principal;
  const interestSavingsFromExtra = Math.max(0, baselineTotalInterest - totalInterestPaid);
  const monthsSavedFromExtra = Math.max(0, totalMonthsNominal - actualMonths);

  return {
    monthlyPrincipalAndInterest: standardMonthlyPI,
    totalMonthlyPayment,
    totalInterestPaid,
    totalPrincipal: principal,
    totalCostOfLoan: principal + totalInterestPaid,
    payoffMonths: actualMonths,
    payoffYears: Math.round((actualMonths / 12) * 10) / 10,
    monthlySchedule,
    yearlySchedule,
    interestSavingsFromExtra,
    monthsSavedFromExtra,
  };
}

/**
 * APR Calculator (Annual Percentage Rate)
 * Finds internal rate of return r where PV = LoanAmount - ClosingFees
 */
export function calculateAPR(
  loanAmount: number,
  statedInterestRatePct: number,
  termYears: number,
  closingCostsAndPoints: number
) {
  const n = termYears * 12;
  const rStated = statedInterestRatePct / 100 / 12;
  const monthlyPmt =
    rStated === 0
      ? loanAmount / n
      : (loanAmount * (rStated * Math.pow(1 + rStated, n))) / (Math.pow(1 + rStated, n) - 1);

  const netLoanProceeds = loanAmount - closingCostsAndPoints;

  // Newton-Raphson to solve for true monthly rate rm where:
  // netLoanProceeds = monthlyPmt * [1 - (1+rm)^-n] / rm
  let rm = rStated;
  for (let i = 0; i < 100; i++) {
    const factor = Math.pow(1 + rm, -n);
    const f = (monthlyPmt * (1 - factor)) / rm - netLoanProceeds;
    const df = (monthlyPmt * (n * factor * rm - (1 - factor))) / (rm * rm);
    
    if (Math.abs(df) < 1e-12) break;
    const nextRm = rm - f / df;
    if (Math.abs(nextRm - rm) < 1e-8) {
      rm = nextRm;
      break;
    }
    rm = nextRm;
  }

  const trueAPR = rm * 12 * 100;
  return {
    statedRate: statedInterestRatePct,
    trueAPR: Math.max(0, trueAPR),
    monthlyPayment: monthlyPmt,
    totalFinanceCharges: monthlyPmt * n - loanAmount + closingCostsAndPoints,
    aprDifference: Math.max(0, trueAPR - statedInterestRatePct),
  };
}

/**
 * Loan Refinance Calculator
 */
export function calculateRefinance(
  currentBalance: number,
  currentInterestRatePct: number,
  currentRemainingYears: number,
  newInterestRatePct: number,
  newTermYears: number,
  closingCosts: number,
  rollClosingCostsIntoLoan: boolean
) {
  const currentLoan = calculateLoanAmortization({
    loanAmount: currentBalance,
    interestRatePct: currentInterestRatePct,
    loanTermYears: currentRemainingYears,
  });

  const newPrincipal = rollClosingCostsIntoLoan ? currentBalance + closingCosts : currentBalance;
  const newLoan = calculateLoanAmortization({
    loanAmount: newPrincipal,
    interestRatePct: newInterestRatePct,
    loanTermYears: newTermYears,
  });

  const monthlySavings = currentLoan.monthlyPrincipalAndInterest - newLoan.monthlyPrincipalAndInterest;
  const breakEvenMonths = monthlySavings > 0 ? Math.ceil(closingCosts / monthlySavings) : 0;
  const lifetimeTotalSavings = currentLoan.totalInterestPaid - (newLoan.totalInterestPaid + (rollClosingCostsIntoLoan ? 0 : closingCosts));

  return {
    currentMonthlyPmt: currentLoan.monthlyPrincipalAndInterest,
    newMonthlyPmt: newLoan.monthlyPrincipalAndInterest,
    monthlySavings,
    breakEvenMonths,
    breakEvenYears: Math.round((breakEvenMonths / 12) * 10) / 10,
    lifetimeTotalSavings,
    isRefinanceBeneficial: lifetimeTotalSavings > 0 && monthlySavings > 0,
    currentTotalInterest: currentLoan.totalInterestPaid,
    newTotalInterest: newLoan.totalInterestPaid,
  };
}

/**
 * Home Affordability Calculator (28/36 Rule)
 */
export function calculateHomeAffordability(
  annualGrossIncome: number,
  monthlyDebts: number,
  downPaymentAvailable: number,
  interestRatePct: number,
  termYears: number = 30,
  annualPropertyTaxRatePct: number = 1.2,
  annualHomeInsuranceRatePct: number = 0.5
) {
  const monthlyGrossIncome = annualGrossIncome / 12;

  // 28% Front-End DTI Limit (Housing only)
  const maxHousingFrontEnd = monthlyGrossIncome * 0.28;

  // 36% Back-End DTI Limit (Housing + existing monthly debts)
  const maxHousingBackEnd = Math.max(0, monthlyGrossIncome * 0.36 - monthlyDebts);

  // Maximum allowed total monthly housing payment
  const maxAllowedMonthlyHousing = Math.min(maxHousingFrontEnd, maxHousingBackEnd);

  // Find max purchase price where P&I + Tax + Insurance <= maxAllowedMonthlyHousing
  const r = interestRatePct / 100 / 12;
  const n = termYears * 12;
  const taxFactorMo = (annualPropertyTaxRatePct / 100) / 12;
  const insFactorMo = (annualHomeInsuranceRatePct / 100) / 12;

  // Let P = purchasePrice. Loan = P - DownPayment
  // Monthly P&I = (P - DP) * [r*(1+r)^n / ((1+r)^n - 1)] = (P - DP) * k
  const k = r === 0 ? 1 / n : (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  // Total Mo = (P - DP)*k + P * (taxFactorMo + insFactorMo) = P*(k + taxFactorMo + insFactorMo) - DP*k
  // maxAllowedMonthlyHousing = P * (k + escrowFactor) - DP*k
  // P = (maxAllowedMonthlyHousing + DP * k) / (k + escrowFactor)

  const escrowFactor = taxFactorMo + insFactorMo;
  const maxHomePrice = Math.max(0, (maxAllowedMonthlyHousing + downPaymentAvailable * k) / (k + escrowFactor));
  const maxLoanAmount = Math.max(0, maxHomePrice - downPaymentAvailable);
  const monthlyPI = maxLoanAmount * k;
  const monthlyTax = maxHomePrice * taxFactorMo;
  const monthlyIns = maxHomePrice * insFactorMo;

  return {
    maxHomePrice,
    maxLoanAmount,
    maxMonthlyPayment: maxAllowedMonthlyHousing,
    monthlyPI,
    monthlyTax,
    monthlyIns,
    frontEndDtiPct: (maxAllowedMonthlyHousing / monthlyGrossIncome) * 100,
    backEndDtiPct: ((maxAllowedMonthlyHousing + monthlyDebts) / monthlyGrossIncome) * 100,
  };
}

/**
 * Rent vs Buy Calculator (10 Year Horizon)
 */
export function calculateRentVsBuy(
  homePrice: number,
  downPaymentPct: number,
  interestRatePct: number,
  monthlyRent: number,
  rentInflationPct: number = 3.5,
  homeAppreciationPct: number = 3.5,
  investmentReturnPct: number = 7.0,
  yearsToCompare: number = 10
) {
  const downPayment = homePrice * (downPaymentPct / 100);
  const loan = calculateLoanAmortization({
    loanAmount: homePrice - downPayment,
    interestRatePct,
    loanTermYears: 30,
    propertyTaxAnnual: homePrice * 0.012,
    homeInsuranceAnnual: homePrice * 0.005,
  });

  // Buying Scenario Net Worth in year N
  let homeValue = homePrice;
  let buyerCumulativeCost = downPayment + (homePrice * 0.03); // 3% initial buying closing costs
  const yearlyBuySchedule = [];
  let remainingMortgage = homePrice - downPayment;

  // Renting Scenario Net Worth in year N (invests down payment + closing costs in market)
  let renterInvestments = downPayment + (homePrice * 0.03);
  let currentRent = monthlyRent;
  let renterCumulativeCost = 0;
  const yearlyRentSchedule = [];

  for (let y = 1; y <= yearsToCompare; y++) {
    // Buy calculations
    homeValue *= 1 + homeAppreciationPct / 100;
    const yearAmort = loan.yearlySchedule[y - 1] || loan.yearlySchedule[loan.yearlySchedule.length - 1];
    remainingMortgage = yearAmort ? yearAmort.remainingBalance : 0;
    const maintenance = homeValue * 0.01; // 1% annual maintenance
    buyerCumulativeCost += (loan.monthlyPrincipalAndInterest + (homePrice * 0.017 / 12)) * 12 + maintenance;

    const buyerNetEquity = homeValue * 0.94 - remainingMortgage; // Minus 6% selling commission

    // Rent calculations
    const annualRentTotal = currentRent * 12;
    renterCumulativeCost += annualRentTotal;
    // Renter investment growth + extra cash saved if rent is lower than buy
    renterInvestments = renterInvestments * (1 + investmentReturnPct / 100);
    currentRent *= 1 + rentInflationPct / 100;

    yearlyBuySchedule.push({ year: y, homeValue, buyerNetEquity, cumulativeCost: buyerCumulativeCost });
    yearlyRentSchedule.push({ year: y, rent: currentRent, renterNetWorth: renterInvestments, cumulativeCost: renterCumulativeCost });
  }

  const finalBuyerEquity = yearlyBuySchedule[yearsToCompare - 1].buyerNetEquity;
  const finalRenterNetWorth = yearlyRentSchedule[yearsToCompare - 1].renterNetWorth;
  const advantage = finalBuyerEquity > finalRenterNetWorth ? 'Buying' : 'Renting';

  return {
    buyerFinalNetWorth: finalBuyerEquity,
    renterFinalNetWorth: finalRenterNetWorth,
    netAdvantageAmount: Math.abs(finalBuyerEquity - finalRenterNetWorth),
    advantage,
    yearlyBuySchedule,
    yearlyRentSchedule,
  };
}

/**
 * Rental Property Investment & Cap Rate
 */
export function calculateRentalProperty(
  purchasePrice: number,
  downPaymentPct: number,
  interestRatePct: number,
  monthlyGrossRent: number,
  vacancyRatePct: number = 5,
  propertyManagementFeePct: number = 8,
  annualPropertyTax: number,
  annualInsurance: number,
  annualMaintenance: number
) {
  const downPayment = purchasePrice * (downPaymentPct / 100);
  const loanAmount = purchasePrice - downPayment;
  const loan = calculateLoanAmortization({
    loanAmount,
    interestRatePct,
    loanTermYears: 30,
  });

  const grossAnnualIncome = monthlyGrossRent * 12;
  const effectiveGrossIncome = grossAnnualIncome * (1 - vacancyRatePct / 100);

  const managementFeeAnnual = effectiveGrossIncome * (propertyManagementFeePct / 100);
  const totalOperatingExpenses = annualPropertyTax + annualInsurance + annualMaintenance + managementFeeAnnual;

  const netOperatingIncome = effectiveGrossIncome - totalOperatingExpenses; // NOI
  const annualDebtService = loan.monthlyPrincipalAndInterest * 12;
  const annualCashFlow = netOperatingIncome - annualDebtService;
  const monthlyCashFlow = annualCashFlow / 12;

  const capRate = purchasePrice > 0 ? (netOperatingIncome / purchasePrice) * 100 : 0;
  const totalInitialCashInvested = downPayment + purchasePrice * 0.03; // plus closing costs
  const cashOnCashReturn = totalInitialCashInvested > 0 ? (annualCashFlow / totalInitialCashInvested) * 100 : 0;
  const grossRentMultiplier = grossAnnualIncome > 0 ? purchasePrice / grossAnnualIncome : 0;

  return {
    netOperatingIncome,
    monthlyCashFlow,
    annualCashFlow,
    capRate,
    cashOnCashReturn,
    grossRentMultiplier,
    operatingExpenseRatio: effectiveGrossIncome > 0 ? (totalOperatingExpenses / effectiveGrossIncome) * 100 : 0,
    debtServiceCoverageRatio: annualDebtService > 0 ? netOperatingIncome / annualDebtService : 0,
  };
}
