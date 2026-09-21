import React, { useState, useEffect } from 'react';
import {
  Mail,
  MessageSquare,
  Send,
  CheckCircle2,
  Copy,
  Check,
  Clock,
  HelpCircle,
  Sparkles,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { HowToUseArticleSection } from '../common/HowToUseArticleSection';
import { SITEWIDE_PAGE_GUIDES } from '../../data/pageGuides';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { updateDocumentSEO } from '../../utils/seo';

interface ContactUsPageProps {
  onNavigateHome: () => void;
  onNavigateAbout: () => void;
}

export const ContactUsPage: React.FC<ContactUsPageProps> = ({
  onNavigateHome,
  onNavigateAbout,
}) => {
  const { settings, fullSiteName } = useSiteSettings();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subjectCategory, setSubjectCategory] = useState('feedback');
  const [calculatorRelated, setCalculatorRelated] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    updateDocumentSEO({
      title: `Contact Us & Technical Support — ${fullSiteName}`,
      description: `Get in touch with the ${fullSiteName} mathematical audit team for calculation inquiries, bug reports, and formula verifications.`,
    });
  }, [fullSiteName]);

  const currentEmail = settings.supportEmail || 'support@omnicalc.pro';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(currentEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const generatedRef = `OMNI-${Math.floor(100000 + Math.random() * 900000)}`;
      setReferenceId(generatedRef);
      setIsSubmitting(false);
      setIsSubmitted(true);

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#059669', '#10b981', '#34d399', '#3b82f6'],
      });
    }, 600);
  };

  const handleResetForm = () => {
    setName('');
    setEmail('');
    setSubjectCategory('feedback');
    setCalculatorRelated('');
    setMessage('');
    setIsSubmitted(false);
    setReferenceId('');
  };

  const faqs = [
    {
      q: 'Are calculations and inputs private on OmniCalc Pro?',
      a: 'Yes, 100%. All 56 calculation engines run entirely in your local browser runtime. We do not store, log, or sell your financial figures, salaries, mortgage amounts, or net worth values to any third parties.',
    },
    {
      q: 'How frequently are tax brackets and IRS limits updated?',
      a: 'Our models are updated promptly whenever the IRS releases annual cost-of-living adjustments (e.g., Notice 2024-80 for 2025/2026), SECURE 2.0 statutory milestones, and updated FINRA / Regulation Z guidelines.',
    },
    {
      q: 'How do I report a formula discrepancy or suggested enhancement?',
      a: 'Use the contact form on this page with the "Formula Audit / Discrepancy" category. Please include the specific calculator name and the parameters you used so our quantitative team can verify the equation against official reference models.',
    },
    {
      q: 'Can I export calculation results and amortization tables?',
      a: 'Yes! Every calculator that produces an amortization or compounding schedule includes a direct "Export CSV" button to download complete spreadsheet tables for Microsoft Excel or Google Sheets, as well as a "Print" option.',
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
        <span className="text-stone-900 font-semibold">Contact Us</span>
      </div>

      {/* Hero Header */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs p-6 sm:p-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
          <span>Support & Quantitative Advisory</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-950 tracking-tight">
          Contact the OmniCalc Pro Team
        </h1>
        <p className="text-sm sm:text-base text-stone-600 max-w-3xl leading-relaxed">
          Have a question about a financial formula, a suggestion for a new calculator, or feedback on our mathematical models? We are here to help.
        </p>
      </div>

      {/* Main Grid: Contact Form + Direct Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form Column (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-stone-200/90 shadow-xs p-6 sm:p-8 space-y-6">
          {isSubmitted ? (
            <div className="text-center py-12 px-4 space-y-5 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-stone-900">Message Received!</h3>
                <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                  Thank you for contacting us, <strong>{name}</strong>. Our quantitative team has logged your inquiry under reference code:
                </p>
                <div className="inline-block px-4 py-1.5 rounded-xl bg-stone-100 border border-stone-300 font-mono text-xs font-bold text-stone-900">
                  {referenceId}
                </div>
              </div>
              <p className="text-xs text-stone-500">
                A confirmation has been queued for <strong>{email}</strong>. We typically respond within 24 business hours.
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="border-b border-stone-100 pb-3">
                <h2 className="text-lg font-bold text-stone-900">Send an Inquiry</h2>
                <p className="text-xs text-stone-500">Fill out the fields below and our team will get back to you promptly</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="contact-name" className="text-xs font-semibold text-stone-700">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-email" className="text-xs font-semibold text-stone-700">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. sarah@example.com"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="contact-category" className="text-xs font-semibold text-stone-700">
                    Topic Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="contact-category"
                    value={subjectCategory}
                    onChange={(e) => setSubjectCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="feedback">General Feedback</option>
                    <option value="formula">Formula Audit / Discrepancy</option>
                    <option value="request">New Calculator Suggestion</option>
                    <option value="partnership">Partnership or Press</option>
                    <option value="technical">Technical / Bug Report</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-calc" className="text-xs font-semibold text-stone-700">
                    Calculator Name <span className="text-stone-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    id="contact-calc"
                    type="text"
                    value={calculatorRelated}
                    onChange={(e) => setCalculatorRelated(e.target.value)}
                    placeholder="e.g. 401(k) Match Calculator"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-message" className="text-xs font-semibold text-stone-700">
                  Your Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please describe your question, feedback, or formula verification request in detail..."
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-all resize-y"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Your email is strictly protected under our Privacy Policy</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Sidebar Info Column (1 col) */}
        <div className="space-y-6">
          {/* Quick Email Card */}
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs p-6 space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Direct Email</h3>
              <p className="text-xs text-stone-500">For direct support and inquiries</p>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-stone-800 break-all pr-2">
                {currentEmail}
              </span>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer shrink-0"
                title="Copy email address"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="pt-2 border-t border-stone-100 space-y-2 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>Response Time: &lt; 24 Business Hours</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-stone-400" />
                <span>Operating Hours: Mon–Fri, 9am–6pm EST</span>
              </div>
            </div>
          </div>

          {/* About Us teaser */}
          <div className="bg-stone-900 text-white rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">About {fullSiteName}</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Explore our mission, CFA-grounded methodologies, and mathematical audit framework.
            </p>
            <button
              onClick={onNavigateAbout}
              className="w-full py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold border border-stone-700 transition-colors cursor-pointer text-center block"
            >
              Learn More About Us
            </button>
          </div>
        </div>
      </div>

      {/* Comprehensive Support & Audit How-To Guide */}
      <HowToUseArticleSection article={SITEWIDE_PAGE_GUIDES.contact} />

      {/* Frequently Asked Questions */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs p-6 sm:p-10 space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-emerald-700 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Common Questions</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-stone-200 rounded-2xl overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-stone-900 text-xs sm:text-sm hover:bg-stone-50 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                {openFaqIndex === idx ? (
                  <ChevronUp className="w-4 h-4 text-stone-500 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-stone-500 shrink-0" />
                )}
              </button>
              {openFaqIndex === idx && (
                <div className="px-4 pb-4 pt-1 text-xs text-stone-600 leading-relaxed border-t border-stone-100 bg-stone-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
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
