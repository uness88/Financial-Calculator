/**
 * Stock & Equity Quantitative Mathematical Engine
 */

/**
 * Normal Cumulative Distribution Function (CDF) approximation for Black-Scholes
 */
export function normalCDF(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x) / Math.sqrt(2.0);

  const t = 1.0 / (1.0 + p * absX);
  const erf = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);

  return 0.5 * (1.0 + sign * erf);
}

export function normalPDF(x: number): number {
  return (1.0 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
}

/**
 * Black-Scholes European Option Pricing Model with Greeks
 */
export function calculateBlackScholes(
  spotPrice: number,
  strikePrice: number,
  timeToExpiryYears: number,
  riskFreeRatePct: number,
  volatilityPct: number
) {
  const S = Math.max(0.01, spotPrice);
  const K = Math.max(0.01, strikePrice);
  const T = Math.max(0.001, timeToExpiryYears);
  const r = riskFreeRatePct / 100;
  const sigma = Math.max(0.001, volatilityPct / 100);

  const d1 = (Math.log(S / K) + (r + (sigma * sigma) / 2) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);

  const callPrice = S * normalCDF(d1) - K * Math.exp(-r * T) * normalCDF(d2);
  const putPrice = K * Math.exp(-r * T) * normalCDF(-d2) - S * normalCDF(-d1);

  // Greeks
  const deltaCall = normalCDF(d1);
  const deltaPut = deltaCall - 1;
  const gamma = normalPDF(d1) / (S * sigma * Math.sqrt(T));
  const vega = (S * normalPDF(d1) * Math.sqrt(T)) / 100; // per 1% vol change
  const thetaCall =
    (-(S * normalPDF(d1) * sigma) / (2 * Math.sqrt(T)) - r * K * Math.exp(-r * T) * normalCDF(d2)) / 365;
  const thetaPut =
    (-(S * normalPDF(d1) * sigma) / (2 * Math.sqrt(T)) + r * K * Math.exp(-r * T) * normalCDF(-d2)) / 365;

  return {
    callPrice: Math.max(0, callPrice),
    putPrice: Math.max(0, putPrice),
    d1,
    d2,
    deltaCall,
    deltaPut,
    gamma,
    vega,
    thetaCall,
    thetaPut,
  };
}

/**
 * CAPM (Capital Asset Pricing Model)
 */
export function calculateCAPM(riskFreeRatePct: number, beta: number, expectedMarketReturnPct: number) {
  const rf = riskFreeRatePct / 100;
  const rm = expectedMarketReturnPct / 100;
  const equityRiskPremium = rm - rf;
  const expectedReturn = rf + beta * equityRiskPremium;

  return {
    expectedReturnPct: expectedReturn * 100,
    equityRiskPremiumPct: equityRiskPremium * 100,
    betaSensitivity: beta > 1 ? 'High Volatility (Aggressive)' : beta < 1 ? 'Low Volatility (Defensive)' : 'Market Benchmark',
  };
}

/**
 * WACC (Weighted Average Cost of Capital)
 */
export function calculateWACC(
  marketValueOfEquity: number,
  marketValueOfDebt: number,
  costOfEquityPct: number,
  costOfDebtPct: number,
  corporateTaxRatePct: number
) {
  const E = Math.max(0, marketValueOfEquity);
  const D = Math.max(0, marketValueOfDebt);
  const V = E + D;
  if (V === 0) return { waccPct: 0, equityWeight: 0, debtWeight: 0, afterTaxCostOfDebt: 0 };

  const re = costOfEquityPct / 100;
  const rd = costOfDebtPct / 100;
  const tc = corporateTaxRatePct / 100;

  const we = E / V;
  const wd = D / V;
  const afterTaxRd = rd * (1 - tc);

  const wacc = we * re + wd * afterTaxRd;

  return {
    waccPct: wacc * 100,
    equityWeightPct: we * 100,
    debtWeightPct: wd * 100,
    afterTaxCostOfDebtPct: afterTaxRd * 100,
  };
}

/**
 * Gordon Constant Growth Dividend Model
 */
export function calculateConstantGrowth(
  expectedNextDividend: number,
  requiredRateOfReturnPct: number,
  dividendGrowthRatePct: number
) {
  const r = requiredRateOfReturnPct / 100;
  const g = dividendGrowthRatePct / 100;

  if (r <= g) {
    return {
      intrinsicValue: 0,
      isValid: false,
      errorMessage: 'Required return (r) must be strictly greater than dividend growth rate (g).',
    };
  }

  const intrinsicValue = expectedNextDividend / (r - g);
  return {
    intrinsicValue,
    isValid: true,
    dividendYieldPct: (expectedNextDividend / intrinsicValue) * 100,
  };
}

/**
 * Non-Constant / Multi-Stage Dividend Growth Model
 */
export function calculateNonConstantGrowth(
  currentDividend: number,
  supernormalGrowthPct: number,
  supernormalYears: number,
  terminalGrowthPct: number,
  requiredReturnPct: number
) {
  const r = requiredReturnPct / 100;
  const g1 = supernormalGrowthPct / 100;
  const g2 = terminalGrowthPct / 100;

  if (r <= g2) {
    return {
      intrinsicValue: 0,
      isValid: false,
      errorMessage: 'Required return must be greater than perpetual terminal growth rate.',
      pvSupernormal: 0,
      pvTerminal: 0,
    };
  }

  let pvSupernormal = 0;
  let lastDividend = currentDividend;
  const projectedDividends: { year: number; dividend: number; pv: number }[] = [];

  for (let t = 1; t <= supernormalYears; t++) {
    lastDividend *= 1 + g1;
    const pv = lastDividend / Math.pow(1 + r, t);
    pvSupernormal += pv;
    projectedDividends.push({ year: t, dividend: lastDividend, pv });
  }

  const terminalDividend = lastDividend * (1 + g2);
  const terminalValueAtYearN = terminalDividend / (r - g2);
  const pvTerminal = terminalValueAtYearN / Math.pow(1 + r, supernormalYears);

  const intrinsicValue = pvSupernormal + pvTerminal;

  return {
    intrinsicValue,
    isValid: true,
    pvSupernormal,
    pvTerminal,
    projectedDividends,
  };
}

/**
 * Pivot Points (Standard, Fibonacci, Camarilla, Woodie)
 */
export function calculatePivotPoints(high: number, low: number, close: number, open: number = close) {
  // Standard Floor Pivot
  const pp = (high + low + close) / 3;
  const r1 = 2 * pp - low;
  const s1 = 2 * pp - high;
  const r2 = pp + (high - low);
  const s2 = pp - (high - low);
  const r3 = high + 2 * (pp - low);
  const s3 = low - 2 * (high - pp);

  // Fibonacci Pivots
  const range = high - low;
  const fibR1 = pp + 0.382 * range;
  const fibR2 = pp + 0.618 * range;
  const fibR3 = pp + 1.0 * range;
  const fibS1 = pp - 0.382 * range;
  const fibS2 = pp - 0.618 * range;
  const fibS3 = pp - 1.0 * range;

  // Camarilla Pivots
  const camR4 = close + range * 1.1 / 2;
  const camR3 = close + range * 1.1 / 4;
  const camS3 = close - range * 1.1 / 4;
  const camS4 = close - range * 1.1 / 2;

  return {
    standard: { pp, r1, r2, r3, s1, s2, s3 },
    fibonacci: { pp, r1: fibR1, r2: fibR2, r3: fibR3, s1: fibS1, s2: fibS2, s3: fibS3 },
    camarilla: { pp, r4: camR4, r3: camR3, s3: camS3, s4: camS4 },
  };
}

/**
 * Fibonacci Retracement & Extension Levels
 */
export function calculateFibonacci(high: number, low: number, trend: 'uptrend' | 'downtrend') {
  const diff = high - low;

  if (trend === 'uptrend') {
    return {
      retracements: [
        { level: '23.6%', price: high - 0.236 * diff },
        { level: '38.2%', price: high - 0.382 * diff },
        { level: '50.0%', price: high - 0.5 * diff },
        { level: '61.8% (Golden Ratio)', price: high - 0.618 * diff },
        { level: '78.6%', price: high - 0.786 * diff },
        { level: '100.0%', price: low },
      ],
      extensions: [
        { level: '127.2%', price: high + 0.272 * diff },
        { level: '161.8% (Golden Extension)', price: high + 0.618 * diff },
        { level: '200.0%', price: high + 1.0 * diff },
        { level: '261.8%', price: high + 1.618 * diff },
      ],
    };
  } else {
    return {
      retracements: [
        { level: '23.6%', price: low + 0.236 * diff },
        { level: '38.2%', price: low + 0.382 * diff },
        { level: '50.0%', price: low + 0.5 * diff },
        { level: '61.8% (Golden Ratio)', price: low + 0.618 * diff },
        { level: '78.6%', price: low + 0.786 * diff },
        { level: '100.0%', price: high },
      ],
      extensions: [
        { level: '127.2%', price: low - 0.272 * diff },
        { level: '161.8% (Golden Extension)', price: low - 0.618 * diff },
        { level: '200.0%', price: low - 1.0 * diff },
        { level: '261.8%', price: low - 1.618 * diff },
      ],
    };
  }
}
