import React, { useEffect } from 'react';
import { FileText, AlertOctagon, Scale, ShieldAlert, BookOpen, CheckCircle, ArrowLeft } from 'lucide-react';
import { HowToUseArticleSection } from '../common/HowToUseArticleSection';
import { SITEWIDE_PAGE_GUIDES } from '../../data/pageGuides';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { updateDocumentSEO } from '../../utils/seo';

interface TermsOfUsePageProps {
  onNavigateHome: () => void;
  onNavigateContact: () => void;
}

export const TermsOfUsePage: React.FC<TermsOfUsePageProps> = ({
  onNavigateHome,
  onNavigateContact,
}) => {
  const { settings, fullSiteName } = useSiteSettings();

  useEffect(() => {
    updateDocumentSEO({
      title: `Terms of Use & Regulatory Disclaimer — ${fullSiteName}`,
      description: `Review the terms of service, mathematical simulation disclaimers, and user agreements for the ${fullSiteName} financial calculation platform.`,
    });
  }, [fullSiteName]);

  const currentEmail = settings.supportEmail || 'legal@omnicalc.pro';

  return (
    <div className="pb-20 space-y-10 animate-fade-in">
      {/* Breadcrumb & Top Bar */}
      <div className="flex items-center gap-2 text-xs font-medium text-stone-500">
        <button
          onClick={onNavigateHome}
          className="hover:text-stone-900 transition-colors cursor-pointer"
        >
          Home
        </button>
        <span>/</span>
        <span className="text-stone-900 font-semibold">Terms of Use</span>
      </div>

      {/* Hero Header */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs p-6 sm:p-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-semibold border border-blue-200">
          <Scale className="w-3.5 h-3.5 text-blue-600" />
          <span>Legal Agreement & Operating Terms</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-950 tracking-tight">
          Terms of Use
        </h1>
        <p className="text-sm sm:text-base text-stone-600 max-w-3xl leading-relaxed">
          Please read these Terms of Use carefully before accessing or using {fullSiteName}'s suite of 56 financial, loan, retirement, and equity valuation calculators.
        </p>
        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-stone-500 border-t border-stone-100">
          <span><strong>Effective Date:</strong> January 1, 2026</span>
          <span>•</span>
          <span><strong>Last Revised:</strong> September 2026</span>
          <span>•</span>
          <span><strong>Jurisdiction:</strong> United States & International Standard</span>
        </div>
      </div>

      {/* Critical Financial Disclaimer Callout */}
      <div className="bg-amber-50/80 rounded-2xl border border-amber-200 p-5 sm:p-6 text-amber-950 space-y-2">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
          <AlertOctagon className="w-5 h-5 text-amber-600 shrink-0" />
          <span>IMPORTANT FINANCIAL & REGULATORY DISCLAIMER</span>
        </div>
        <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed">
          {fullSiteName} provides mathematical models and educational estimators for illustrative scenario analysis only. {fullSiteName} is not an investment advisor, registered broker-dealer, mortgage lender, Certified Financial Planner (CFP®), Certified Public Accountant (CPA), or legal counsel. No attorney-client, fiduciary, or financial advisory relationship is formed by accessing these calculators.
        </p>
      </div>

      {/* Comprehensive Terms of Use How-To & Compliance Guide */}
      <HowToUseArticleSection article={SITEWIDE_PAGE_GUIDES.terms} />

      {/* Detailed Legal Sections */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs p-6 sm:p-10 space-y-8 text-stone-800 leading-relaxed">
        
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-800 text-xs font-mono font-bold flex items-center justify-center">1</span>
            Acceptance of Terms
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            By accessing, browsing, testing, or saving calculations on OmniCalc Pro, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree to these terms, you must discontinue use of the platform immediately.
          </p>
        </section>

        <hr className="border-stone-100" />

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-800 text-xs font-mono font-bold flex items-center justify-center">2</span>
            Nature of Calculators & Mathematical Projections
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Our calculators use recognized financial algorithms (such as the Black-Scholes formula, standard compound interest equations, amortization algorithms conforming to Regulation Z, and IRS tax brackets). However:
          </p>
          <ul className="space-y-2 text-xs text-stone-700 pl-2">
            <li className="flex items-start gap-2">
              <span className="font-bold text-emerald-600">•</span>
              <span><strong>Assumptions & Variables:</strong> Calculations rely directly on numbers, rates, and assumptions inputted by you. Real-world investment returns, market volatility, inflation, interest rate fluctuations, and tax rates vary.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-emerald-600">•</span>
              <span><strong>Tax & Regulatory Changes:</strong> While audited against 2026/2027 IRS limits and SECURE 2.0 regulations, local, state, and federal tax laws change frequently.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-emerald-600">•</span>
              <span><strong>No Guarantees of Future Performance:</strong> Past performance and mathematical models do not guarantee actual investment outcomes, annuity yields, or loan approvals.</span>
            </li>
          </ul>
        </section>

        <hr className="border-stone-100" />

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-800 text-xs font-mono font-bold flex items-center justify-center">3</span>
            Permitted and Prohibited Uses
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2">
              <strong className="text-emerald-950 block font-bold text-sm">Permitted Uses</strong>
              <ul className="space-y-1.5 text-emerald-900">
                <li>✓ Personal financial planning and education</li>
                <li>✓ Comparative loan and mortgage evaluation</li>
                <li>✓ Professional scenario modeling for client consultations</li>
                <li>✓ Exporting CSV schedules and printing reports for reference</li>
              </ul>
            </div>
            <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-200 space-y-2">
              <strong className="text-rose-950 block font-bold text-sm">Prohibited Uses</strong>
              <ul className="space-y-1.5 text-rose-900">
                <li>✗ Scraping or bulk automated querying of computation endpoints</li>
                <li>✗ Reverse engineering or unauthorized commercial repackaging</li>
                <li>✗ Misrepresenting OmniCalc Pro outputs as certified underwritten loans</li>
                <li>✗ Attempting to introduce malicious code or compromise system availability</li>
              </ul>
            </div>
          </div>
        </section>

        <hr className="border-stone-100" />

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-800 text-xs font-mono font-bold flex items-center justify-center">4</span>
            Intellectual Property & Algorithmic Attribution
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            All code, custom visual interface designs, algorithmic compositions, formulas, text breakdowns, and trademarks associated with OmniCalc Pro are protected by copyright, trademark, and applicable intellectual property laws. You are granted a limited, revocable, non-exclusive license to use the calculators for their intended analytical purposes.
          </p>
        </section>

        <hr className="border-stone-100" />

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-800 text-xs font-mono font-bold flex items-center justify-center">5</span>
            Disclaimer of Warranties & Limitation of Liability
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            THE PLATFORM, CALCULATORS, GRAPHS, AND CONTENT ARE PROVIDED STRICTLY ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR ACCURACY.
          </p>
          <p className="text-xs sm:text-sm text-stone-600">
            IN NO EVENT SHALL OMNICALC PRO, ITS CONTRIBUTORS, OR OPERATORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES RESULTING FROM FINANCIAL DECISIONS, LOAN AGREEMENTS, TRADES, OR LOSSES INCURRED THROUGH RELIANCE ON THESE CALCULATORS.
          </p>
        </section>

        <hr className="border-stone-100" />

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-800 text-xs font-mono font-bold flex items-center justify-center">6</span>
            Modifications & Updates to Terms
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            We reserve the right to modify these Terms of Use at any time to reflect updates in financial regulations (such as updated annual IRS cost-of-living adjustments) or platform functionality. Continued use of the platform after updates signifies your acceptance of the revised terms.
          </p>
        </section>

        <hr className="border-stone-100" />

        {/* Section 7 */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-800 text-xs font-mono font-bold flex items-center justify-center">7</span>
            Contact & Legal Inquiries
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            For legal notices, terms clarification, or licensing inquiries, please contact our legal administration team:
          </p>
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <strong className="text-stone-900 text-sm block">{fullSiteName} Legal & Compliance</strong>
              <span className="text-xs text-stone-500">Email: {currentEmail}</span>
            </div>
            <button
              onClick={onNavigateContact}
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Contact Legal
            </button>
          </div>
        </section>

      </div>

      {/* Back button */}
      <div className="pt-2">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 px-4 py-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All 56 Calculators</span>
        </button>
      </div>
    </div>
  );
};
