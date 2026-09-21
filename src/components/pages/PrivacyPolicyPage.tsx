import React, { useEffect } from 'react';
import { Shield, Lock, Eye, Database, Server, UserCheck, Bell, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { HowToUseArticleSection } from '../common/HowToUseArticleSection';
import { SITEWIDE_PAGE_GUIDES } from '../../data/pageGuides';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { updateDocumentSEO } from '../../utils/seo';

interface PrivacyPolicyPageProps {
  onNavigateHome: () => void;
  onNavigateContact: () => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({
  onNavigateHome,
  onNavigateContact,
}) => {
  const { settings, fullSiteName } = useSiteSettings();

  useEffect(() => {
    updateDocumentSEO({
      title: `Privacy Policy & Client-Side Security Standards — ${fullSiteName}`,
      description: `Read the official privacy policy and client-side data isolation standards for ${fullSiteName}. All calculations are executed locally without server tracking.`,
    });
  }, [fullSiteName]);

  const currentEmail = settings.supportEmail || 'privacy@omnicalc.pro';

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
        <span className="text-stone-900 font-semibold">Privacy Policy</span>
      </div>

      {/* Hero Header */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs p-6 sm:p-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>Privacy & Data Security Commitment</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-950 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm sm:text-base text-stone-600 max-w-3xl leading-relaxed">
          At {fullSiteName}, your financial privacy is fundamental. We believe that calculating retirement readiness, loan payments, investment returns, or tax projections should never require compromising your personal financial data.
        </p>
        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-stone-500 border-t border-stone-100">
          <span><strong>Effective Date:</strong> January 1, 2026</span>
          <span>•</span>
          <span><strong>Last Updated:</strong> September 2026</span>
          <span>•</span>
          <span><strong>Version:</strong> 2.4.0 (SECURE 2.0 Compliant)</span>
        </div>
      </div>

      {/* Core Privacy Pillar Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-stone-900">100% Client-Side Computing</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            All 56 calculation engines execute locally inside your browser's JavaScript runtime. Your salary, loan balances, investment portfolios, and net worth numbers are never transmitted to or processed by our servers.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-stone-900">Zero Financial Data Selling</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            We do not sell, rent, monetize, or broker your inputs, calculation histories, or search behaviors to mortgage lenders, credit card issuers, brokers, or data aggregators.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-stone-900">Local Scenario Control</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            When you save a calculation scenario or bookmark a plan, it is stored solely in your local browser storage (<code className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">localStorage</code>). You retain complete authority to delete it at any time.
          </p>
        </div>
      </div>

      {/* Comprehensive Privacy & Security How-To Guide */}
      <HowToUseArticleSection article={SITEWIDE_PAGE_GUIDES.privacy} />

      {/* Detailed Legal Sections */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs p-6 sm:p-10 space-y-8 text-stone-800 leading-relaxed">
        
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-800 text-xs font-mono font-bold flex items-center justify-center">1</span>
            Information We Do NOT Collect
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Because our financial computation architecture operates completely client-side in your local browser memory, OmniCalc Pro does <strong>NOT</strong> collect, store, or inspect:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700 pt-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Social Security Numbers (SSN), Tax IDs, or credit scores</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Bank account, brokerage account, or credit card numbers</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Your actual mortgage balance, loan terms, or salary records</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Personal identities, physical residential addresses, or phone numbers</span>
            </li>
          </ul>
        </section>

        <hr className="border-stone-100" />

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-800 text-xs font-mono font-bold flex items-center justify-center">2</span>
            Information We May Process
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            To ensure application reliability, platform uptime, and mathematical precision, we may process minimal non-identifying technical metadata:
          </p>
          <div className="space-y-2 text-xs text-stone-700">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
              <strong className="text-stone-900 block mb-1">A. Technical Telemetry & Diagnostics:</strong>
              Standard HTTP headers, browser user-agent, operating system, screen dimensions, and anonymous performance logs to ensure calculators render accurately across mobile and desktop devices.
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
              <strong className="text-stone-900 block mb-1">B. Direct Inquiries & Contact Submissions:</strong>
              When you voluntarily reach out through our Contact form or email, we receive your provided name, email address, and message content solely to respond to your support request or mathematical question.
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
              <strong className="text-stone-900 block mb-1">C. Client-Side Local Storage:</strong>
              Browser local storage is utilized strictly to preserve your saved scenario calculations and user preferences (e.g., active chart views). This data remains on your physical device.
            </div>
          </div>
        </section>

        <hr className="border-stone-100" />

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-800 text-xs font-mono font-bold flex items-center justify-center">3</span>
            Cookies & Tracking Technologies
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            We do not use invasive third-party cross-site tracking cookies or advertising pixels. We do not participate in behavioral retargeting networks. Any cookies used are strictly essential for core web security and performance optimization.
          </p>
        </section>

        <hr className="border-stone-100" />

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-800 text-xs font-mono font-bold flex items-center justify-center">4</span>
            Global Privacy Compliance (GDPR, CCPA / CPRA)
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Whether you reside in the European Economic Area (EEA), United Kingdom, California, or worldwide, you hold the following rights:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-700">
            <div className="p-3 rounded-xl border border-stone-200">
              <strong className="text-stone-900 block font-semibold mb-1">Right to Access & Rectify:</strong>
              You may request copies of any direct communications or inquiry records held by OmniCalc Pro.
            </div>
            <div className="p-3 rounded-xl border border-stone-200">
              <strong className="text-stone-900 block font-semibold mb-1">Right to Erasure (To Be Forgotten):</strong>
              You may request immediate deletion of any support email or contact correspondence.
            </div>
            <div className="p-3 rounded-xl border border-stone-200">
              <strong className="text-stone-900 block font-semibold mb-1">Right to Opt-Out of Data Sale:</strong>
              We do not sell personal data; thus no opt-out is necessary, but we uphold a permanent non-sale policy.
            </div>
            <div className="p-3 rounded-xl border border-stone-200">
              <strong className="text-stone-900 block font-semibold mb-1">Local Data Deletion:</strong>
              You can instantly purge all saved scenarios by clicking "Clear All" in the Saved Scenarios dashboard.
            </div>
          </div>
        </section>

        <hr className="border-stone-100" />

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-800 text-xs font-mono font-bold flex items-center justify-center">5</span>
            Children's Privacy Protection
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Our platform provides general educational financial computation tools and does not knowingly collect or solicit personal information from children under the age of 13 (or 16 in applicable jurisdictions) in accordance with the Children's Online Privacy Protection Act (COPPA).
          </p>
        </section>

        <hr className="border-stone-100" />

        {/* Section 6 */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-800 text-xs font-mono font-bold flex items-center justify-center">6</span>
            Privacy Contact & Data Inquiries
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            If you have questions regarding this Privacy Policy, your rights, or wish to submit a data protection inquiry, please reach out directly:
          </p>
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <strong className="text-stone-900 text-sm block">{fullSiteName} Privacy & Security Office</strong>
              <span className="text-xs text-stone-500">Email: {currentEmail}</span>
            </div>
            <button
              onClick={onNavigateContact}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Contact Privacy Team
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
