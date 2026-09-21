import React from 'react';
import { Calculator, ShieldCheck, BookOpen, ExternalLink, Sparkles, Lock, Settings } from 'lucide-react';
import { CATEGORIES } from '../../config/categories';
import { CURRENT_RULES } from '../../config/financialRules';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { SiteLogo } from '../common/SiteLogo';

interface FooterProps {
  onNavigateCategory: (categorySlug: string) => void;
  onNavigateCalculator: (slug: string) => void;
  onNavigateHome?: () => void;
  onNavigatePrivacy?: () => void;
  onNavigateTerms?: () => void;
  onNavigateAbout?: () => void;
  onNavigateContact?: () => void;
  onNavigateAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateCategory,
  onNavigateCalculator,
  onNavigateHome,
  onNavigatePrivacy,
  onNavigateTerms,
  onNavigateAbout,
  onNavigateContact,
  onNavigateAdmin,
}) => {
  const { settings, fullSiteName } = useSiteSettings();

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-8 pb-12 border-b border-stone-800">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <SiteLogo settings={settings} size="md" />
              <span className="text-xl font-bold text-white tracking-tight">{fullSiteName}</span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
              {settings.siteTagline || 'The premier online suite of 56 institutional-grade financial, retirement, mortgage, and stock market calculators.'} Audited against 2026 IRS tax tables, CFA methodologies, and Regulation Z Truth-in-Lending standards.
            </p>
          </div>

          {/* Categories Columns */}
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="space-y-3">
              <button
                onClick={() => onNavigateCategory(cat.slug)}
                className="text-xs font-semibold text-white tracking-wider hover:text-emerald-400 transition-colors cursor-pointer text-left block"
              >
                {cat.name.toUpperCase()}
              </button>
              <ul className="space-y-2 text-xs text-stone-400">
                {cat.popularCalculatorSlugs.map((slug) => {
                  const label = slug
                    .split('-')
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(' ')
                    .replace('401k', '401(k)')
                    .replace('Ira', 'IRA')
                    .replace('Rmd', 'RMD')
                    .replace('Npv', 'NPV')
                    .replace('Irr', 'IRR')
                    .replace('Apr', 'APR')
                    .replace('Capm', 'CAPM')
                    .replace('Wacc', 'WACC');
                  return (
                    <li key={slug}>
                      <button
                        onClick={() => onNavigateCalculator(slug)}
                        className="hover:text-emerald-300 transition-colors cursor-pointer text-left line-clamp-1"
                      >
                        {label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {/* Company & Legal Column */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-white tracking-wider block">
              COMPANY & LEGAL
            </span>
            <ul className="space-y-2 text-xs text-stone-400">
              {onNavigateAbout && (
                <li>
                  <button
                    onClick={onNavigateAbout}
                    className="hover:text-emerald-300 transition-colors cursor-pointer text-left"
                  >
                    About Us
                  </button>
                </li>
              )}
              {onNavigateContact && (
                <li>
                  <button
                    onClick={onNavigateContact}
                    className="hover:text-emerald-300 transition-colors cursor-pointer text-left"
                  >
                    Contact Us
                  </button>
                </li>
              )}
              {onNavigatePrivacy && (
                <li>
                  <button
                    onClick={onNavigatePrivacy}
                    className="hover:text-emerald-300 transition-colors cursor-pointer text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
              )}
              {onNavigateTerms && (
                <li>
                  <button
                    onClick={onNavigateTerms}
                    className="hover:text-emerald-300 transition-colors cursor-pointer text-left"
                  >
                    Terms of Use
                  </button>
                </li>
              )}
              {onNavigateAdmin && (
                <li className="pt-2">
                  <button
                    onClick={onNavigateAdmin}
                    className="text-[11px] text-stone-500 hover:text-emerald-400 transition-colors cursor-pointer text-left flex items-center gap-1.5"
                    title="Private Site Administration (Ctrl+Shift+A)"
                  >
                    <Lock className="w-3 h-3" />
                    <span>Site Administration</span>
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* IRS 2026 Reference Ticker Banner */}
        <div className="py-6 border-b border-stone-800/80 my-2 text-xs grid grid-cols-2 sm:grid-cols-4 gap-4 text-stone-400">
          <div>
            <span className="text-stone-500 block">401(k) Max (2026):</span>
            <strong className="text-stone-200">${CURRENT_RULES.limit401k.toLocaleString('en-US')}</strong>
          </div>
          <div>
            <span className="text-stone-500 block">IRA Limit (2026):</span>
            <strong className="text-stone-200">${CURRENT_RULES.iraContributionLimit.toLocaleString('en-US')}</strong>
          </div>
          <div>
            <span className="text-stone-500 block">HSA Family Max:</span>
            <strong className="text-stone-200">${CURRENT_RULES.hsaFamilyLimit.toLocaleString('en-US')}</strong>
          </div>
          <div>
            <span className="text-stone-500 block">RMD Mandatory Age:</span>
            <strong className="text-stone-200">Age {CURRENT_RULES.rmdStartingAge} (SECURE 2.0)</strong>
          </div>
        </div>

        {/* Disclaimers & Methodology */}
        <div className="pt-6 space-y-4 text-[11px] text-stone-400 leading-relaxed">
          <p>
            <strong>Financial Disclaimer:</strong> {fullSiteName} calculators, mathematical models, formula breakdowns, and analytical projections are provided strictly for educational and informational planning purposes. They do not constitute certified financial, tax, investment, legal, or mortgage underwriting advice. Projections rely on user inputs and assumed rates of return which are subject to market volatility. Consult a Certified Financial Planner (CFP®), CPA, or licensed mortgage loan officer before executing financial decisions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-800/60 text-stone-400">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <p>{settings.customFooterNote || `© ${new Date().getFullYear()} ${fullSiteName}. All rights reserved.`}</p>
              {onNavigatePrivacy && (
                <button
                  onClick={onNavigatePrivacy}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-[11px]"
                >
                  Privacy Policy
                </button>
              )}
              {onNavigateTerms && (
                <button
                  onClick={onNavigateTerms}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-[11px]"
                >
                  Terms of Use
                </button>
              )}
              {onNavigateAbout && (
                <button
                  onClick={onNavigateAbout}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-[11px]"
                >
                  About Us
                </button>
              )}
              {onNavigateContact && (
                <button
                  onClick={onNavigateContact}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-[11px]"
                >
                  Contact
                </button>
              )}
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1 text-emerald-400">
                <Sparkles className="w-3 h-3" /> All 56 Engines Active
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> CFA & IRS Standards
              </span>
              {onNavigateAdmin && (
                <>
                  <span>•</span>
                  <button
                    onClick={onNavigateAdmin}
                    className="hover:text-emerald-400 transition-colors cursor-pointer text-stone-500"
                    title="Site Administration"
                  >
                    <Settings className="w-3 h-3" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
