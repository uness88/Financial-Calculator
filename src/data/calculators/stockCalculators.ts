import { CalculatorDefinition } from '../../types/calculator';
import {
  calculateBlackScholes,
  calculateCAPM,
  calculateWACC,
  calculateConstantGrowth,
  calculatePivotPoints,
  calculateFibonacci,
} from '../../math/stockMath';

export const STOCK_CALCULATORS: CalculatorDefinition[] = [
  {
    slug: 'stock-calculator',
    name: 'Stock Profit & Loss Calculator',
    h1Title: 'Stock Profit & Loss (P&L) and ROI Calculator',
    category: 'stock-calculators',
    badge: 'Popular',
    shortDescription: 'Calculate net capital gains, total return, broker commissions, and holding period ROI on stock trades.',
    longDescription: 'Calculate your exact profit or loss on stock and ETF trades. Factor in buy price, sell price, share count, trading commissions, and dividend income to determine your net profit and annualized return on investment.',
    seoTitle: 'Stock Profit & Loss Calculator - Calculate Stock Trade Returns & ROI',
    metaDescription: 'Free Stock Calculator. Calculate profit/loss, return on investment (ROI), trading fees, and net capital gains on stock and ETF trades.',
    keywords: ['stock calculator', 'stock profit calculator', 'stock return calculator', 'trade pnl calculator', 'stock roi'],
    inputs: [
      { id: 'shares', label: 'Number of Shares Traded', type: 'number', defaultValue: 100, min: 1 },
      { id: 'buyPrice', label: 'Purchase Price Per Share', type: 'currency', defaultValue: 150.00 },
      { id: 'sellPrice', label: 'Selling Price Per Share', type: 'currency', defaultValue: 195.00 },
      { id: 'buyCommission', label: 'Purchase Commission / Trading Fee', type: 'currency', defaultValue: 0 },
      { id: 'sellCommission', label: 'Selling Commission / Trading Fee', type: 'currency', defaultValue: 0 },
      { id: 'dividendsReceived', label: 'Total Dividends Received During Holding Period', type: 'currency', defaultValue: 250 },
    ],
    calculate: (inputs) => {
      const shares = Number(inputs.shares) || 1;
      const buyP = Number(inputs.buyPrice) || 0;
      const sellP = Number(inputs.sellPrice) || 0;
      const buyComm = Number(inputs.buyCommission) || 0;
      const sellComm = Number(inputs.sellCommission) || 0;
      const divs = Number(inputs.dividendsReceived) || 0;

      const totalBuyCost = (shares * buyP) + buyComm;
      const grossProceeds = shares * sellP;
      const netSellProceeds = grossProceeds - sellComm;
      const capitalGain = netSellProceeds - totalBuyCost;
      const netProfit = capitalGain + divs;
      const totalROI = totalBuyCost > 0 ? (netProfit / totalBuyCost) * 100 : 0;

      return {
        primaryResult: {
          id: 'net_profit',
          label: 'Total Net Profit / Return',
          value: netProfit,
          format: 'currency',
          isPrimary: true,
          changeType: netProfit >= 0 ? 'positive' : 'negative',
        },
        metrics: [
          { id: 'total_roi', label: 'Total Return on Investment (ROI)', value: totalROI, format: 'percentage', changeType: totalROI >= 0 ? 'positive' : 'negative' },
          { id: 'capital_gain', label: 'Capital Gain (Excl. Dividends)', value: capitalGain, format: 'currency', changeType: capitalGain >= 0 ? 'positive' : 'negative' },
          { id: 'total_invested', label: 'Total Cost Basis Invested', value: totalBuyCost, format: 'currency' },
          { id: 'proceeds', label: 'Gross Sale Proceeds', value: grossProceeds, format: 'currency' },
        ],
        summaryText: `Your trade produced a net profit of $${Math.round(netProfit).toLocaleString('en-US')} on an initial investment of $${Math.round(totalBuyCost).toLocaleString('en-US')} (${totalROI >= 0 ? '+' : ''}${totalROI.toFixed(2)}% ROI), including $${capitalGain.toFixed(2)} in capital gains and $${divs.toFixed(2)} in dividends.`,
      };
    },
    formula: {
      formula: '\\text{Net Profit} = (\\text{Shares} \\times P_{\\text{sell}} - \\text{Fee}_{\\text{sell}}) - (\\text{Shares} \\times P_{\\text{buy}} + \\text{Fee}_{\\text{buy}}) + \\text{Dividends}',
      explanation: 'Calculates true net investment yield accounting for all transaction friction and cash distributions.',
      variables: [
        { symbol: 'P_sell', name: 'Exit Price', description: 'Execution price per share on sale' },
        { symbol: 'P_buy', name: 'Entry Price', description: 'Execution price per share on purchase' },
      ],
    },
    howItWorks: [
      'Enter the number of shares bought and sold.',
      'Enter purchase price, sale price, and any transaction fees.',
      'Review net dollar profit and percentage return on investment.',
    ],
    example: {
      scenarioTitle: 'Buying 100 Shares at $150 and Selling at $195 with $250 in Dividends',
      description: 'Calculating total trade P&L.',
      inputs: { 'Shares': '100', 'Buy Price': '$150', 'Sell Price': '$195', 'Dividends': '$250' },
      stepByStep: [
        'Total purchase cost = 100 × $150 = $15,000.',
        'Total sale revenue = 100 × $195 = $19,500.',
        'Capital gain = $19,500 - $15,000 = $4,500.',
        'Net profit with dividends = $4,500 + $250 = $4,750 (+31.67% ROI).',
      ],
      finalOutcome: 'Total profit = $4,750 (31.67% ROI).',
    },
    whatItMeans: 'Dividends provide substantial downside cushioning and boost total realized returns over time.',
    factorsToConsider: ['Short-term vs long-term capital gains tax rates depending on holding period (under or over 1 year).'],
    faqs: [
      { question: 'How is stock capital gains tax calculated in the US?', answer: 'Assets held for 1 year or less are taxed at ordinary income tax rates (10%–37%). Assets held longer than 1 year qualify for preferential long-term capital gains tax rates (0%, 15%, or 20%).' },
    ],
    relatedCalculatorSlugs: ['dividend-growth-calculator', 'dollar-cost-averaging-calculator', 'roi-calculator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Standard trade P&L cost basis accounting.',
  },
  {
    slug: 'black-scholes-calculator',
    name: 'Black-Scholes Options Calculator',
    h1Title: 'Black-Scholes Options Pricing & Greeks Calculator',
    category: 'stock-calculators',
    badge: 'Quant Model',
    shortDescription: 'Price European Call and Put options and compute the Greeks: Delta, Gamma, Theta, Vega, and Rho.',
    longDescription: 'The Black-Scholes-Merton model is the cornerstone of quantitative option pricing. Calculate theoretical fair market values for European Call and Put options alongside all 5 key option Greeks.',
    seoTitle: 'Black-Scholes Calculator - Options Pricing & Greeks (Delta, Gamma, Theta)',
    metaDescription: 'Free Black-Scholes Options Calculator. Calculate Call and Put fair values, Delta, Gamma, Theta, Vega, and Rho with historical volatility.',
    keywords: ['black scholes calculator', 'option pricing calculator', 'option greeks calculator', 'delta gamma theta vega', 'call put option calculator'],
    inputs: [
      { id: 'stockPrice', label: 'Underlying Stock Price (S)', type: 'currency', defaultValue: 100.00 },
      { id: 'strikePrice', label: 'Option Strike Price (K)', type: 'currency', defaultValue: 100.00 },
      { id: 'timeToMaturityYears', label: 'Time to Expiration (Years)', type: 'years', defaultValue: 0.5, step: 0.01, helpText: 'e.g., 0.5 for 6 months, 0.25 for 3 months, 0.083 for 1 month' },
      { id: 'volatilityPct', label: 'Implied Volatility / Sigma (%)', type: 'percentage', defaultValue: 25.0 },
      { id: 'riskFreeRatePct', label: 'Risk-Free Interest Rate (%)', type: 'percentage', defaultValue: 4.5 },
    ],
    calculate: (inputs) => {
      const s = Number(inputs.stockPrice) || 100;
      const k = Number(inputs.strikePrice) || 100;
      const t = Math.max(0.001, Number(inputs.timeToMaturityYears) || 0.25);
      const vol = Number(inputs.volatilityPct) || 25;
      const r = Number(inputs.riskFreeRatePct) || 4.5;

      const res = calculateBlackScholes(s, k, t, r, vol);

      return {
        primaryResult: {
          id: 'call_price',
          label: 'Theoretical Call Option Price',
          value: res.callPrice,
          format: 'currency',
          isPrimary: true,
        },
        metrics: [
          { id: 'put_price', label: 'Theoretical Put Option Price', value: res.putPrice, format: 'currency' },
          { id: 'delta_call', label: 'Call Delta (Δ)', value: res.deltaCall.toFixed(4), format: 'number' },
          { id: 'gamma_val', label: 'Gamma (Γ)', value: res.gamma.toFixed(4), format: 'number' },
          { id: 'theta_call', label: 'Call Theta (Daily Time Decay)', value: res.thetaCall.toFixed(3), format: 'number' },
          { id: 'vega_val', label: 'Vega (ν per 1% IV change)', value: res.vega.toFixed(3), format: 'number' },
        ],
        summaryText: `At an underlying price of $${s.toFixed(2)} and strike of $${k.toFixed(2)} (${(t*365).toFixed(0)} days to expiry at ${vol}% IV), the fair Call price is $${res.callPrice.toFixed(2)} (Delta: ${res.deltaCall.toFixed(3)}) and Put price is $${res.putPrice.toFixed(2)} (Delta: ${res.deltaPut.toFixed(3)}).`,
        insights: [
          {
            type: 'info',
            title: 'Greeks Interpretation',
            message: `Call Delta is ${res.deltaCall.toFixed(3)}, meaning a $1 increase in the stock will increase the call value by ~$${res.deltaCall.toFixed(2)}. Theta decays the call by $${Math.abs(res.thetaCall).toFixed(3)} each day.`,
          }
        ]
      };
    },
    formula: {
      formula: 'C = S N(d_1) - K e^{-rT} N(d_2), \\quad d_1 = \\frac{\\ln(S/K) + (r + \\sigma^2/2)T}{\\sigma \\sqrt{T}}',
      explanation: 'The Nobel prize-winning Black-Scholes formula models option prices assuming stock prices follow geometric Brownian motion with log-normal returns.',
      variables: [
        { symbol: 'S', name: 'Stock Price', description: 'Current spot market price of the underlying asset' },
        { symbol: 'K', name: 'Strike Price', description: 'Agreed exercise strike price' },
        { symbol: '\\sigma', name: 'Volatility', description: 'Annualized standard deviation of asset returns' },
        { symbol: 'r', name: 'Risk-Free Rate', description: 'Yield on equivalent maturity US Treasury bills' },
      ],
    },
    howItWorks: [
      'Enter spot price, strike price, time to expiration, and implied volatility.',
      'Enter risk-free interest rate.',
      'Inspect theoretical pricing and Greek risk sensitivities.',
    ],
    example: {
      scenarioTitle: '$100 Stock At-the-Money 6-Month Call at 25% Volatility',
      description: 'Pricing a $100 strike Call and Put with 4.5% Treasury yield.',
      inputs: { 'S': '$100', 'K': '$100', 'Time': '0.5 Yrs (182 days)', 'Volatility': '25%', 'Risk-Free': '4.5%' },
      stepByStep: [
        'Compute d1 = 0.222, d2 = 0.045.',
        'N(d1) = 0.5878 (Call Delta), N(d2) = 0.5180.',
        'Fair Call Price = $7.78.',
        'Fair Put Price = $5.60.',
      ],
      finalOutcome: 'Call Fair Value = $7.78 | Put Fair Value = $5.60.',
    },
    whatItMeans: 'Comparing Black-Scholes theoretical value to actual market option prices reveals whether options are underpriced or overpriced relative to historical volatility.',
    factorsToConsider: ['Volatility smile and skew: Real market options trade with implied volatility smiles across different strikes.'],
    faqs: [
      { question: 'What does Option Delta mean?', answer: 'Delta measures the rate of change of an option price with respect to changes in the underlying asset price. A delta of 0.50 means the option price moves $0.50 for every $1.00 move in the stock.' },
    ],
    relatedCalculatorSlugs: ['stock-calculator', 'capm-calculator', 'wacc-calculator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'CFA Institute Black-Scholes-Merton quantitative pricing benchmark.',
  },
  {
    slug: 'capm-calculator',
    name: 'CAPM Calculator',
    h1Title: 'Capital Asset Pricing Model (CAPM) Calculator',
    category: 'stock-calculators',
    badge: 'Valuation',
    shortDescription: 'Calculate the theoretical expected return of an asset or equity based on its systemic market risk (Beta).',
    longDescription: 'The Capital Asset Pricing Model (CAPM) establishes the relationship between systemic risk (Beta) and the expected return for assets, particularly equities. Use CAPM to calculate the cost of equity for company valuation.',
    seoTitle: 'CAPM Calculator - Capital Asset Pricing Model Expected Return',
    metaDescription: 'Free CAPM Calculator. Calculate the required cost of equity and expected stock return using Beta, Risk-Free Rate, and Equity Risk Premium.',
    keywords: ['capm calculator', 'capital asset pricing model', 'cost of equity calculator', 'stock beta calculator', 'equity risk premium'],
    inputs: [
      { id: 'riskFreeRate', label: 'Risk-Free Rate (Rf %)', type: 'percentage', defaultValue: 4.25, helpText: 'Current yield on 10-Year US Treasury bonds' },
      { id: 'stockBeta', label: 'Stock Beta (β)', type: 'number', defaultValue: 1.25, step: 0.01, helpText: 'Measure of stock volatility relative to the S&P 500 (Market Beta = 1.0)' },
      { id: 'expectedMarketReturn', label: 'Expected Market Return (Rm %)', type: 'percentage', defaultValue: 10.0, helpText: 'Historical S&P 500 average return (~9.5% - 10.5%)' },
    ],
    calculate: (inputs) => {
      const rf = Number(inputs.riskFreeRate) || 4.25;
      const beta = Number(inputs.stockBeta) || 1.25;
      const rm = Number(inputs.expectedMarketReturn) || 10.0;

      const res = calculateCAPM(rf, beta, rm);

      return {
        primaryResult: {
          id: 'expected_return',
          label: 'CAPM Required Expected Return',
          value: res.expectedReturnPct,
          format: 'percentage',
          isPrimary: true,
        },
        metrics: [
          { id: 'market_risk_prem', label: 'Equity Market Risk Premium (ERP)', value: res.equityRiskPremiumPct, format: 'percentage' },
          { id: 'beta_score', label: 'Stock Volatility Sensitivity (Beta)', value: beta.toFixed(2), format: 'number' },
          { id: 'profile_label', label: 'Risk Classification', value: res.betaSensitivity, format: 'text' },
        ],
        summaryText: `With a 10-year Treasury rate of ${rf}%, an Equity Risk Premium of ${res.equityRiskPremiumPct.toFixed(2)}%, and a Beta of ${beta.toFixed(2)}, the required cost of equity is ${res.expectedReturnPct.toFixed(2)}%.`,
      };
    },
    formula: {
      formula: 'E(R_i) = R_f + \\beta_i [E(R_m) - R_f]',
      explanation: 'Investors require compensation in two parts: the time value of money (Risk-Free Rate) plus risk compensation for taking on non-diversifiable systematic risk.',
      variables: [
        { symbol: 'R_f', name: 'Risk-Free Rate', description: 'Yield on default-free sovereign government bonds' },
        { symbol: '\\beta', name: 'Beta', description: 'Covariance of stock returns with market returns divided by market variance' },
        { symbol: 'E(R_m) - R_f', name: 'Market Risk Premium', description: 'Excess return required to hold equities over risk-free bonds' },
      ],
    },
    howItWorks: [
      'Enter current risk-free rate (e.g. 10-year US Treasury yield).',
      'Enter the company\'s Beta and expected overall market return.',
      'Calculate the theoretical required rate of return for equity discount rate analysis.',
    ],
    example: {
      scenarioTitle: 'Tech Stock with Beta of 1.25 in a 10% Market Return Environment',
      description: 'Treasury Rate = 4.25%, Beta = 1.25, Market Return = 10.0%.',
      inputs: { 'Risk-Free Rate': '4.25%', 'Beta': '1.25', 'Market Return': '10.0%' },
      stepByStep: [
        'Market Risk Premium = 10.0% - 4.25% = 5.75%.',
        'Asset Risk Premium = 1.25 × 5.75% = 7.188%.',
        'Expected Return = 4.25% + 7.188% = 11.438%.',
      ],
      finalOutcome: 'Required Expected Return = 11.44%.',
    },
    whatItMeans: 'Stocks with higher Betas (above 1.0) must offer higher expected returns to compensate investors for higher systematic volatility.',
    factorsToConsider: ['Beta fluctuates across market cycles; CAPM assumes efficient capital markets.'],
    faqs: [
      { question: 'What does a Beta greater than 1.0 mean?', answer: 'A Beta of 1.25 means the stock is historically 25% more volatile than the broader market index. When the market moves up or down by 1%, the stock tends to move 1.25%.' },
    ],
    relatedCalculatorSlugs: ['wacc-calculator', 'stock-calculator', 'dividend-growth-calculator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'CFA Level 1 & 2 Equity Valuation CAPM standard framework.',
  },
  {
    slug: 'wacc-calculator',
    name: 'WACC Calculator',
    h1Title: 'Weighted Average Cost of Capital (WACC) Calculator',
    category: 'stock-calculators',
    badge: 'Corporate Finance',
    shortDescription: 'Calculate a company\'s hurdle rate and Weighted Average Cost of Capital across debt and equity.',
    longDescription: 'The Weighted Average Cost of Capital (WACC) calculates a company\'s blended cost of capital across common equity and debt financing, incorporating corporate tax shields. WACC serves as the fundamental discount rate for Discounted Cash Flow (DCF) models.',
    seoTitle: 'WACC Calculator - Weighted Average Cost of Capital Discount Rate',
    metaDescription: 'Free WACC Calculator. Calculate corporate hurdle rates and Weighted Average Cost of Capital with debt tax shields for DCF valuation.',
    keywords: ['wacc calculator', 'weighted average cost of capital', 'discount rate calculator', 'cost of capital', 'dcf discount rate'],
    inputs: [
      { id: 'equityValue', label: 'Market Value of Common Equity ($E)', type: 'currency', defaultValue: 80000000 },
      { id: 'debtValue', label: 'Market Value of Debt ($D)', type: 'currency', defaultValue: 20000000 },
      { id: 'costOfEquity', label: 'Cost of Equity (% Re)', type: 'percentage', defaultValue: 10.5 },
      { id: 'costOfDebt', label: 'Pre-Tax Cost of Debt (% Rd)', type: 'percentage', defaultValue: 6.0 },
      { id: 'taxRate', label: 'Corporate Marginal Tax Rate (%)', type: 'percentage', defaultValue: 21.0 },
    ],
    calculate: (inputs) => {
      const e = Number(inputs.equityValue) || 1000000;
      const d = Number(inputs.debtValue) || 0;
      const re = Number(inputs.costOfEquity) || 10.5;
      const rd = Number(inputs.costOfDebt) || 6.0;
      const t = Number(inputs.taxRate) || 21.0;

      const res = calculateWACC(e, d, re, rd, t);

      return {
        primaryResult: {
          id: 'wacc_rate',
          label: 'Weighted Average Cost of Capital (WACC)',
          value: res.waccPct,
          format: 'percentage',
          isPrimary: true,
        },
        metrics: [
          { id: 'weight_equity', label: 'Equity Weight (% of Capital)', value: res.equityWeightPct || 0, format: 'percentage' },
          { id: 'weight_debt', label: 'Debt Weight (% of Capital)', value: res.debtWeightPct || 0, format: 'percentage' },
          { id: 'after_tax_debt', label: 'After-Tax Cost of Debt', value: res.afterTaxCostOfDebtPct || 0, format: 'percentage' },
          { id: 'total_capital', label: 'Total Firm Enterprise Value', value: e + d, format: 'currency' },
        ],
        summaryText: `For an enterprise capitalized with ${(res.equityWeightPct || 80).toFixed(0)}% equity and ${(res.debtWeightPct || 20).toFixed(0)}% debt, the blended WACC is ${res.waccPct.toFixed(2)}%. Use ${res.waccPct.toFixed(2)}% as your discount hurdle rate in DCF models.`,
      };
    },
    formula: {
      formula: '\\text{WACC} = \\left(\\frac{E}{V} \\times R_e\\right) + \\left(\\frac{D}{V} \\times R_d \\times (1 - T)\\right)',
      explanation: 'Debt interest payments are tax-deductible, creating an interest tax shield that lowers the effective cost of debt to Rd × (1 - T).',
      variables: [
        { symbol: 'V', name: 'Total Capital', description: 'Total value of equity (E) + debt (D)' },
        { symbol: '1 - T', name: 'Tax Shield', description: 'Deduction benefit reducing net debt servicing expense' },
      ],
    },
    howItWorks: [
      'Enter market capitalization of equity and market value of debt.',
      'Enter cost of equity (from CAPM), pre-tax debt interest rate, and corporate tax rate.',
      'Get the exact hurdle rate for corporate investment appraisal.',
    ],
    example: {
      scenarioTitle: '$80M Equity / $20M Debt at 21% Corporate Tax',
      description: 'Cost of Equity = 10.5%, Cost of Debt = 6.0%.',
      inputs: { 'Equity': '$80M', 'Debt': '$20M', 'Re': '10.5%', 'Rd': '6.0%', 'Tax': '21%' },
      stepByStep: [
        'Total Enterprise Capital V = $100M.',
        'Equity Weight = 80%, Debt Weight = 20%.',
        'After-Tax Cost of Debt = 6.0% × (1 - 0.21) = 4.74%.',
        'WACC = (0.80 × 10.5%) + (0.20 × 4.74%) = 8.40% + 0.948% = 9.35%.',
      ],
      finalOutcome: 'WACC = 9.35%.',
    },
    whatItMeans: 'WACC is the minimum return a company must earn on existing assets to satisfy shareholders and creditors.',
    factorsToConsider: ['Optimal capital structure: Adding low-cost debt lowers WACC up to the point where bankruptcy risk increases cost of equity.'],
    faqs: [
      { question: 'Why is debt cheaper than equity in WACC?', answer: 'Debt is cheaper because debt holders have senior claim over equity in bankruptcy, and interest payments are tax-deductible expenses.' },
    ],
    relatedCalculatorSlugs: ['capm-calculator', 'stock-calculator', 'npv-irr-calculator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'CFA Corporate Finance WACC standard formulation.',
  },
  {
    slug: 'dividend-growth-calculator',
    name: 'Dividend Growth Calculator',
    h1Title: 'Dividend Growth & Gordon Growth Model Calculator',
    category: 'stock-calculators',
    badge: 'Dividends',
    shortDescription: 'Calculate future dividend income growth, Yield on Cost (YOC), and intrinsic stock valuation.',
    longDescription: 'Model the compounding power of Dividend Growth Investing (DGI). Calculate your projected annual dividend cash flow, future Yield on Cost, and theoretical intrinsic stock valuation using the Gordon Growth Model.',
    seoTitle: 'Dividend Growth Calculator - Gordon Growth Model & Yield on Cost',
    metaDescription: 'Free Dividend Growth Calculator. Calculate future dividend payouts, DRIP compounding, Yield on Cost (YOC), and intrinsic share value.',
    keywords: ['dividend growth calculator', 'gordon growth model', 'yield on cost calculator', 'dividend reinvestment', 'drip calculator'],
    inputs: [
      { id: 'currentSharePrice', label: 'Current Stock Price', type: 'currency', defaultValue: 100.00 },
      { id: 'annualDividend', label: 'Annual Dividend Per Share ($D0)', type: 'currency', defaultValue: 3.50 },
      { id: 'sharesOwned', label: 'Shares Owned', type: 'number', defaultValue: 200 },
      { id: 'dividendGrowthRatePct', label: 'Annual Dividend Growth Rate (%)', type: 'percentage', defaultValue: 7.0 },
      { id: 'yearsToProject', label: 'Projection Horizon (Years)', type: 'years', defaultValue: 15 },
      { id: 'requiredReturnRate', label: 'Required Rate of Return (for Valuation %)', type: 'percentage', defaultValue: 9.5 },
    ],
    calculate: (inputs) => {
      const price = Number(inputs.currentSharePrice) || 100;
      const d0 = Number(inputs.annualDividend) || 3.5;
      const shares = Number(inputs.sharesOwned) || 100;
      const g = Number(inputs.dividendGrowthRatePct) || 7;
      const yrs = Number(inputs.yearsToProject) || 15;
      const r = Number(inputs.requiredReturnRate) || 9.5;

      const expectedNextDiv = d0 * (1 + g / 100);
      const gordon = calculateConstantGrowth(expectedNextDiv, r, g);

      const futureAnnualDivPerShare = d0 * Math.pow(1 + g / 100, yrs);
      const futureAnnualIncome = futureAnnualDivPerShare * shares;
      const futureYieldOnCost = (futureAnnualDivPerShare / price) * 100;
      const currentDividendYield = (d0 / price) * 100;

      let totalDivs = 0;
      for (let y = 1; y <= yrs; y++) {
        totalDivs += d0 * Math.pow(1 + g / 100, y) * shares;
      }

      return {
        primaryResult: {
          id: 'future_annual_div',
          label: `Projected Annual Dividend Income at Year ${yrs}`,
          value: futureAnnualIncome,
          format: 'currency',
          isPrimary: true,
        },
        metrics: [
          { id: 'yield_on_cost', label: `Yield on Cost at Year ${yrs}`, value: futureYieldOnCost, format: 'percentage', changeType: 'positive' },
          { id: 'total_divs_collected', label: `Total Cumulative Dividends Over ${yrs} Yrs`, value: totalDivs, format: 'currency', changeType: 'positive' },
          { id: 'intrinsic_val', label: 'Gordon Growth Intrinsic Stock Value', value: gordon.intrinsicValue, format: 'currency' },
          { id: 'current_yield', label: 'Current Dividend Yield', value: currentDividendYield, format: 'percentage' },
        ],
        summaryText: `Your $${d0.toFixed(2)} dividend growing at ${g}%/year will pay $${futureAnnualDivPerShare.toFixed(2)}/share in Year ${yrs}, generating $${Math.round(futureAnnualIncome).toLocaleString('en-US')}/year in passive income (Yield on Cost jumps from ${currentDividendYield.toFixed(2)}% to ${futureYieldOnCost.toFixed(2)}%).`,
      };
    },
    formula: {
      formula: 'P_0 = \\frac{D_0(1 + g)}{r - g}, \\quad \\text{YOC}_t = \\frac{D_0(1 + g)^t}{\\text{Initial Purchase Price}} \\times 100\\%',
      explanation: 'The Gordon Growth Model values dividend-paying companies by discounting future growing dividends back to present value.',
      variables: [
        { symbol: 'D_0(1+g)', name: 'Next Year Dividend (D1)', description: 'Expected dividend payment next year' },
        { symbol: 'r - g', name: 'Capitalization Spread', description: 'Required rate of return minus sustainable growth rate' },
      ],
    },
    howItWorks: [
      'Enter current stock price, dividend payment, and shares owned.',
      'Enter expected historical dividend growth rate and projection years.',
      'Review future dividend income and intrinsic valuation.',
    ],
    example: {
      scenarioTitle: '200 Shares of a $100 Stock with $3.50 Dividend Growing at 7%',
      description: 'Projecting 15 years of dividend growth.',
      inputs: { 'Shares': '200', 'Dividend': '$3.50', 'Growth': '7.0%', 'Years': '15' },
      stepByStep: [
        'Year 1 Income = 200 × $3.50 = $700.00 (3.50% Yield).',
        'Year 15 Dividend per share = $3.50 × (1.07)^15 = $9.66.',
        'Year 15 Annual Income = 200 × $9.66 = $1,931.50/year.',
        'Yield on Cost at Year 15 = $9.66 / $100 = 9.66%.',
      ],
      finalOutcome: 'Annual passive dividend income expands from $700 to $1,931/yr.',
    },
    whatItMeans: 'High dividend growth stocks can provide superior passive retirement income compared to high-yielding stagnant stocks.',
    factorsToConsider: ['Dividend payout ratio: A payout ratio under 60% indicates a safe, sustainable dividend growth trajectory.'],
    faqs: [
      { question: 'What is Yield on Cost (YOC)?', answer: 'Yield on Cost is the current annual dividend divided by the original purchase price of the stock, illustrating how passive income expands over time relative to your initial capital.' },
    ],
    relatedCalculatorSlugs: ['stock-calculator', 'compound-interest-calculator', 'capm-calculator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'CFA Level 1 Gordon Growth Model (DDM) standard methodology.',
  },
  {
    slug: 'pivot-point-calculator',
    name: 'Pivot Point Calculator',
    h1Title: 'Technical Analysis Pivot Point Calculator (Standard, Fibonacci, Camarilla)',
    category: 'stock-calculators',
    badge: 'Technical Analysis',
    shortDescription: 'Calculate key intraday support and resistance levels across Standard, Fibonacci, Camarilla, and Woodie formulas.',
    longDescription: 'Pivot points are used by intraday and swing traders to identify key support and resistance levels. Enter prior period High, Low, and Close prices to generate precise trading pivot floors and ceilings.',
    seoTitle: 'Pivot Point Calculator - Standard, Fibonacci, Camarilla Support & Resistance',
    metaDescription: 'Free Pivot Point Calculator. Calculate Standard, Fibonacci, Camarilla, and Woodie support (S1-S3) and resistance (R1-R3) levels for trading.',
    keywords: ['pivot point calculator', 'support and resistance calculator', 'fibonacci pivot points', 'camarilla pivot points', 'day trading calculator'],
    inputs: [
      { id: 'highPrice', label: 'Prior Period High (H)', type: 'currency', defaultValue: 185.50 },
      { id: 'lowPrice', label: 'Prior Period Low (L)', type: 'currency', defaultValue: 179.20 },
      { id: 'closePrice', label: 'Prior Period Close (C)', type: 'currency', defaultValue: 184.10 },
      { id: 'openPrice', label: 'Current Period Open (O)', type: 'currency', defaultValue: 184.50 },
    ],
    calculate: (inputs) => {
      const h = Number(inputs.highPrice) || 100;
      const l = Number(inputs.lowPrice) || 90;
      const c = Number(inputs.closePrice) || 95;
      const o = Number(inputs.openPrice) || 95;

      const res = calculatePivotPoints(h, l, c, o);

      return {
        primaryResult: {
          id: 'main_pivot',
          label: 'Central Pivot Point (PP)',
          value: res.standard.pp,
          format: 'currency',
          isPrimary: true,
        },
        metrics: [
          { id: 'res_1', label: 'Standard Resistance 1 (R1)', value: res.standard.r1, format: 'currency' },
          { id: 'res_2', label: 'Standard Resistance 2 (R2)', value: res.standard.r2, format: 'currency' },
          { id: 'sup_1', label: 'Standard Support 1 (S1)', value: res.standard.s1, format: 'currency' },
          { id: 'sup_2', label: 'Standard Support 2 (S2)', value: res.standard.s2, format: 'currency' },
        ],
        summaryText: `Central Pivot Point is $${res.standard.pp.toFixed(2)}. Key resistance targets are R1: $${res.standard.r1.toFixed(2)} and R2: $${res.standard.r2.toFixed(2)}. Key support targets are S1: $${res.standard.s1.toFixed(2)} and S2: $${res.standard.s2.toFixed(2)}.`,
        breakdownItems: [
          { label: 'R3 Resistance', amount: res.standard.r3, color: '#ef4444' },
          { label: 'R2 Resistance', amount: res.standard.r2, color: '#f87171' },
          { label: 'R1 Resistance', amount: res.standard.r1, color: '#fca5a5' },
          { label: 'Pivot Point (PP)', amount: res.standard.pp, color: '#3b82f6' },
          { label: 'S1 Support', amount: res.standard.s1, color: '#86efac' },
          { label: 'S2 Support', amount: res.standard.s2, color: '#4ade80' },
          { label: 'S3 Support', amount: res.standard.s3, color: '#22c55e' },
        ],
      };
    },
    formula: {
      formula: 'PP = \\frac{H + L + C}{3}, \\quad R1 = 2(PP) - L, \\quad S1 = 2(PP) - H',
      explanation: 'Mathematical floors and ceilings based on the prior trading session\'s range.',
      variables: [
        { symbol: 'H', name: 'High', description: 'Highest price reached during prior session' },
        { symbol: 'L', name: 'Low', description: 'Lowest price reached during prior session' },
        { symbol: 'C', name: 'Close', description: 'Final settlement closing price' },
      ],
    },
    howItWorks: [
      'Enter the High, Low, and Close prices from the previous daily, weekly, or 4-hour bar.',
      'Review key support and resistance thresholds across multiple popular technical formulas.',
    ],
    example: {
      scenarioTitle: 'Daily Bar: High $185.50, Low $179.20, Close $184.10',
      description: 'Calculating Standard Pivot Levels.',
      inputs: { 'High': '$185.50', 'Low': '$179.20', 'Close': '$184.10' },
      stepByStep: [
        'PP = (185.50 + 179.20 + 184.10) / 3 = $182.93.',
        'R1 = 2(182.93) - 179.20 = $186.67.',
        'S1 = 2(182.93) - 185.50 = $180.37.',
      ],
      finalOutcome: 'Pivot: $182.93 | R1: $186.67 | S1: $180.37.',
    },
    whatItMeans: 'Prices trading above the Central Pivot indicate bullish intraday sentiment; prices below indicate bearish sentiment.',
    factorsToConsider: ['Combine pivot points with volume and momentum indicators like RSI for confirmation.'],
    faqs: [
      { question: 'What is the Camarilla Pivot formula?', answer: 'Camarilla pivots use tighter 8-level equations based on prior day range, popular with mean-reversion day traders.' },
    ],
    relatedCalculatorSlugs: ['fibonacci-calculator', 'stock-calculator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Standard floor trader pivot formulas (CME & NYSE).',
  },
  {
    slug: 'fibonacci-calculator',
    name: 'Fibonacci Retracement Calculator',
    h1Title: 'Fibonacci Retracement & Extension Calculator',
    category: 'stock-calculators',
    badge: 'Technical Analysis',
    shortDescription: 'Calculate Fibonacci retracement levels (23.6%, 38.2%, 50%, 61.8%, 78.6%) and extension targets.',
    longDescription: 'Identify potential reversal zones and profit-taking price targets. Enter swing high and swing low anchor points to generate Fibonacci retracement levels and golden ratio extensions.',
    seoTitle: 'Fibonacci Calculator - Retracement & Extension Price Levels',
    metaDescription: 'Free Fibonacci Retracement Calculator. Calculate key 23.6%, 38.2%, 50%, 61.8% Golden Ratio pullback levels and extensions for trading.',
    keywords: ['fibonacci calculator', 'fibonacci retracement calculator', 'golden ratio trading', 'fibonacci extension', 'swing trading levels'],
    inputs: [
      { id: 'swingHigh', label: 'Swing High Price', type: 'currency', defaultValue: 210.00 },
      { id: 'swingLow', label: 'Swing Low Price', type: 'currency', defaultValue: 150.00 },
      { id: 'trendDirection', label: 'Trend Direction', type: 'select', defaultValue: 'uptrend', options: [
        { label: 'Uptrend (Pullback Retracement Support)', value: 'uptrend' },
        { label: 'Downtrend (Bounce Retracement Resistance)', value: 'downtrend' },
      ]},
    ],
    calculate: (inputs) => {
      const high = Number(inputs.swingHigh) || 210;
      const low = Number(inputs.swingLow) || 150;
      const trend = inputs.trendDirection === 'downtrend' ? 'downtrend' : 'uptrend';

      const res = calculateFibonacci(high, low, trend);

      const fib618 = res.retracements.find((r) => r.level.includes('61.8%'))?.price || 0;
      const fib382 = res.retracements.find((r) => r.level.includes('38.2%'))?.price || 0;
      const fib500 = res.retracements.find((r) => r.level.includes('50.0%'))?.price || 0;
      const ext1618 = res.extensions.find((e) => e.level.includes('161.8%'))?.price || 0;

      return {
        primaryResult: {
          id: 'golden_ratio',
          label: 'Key 61.8% Golden Ratio Level',
          value: fib618,
          format: 'currency',
          isPrimary: true,
        },
        metrics: [
          { id: 'fib_382', label: '38.2% Retracement', value: fib382, format: 'currency' },
          { id: 'fib_500', label: '50.0% Midpoint Level', value: fib500, format: 'currency' },
          { id: 'fib_ext_1618', label: '161.8% Extension Target', value: ext1618, format: 'currency', changeType: 'positive' },
        ],
        summaryText: `In this ${high - low > 0 ? '$' + (high - low).toFixed(2) : ''} swing, the primary 61.8% Golden Ratio retracement level is $${fib618.toFixed(2)}. The 161.8% expansion price target is $${ext1618.toFixed(2)}.`,
      };
    },
    formula: {
      formula: '\\text{Retracement Level} = \\text{High} - [(\\text{High} - \\text{Low}) \\times \\text{Ratio}]',
      explanation: 'Derived from the mathematical Fibonacci sequence where each number is roughly 1.618 times the preceding number (Golden Ratio φ).',
      variables: [
        { symbol: '61.8%', name: 'Golden Ratio', description: 'Primary institutional pullback bounce target' },
      ],
    },
    howItWorks: [
      'Enter the prominent swing high and swing low from your chart.',
      'Select whether you are analyzing an uptrend or downtrend.',
      'Read key entry pullback zones and profit targets.',
    ],
    example: {
      scenarioTitle: 'Uptrend from $150 Low to $210 High',
      description: 'Calculating pullback support levels.',
      inputs: { 'Swing High': '$210', 'Swing Low': '$150', 'Trend': 'Uptrend' },
      stepByStep: [
        'Total Range = $210 - $150 = $60.',
        '38.2% Retracement = $210 - (60 × 0.382) = $187.08.',
        '50.0% Retracement = $210 - (60 × 0.500) = $180.00.',
        '61.8% Golden Ratio = $210 - (60 × 0.618) = $172.92.',
        '161.8% Extension = $210 + (60 × 0.618) = $247.08.',
      ],
      finalOutcome: '61.8% Support = $172.92 | 161.8% Target = $247.08.',
    },
    whatItMeans: 'Institutions and algorithmic trading systems cluster limit buy orders around the 61.8% Golden Ratio.',
    factorsToConsider: ['Confluence with 50-day or 200-day moving averages strengthens Fibonacci levels.'],
    faqs: [
      { question: 'Is the 50% level a true Fibonacci number?', answer: 'Mathematically no, but it is included in all trading Fibonacci toolsets due to Charles Dow\'s observation that assets frequently retrace half of their prior move.' },
    ],
    relatedCalculatorSlugs: ['pivot-point-calculator', 'stock-calculator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Standard technical market analysis Golden Ratio formulas.',
  },
  {
    slug: 'margin-call-calculator',
    name: 'Margin Call Calculator',
    h1Title: 'Broker Margin Call & Maintenance Margin Calculator',
    category: 'stock-calculators',
    badge: 'Risk Control',
    shortDescription: 'Calculate the exact stock price drop that triggers a broker margin call under FINRA Rule 4210.',
    longDescription: 'When buying stocks on margin, a sharp decline in share price can reduce account equity below FINRA or house maintenance requirements (typically 25%–35%). Calculate your exact margin call trigger price and liquidation risk.',
    seoTitle: 'Margin Call Calculator - Calculate Margin Call Stock Price & FINRA Limits',
    metaDescription: 'Free Margin Call Calculator. Calculate the exact stock price drop that triggers a broker margin call under 25% and 30% maintenance margin requirements.',
    keywords: ['margin call calculator', 'margin loan calculator', 'finra rule 4210', 'maintenance margin', 'margin liquidation price'],
    inputs: [
      { id: 'sharesPurchased', label: 'Number of Shares Purchased', type: 'number', defaultValue: 500 },
      { id: 'purchasePrice', label: 'Purchase Price Per Share', type: 'currency', defaultValue: 100.00 },
      { id: 'borrowedMarginAmount', label: 'Amount Borrowed on Margin (Debt)', type: 'currency', defaultValue: 25000 },
      { id: 'maintenanceMarginPct', label: 'Maintenance Margin Requirement (%)', type: 'percentage', defaultValue: 30.0, helpText: 'FINRA minimum is 25%; most brokerages require 30% to 35%' },
    ],
    calculate: (inputs) => {
      const shares = Number(inputs.sharesPurchased) || 100;
      const buyP = Number(inputs.purchasePrice) || 100;
      const debt = Number(inputs.borrowedMarginAmount) || 0;
      const mmPct = (Number(inputs.maintenanceMarginPct) || 30) / 100;

      // Formula: Trigger Price = Borrowed / [ Shares * (1 - Maintenance Margin) ]
      const triggerPrice = shares > 0 && mmPct < 1 ? debt / (shares * (1 - mmPct)) : 0;
      const priceDropPct = buyP > 0 ? ((buyP - triggerPrice) / buyP) * 100 : 0;

      return {
        primaryResult: {
          id: 'margin_trigger',
          label: 'Margin Call Trigger Price',
          value: triggerPrice,
          format: 'currency',
          isPrimary: true,
          changeType: 'negative',
        },
        metrics: [
          { id: 'drop_allowed', label: 'Maximum Price Drop Allowed', value: priceDropPct, format: 'percentage' },
          { id: 'total_cost', label: 'Total Initial Trade Value', value: shares * buyP, format: 'currency' },
          { id: 'your_equity', label: 'Your Initial Cash Equity', value: (shares * buyP) - debt, format: 'currency' },
        ],
        summaryText: `If the stock drops from $${buyP.toFixed(2)} down to $${triggerPrice.toFixed(2)} (a ${priceDropPct.toFixed(1)}% decline), your equity will hit the ${(mmPct * 100).toFixed(0)}% maintenance minimum, triggering a mandatory margin call.`,
      };
    },
    formula: {
      formula: 'P_{\\text{call}} = \\frac{\\text{Borrowed Margin Debt}}{\\text{Shares} \\times (1 - \\text{Maintenance}\\%)}',
      explanation: 'Solves for the critical stock price where Account Equity / Market Value equals the broker\'s maintenance requirement.',
      variables: [
        { symbol: 'P_call', name: 'Trigger Price', description: 'Share price where forced liquidation begins' },
      ],
    },
    howItWorks: [
      'Enter shares bought, purchase price, and margin debt borrowed.',
      'Enter your broker\'s maintenance margin percentage.',
      'Review your exact cushion before receiving a margin call.',
    ],
    example: {
      scenarioTitle: '500 Shares at $100 with $25,000 Margin Debt & 30% Maintenance',
      description: 'Calculating margin call threshold.',
      inputs: { 'Shares': '500', 'Buy Price': '$100', 'Margin Debt': '$25,000', 'Maintenance': '30%' },
      stepByStep: [
        'Total purchase = $50,000 ($25k cash + $25k margin).',
        'Trigger price = $25,000 / [ 500 × (1 - 0.30) ] = $25,000 / 350 = $71.43.',
        'A 28.57% drop triggers a margin call.',
      ],
      finalOutcome: 'Margin call occurs if stock falls to $71.43.',
    },
    whatItMeans: 'Margin loans magnify both gains and losses; exceeding maintenance limits results in automated forced selling by your broker.',
    factorsToConsider: ['Margin interest rates charged on borrowed cash balances.'],
    faqs: [
      { question: 'What is FINRA Rule 4210?', answer: 'FINRA Rule 4210 mandates that margin account holders maintain a minimum equity of at least 25% of the total market value of margin securities at all times.' },
    ],
    relatedCalculatorSlugs: ['stock-calculator', 'black-scholes-calculator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'FINRA Rule 4210 statutory margin formulas.',
  },
  {
    slug: 'dollar-cost-averaging-calculator',
    name: 'Dollar-Cost Averaging (DCA) Calculator',
    h1Title: 'Dollar-Cost Averaging (DCA) vs. Lump Sum Calculator',
    category: 'stock-calculators',
    badge: 'Strategy',
    shortDescription: 'Compare the long-term wealth outcomes of Dollar-Cost Averaging periodic deposits versus investing a lump sum.',
    longDescription: 'Dollar-Cost Averaging (DCA) invests a fixed dollar amount at regular intervals, reducing the risk of bad market timing. Compare DCA systematic investing against immediate lump-sum investing.',
    seoTitle: 'Dollar Cost Averaging Calculator - DCA vs Lump Sum Investing',
    metaDescription: 'Free DCA Calculator. Compare Dollar Cost Averaging against Lump Sum investing in stocks and ETFs with compound returns.',
    keywords: ['dollar cost averaging calculator', 'dca calculator', 'dca vs lump sum', 'systematic investment plan', 'dca stock calculator'],
    inputs: [
      { id: 'totalCapitalToInvest', label: 'Total Capital to Deploy', type: 'currency', defaultValue: 60000 },
      { id: 'dcaMonthlyDeposit', label: 'Monthly DCA Deposit Amount', type: 'currency', defaultValue: 2500 },
      { id: 'expectedAnnualReturn', label: 'Expected Annual Market Return (%)', type: 'percentage', defaultValue: 8.0 },
      { id: 'investmentHorizonYears', label: 'Total Investment Timeline (Years)', type: 'years', defaultValue: 10 },
    ],
    calculate: (inputs) => {
      const totalCap = Number(inputs.totalCapitalToInvest) || 12000;
      const dcaMo = Number(inputs.dcaMonthlyDeposit) || 1000;
      const rate = Number(inputs.expectedAnnualReturn) || 7;
      const yrs = Number(inputs.investmentHorizonYears) || 10;

      // Lump sum growth
      const lumpSumValue = totalCap * Math.pow(1 + rate / 100, yrs);

      // DCA months to deploy totalCap
      const dcaMonths = Math.min(yrs * 12, Math.ceil(totalCap / dcaMo));
      let dcaBalance = 0;
      const monthlyRate = rate / 100 / 12;

      for (let m = 1; m <= yrs * 12; m++) {
        if (m <= dcaMonths) {
          dcaBalance += dcaMo;
        }
        dcaBalance *= 1 + monthlyRate;
      }

      const winner = lumpSumValue >= dcaBalance ? 'Lump-Sum' : 'DCA';
      const spread = Math.abs(lumpSumValue - dcaBalance);

      return {
        primaryResult: {
          id: 'lump_sum_val',
          label: 'Lump-Sum Final Portfolio Value',
          value: lumpSumValue,
          format: 'currency',
          isPrimary: true,
        },
        metrics: [
          { id: 'dca_val', label: 'DCA Final Portfolio Value', value: dcaBalance, format: 'currency' },
          { id: 'strategy_spread', label: `${winner} Advantage`, value: spread, format: 'currency', changeType: 'positive' },
        ],
        summaryText: `Deploying $${totalCap.toLocaleString('en-US')} as an immediate lump sum yields $${Math.round(lumpSumValue).toLocaleString('en-US')} after ${yrs} years, outperforming the DCA strategy ($${Math.round(dcaBalance).toLocaleString('en-US')}) by $${Math.round(spread).toLocaleString('en-US')} due to greater time in the market.`,
      };
    },
    formula: {
      formula: '\\text{FV}_{\\text{Lump}} = P(1+r)^t, \\quad \\text{FV}_{\\text{DCA}} = \\sum_{m=1}^{N} \\text{PMT}_m (1 + r/12)^{T - m}',
      explanation: 'Historically, lump-sum investing outperforms DCA approximately 68% of the time because equity markets trend upward over long horizons.',
      variables: [
        { symbol: 'Time in Market', name: 'Compounding Window', description: 'Early deployment maximizes compound interest runway' },
      ],
    },
    howItWorks: [
      'Enter total cash to deploy, monthly DCA installment, and expected rate of return.',
      'Compare ending wealth accumulation across both strategies.',
    ],
    example: {
      scenarioTitle: '$60,000 Invested: Lump-Sum vs $2,500/mo DCA (24 Months) Over 10 Years',
      description: 'At 8.0% annual average return.',
      inputs: { 'Capital': '$60,000', 'DCA Deposit': '$2,500/mo', 'Years': '10' },
      stepByStep: [
        'Lump-sum grows to $129,535.',
        'DCA deploys over 2 years, ending at $119,842.',
        'Lump-sum delivers $9,693 (+8.1%) more total wealth.',
      ],
      finalOutcome: 'Lump-sum wins mathematically; DCA provides psychological reassurance.',
    },
    whatItMeans: 'DCA is primarily a behavioral risk-management tool that prevents emotional regret during volatile markets.',
    factorsToConsider: ['Cash drag on uninvested capital while waiting to DCA.'],
    faqs: [
      { question: 'Why does lump sum historically beat DCA?', answer: 'Because stock markets rise roughly 7 out of every 10 years, putting money to work immediately gives compounding more time to generate returns.' },
    ],
    relatedCalculatorSlugs: ['compound-interest-calculator', 'stock-calculator', 'savings-goal-calculator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Vanguard research on DCA vs Lump-Sum wealth creation.',
  },
  {
    slug: 'stock-split-calculator',
    name: 'Stock Split Calculator',
    h1Title: 'Stock Split & Reverse Stock Split Calculator',
    category: 'stock-calculators',
    badge: 'Corporate Action',
    shortDescription: 'Calculate adjusted share quantity, new share price, and portfolio value following forward and reverse stock splits.',
    longDescription: 'Corporate stock splits change the number of outstanding shares and share price while keeping total market capitalization and your total investment value identical. Calculate post-split shares and cost basis.',
    seoTitle: 'Stock Split Calculator - Forward & Reverse Stock Split Adjustments',
    metaDescription: 'Free Stock Split Calculator. Calculate new share price, share quantity, and cost basis for 2-for-1, 3-for-1, or reverse stock splits.',
    keywords: ['stock split calculator', 'reverse stock split', '2 for 1 split', 'post split shares', 'cost basis stock split'],
    inputs: [
      { id: 'sharesOwned', label: 'Pre-Split Shares Owned', type: 'number', defaultValue: 100 },
      { id: 'preSplitPrice', label: 'Pre-Split Share Price', type: 'currency', defaultValue: 300.00 },
      { id: 'splitRatioNew', label: 'Split Ratio (New Shares)', type: 'number', defaultValue: 3, helpText: 'e.g., 3 for a 3-for-1 split' },
      { id: 'splitRatioOld', label: 'Split Ratio (Old Shares)', type: 'number', defaultValue: 1, helpText: 'e.g., 1 for a 3-for-1 split, or 10 for a 1-for-10 reverse split' },
    ],
    calculate: (inputs) => {
      const shares = Number(inputs.sharesOwned) || 100;
      const price = Number(inputs.preSplitPrice) || 100;
      const ratioNew = Number(inputs.splitRatioNew) || 2;
      const ratioOld = Number(inputs.splitRatioOld) || 1;

      const multiplier = ratioNew / ratioOld;
      const postSplitShares = shares * multiplier;
      const postSplitPrice = price / multiplier;
      const totalVal = shares * price;

      const isReverse = multiplier < 1;

      return {
        primaryResult: {
          id: 'post_shares',
          label: 'Post-Split Share Quantity',
          value: postSplitShares,
          format: 'number',
          isPrimary: true,
        },
        metrics: [
          { id: 'post_price', label: 'New Adjusted Share Price', value: postSplitPrice, format: 'currency' },
          { id: 'total_portfolio', label: 'Total Position Value (Unchanged)', value: totalVal, format: 'currency' },
          { id: 'split_type', label: 'Corporate Action Type', value: isReverse ? `${ratioOld}-for-${ratioNew} Reverse Split` : `${ratioNew}-for-${ratioOld} Forward Split`, format: 'text' },
        ],
        summaryText: `Following this ${ratioNew}-for-${ratioOld} ${isReverse ? 'reverse split' : 'forward split'}, you will own ${postSplitShares} shares priced at $${postSplitPrice.toFixed(2)}/share. Your total portfolio position remains unchanged at $${Math.round(totalVal).toLocaleString('en-US')}.`,
      };
    },
    formula: {
      formula: '\\text{Shares}_{\\text{new}} = \\text{Shares}_{\\text{old}} \\times \\left(\\frac{R_{\\text{new}}}{R_{\\text{old}}}\\right), \\quad P_{\\text{new}} = P_{\\text{old}} \\times \\left(\\frac{R_{\\text{old}}}{R_{\\text{new}}}\\right)',
      explanation: 'Stock splits divide the corporate pizza into more (or fewer) slices without changing the overall size of the pizza.',
      variables: [
        { symbol: 'R_new / R_old', name: 'Split Factor', description: 'Ratio of post-split shares to pre-split shares' },
      ],
    },
    howItWorks: [
      'Enter your pre-split share count and share price.',
      'Enter the split ratio (e.g. 3-for-1 forward or 1-for-5 reverse).',
      'Instantly see new share quantity and adjusted price.',
    ],
    example: {
      scenarioTitle: '100 Shares at $300 Undergoing a 3-for-1 Forward Split',
      description: 'Calculating post-split position.',
      inputs: { 'Pre-Split Shares': '100', 'Pre-Split Price': '$300', 'Ratio': '3-for-1' },
      stepByStep: [
        'Pre-split value = 100 × $300 = $30,000.',
        'Post-split shares = 100 × (3 / 1) = 300 shares.',
        'Post-split price = $300 / 3 = $100.00/share.',
        'Post-split value = 300 × $100 = $30,000.',
      ],
      finalOutcome: 'You own 300 shares at $100/share ($30,000 total).',
    },
    whatItMeans: 'Stock splits increase liquidity and make share prices more accessible to retail investors.',
    factorsToConsider: ['Stock splits are non-taxable events in the US; your original cost basis simply divides across the new share count.'],
    faqs: [
      { question: 'Do I have to pay taxes on a stock split?', answer: 'No. Forward and reverse stock splits do not trigger capital gains taxes. Your cost basis per share is automatically adjusted proportionally.' },
    ],
    relatedCalculatorSlugs: ['stock-calculator', 'pe-ratio-calculator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'SEC standard corporate action cost-basis adjustment rules.',
  },
  {
    slug: 'beta-calculator',
    name: 'Beta Calculator',
    h1Title: 'Stock Beta & Covariance Risk Calculator',
    category: 'stock-calculators',
    badge: 'Risk Analysis',
    shortDescription: 'Calculate stock Beta (systematic risk) relative to a benchmark market index using covariance and variance.',
    longDescription: 'Beta measures the systematic risk or volatility of an individual stock in comparison to the broader market portfolio (such as the S&P 500). Calculate Beta using historical covariance and benchmark variance.',
    seoTitle: 'Beta Calculator - Calculate Stock Volatility & Market Beta',
    metaDescription: 'Free Stock Beta Calculator. Calculate systematic volatility, correlation, and market covariance against the S&P 500.',
    keywords: ['beta calculator', 'stock beta calculator', 'systematic risk', 'covariance variance beta', 'portfolio volatility'],
    inputs: [
      { id: 'covariance', label: 'Covariance of Stock with Market (Cov(Rs, Rm))', type: 'number', defaultValue: 0.0035, step: 0.0001 },
      { id: 'marketVariance', label: 'Variance of Benchmark Market (Var(Rm))', type: 'number', defaultValue: 0.0028, step: 0.0001 },
    ],
    calculate: (inputs) => {
      const cov = Number(inputs.covariance) || 0.0025;
      const varM = Math.max(0.00001, Number(inputs.marketVariance) || 0.0025);

      const beta = cov / varM;
      let interpretation = 'Equal volatility to market';
      if (beta > 1.2) interpretation = 'High systematic volatility (Aggressive)';
      else if (beta > 1.0) interpretation = 'Moderate above-market volatility';
      else if (beta > 0.5) interpretation = 'Defensive / Low volatility';
      else if (beta <= 0.5) interpretation = 'Ultra-defensive / Uncorrelated';

      return {
        primaryResult: {
          id: 'stock_beta',
          label: 'Calculated Stock Beta (β)',
          value: beta.toFixed(3),
          format: 'number',
          isPrimary: true,
        },
        metrics: [
          { id: 'risk_classification', label: 'Volatility Profile', value: interpretation, format: 'text' },
          { id: 'benchmark_comparison', label: 'Expected Move vs 1% Market Shift', value: `${(beta * 1).toFixed(2)}%`, format: 'text' },
        ],
        summaryText: `The calculated Beta is ${beta.toFixed(3)} (${interpretation}). When the market moves by 1%, this stock is expected to move by ${beta.toFixed(2)}% in the same direction.`,
      };
    },
    formula: {
      formula: '\\beta = \\frac{\\text{Cov}(R_s, R_m)}{\\text{Var}(R_m)} = \\rho_{s,m} \\times \\frac{\\sigma_s}{\\sigma_m}',
      explanation: 'Beta is the slope coefficient of a linear regression of asset returns against benchmark market returns.',
      variables: [
        { symbol: '\\text{Cov}', name: 'Covariance', description: 'Joint variability of stock and market returns' },
        { symbol: '\\text{Var}', name: 'Market Variance', description: 'Dispersion of benchmark index returns' },
      ],
    },
    howItWorks: [
      'Enter covariance of the asset and variance of the benchmark index.',
      'Review computed Beta score and risk classification.',
    ],
    example: {
      scenarioTitle: 'Covariance 0.0035 with Market Variance 0.0028',
      description: 'Calculating Beta regression slope.',
      inputs: { 'Covariance': '0.0035', 'Variance': '0.0028' },
      stepByStep: [
        'Beta = 0.0035 / 0.0028 = 1.25.',
      ],
      finalOutcome: 'Beta = 1.25 (Stock is 25% more volatile than S&P 500).',
    },
    whatItMeans: 'High Beta stocks generate superior returns in bull markets but suffer steeper drawdowns in bear markets.',
    factorsToConsider: ['Beta only measures systematic risk, not idiosyncratic company-specific risk.'],
    faqs: [
      { question: 'What is a negative Beta?', answer: 'A negative Beta means an asset moves in the opposite direction of the broader stock market (e.g., gold or inverse ETFs).' },
    ],
    relatedCalculatorSlugs: ['capm-calculator', 'wacc-calculator', 'stock-calculator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'CFA Institute Portfolio Management Beta regression formulation.',
  },
  {
    slug: 'pe-ratio-calculator',
    name: 'P/E Ratio Calculator',
    h1Title: 'Price-to-Earnings (P/E) & PEG Ratio Valuation Calculator',
    category: 'stock-calculators',
    badge: 'Valuation',
    shortDescription: 'Calculate Trailing P/E, Forward P/E, Earnings Yield, and the PEG Ratio to evaluate stock valuation.',
    longDescription: 'The Price-to-Earnings (P/E) ratio is the most widely used equity valuation metric. Calculate Trailing P/E, Forward P/E, Earnings Yield (the inverse of P/E), and PEG Ratio (P/E adjusted for annual EPS growth rate).',
    seoTitle: 'P/E Ratio Calculator - Price to Earnings & PEG Valuation Tool',
    metaDescription: 'Free P/E Ratio Calculator. Calculate Trailing P/E, Forward P/E, Earnings Yield, and PEG Ratio to evaluate stock valuation.',
    keywords: ['pe ratio calculator', 'price to earnings ratio', 'peg ratio calculator', 'earnings yield', 'stock valuation calculator'],
    inputs: [
      { id: 'stockPrice', label: 'Current Share Price', type: 'currency', defaultValue: 175.00 },
      { id: 'trailingEPS', label: 'Trailing 12-Month EPS ($TTM)', type: 'currency', defaultValue: 7.00 },
      { id: 'forwardEPS', label: 'Forward 12-Month Projected EPS', type: 'currency', defaultValue: 8.50 },
      { id: 'expectedGrowthRate', label: 'Expected Annual EPS Growth Rate (%)', type: 'percentage', defaultValue: 15.0 },
    ],
    calculate: (inputs) => {
      const price = Number(inputs.stockPrice) || 100;
      const ttm = Math.max(0.01, Number(inputs.trailingEPS) || 5);
      const fwd = Math.max(0.01, Number(inputs.forwardEPS) || 6);
      const g = Math.max(0.1, Number(inputs.expectedGrowthRate) || 10);

      const trailingPE = price / ttm;
      const forwardPE = price / fwd;
      const earningsYield = (ttm / price) * 100;
      const pegRatio = trailingPE / g;

      return {
        primaryResult: {
          id: 'trailing_pe',
          label: 'Trailing P/E Ratio (TTM)',
          value: `${trailingPE.toFixed(2)}x`,
          format: 'text',
          isPrimary: true,
        },
        metrics: [
          { id: 'forward_pe', label: 'Forward P/E Ratio', value: `${forwardPE.toFixed(2)}x`, format: 'text' },
          { id: 'peg_metric', label: 'PEG Ratio (Price/Earnings-to-Growth)', value: `${pegRatio.toFixed(2)}x`, format: 'text', changeType: pegRatio < 1.0 ? 'positive' : 'neutral' },
          { id: 'earnings_yield', label: 'Earnings Yield (E/P %)', value: earningsYield, format: 'percentage' },
        ],
        summaryText: `At $${price.toFixed(2)} per share, the stock trades at ${trailingPE.toFixed(2)}x trailing earnings and ${forwardPE.toFixed(2)}x forward earnings. Factoring in a ${g}% growth rate produces a PEG Ratio of ${pegRatio.toFixed(2)}x ${pegRatio <= 1.0 ? '(Considered undervalued / attractive)' : '(Reflects premium valuation)'}.`,
      };
    },
    formula: {
      formula: '\\text{P/E} = \\frac{\\text{Price}}{\\text{EPS}}, \\quad \\text{PEG} = \\frac{\\text{P/E}}{\\text{Annual EPS Growth}\\%}',
      explanation: 'Measures how much investors are willing to pay for each $1 of current corporate earnings.',
      variables: [
        { symbol: 'EPS', name: 'Earnings Per Share', description: 'Net income divided by diluted shares outstanding' },
        { symbol: 'PEG', name: 'PEG Ratio', description: 'Valuation metric popularized by Peter Lynch' },
      ],
    },
    howItWorks: [
      'Enter current stock price, trailing 12-month EPS, and projected forward EPS.',
      'Enter expected long-term EPS growth rate.',
      'Review Trailing P/E, Forward P/E, Earnings Yield, and PEG Ratio.',
    ],
    example: {
      scenarioTitle: 'Stock at $175 with $7.00 EPS Growing at 15% Annually',
      description: 'Calculating valuation metrics.',
      inputs: { 'Price': '$175.00', 'EPS': '$7.00', 'Growth': '15.0%' },
      stepByStep: [
        'Trailing P/E = $175 / $7.00 = 25.0x.',
        'Earnings Yield = ($7.00 / $175) × 100 = 4.00%.',
        'PEG Ratio = 25.0 / 15 = 1.67x.',
      ],
      finalOutcome: 'P/E = 25.0x | PEG = 1.67x | Earnings Yield = 4.00%.',
    },
    whatItMeans: 'Peter Lynch considered a PEG ratio below 1.0x to indicate an undervalued growth company.',
    factorsToConsider: ['Non-recurring one-time charges that distort GAAP EPS.'],
    faqs: [
      { question: 'What is Earnings Yield?', answer: 'Earnings Yield is the inverse of the P/E ratio (EPS / Price), allowing you to directly compare a stock\'s earnings power to bond yields and Treasury rates.' },
    ],
    relatedCalculatorSlugs: ['stock-calculator', 'dividend-growth-calculator', 'capm-calculator'],
    lastUpdated: '2026-03-01',
    methodologyReview: 'Standard equity fundamental valuation ratio analysis.',
  },
];
