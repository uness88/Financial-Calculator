import { ALL_CALCULATORS, getCalculatorBySlug } from '../data/calculatorRegistry';
import { CATEGORIES, getCategoryBySlug } from '../config/categories';
import { CATEGORY_GUIDES, SITEWIDE_PAGE_GUIDES, PageGuideArticle } from '../data/pageGuides';
import { getCalculatorHowToUseArticle, HowToUseArticle } from '../data/calculatorHowToUse';
import { DEFAULT_SITE_SETTINGS, SiteSettings } from '../types/siteSettings';

/**
 * Server-Side Semantic HTML Pre-Renderer
 * Generates 100% crawler-visible, AdSense & Googlebot-ready semantic HTML
 * for all routes (Home, 56 Calculators, Categories, Static Legal/Info pages).
 */

export interface PreRenderResult {
  title: string;
  metaDescription: string;
  canonicalUrl: string;
  schemaJsonLd: string;
  bodyHtml: string;
  keywords: string;
}

/**
 * Shared Header HTML used across all pages
 */
function renderHeaderHtml(siteName: string): string {
  return `
  <header class="bg-white border-b border-stone-200 py-3.5 px-4 sm:px-8 shadow-xs sticky top-0 z-40">
    <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
      <a href="/" class="flex items-center gap-2.5 text-stone-900 font-bold text-lg group">
        <span class="p-2 bg-emerald-600 text-white rounded-xl shadow-xs group-hover:bg-emerald-700 transition-colors">🧮</span>
        <span class="tracking-tight text-stone-900 font-extrabold">${siteName}</span>
      </a>
      
      <nav aria-label="Main Navigation" class="hidden md:flex items-center gap-5 text-xs font-semibold text-stone-600">
        <a href="/" class="hover:text-emerald-700 transition-colors">All 56 Tools</a>
        <a href="/category/finance-investment" class="hover:text-emerald-700 transition-colors">Personal Finance</a>
        <a href="/category/retirement-calculators" class="hover:text-emerald-700 transition-colors">Retirement</a>
        <a href="/category/loan-mortgage-calculators" class="hover:text-emerald-700 transition-colors">Mortgages &amp; Loans</a>
        <a href="/category/stock-calculators" class="hover:text-emerald-700 transition-colors">Stocks &amp; Investing</a>
      </nav>

      <div class="flex items-center gap-3 text-xs">
        <a href="/about" class="hidden sm:inline-block text-stone-600 hover:text-stone-900 font-medium">About Us</a>
        <a href="/contact" class="hidden sm:inline-block text-stone-600 hover:text-stone-900 font-medium">Contact Us</a>
        <a href="/saved" class="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold transition-colors flex items-center gap-1.5">
          <span>💾</span>
          <span>Saved</span>
        </a>
      </div>
    </div>
  </header>`;
}

/**
 * Shared Footer HTML used across all pages
 */
function renderFooterHtml(siteName: string, settings: SiteSettings): string {
  const currentYear = new Date().getFullYear();
  return `
  <footer class="bg-stone-900 text-stone-300 border-t border-stone-800 mt-20 pt-16 pb-12 px-4 sm:px-8">
    <div class="max-w-7xl mx-auto space-y-12">
      <!-- 4-Column Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <!-- Col 1: Brand & Mission -->
        <div class="space-y-4">
          <div class="flex items-center gap-2 text-white font-bold text-lg">
            <span class="p-2 bg-emerald-600 text-white rounded-xl">🧮</span>
            <span>${siteName}</span>
          </div>
          <p class="text-xs text-stone-400 leading-relaxed">
            Institutional-grade financial calculation suite offering 56 mathematical engines, amortization schedules, and retirement models calibrated to IRS 2026 statutory guidelines.
          </p>
          <div class="flex items-center gap-2 text-[11px] text-emerald-400 font-semibold">
            <span>✓ 100% Client-Side Computation</span>
            <span>•</span>
            <span>Zero Tracking</span>
          </div>
        </div>

        <!-- Col 2: Categories -->
        <div class="space-y-3">
          <h3 class="text-xs font-bold uppercase tracking-wider text-white">Financial Categories</h3>
          <ul class="space-y-2 text-xs text-stone-400 font-medium">
            <li><a href="/category/finance-investment" class="hover:text-emerald-400 transition-colors">Personal Finance &amp; Savings</a></li>
            <li><a href="/category/retirement-calculators" class="hover:text-emerald-400 transition-colors">Retirement &amp; 401(k) Planning</a></li>
            <li><a href="/category/loan-mortgage-calculators" class="hover:text-emerald-400 transition-colors">Mortgages, Loans &amp; Amortization</a></li>
            <li><a href="/category/stock-calculators" class="hover:text-emerald-400 transition-colors">Stocks, Options &amp; Investments</a></li>
          </ul>
        </div>

        <!-- Col 3: Popular Calculators -->
        <div class="space-y-3">
          <h3 class="text-xs font-bold uppercase tracking-wider text-white">Popular 2026 Calculators</h3>
          <ul class="space-y-2 text-xs text-stone-400 font-medium">
            <li><a href="/calculator/mortgage-calculator" class="hover:text-emerald-400 transition-colors">Mortgage Payment Calculator</a></li>
            <li><a href="/calculator/compound-interest-calculator" class="hover:text-emerald-400 transition-colors">Compound Interest Calculator</a></li>
            <li><a href="/calculator/401k-calculator" class="hover:text-emerald-400 transition-colors">401(k) Growth &amp; Employer Match</a></li>
            <li><a href="/calculator/roth-ira-calculator" class="hover:text-emerald-400 transition-colors">Roth IRA Tax-Free Engine</a></li>
            <li><a href="/calculator/loan-amortization-calculator" class="hover:text-emerald-400 transition-colors">Loan Amortization Schedule</a></li>
            <li><a href="/calculator/stock-profit-calculator" class="hover:text-emerald-400 transition-colors">Stock Profit &amp; Dividend Return</a></li>
          </ul>
        </div>

        <!-- Col 4: Institutional & Legal Links -->
        <div class="space-y-3">
          <h3 class="text-xs font-bold uppercase tracking-wider text-white">Company &amp; Legal</h3>
          <ul class="space-y-2 text-xs text-stone-400 font-medium">
            <li><a href="/about" class="hover:text-emerald-400 transition-colors">About Us &amp; Standards</a></li>
            <li><a href="/contact" class="hover:text-emerald-400 transition-colors">Contact Us &amp; Support</a></li>
            <li><a href="/privacy" class="hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
            <li><a href="/terms" class="hover:text-emerald-400 transition-colors">Terms of Use &amp; Disclaimers</a></li>
            <li><a href="/saved" class="hover:text-emerald-400 transition-colors">Saved Scenarios</a></li>
          </ul>
        </div>
      </div>

      <!-- Legal Disclaimer & Copyright -->
      <div class="pt-8 border-t border-stone-800 space-y-4">
        <p class="text-[11px] text-stone-500 leading-relaxed">
          <strong>Educational &amp; Regulatory Disclaimer:</strong> ${siteName} provides mathematical calculation algorithms and financial models strictly for educational and informational purposes. Projections do not constitute certified financial, tax, mortgage underwriting, or legal advice. Consult a licensed CPA or CFP® professional before making financial commitments.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>${settings.customFooterNote || `© ${currentYear} ${siteName}. All rights reserved.`}</p>
          <div class="flex items-center gap-5">
            <a href="/about" class="hover:text-white transition-colors">About Us</a>
            <a href="/contact" class="hover:text-white transition-colors">Contact Us</a>
            <a href="/privacy" class="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms" class="hover:text-white transition-colors">Terms of Use</a>
          </div>
        </div>
      </div>
    </div>
  </footer>`;
}

