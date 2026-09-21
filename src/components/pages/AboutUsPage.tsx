import React, { useEffect } from 'react';
import {
  Calculator,
  ShieldCheck,
  TrendingUp,
  PiggyBank,
  Home,
  Percent,
  Sparkles,
  Award,
  CheckCircle2,
  Users,
  Code2,
  Lock,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { CATEGORIES } from '../../config/categories';
import { ALL_CALCULATORS } from '../../data/calculatorRegistry';
import { CURRENT_RULES } from '../../config/financialRules';
import { HowToUseArticleSection } from '../common/HowToUseArticleSection';
import { SITEWIDE_PAGE_GUIDES } from '../../data/pageGuides';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { updateDocumentSEO } from '../../utils/seo';

interface AboutUsPageProps {
  onNavigateHome: () => void;
  onNavigateCategory: (categorySlug: string) => void;
  onSelectCalculator: (slug: string) => void;
  onNavigateContact: () => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({
  onNavigateHome,
  onNavigateCategory,
  onSelectCalculator,
  onNavigateContact,
}) => {
  const { settings, fullSiteName } = useSiteSettings();

  useEffect(() => {
    updateDocumentSEO({
      title: `About Us & CFA Audit Methodology — ${fullSiteName}`,
      description: `Learn about ${fullSiteName}'s mission to provide institutional-grade financial calculators, built upon CFA Institute quantitative frameworks and current IRS tax standards.`,
    });
  }, [fullSiteName]);

  const stats = [
    { label: 'Calculators in Suite', value: '56', detail: 'Covering 4 core financial domains' },
    { label: 'Tax Year Conformity', value: '2026/2027', detail: 'SECURE 2.0 & IRS Notice 2024-80' },
    { label: 'Client-Side Privacy', value: '100%', detail: 'Zero financial data leaves your browser' },
    { label: 'Cost to Users', value: '$0.00', detail: 'Free forever without paywalls or ads' },
  ];

  const pillarCards = [
    {
      title: 'General Finance & Investment',
      count: '14 Calculators',
      icon: <Percent className="w-5 h-5 text-emerald-600" />,
      desc: 'Compound interest with flexible frequencies, Discounted Cash Flow (NPV/IRR), bond duration/convexity, municipal tax-equivalent yields, 529 college savings, and annuity modeling.',
      slug: 'general-finance-calculators',
    },
    {
      title: 'Retirement & Pension Planning',
      count: '14 Calculators',
      icon: <PiggyBank className="w-5 h-5 text-amber-600" />,
      desc: '401(k) employer match optimization, Roth vs. Traditional IRA comparisons, Social Security claiming strategies (Ages 62-70), Backdoor Roth, Mega Backdoor, and SECURE 2.0 RMD tables.',
      slug: 'retirement-calculators',
    },
    {
      title: 'Loans & Real Estate Mortgages',
      count: '16 Calculators',
      icon: <Home className="w-5 h-5 text-blue-600" />,
      desc: 'Fixed-rate mortgages, comprehensive amortization tables, refinance break-even, bi-weekly acceleration, Rent vs. Buy analysis, FHA/VA/USDA loans, and Debt Snowball/Avalanche payoff.',
      slug: 'loan-mortgage-calculators',
    },
    {
      title: 'Stocks, Options & Equities',
      count: '12 Calculators',
      icon: <TrendingUp className="w-5 h-5 text-indigo-600" />,
      desc: 'Black-Scholes European option pricing with all five Greeks (Delta, Gamma, Theta, Vega, Rho), CAPM, WACC, Gordon Growth Model, Fibonacci retracements, and FINRA Rule 4210 margin calls.',
      slug: 'stock-investing-calculators',
    },
  ];

  return (
    <div className="pb-20 space-y-12 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-stone-500">
        <button
          onClick={onNavigateHome}
          className="hover:text-stone-900 transition-colors cursor-pointer"
        >
          Home
        </button>
        <span>/</span>
        <span className="text-stone-900 font-semibold">About Us</span>
      </div>

      {/* Hero Section */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs p-6 sm:p-12 space-y-6 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>The Financial Modeling Standard</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-950 tracking-tight leading-tight">
            Democratizing Institutional-Grade Financial Mathematics
          </h1>
          <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
            OmniCalc Pro was founded with a singular mission: to provide individuals, financial advisors, mortgage planners, and quantitative investors with transparent, audited, and ad-free financial calculation tools built to CFA Institute and IRS regulatory standards.
          </p>
        </div>
        {/* Subtle decorative glow */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Key Metric Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <div key={idx} className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/90 shadow-2xs space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight block">
              {s.value}
            </span>
            <span className="text-xs font-bold text-stone-800 block">{s.label}</span>
            <p className="text-[11px] text-stone-500 pt-1 leading-snug">{s.detail}</p>
          </div>
        ))}
      </div>

      {/* Our Mission & Core Values */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs p-6 sm:p-10 space-y-8">
        <div className="max-w-2xl space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900">Why OmniCalc Pro Exists</h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Most online financial calculators are lead-generation funnels in disguise—hiding formulas behind opaque assumptions and selling your private information to lending affiliates. We built the exact opposite.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-stone-900">Mathematical Rigor</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Every formula is grounded in peer-reviewed financial engineering: Continuous compounding, exact Regulation Z Truth-in-Lending APR formulas, Black-Scholes differential equations, and SECURE 2.0 Uniform Lifetime Tables.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-stone-900">Radical Privacy</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Calculations run entirely in your local browser runtime. We never harvest your loan balances, annual salaries, or net worth figures. Your financial plans remain private to you.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-stone-900">Open Explanations</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              No black boxes. Every calculator features explicit mathematical formula breakdowns, parameter definitions, and actionable financial planning insights so you understand the "why" behind the numbers.
            </p>
          </div>
        </div>
      </div>

      {/* The 4 Core Domains */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900">Our 4 Core Calculation Suites</h2>
            <p className="text-xs sm:text-sm text-stone-600">56 specialized analytical instruments engineered for precision</p>
          </div>
          <button
            onClick={onNavigateHome}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All 56 Calculators</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {pillarCards.map((card) => (
            <div
              key={card.slug}
              className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-6 space-y-4 hover:border-stone-300 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center">
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-stone-900">{card.title}</h3>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {card.count}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">{card.desc}</p>

              <button
                onClick={() => onNavigateCategory(card.slug)}
                className="w-full py-2.5 px-4 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-semibold border border-stone-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Explore {card.title}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Comprehensive How-To Guide for Platform Usage */}
      <HowToUseArticleSection article={SITEWIDE_PAGE_GUIDES.about} />

      {/* Tax & Regulatory Framework */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-10 space-y-6">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Regulatory Compliance Engine</span>
        </div>
        <div className="space-y-2 max-w-2xl">
          <h3 className="text-xl sm:text-2xl font-bold">Audited for 2026/2027 IRS & Federal Rules</h3>
          <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
            Our retirement and tax calculators are continuously synchronized with the latest IRS contribution limitations, standard deduction indexing, and SECURE 2.0 Act adjustments.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-4 border-t border-stone-800">
          <div className="p-3 bg-stone-800/80 rounded-xl border border-stone-700/60">
            <span className="text-stone-400 block text-[11px]">401(k) Elective Deferral</span>
            <strong className="text-white text-sm font-extrabold">${CURRENT_RULES.limit401k.toLocaleString('en-US')}</strong>
          </div>
          <div className="p-3 bg-stone-800/80 rounded-xl border border-stone-700/60">
            <span className="text-stone-400 block text-[11px]">Age 50+ Catch-up</span>
            <strong className="text-white text-sm font-extrabold">+${CURRENT_RULES.catchUp401k.toLocaleString('en-US')}</strong>
          </div>
          <div className="p-3 bg-stone-800/80 rounded-xl border border-stone-700/60">
            <span className="text-stone-400 block text-[11px]">Traditional / Roth IRA</span>
            <strong className="text-white text-sm font-extrabold">${CURRENT_RULES.iraContributionLimit.toLocaleString('en-US')}</strong>
          </div>
          <div className="p-3 bg-stone-800/80 rounded-xl border border-stone-700/60">
            <span className="text-stone-400 block text-[11px]">RMD Mandatory Age</span>
            <strong className="text-white text-sm font-extrabold">Age {CURRENT_RULES.rmdStartingAge} (SECURE 2.0)</strong>
          </div>
        </div>
      </div>

      {/* Call to action & contact */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-stone-900">Have Feedback or Suggested Formulas?</h3>
          <p className="text-xs text-stone-600">
            Our quantitative engineering team welcomes feedback, formula verification requests, and suggestions for new financial tools.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateContact}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Contact Our Team
          </button>
          <button
            onClick={onNavigateHome}
            className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors cursor-pointer"
          >
            Browse All Tools
          </button>
        </div>
      </div>
    </div>
  );
};
