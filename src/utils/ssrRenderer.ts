import { ALL_CALCULATORS, getCalculatorBySlug } from '../data/calculatorRegistry';
import { CATEGORIES, getCategoryBySlug } from '../config/categories';
import { CATEGORY_GUIDES, SITEWIDE_PAGE_GUIDES, PageGuideArticle } from '../data/pageGuides';
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
      const howToArticle: PageGuideArticle | undefined = SITEWIDE_PAGE_GUIDES[calc.slug];

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
        <header class="bg-white border-b border-stone-200 py-3.5 px-4 sm:px-8 shadow-xs">
          <div class="max-w-7xl mx-auto flex items-center justify-between">
            <a href="/" class="flex items-center gap-2 text-stone-900 font-bold text-lg">
              <span class="p-2 bg-emerald-600 text-white rounded-xl">🧮</span>
              <span>${siteName}</span>
            </a>
            <nav class="hidden md:flex items-center gap-4 text-xs font-medium text-stone-600">
              <a href="/" class="hover:text-stone-900">All Tools</a>
              <a href="/category/finance-investment" class="hover:text-stone-900">Personal Finance</a>
              <a href="/category/retirement-calculators" class="hover:text-stone-900">Retirement</a>
              <a href="/category/loan-mortgage-calculators" class="hover:text-stone-900">Mortgages &amp; Loans</a>
              <a href="/category/stock-calculators" class="hover:text-stone-900">Stocks &amp; Investing</a>
            </nav>
          </div>
        </header>

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

          <!-- Mathematical Formula & Methodology Breakdown -->
          ${
            calc.formula
              ? `
          <section class="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 space-y-6 shadow-sm">
            <h2 class="text-xl sm:text-2xl font-black text-stone-900">Mathematical Formula &amp; Methodology</h2>
            ${
              calc.formula.formula
                ? `
            <div class="p-4 sm:p-6 rounded-2xl bg-stone-900 text-emerald-400 font-mono text-xs sm:text-sm border border-stone-800 overflow-x-auto">
              <code>${calc.formula.formula}</code>
            </div>`
                : ''
            }
            ${
              calc.formula.explanation
                ? `
            <div class="prose prose-stone max-w-none text-xs sm:text-sm text-stone-700 leading-relaxed space-y-3">
              <p>${calc.formula.explanation}</p>
            </div>`
                : ''
            }
            ${
              calc.formula.variables && calc.formula.variables.length > 0
                ? `
            <div class="space-y-2">
              <h3 class="text-sm font-bold text-stone-900">Variable Definitions:</h3>
              <ul class="list-disc list-inside space-y-1 text-xs sm:text-sm text-stone-600">
                ${calc.formula.variables.map((v) => `<li><strong>${v.symbol}</strong>: ${v.name} — ${v.description}</li>`).join('')}
              </ul>
            </div>`
                : ''
            }
          </section>`
              : ''
          }

          <!-- In-depth Editorial Guide / How-To Article (1,000+ words SEO authority) -->
          ${
            howToArticle
              ? `
          <article class="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 space-y-8 shadow-sm">
            <div class="border-b border-stone-100 pb-4">
              <h2 class="text-xl sm:text-2xl lg:text-3xl font-black text-stone-900 tracking-tight">${howToArticle.title}</h2>
              <p class="text-xs sm:text-sm text-stone-500 mt-1">${howToArticle.subtitle || ''} • <span class="text-emerald-700 font-semibold">${howToArticle.estimatedReadTime || '5 min read'}</span></p>
            </div>

            <div class="space-y-6 text-stone-700 leading-relaxed text-xs sm:text-sm">
              ${howToArticle.sections
                .map(
                  (sec) => `
                <div class="space-y-3">
                  <h3 class="text-base sm:text-lg font-bold text-stone-900">${sec.heading}</h3>
                  <p class="leading-relaxed">${sec.content}</p>
                  ${
                    sec.bulletPoints && sec.bulletPoints.length > 0
                      ? `<ul class="list-disc list-inside space-y-1.5 pl-2 text-stone-600 font-medium">
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
          ${
            calc.faqs && calc.faqs.length > 0
              ? `
          <section class="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 space-y-6 shadow-sm">
            <h2 class="text-xl sm:text-2xl font-black text-stone-900">Frequently Asked Questions</h2>
            <div class="space-y-4">
              ${calc.faqs
                .map(
                  (faq) => `
                <div class="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <h3 class="text-sm sm:text-base font-bold text-stone-900">${faq.question}</h3>
                  <p class="text-xs sm:text-sm text-stone-600 leading-relaxed">${faq.answer}</p>
                </div>`
                )
                .join('')}
            </div>
          </section>`
              : ''
          }
        </main>

        <footer class="bg-stone-900 text-stone-300 border-t border-stone-800 mt-16 pt-12 pb-8 px-4 sm:px-8">
          <div class="max-w-7xl mx-auto space-y-6">
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
              <p>${settings.customFooterNote || `© 2026 ${siteName}. All rights reserved.`}</p>
              <div class="flex items-center gap-4">
                <a href="/privacy" class="hover:text-white">Privacy Policy</a>
                <a href="/terms" class="hover:text-white">Terms of Use</a>
                <a href="/about" class="hover:text-white">About Us</a>
                <a href="/contact" class="hover:text-white">Contact</a>
              </div>
            </div>
          </div>
        </footer>
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
        <header class="bg-white border-b border-stone-200 py-3.5 px-4 sm:px-8 shadow-xs">
          <div class="max-w-7xl mx-auto flex items-center justify-between">
            <a href="/" class="flex items-center gap-2 text-stone-900 font-bold text-lg">
              <span class="p-2 bg-emerald-600 text-white rounded-xl">🧮</span>
              <span>${siteName}</span>
            </a>
          </div>
        </header>

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

  // 3. HOME PAGE: /
  const homeCanonical = `${baseUrl}/`;
  const homeTitle = `${settings.siteTitle || 'Financial Calculators - Free Online Finance & Investment Tools'} | ${siteName}`;
  const homeDescription = settings.siteDescription;

  const homeHtml = `
  <div class="min-h-screen bg-stone-50 text-stone-900 flex flex-col antialiased">
    <header class="bg-white border-b border-stone-200 py-3.5 px-4 sm:px-8 shadow-xs">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <a href="/" class="flex items-center gap-2 text-stone-900 font-bold text-lg">
          <span class="p-2 bg-emerald-600 text-white rounded-xl">🧮</span>
          <span>${siteName}</span>
        </a>
      </div>
    </header>

    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-10">
      <section class="rounded-3xl bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 text-white p-6 sm:p-10 lg:p-12 shadow-xl border border-stone-800 space-y-4">
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
          56 Certified Financial Calculators
        </h1>
        <p class="text-sm sm:text-base text-stone-300 max-w-2xl leading-relaxed">${settings.siteDescription}</p>
      </section>

      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        ${CATEGORIES.map(
          (c) => `
          <a href="/category/${c.slug}" class="p-5 rounded-2xl bg-white border border-stone-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all block">
            <h2 class="text-sm font-bold text-stone-900 mb-1">${c.name}</h2>
            <p class="text-xs text-stone-500 line-clamp-2">${c.description}</p>
            <div class="mt-3 text-xs font-semibold text-emerald-700">${c.calculatorsCount} Calculators →</div>
          </a>`
        ).join('')}
      </section>

      <section class="space-y-4">
        <h2 class="text-xl font-bold text-stone-900">All 56 Financial Models &amp; Calculators</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${ALL_CALCULATORS.map(
            (c) => `
            <a href="/calculator/${c.slug}" class="p-4 rounded-xl bg-white border border-stone-200 hover:border-emerald-500 shadow-2xs transition-all block">
              <h3 class="text-sm font-bold text-stone-900">${c.name}</h3>
              <p class="text-xs text-stone-500 mt-1 line-clamp-2">${c.shortDescription}</p>
            </a>`
          ).join('')}
        </div>
      </section>
    </main>
  </div>`;

  return {
    title: homeTitle,
    metaDescription: homeDescription,
    canonicalUrl: homeCanonical,
    schemaJsonLd: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteName,
      url: baseUrl,
      description: homeDescription,
    }),
    bodyHtml: homeHtml,
    keywords: settings.keywords,
  };
}