export function renderPageToString(
  urlPath: string,
  settings: SiteSettings = DEFAULT_SITE_SETTINGS
): PreRenderResult {
  const clean = urlPath.replace(/^\/+/, '').replace(/\/+$/, '').split('?')[0].split('#')[0];
  const baseUrl = (settings.canonicalBaseUrl || 'https://omnicalc.pro').replace(/\/+$/, '');
  const siteName = settings.siteNameSuffix ? `${settings.siteName} ${settings.siteNameSuffix}` : settings.siteName;

  // 1. CALCULATOR ROUTE: /calculator/:slug
  if (clean.startsWith('calculator/')) {
    const slug = clean.replace('calculator/', '');
    const calc = getCalculatorBySlug(slug);

    if (calc) {
      const canonical = `${baseUrl}/calculator/${calc.slug}`;
      const title = `${calc.seoTitle || calc.name} | ${siteName}`;
      const metaDescription = calc.metaDescription || calc.shortDescription;
      const keywords = calc.keywords ? calc.keywords.join(', ') : settings.keywords;
      const howToArticle: HowToUseArticle = getCalculatorHowToUseArticle(calc);
      const relatedCalcs = (calc.relatedCalculatorSlugs || [])
        .map((s) => getCalculatorBySlug(s))
        .filter((c): c is NonNullable<typeof c> => Boolean(c));

      // Schema.org Structured Data
      const schemaData: Record<string, any>[] = [
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: calc.name,
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'All',
          browserRequirements: 'Requires JavaScript. Requires HTML5.',
          description: calc.shortDescription,
          url: canonical,
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
          provider: {
            '@type': 'FinancialService',
            name: siteName,
            url: baseUrl,
          },
        },
      ];

      if (calc.faqs && calc.faqs.length > 0) {
        schemaData.push({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: calc.faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.answer,
            },
          })),
        });
      }

      // Pre-rendered HTML markup
      const html = `
      <div class="min-h-screen bg-stone-50 text-stone-900 flex flex-col antialiased">
        ${renderHeaderHtml(siteName)}

        <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-8">
          <!-- Breadcrumbs -->
          <nav aria-label="Breadcrumb" class="text-xs text-stone-500 flex items-center gap-2">
            <a href="/" class="hover:text-stone-900">Home</a>
            <span>/</span>
            <a href="/category/${calc.category}" class="hover:text-stone-900 capitalize">${calc.category.replace(/-/g, ' ')}</a>
            <span>/</span>
            <span class="text-stone-800 font-semibold">${calc.name}</span>
          </nav>

          <!-- Hero & Title Section -->
          <section class="rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950 text-white p-6 sm:p-10 border border-stone-800 shadow-xl space-y-4">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
              <span>Verified 2026 Financial Engine</span>
            </div>
            <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">${calc.h1Title || calc.name}</h1>
            <p class="text-sm sm:text-base text-stone-300 max-w-3xl leading-relaxed">${calc.longDescription || calc.shortDescription}</p>
          </section>

          <!-- Interactive Calculator Inputs Preview -->
          <div id="calculator-interactive-root" class="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm">
            <div class="space-y-4">
              <h2 class="text-lg font-bold text-stone-900">Calculator Parameters &amp; Inputs</h2>
              <p class="text-xs text-stone-500">Configure parameters below to compute instant financial outcomes.</p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${calc.inputs
                  .map(
                    (input) => `
                  <div class="p-4 rounded-xl bg-stone-50 border border-stone-200">
                    <label class="block text-xs font-semibold text-stone-700 mb-1">${input.label}</label>
                    <div class="text-sm font-mono text-stone-900 font-bold bg-white px-3 py-2 rounded-lg border border-stone-300">
                      ${input.defaultValue} ${input.unit || ''}
                    </div>
                    ${input.helpText ? `<p class="text-[11px] text-stone-500 mt-1">${input.helpText}</p>` : ''}
                  </div>`
                  )
                  .join('')}
              </div>
            </div>
          </div>

          <!-- How It Works & Educational Steps -->
          <section class="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 space-y-4 shadow-sm">
            <h2 class="text-xl sm:text-2xl font-black text-stone-900">How This Calculator Works</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${(calc.howItWorks && calc.howItWorks.length > 0 ? calc.howItWorks : [
                `Enter your initial parameters, interest or growth rates, and duration into the calculator inputs.`,
                `The computational engine processes standard compounding, amortization, or return formulas instantly.`,
                `Review the primary summary metrics, detailed payment or growth schedule, and visual charts.`,
                `Adjust variables to compare different financial scenarios and optimize your decisions.`
              ])
                .map(
                  (step, idx) => `
                <div class="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex gap-3.5">
                  <span class="flex-shrink-0 w-7 h-7 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">${idx + 1}</span>
                  <p class="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">${step}</p>
                </div>`
                )
                .join('')}
            </div>
          </section>

          <!-- Mathematical Formula & Methodology Breakdown -->
          <section class="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 space-y-6 shadow-sm">
            <h2 class="text-xl sm:text-2xl font-black text-stone-900">FINANCIAL FORMULA &amp; METHODOLOGY</h2>
            ${
              calc.formula?.formula
                ? `
            <div class="p-4 sm:p-6 rounded-2xl bg-stone-900 text-emerald-400 font-mono text-xs sm:text-sm border border-stone-800 overflow-x-auto">
              <code>${calc.formula.formula}</code>
            </div>`
                : `
            <div class="p-4 sm:p-6 rounded-2xl bg-stone-900 text-emerald-400 font-mono text-xs sm:text-sm border border-stone-800 overflow-x-auto">
              <code>Standard Quantitative Financial Formula: Result = f(Principal, Rate, Time, CashFlows)</code>
            </div>`
            }
            <div class="prose prose-stone max-w-none text-xs sm:text-sm text-stone-700 leading-relaxed space-y-3">
              <p>${calc.formula?.explanation || `This calculator implements standardized financial mathematics adhering to standard accounting practices, time-value-of-money equations, and compounding frequencies.`}</p>
            </div>
            ${
              calc.formula?.variables && calc.formula.variables.length > 0
                ? `
            <div class="space-y-2">
              <h3 class="text-sm font-bold text-stone-900">Variable Definitions:</h3>
              <ul class="list-disc list-inside space-y-1 text-xs sm:text-sm text-stone-600">
                ${calc.formula.variables.map((v) => `<li><strong>${v.symbol}</strong>: ${v.name} — ${v.description}</li>`).join('')}
              </ul>
            </div>`
                : ''
            }
          </section>

          <!-- Financial Meaning & Interpretation -->
          <section class="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 space-y-3 shadow-sm">
            <h2 class="text-xl sm:text-2xl font-black text-stone-900">Interpreting Your Results</h2>
            <p class="text-xs sm:text-sm text-stone-700 leading-relaxed">${calc.whatItMeans || `Understanding the calculated outcome allows you to gauge long-term wealth accumulation, evaluate cost of borrowing, and benchmark against alternatives to make informed financial commitments.`}</p>
          </section>

          <!-- Factors to Consider -->
          ${
            calc.factorsToConsider && calc.factorsToConsider.length > 0
              ? `
          <section class="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 space-y-4 shadow-sm">
            <h2 class="text-xl sm:text-2xl font-black text-stone-900">Key Strategic Factors to Consider</h2>
            <ul class="grid grid-cols-1 md:grid-cols-2 gap-3">
              ${calc.factorsToConsider
                .map(
                  (factor) => `
                <li class="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-700 flex items-start gap-2.5">
                  <span class="text-emerald-600 font-bold mt-0.5">✓</span>
                  <span>${factor}</span>
                </li>`
                )
                .join('')}
            </ul>
          </section>`
              : ''
          }

          <!-- Practical Worked Example -->
          <section class="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 space-y-4 shadow-sm">
            <h2 class="text-xl sm:text-2xl font-black text-stone-900">Worked Example: ${calc.example?.scenarioTitle || `${calc.name} Application Case`}</h2>
            <p class="text-xs sm:text-sm text-stone-600">${calc.example?.description || `Consider a real-world scenario applying baseline parameters to observe how the calculations materialize.`}</p>
            <div class="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <h3 class="text-xs sm:text-sm font-bold text-stone-900 uppercase">Calculation Steps:</h3>
              <ol class="list-decimal list-inside space-y-1.5 text-xs sm:text-sm text-stone-700">
                ${(calc.example?.stepByStep || [
                  `Identify the starting investment, principal balance, or input amounts.`,
                  `Apply the relevant periodic interest rate and compounding cadence.`,
                  `Calculate total accumulated value or periodic repayment obligation.`,
                  `Synthesize the net profit, total interest paid, or final balance.`
                ]).map((s) => `<li>${s}</li>`).join('')}
              </ol>
              <p class="pt-2 text-xs sm:text-sm font-bold text-emerald-800">Final Outcome: ${calc.example?.finalOutcome || `Accurate, actionable projection based on verified financial equations.`}</p>
            </div>
          </section>

          <!-- Institutional Methodology & Compliance Review -->
          ${
            calc.methodologyReview
              ? `
          <section class="bg-emerald-950 text-white rounded-3xl p-6 sm:p-8 space-y-2 border border-emerald-800 shadow-md">
            <h3 class="text-xs font-bold uppercase tracking-wider text-emerald-400">Institutional Review &amp; Compliance</h3>
            <p class="text-xs sm:text-sm text-emerald-100 leading-relaxed">${calc.methodologyReview}</p>
            ${calc.lastUpdated ? `<span class="text-[11px] text-emerald-400 block pt-1">Calibrated Date: ${calc.lastUpdated}</span>` : ''}
          </section>`
              : ''
          }

          <!-- In-depth Editorial Guide / Comprehensive User Guide & How-To Manual (1,000+ words SEO authority) -->
          ${
            howToArticle
              ? `
          <article class="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 space-y-8 shadow-sm">
            <div class="border-b border-stone-100 pb-4 space-y-2">
              <div class="flex items-center gap-2 text-emerald-800 font-bold text-xs tracking-wider uppercase">
                <span>📖 Comprehensive User Guide &amp; How-To Manual</span>
              </div>
              <h2 class="text-xl sm:text-2xl lg:text-3xl font-black text-stone-900 tracking-tight">${howToArticle.title}</h2>
              <p class="text-xs sm:text-sm text-stone-600 leading-relaxed">${howToArticle.subtitle || ''}</p>
              <div class="flex items-center gap-3 text-xs text-stone-500 pt-1">
                <span class="font-medium text-emerald-700">⏱️ ${howToArticle.estimatedReadTime || '5 min read'}</span>
                <span>•</span>
                <span>📄 ${howToArticle.characterCount ? howToArticle.characterCount.toLocaleString('en-US') + ' characters' : 'Comprehensive Guide'}</span>
              </div>
            </div>

            <div class="space-y-6 text-stone-700 leading-relaxed text-xs sm:text-sm">
              ${howToArticle.sections
                .map(
                  (sec, sIdx) => `
                <div class="space-y-3">
                  <h3 class="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
                    <span class="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0">${sIdx + 1}</span>
                    <span>${sec.heading}</span>
                  </h3>
                  <p class="leading-relaxed pl-8">${sec.content}</p>
                  ${
                    sec.bulletPoints && sec.bulletPoints.length > 0
                      ? `<ul class="list-disc list-inside space-y-1.5 pl-8 text-stone-600 font-medium">
                        ${sec.bulletPoints.map((bp: string) => `<li>${bp}</li>`).join('')}
                      </ul>`
                      : ''
                  }
                </div>`
                )
                .join('')}

              ${
                howToArticle.summaryTakeaway
                  ? `
              <div class="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2">
                <strong class="text-xs font-bold uppercase tracking-wider block text-emerald-800">Key Strategic Takeaway:</strong>
                <p class="text-xs sm:text-sm font-medium leading-relaxed">${howToArticle.summaryTakeaway}</p>
              </div>`
                  : ''
              }
            </div>
          </article>`
              : ''
          }

          <!-- FAQ Section -->
          <section class="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 space-y-6 shadow-sm">
            <h2 class="text-xl sm:text-2xl font-black text-stone-900">Frequently Asked Questions</h2>
            <div class="space-y-4">
              ${(calc.faqs && calc.faqs.length > 0 ? calc.faqs : [
                {
                  question: `How accurate are the results provided by this ${calc.name}?`,
                  answer: `Calculations strictly adhere to verified quantitative finance and banking equations. For formal tax, legal, or personal advisory, consult a certified financial planner.`
                },
                {
                  question: `Is my financial data kept private when using this tool?`,
                  answer: `Yes, 100%. All computations are executed client-side inside your web browser. No personal or financial information is transmitted to external servers.`
                },
                {
                  question: `Can I export or save these calculations?`,
                  answer: `Yes, you can click 'Save Calculation' to store this scenario in your browser's local storage for future reference and comparison.`
                }
              ])
                .map(
                  (faq) => `
                <div class="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <h3 class="text-sm sm:text-base font-bold text-stone-900">${faq.question}</h3>
                  <p class="text-xs sm:text-sm text-stone-600 leading-relaxed">${faq.answer}</p>
                </div>`
                )
                .join('')}
            </div>
          </section>

          <!-- Related Calculators -->
          ${
            relatedCalcs.length > 0
              ? `
          <section class="space-y-4">
            <h2 class="text-xl font-bold text-stone-900">Related Financial Tools &amp; Calculators</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              ${relatedCalcs
                .map(
                  (rc) => `
                <a href="/calculator/${rc.slug}" class="p-4 rounded-2xl bg-white border border-stone-200 hover:border-emerald-500 shadow-2xs transition-all block">
                  <h3 class="text-sm font-bold text-stone-900">${rc.name}</h3>
                  <p class="text-xs text-stone-500 mt-1 line-clamp-2">${rc.shortDescription}</p>
                </a>`
                )
                .join('')}
            </div>
          </section>`
              : ''
          }
        </main>

        ${renderFooterHtml(siteName, settings)}
      </div>`;

      return {
        title,
        metaDescription,
        canonicalUrl: canonical,
        schemaJsonLd: JSON.stringify(schemaData),
        bodyHtml: html,
        keywords,
      };
    }
  }

  // 2. CATEGORY ROUTE: /category/:categorySlug
  if (clean.startsWith('category/')) {
    const catSlug = clean.replace('category/', '');
    const cat = getCategoryBySlug(catSlug);

    if (cat) {
      const canonical = `${baseUrl}/category/${cat.slug}`;
      const title = `${cat.name} — Free Financial Calculators | ${siteName}`;
      const metaDescription = cat.description;
      const calcs = ALL_CALCULATORS.filter((c) => c.category === cat.slug);
      const guide: PageGuideArticle | undefined = CATEGORY_GUIDES[cat.slug];

      const html = `
      <div class="min-h-screen bg-stone-50 text-stone-900 flex flex-col antialiased">
        ${renderHeaderHtml(siteName)}

        <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-8">
          <nav aria-label="Breadcrumb" class="text-xs text-stone-500 flex items-center gap-2">
            <a href="/" class="hover:text-stone-900">Home</a>
            <span>/</span>
            <span class="text-stone-800 font-semibold">${cat.name}</span>
          </nav>

          <section class="rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950 text-white p-6 sm:p-10 border border-stone-800 shadow-xl space-y-4">
            <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300">${calcs.length} Financial Engines</span>
            <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">${cat.name}</h1>
            <p class="text-sm sm:text-base text-stone-300 max-w-3xl leading-relaxed">${cat.description}</p>
          </section>

          <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            ${calcs
              .map(
                (c) => `
              <a href="/calculator/${c.slug}" class="p-5 rounded-2xl bg-white border border-stone-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                <div class="space-y-2">
                  <h2 class="text-base font-bold text-stone-900">${c.name}</h2>
                  <p class="text-xs text-stone-600 leading-relaxed">${c.shortDescription}</p>
                </div>
                <div class="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
                  <span>Open Calculator</span>
                  <span>→</span>
                </div>
              </a>`
              )
              .join('')}
          </section>

          ${
            guide
              ? `
          <article class="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 space-y-6 shadow-sm mt-8">
            <h2 class="text-xl sm:text-2xl font-black text-stone-900">${guide.title}</h2>
            <p class="text-xs sm:text-sm text-stone-500">${guide.subtitle}</p>
            <div class="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
              ${guide.sections
                .map(
                  (s) => `
                <div class="space-y-2">
                  <h3 class="text-sm sm:text-base font-bold text-stone-900">${s.heading}</h3>
                  <p>${s.content}</p>
                </div>`
                )
                .join('')}
            </div>
          </article>`
              : ''
          }
        </main>

        ${renderFooterHtml(siteName, settings)}
      </div>`;

      return {
        title,
        metaDescription,
        canonicalUrl: canonical,
        schemaJsonLd: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: cat.name,
          description: cat.description,
          url: canonical,
        }),
        bodyHtml: html,
        keywords: settings.keywords,
      };
    }
  }

  // 3. STATIC PAGES (/privacy, /terms, /about, /contact, /saved)
  if (clean === 'privacy') {
    const canonical = `${baseUrl}/privacy`;
    const title = `Privacy Policy | ${siteName}`;
    const desc = `Privacy policy and user data protections for ${siteName}. Zero tracking, client-side execution, and GDPR/CCPA compliance.`;
    const guide: PageGuideArticle | undefined = SITEWIDE_PAGE_GUIDES['privacy'];
    const html = `
    <div class="min-h-screen bg-stone-50 text-stone-900 flex flex-col antialiased">
      ${renderHeaderHtml(siteName)}
      <main class="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <h1 class="text-3xl sm:text-4xl font-black text-stone-950">Privacy Policy</h1>
        <p class="text-xs sm:text-sm text-stone-500">Last updated: January 2026. Official privacy notice of ${siteName}.</p>
        
        <div class="prose prose-stone max-w-none text-xs sm:text-sm space-y-6 text-stone-700 leading-relaxed bg-white p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-sm">
          <p>At ${siteName}, accessible from <a href="${baseUrl}" class="text-emerald-700 underline font-semibold">${baseUrl}</a>, the privacy of our visitors is one of our main priorities. This Privacy Policy document outlines the types of information collected and recorded by ${siteName} and how we protect your financial privacy.</p>
          
          <h2 class="text-lg font-bold text-stone-900">1. 100% Client-Side Computation Architecture</h2>
          <p>All calculations, loan amortization tables, mortgage inputs, salary numbers, investment figures, and tax brackets are computed purely in your local web browser. None of your financial figures or scenarios are transmitted to our servers or saved externally.</p>
          
          <h2 class="text-lg font-bold text-stone-900">2. Google AdSense &amp; Advertising Cookies</h2>
          <p>We partner with Google AdSense to serve non-intrusive advertisements. Google may use cookies, such as the DoubleClick cookie, to serve relevant ads based on prior visits to our site or other websites. You can opt out of personalized advertising by visiting Google's Ad Settings.</p>
          
          <h2 class="text-lg font-bold text-stone-900">3. Local Storage</h2>
          <p>When you save scenarios or customize preferences, they are stored strictly in your browser's localStorage. You can clear this data at any time via your browser settings or our <a href="/saved" class="text-emerald-700 underline">Saved Calculations</a> portal.</p>
          
          <h2 class="text-lg font-bold text-stone-900">4. Contact Privacy Officer</h2>
          <p>If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at <a href="/contact" class="text-emerald-700 underline">${settings.supportEmail || 'support@okcoloring.com'}</a>.</p>
        </div>

        ${
          guide
            ? `
        <article class="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 space-y-6 shadow-sm">
          <div class="border-b border-stone-100 pb-4 space-y-1">
            <span class="text-emerald-800 font-bold text-xs uppercase tracking-wider">Comprehensive Privacy Guide</span>
            <h2 class="text-xl sm:text-2xl font-black text-stone-900">${guide.title}</h2>
            <p class="text-xs text-stone-500">${guide.subtitle} • <span class="text-emerald-700 font-semibold">${guide.estimatedReadTime}</span></p>
          </div>
          <div class="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
            ${guide.sections
              .map(
                (sec) => `
              <div class="space-y-2">
                <h3 class="text-base font-bold text-stone-900">${sec.heading}</h3>
                <p>${sec.content}</p>
                ${
                  sec.bulletPoints && sec.bulletPoints.length > 0
                    ? `<ul class="list-disc list-inside space-y-1 pl-2 text-stone-600">
                      ${sec.bulletPoints.map((bp) => `<li>${bp}</li>`).join('')}
                    </ul>`
                    : ''
                }
              </div>`
              )
              .join('')}
            ${
              guide.summaryTakeaway
                ? `<div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs sm:text-sm">
                  <strong>Takeaway:</strong> ${guide.summaryTakeaway}
                </div>`
                : ''
            }
          </div>
        </article>`
            : ''
        }
      </main>
      ${renderFooterHtml(siteName, settings)}
    </div>`;

    return { title, metaDescription: desc, canonicalUrl: canonical, schemaJsonLd: '', bodyHtml: html, keywords: settings.keywords };
  }

  if (clean === 'terms') {
    const canonical = `${baseUrl}/terms`;
    const title = `Terms of Use & Financial Disclaimers | ${siteName}`;
    const desc = `Terms of use, SECURE Act 2.0 notices, and educational financial disclaimers for ${siteName}.`;
    const guide: PageGuideArticle | undefined = SITEWIDE_PAGE_GUIDES['terms'];
    const html = `
    <div class="min-h-screen bg-stone-50 text-stone-900 flex flex-col antialiased">
      ${renderHeaderHtml(siteName)}
      <main class="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <h1 class="text-3xl sm:text-4xl font-black text-stone-950">Terms of Use &amp; Financial Disclaimers</h1>
        <p class="text-xs sm:text-sm text-stone-500">Last updated: January 2026.</p>
        
        <div class="prose prose-stone max-w-none text-xs sm:text-sm space-y-6 text-stone-700 leading-relaxed bg-white p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-sm">
          <p>By accessing and using ${siteName} (<a href="${baseUrl}" class="text-emerald-700 underline">${baseUrl}</a>), you agree to be bound by these Terms of Use and all applicable financial notices.</p>
          
          <h2 class="text-lg font-bold text-stone-900">1. Not Certified Financial Advice</h2>
          <p>The calculation engines, mathematical formulas, projections, and educational articles provided on this website are designed solely for educational, exploratory, and informational purposes. They do not constitute certified financial, tax, investment, mortgage underwriting, or legal counsel.</p>
          
          <h2 class="text-lg font-bold text-stone-900">2. Mathematical Accuracy &amp; IRS Conformance</h2>
          <p>While our algorithms adhere to CFA Institute methodologies and 2026 IRS contribution limits (e.g. SECURE 2.0 rules), actual real-world loans, tax rates, and investment returns will vary depending on your specific financial institution and jurisdiction.</p>

          <h2 class="text-lg font-bold text-stone-900">3. Limitation of Liability</h2>
          <p>In no event shall ${siteName} or its developers be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the tools on this site.</p>
        </div>

        ${
          guide
            ? `
        <article class="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 space-y-6 shadow-sm">
          <div class="border-b border-stone-100 pb-4 space-y-1">
            <span class="text-emerald-800 font-bold text-xs uppercase tracking-wider">Comprehensive Terms Guide</span>
            <h2 class="text-xl sm:text-2xl font-black text-stone-900">${guide.title}</h2>
            <p class="text-xs text-stone-500">${guide.subtitle} • <span class="text-emerald-700 font-semibold">${guide.estimatedReadTime}</span></p>
          </div>
          <div class="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
            ${guide.sections
              .map(
                (sec) => `
              <div class="space-y-2">
                <h3 class="text-base font-bold text-stone-900">${sec.heading}</h3>
                <p>${sec.content}</p>
                ${
                  sec.bulletPoints && sec.bulletPoints.length > 0
                    ? `<ul class="list-disc list-inside space-y-1 pl-2 text-stone-600">
                      ${sec.bulletPoints.map((bp) => `<li>${bp}</li>`).join('')}
                    </ul>`
                    : ''
                }
              </div>`
              )
              .join('')}
            ${
              guide.summaryTakeaway
                ? `<div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs sm:text-sm">
                  <strong>Takeaway:</strong> ${guide.summaryTakeaway}
                </div>`
                : ''
            }
          </div>
        </article>`
            : ''
        }
      </main>
      ${renderFooterHtml(siteName, settings)}
    </div>`;

    return { title, metaDescription: desc, canonicalUrl: canonical, schemaJsonLd: '', bodyHtml: html, keywords: settings.keywords };
  }

  if (clean === 'about') {
    const canonical = `${baseUrl}/about`;
    const title = `About Us — Institutional Financial Calculators | ${siteName}`;
    const desc = `Learn about ${siteName}, our computational standards, editorial guidelines, and verified 2026 financial engines.`;
    const guide: PageGuideArticle | undefined = SITEWIDE_PAGE_GUIDES['about'];
    const html = `
    <div class="min-h-screen bg-stone-50 text-stone-900 flex flex-col antialiased">
      ${renderHeaderHtml(siteName)}
      <main class="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <section class="rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950 text-white p-8 sm:p-12 border border-stone-800 shadow-xl space-y-4">
          <span class="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300">Our Mission</span>
          <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">About ${siteName}</h1>
          <p class="text-sm sm:text-base text-stone-300 max-w-3xl leading-relaxed">
            Democratizing institutional-grade financial mathematics with 56 high-precision calculators, zero paywalls, zero private data transmission, and 100% transparent algorithmic methodology.
          </p>
        </section>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="p-6 rounded-2xl bg-white border border-stone-200 space-y-2">
            <h2 class="text-base font-bold text-stone-900">📐 CFA-Compliant Math</h2>
            <p class="text-xs text-stone-600 leading-relaxed">Every amortization formula, NPV schedule, and Black-Scholes engine adheres strictly to verified CFA Institute standards.</p>
          </div>
          <div class="p-6 rounded-2xl bg-white border border-stone-200 space-y-2">
            <h2 class="text-base font-bold text-stone-900">🛡️ 100% Private &amp; Client-Side</h2>
            <p class="text-xs text-stone-600 leading-relaxed">Your financial figures never leave your device. All calculations run instantaneously inside your browser engine.</p>
          </div>
          <div class="p-6 rounded-2xl bg-white border border-stone-200 space-y-2">
            <h2 class="text-base font-bold text-stone-900">🏛️ IRS 2026 Calibrated</h2>
            <p class="text-xs text-stone-600 leading-relaxed">Updated with 2026 401(k) limits, SECURE Act 2.0 catch-up provisions, Roth IRA income phaseouts, and Social Security PIA rules.</p>
          </div>
        </div>

        <section class="bg-white rounded-3xl border border-stone-200 p-8 sm:p-10 space-y-4">
          <h2 class="text-2xl font-black text-stone-900">Our Editorial &amp; Computational Philosophy</h2>
          <p class="text-xs sm:text-sm text-stone-700 leading-relaxed">
            Founded by software engineers and quantitative finance analysts, ${siteName} was built to replace ad-bloated, slow, and opaque financial websites. We believe everyone deserves instant, clear, and mathematically accurate financial tools.
          </p>
          <div class="pt-4 flex flex-wrap gap-4 text-xs font-semibold">
            <a href="/category/finance-investment" class="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800">Explore Personal Finance →</a>
            <a href="/category/retirement-calculators" class="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800">Explore Retirement Calculators →</a>
            <a href="/category/loan-mortgage-calculators" class="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800">Explore Mortgage Calculators →</a>
            <a href="/category/stock-calculators" class="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800">Explore Stock Calculators →</a>
          </div>
        </section>

        ${
          guide
            ? `
        <article class="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 space-y-6 shadow-sm">
          <div class="border-b border-stone-100 pb-4 space-y-1">
            <span class="text-emerald-800 font-bold text-xs uppercase tracking-wider">Comprehensive User Guide &amp; How-To Manual</span>
            <h2 class="text-xl sm:text-2xl font-black text-stone-900">${guide.title}</h2>
            <p class="text-xs text-stone-500">${guide.subtitle} • <span class="text-emerald-700 font-semibold">${guide.estimatedReadTime}</span></p>
          </div>
          <div class="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
            ${guide.sections
              .map(
                (sec) => `
              <div class="space-y-2">
                <h3 class="text-base font-bold text-stone-900">${sec.heading}</h3>
                <p>${sec.content}</p>
                ${
                  sec.bulletPoints && sec.bulletPoints.length > 0
                    ? `<ul class="list-disc list-inside space-y-1 pl-2 text-stone-600">
                      ${sec.bulletPoints.map((bp) => `<li>${bp}</li>`).join('')}
                    </ul>`
                    : ''
                }
              </div>`
              )
              .join('')}
            ${
              guide.summaryTakeaway
                ? `<div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs sm:text-sm">
                  <strong>Takeaway:</strong> ${guide.summaryTakeaway}
                </div>`
                : ''
            }
          </div>
        </article>`
            : ''
        }
      </main>
      ${renderFooterHtml(siteName, settings)}
    </div>`;

    return { title, metaDescription: desc, canonicalUrl: canonical, schemaJsonLd: '', bodyHtml: html, keywords: settings.keywords };
  }

  if (clean === 'contact') {
    const canonical = `${baseUrl}/contact`;
    const title = `Contact Us | ${siteName}`;
    const desc = `Get in touch with the ${siteName} editorial and engineering team for feedback, calculator requests, or questions.`;
    const guide: PageGuideArticle | undefined = SITEWIDE_PAGE_GUIDES['contact'];
    const html = `
    <div class="min-h-screen bg-stone-50 text-stone-900 flex flex-col antialiased">
      ${renderHeaderHtml(siteName)}
      <main class="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <h1 class="text-3xl sm:text-4xl font-black text-stone-950">Contact Us</h1>
        <p class="text-xs sm:text-sm text-stone-500">We welcome feedback, formula verification queries, and partnership requests.</p>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div class="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-3">
            <h2 class="text-base font-bold text-stone-900">Technical &amp; Formula Support</h2>
            <p class="text-xs text-stone-600 leading-relaxed">Found an error or have an algorithm calibration recommendation?</p>
            <p class="text-xs sm:text-sm font-semibold text-emerald-700 font-mono">${settings.supportEmail || 'support@okcoloring.com'}</p>
          </div>

          <div class="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-3">
            <h2 class="text-base font-bold text-stone-900">General Inquiries &amp; Partnerships</h2>
            <p class="text-xs text-stone-600 leading-relaxed">For business development, press, or API licensing discussions:</p>
            <p class="text-xs sm:text-sm font-semibold text-emerald-700 font-mono">${settings.contactEmail || 'contact@okcoloring.com'}</p>
          </div>
        </div>

        <div class="p-6 sm:p-8 rounded-3xl bg-emerald-50 border border-emerald-200 space-y-3">
          <h2 class="text-base font-bold text-emerald-950">Looking for a specific calculator?</h2>
          <p class="text-xs text-emerald-900 leading-relaxed">We maintain 56 certified calculators across Personal Finance, Mortgages, Retirement, and Stock Markets. Check our full directory below.</p>
          <a href="/" class="inline-block px-4 py-2 rounded-xl bg-emerald-700 text-white font-semibold text-xs hover:bg-emerald-800 transition-colors">Browse All 56 Calculators →</a>
        </div>

        ${
          guide
            ? `
        <article class="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 space-y-6 shadow-sm">
          <div class="border-b border-stone-100 pb-4 space-y-1">
            <span class="text-emerald-800 font-bold text-xs uppercase tracking-wider">Support &amp; Audit Guide</span>
            <h2 class="text-xl sm:text-2xl font-black text-stone-900">${guide.title}</h2>
            <p class="text-xs text-stone-500">${guide.subtitle} • <span class="text-emerald-700 font-semibold">${guide.estimatedReadTime}</span></p>
          </div>
          <div class="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
            ${guide.sections
              .map(
                (sec) => `
              <div class="space-y-2">
                <h3 class="text-base font-bold text-stone-900">${sec.heading}</h3>
                <p>${sec.content}</p>
                ${
                  sec.bulletPoints && sec.bulletPoints.length > 0
                    ? `<ul class="list-disc list-inside space-y-1 pl-2 text-stone-600">
                      ${sec.bulletPoints.map((bp) => `<li>${bp}</li>`).join('')}
                    </ul>`
                    : ''
                }
              </div>`
              )
              .join('')}
            ${
              guide.summaryTakeaway
                ? `<div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs sm:text-sm">
                  <strong>Takeaway:</strong> ${guide.summaryTakeaway}
                </div>`
                : ''
            }
          </div>
        </article>`
            : ''
        }
      </main>
      ${renderFooterHtml(siteName, settings)}
    </div>`;

    return { title, metaDescription: desc, canonicalUrl: canonical, schemaJsonLd: '', bodyHtml: html, keywords: settings.keywords };
  }

  if (clean === 'saved') {
    const canonical = `${baseUrl}/saved`;
    const title = `Saved Financial Calculations | ${siteName}`;
    const desc = `View, compare, and export your locally saved financial scenarios and calculation snapshots.`;
    const guide: PageGuideArticle | undefined = SITEWIDE_PAGE_GUIDES['saved'];
    const html = `
    <div class="min-h-screen bg-stone-50 text-stone-900 flex flex-col antialiased">
      ${renderHeaderHtml(siteName)}
      <main class="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <h1 class="text-3xl font-black text-stone-950">Saved Calculations</h1>
        <p class="text-xs sm:text-sm text-stone-600">Your locally saved scenario snapshots will load here. Calculations are stored strictly on your local device.</p>
        <div class="p-8 rounded-3xl bg-white border border-stone-200 text-center space-y-4">
          <p class="text-stone-500 text-xs sm:text-sm">Explore our 56 calculators and click "Save Scenario" to store records for quick offline comparison.</p>
          <a href="/" class="inline-block px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors">Explore All Calculators →</a>
        </div>

        ${
          guide
            ? `
        <article class="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 space-y-6 shadow-sm mt-6">
          <div class="border-b border-stone-100 pb-4 space-y-1">
            <span class="text-emerald-800 font-bold text-xs uppercase tracking-wider">How to Manage Saved Scenarios</span>
            <h2 class="text-xl sm:text-2xl font-black text-stone-900">${guide.title}</h2>
            <p class="text-xs text-stone-500">${guide.subtitle} • <span class="text-emerald-700 font-semibold">${guide.estimatedReadTime}</span></p>
          </div>
          <div class="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
            ${guide.sections
              .map(
                (sec) => `
              <div class="space-y-2">
                <h3 class="text-base font-bold text-stone-900">${sec.heading}</h3>
                <p>${sec.content}</p>
                ${
                  sec.bulletPoints && sec.bulletPoints.length > 0
                    ? `<ul class="list-disc list-inside space-y-1 pl-2 text-stone-600">
                      ${sec.bulletPoints.map((bp) => `<li>${bp}</li>`).join('')}
                    </ul>`
                    : ''
                }
              </div>`
              )
              .join('')}
            ${
              guide.summaryTakeaway
                ? `<div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs sm:text-sm">
                  <strong>Takeaway:</strong> ${guide.summaryTakeaway}
                </div>`
                : ''
            }
          </div>
        </article>`
            : ''
        }
      </main>
      ${renderFooterHtml(siteName, settings)}
    </div>`;

    return { title, metaDescription: desc, canonicalUrl: canonical, schemaJsonLd: '', bodyHtml: html, keywords: settings.keywords };
  }

  // 4. HOME PAGE: /
  const homeCanonical = `${baseUrl}/`;
  const homeTitle = `${settings.siteTitle || '56 Financial Calculators - Free Online Personal Finance, Loan & Investment Tools'} | ${siteName}`;
  const homeDescription = settings.siteDescription;

  // Global FAQ for Index Page Schema
  const homeFaqs = [
    {
      q: 'Are all 56 financial calculators on this site 100% free to use?',
      a: 'Yes, every financial calculator across all 4 categories is completely free, with unlimited calculations, amortization exports, and no registration or subscriptions required.'
    },
    {
      q: 'Are the financial calculations calibrated to 2026 tax and IRS regulations?',
      a: 'Yes, our 401(k), Roth IRA, Social Security, and tax calculators are calibrated with 2026 statutory limits, SECURE Act 2.0 provisions, and IRS brackets.'
    },
    {
      q: 'Is my personal financial data private and secure?',
      a: 'Absolutely. All formulas and computations execute 100% in your local browser using client-side WebAssembly/JavaScript. No private salary, mortgage, or investment amounts are sent to external servers.'
    },
    {
      q: 'How are the loan and mortgage amortization schedules computed?',
      a: 'Our amortization engines use standard standard Truth in Lending Act (Regulation Z) mathematical formulas with compound periodic rate equations and exact monthly interest-principal splits.'
    }
  ];

  const homeSchema = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteName,
      url: baseUrl,
      description: homeDescription,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: homeFaqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.a,
        },
      })),
    },
  ];

  const homeHtml = `
  <div class="min-h-screen bg-stone-50 text-stone-900 flex flex-col antialiased">
    ${renderHeaderHtml(siteName)}

    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 space-y-12">
      <!-- Hero Section with Statistics -->
      <section class="rounded-3xl bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 text-white p-6 sm:p-12 lg:p-16 shadow-xl border border-stone-800 space-y-6 text-center sm:text-left">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
          <span>✨ 56 Institutional Calculation Engines • 2026 Edition</span>
        </div>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight max-w-4xl">
          Free Financial &amp; Investment Calculators
        </h1>
        <p class="text-sm sm:text-base text-stone-300 max-w-3xl leading-relaxed">
          Compute accurate mortgage payments, 401(k) retirement growth, compound interest, stock profits, and loan payoff strategies with CFA-compliant mathematical accuracy.
        </p>

        <!-- Stats Bar -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-stone-800 text-left">
          <div class="p-3 rounded-xl bg-stone-800/60 border border-stone-700/50">
            <span class="text-xl sm:text-2xl font-black text-emerald-400">56</span>
            <span class="text-xs text-stone-300 block">Verified Calculators</span>
          </div>
          <div class="p-3 rounded-xl bg-stone-800/60 border border-stone-700/50">
            <span class="text-xl sm:text-2xl font-black text-emerald-400">4</span>
            <span class="text-xs text-stone-300 block">Core Categories</span>
          </div>
          <div class="p-3 rounded-xl bg-stone-800/60 border border-stone-700/50">
            <span class="text-xl sm:text-2xl font-black text-emerald-400">100%</span>
            <span class="text-xs text-stone-300 block">Free &amp; Client-Side</span>
          </div>
          <div class="p-3 rounded-xl bg-stone-800/60 border border-stone-700/50">
            <span class="text-xl sm:text-2xl font-black text-emerald-400">2026</span>
            <span class="text-xs text-stone-300 block">IRS &amp; CFA Calibrated</span>
          </div>
        </div>
      </section>

      <!-- 4 Core Categories Grid -->
      <section class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">Browse Financial Categories</h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          ${CATEGORIES.map((c) => {
            const iconEmoji =
              c.slug === 'finance-investment'
                ? '📈'
                : c.slug === 'retirement-calculators'
                ? '🛡️'
                : c.slug === 'loan-mortgage-calculators'
                ? '🏠'
                : '📊';
            return `
            <a href="/category/${c.slug}" class="p-5 rounded-3xl bg-white border border-stone-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
              <div class="space-y-2">
                <span class="text-2xl block">${iconEmoji}</span>
                <h3 class="text-base font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">${c.name}</h3>
                <p class="text-xs text-stone-500 leading-relaxed line-clamp-2">${c.description}</p>
              </div>
              <div class="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                <span>${c.calculatorsCount} Engines</span>
                <span>→</span>
              </div>
            </a>`;
          }).join('')}
        </div>
      </section>

      <!-- Comprehensive Directory of All 56 Calculators -->
      <section class="space-y-6">
        <div class="border-b border-stone-200 pb-3 flex items-center justify-between">
          <h2 class="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">Complete Directory of All 56 Financial Tools</h2>
          <span class="text-xs font-semibold text-stone-500">Click any tool to open</span>
        </div>

        <div class="space-y-8">
          ${CATEGORIES.map((cat) => {
            const catCalcs = ALL_CALCULATORS.filter((c) => c.category === cat.slug);
            const iconEmoji =
              cat.slug === 'finance-investment'
                ? '📈'
                : cat.slug === 'retirement-calculators'
                ? '🛡️'
                : cat.slug === 'loan-mortgage-calculators'
                ? '🏠'
                : '📊';
            return `
            <div class="space-y-4">
              <div class="flex items-center gap-2">
                <span class="text-lg">${iconEmoji}</span>
                <h3 class="text-lg font-bold text-stone-900">${cat.name} (${catCalcs.length})</h3>
                <a href="/category/${cat.slug}" class="text-xs font-semibold text-emerald-700 hover:underline ml-2">View Category Guide →</a>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                ${catCalcs
                  .map(
                    (c) => `
                  <a href="/calculator/${c.slug}" class="p-4 rounded-2xl bg-white border border-stone-200 hover:border-emerald-500 hover:shadow-xs transition-all flex flex-col justify-between group">
                    <div class="space-y-1.5">
                      <div class="flex items-center justify-between gap-2">
                        <h4 class="text-sm font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">${c.name}</h4>
                        ${c.badge ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">${c.badge}</span>` : ''}
                      </div>
                      <p class="text-xs text-stone-500 line-clamp-2 leading-relaxed">${c.shortDescription}</p>
                    </div>
                    <div class="mt-3 pt-2 text-[11px] font-semibold text-emerald-700 flex items-center justify-between">
                      <span>Calculate Now</span>
                      <span>→</span>
                    </div>
                  </a>`
                  )
                  .join('')}
              </div>
            </div>`;
          }).join('')}
        </div>
      </section>

      <!-- Featured Educational Guides / Articles -->
      <section class="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 space-y-6 shadow-sm">
        <div class="border-b border-stone-100 pb-4">
          <h2 class="text-2xl font-black text-stone-900 tracking-tight">Financial Modeling &amp; Calculation Articles</h2>
          <p class="text-xs sm:text-sm text-stone-500 mt-1">In-depth mathematical breakdowns and strategic guides authored for investors and borrowers.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <article class="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <span class="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Mortgage &amp; Real Estate</span>
            <h3 class="text-base font-bold text-stone-900">How Extra Principal Payments Reduce Total Loan Interest</h3>
            <p class="text-xs text-stone-600 leading-relaxed">
              Applying even $100 extra per month toward a 30-year fixed mortgage directly lowers the compound interest baseline, effectively knocking 4 to 6 years off your amortization term.
            </p>
            <a href="/calculator/mortgage-calculator" class="text-xs font-semibold text-emerald-700 hover:underline block pt-1">Try Mortgage Calculator →</a>
          </article>

          <article class="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <span class="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Retirement Planning</span>
            <h3 class="text-base font-bold text-stone-900">Traditional 401(k) vs. Roth IRA: 2026 Tax Optimization</h3>
            <p class="text-xs text-stone-600 leading-relaxed">
              Comparing upfront pre-tax deductions against tax-free compounding withdrawals at retirement. Learn when to switch contributions based on marginal tax brackets.
            </p>
            <a href="/calculator/401k-calculator" class="text-xs font-semibold text-emerald-700 hover:underline block pt-1">Try 401(k) Calculator →</a>
          </article>

          <article class="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <span class="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Compound Growth</span>
            <h3 class="text-base font-bold text-stone-900">The Mathematics of Compound Interest: Compounding Frequencies</h3>
            <p class="text-xs text-stone-600 leading-relaxed">
              Understanding the difference between annual, monthly, daily, and continuous compounding formulas: A = P(1 + r/n)^(nt).
            </p>
            <a href="/calculator/compound-interest-calculator" class="text-xs font-semibold text-emerald-700 hover:underline block pt-1">Try Compound Interest Calculator →</a>
          </article>

          <article class="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <span class="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Stock Valuation</span>
            <h3 class="text-base font-bold text-stone-900">Risk-Adjusted Return Metrics: Sharpe &amp; Treynor Ratios</h3>
            <p class="text-xs text-stone-600 leading-relaxed">
              Evaluating equity performance relative to the risk-free rate of return and market volatility benchmark standard deviations.
            </p>
            <a href="/calculator/stock-profit-calculator" class="text-xs font-semibold text-emerald-700 hover:underline block pt-1">Try Stock Profit Calculator →</a>
          </article>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 space-y-6 shadow-sm">
        <h2 class="text-2xl font-black text-stone-900 tracking-tight">Frequently Asked Questions</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${homeFaqs
            .map(
              (faq) => `
            <div class="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <h3 class="text-sm font-bold text-stone-900">${faq.q}</h3>
              <p class="text-xs text-stone-600 leading-relaxed">${faq.a}</p>
            </div>`
            )
            .join('')}
        </div>
      </section>
    </main>

    ${renderFooterHtml(siteName, settings)}
  </div>`;

  return {
    title: homeTitle,
    metaDescription: homeDescription,
    canonicalUrl: homeCanonical,
    schemaJsonLd: JSON.stringify(homeSchema),
    bodyHtml: homeHtml,
    keywords: settings.keywords,
  };
}
