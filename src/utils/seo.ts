/**
 * Dynamic SEO, OpenGraph, Twitter Cards, Webmaster Verification, and Schema.org JSON-LD Injector
 * 100% compliant with Google Search, Googlebot, and Google AdSense crawl requirements
 */

import { CalculatorDefinition } from '../types/calculator';
import { SiteSettings } from '../types/siteSettings';

export interface SEOMetadata {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article';
  siteName?: string;
  noIndex?: boolean;
  ogImage?: string;
  keywords?: string;
  schema?: Record<string, any> | Record<string, any>[];
}

function getStoredSettings(): Partial<SiteSettings> {
  try {
    const stored = localStorage.getItem('omnicalc_site_settings_v2');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {}
  return {};
}

export function updateDocumentSEO(seoOrCalc: SEOMetadata | CalculatorDefinition, dynamicSiteName?: string) {
  if (typeof document === 'undefined') return;

  const stored = getStoredSettings();
  const currentSiteName =
    dynamicSiteName ||
    (stored.siteName ? (stored.siteNameSuffix ? `${stored.siteName} ${stored.siteNameSuffix}` : stored.siteName) : 'OmniCalc Pro');

  let title = '';
  let description = '';
  let canonicalUrl = '';
  let ogType: 'website' | 'article' = 'website';
  let noIndex = false;
  let ogImage = stored.defaultOgImage || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&h=630&q=80';
  let keywords = stored.keywords || '';
  let schema: any = null;

  const baseUrl = stored.canonicalBaseUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://omnicalc.pro');

  if ('slug' in seoOrCalc && 'h1Title' in seoOrCalc) {
    // It is a CalculatorDefinition
    const calc = seoOrCalc as CalculatorDefinition;
    title = calc.seoTitle || `${calc.name} - ${currentSiteName}`;
    description = calc.metaDescription || calc.shortDescription;
    canonicalUrl = `${baseUrl}/#calculator/${calc.slug}`;
    ogType = 'website';
    noIndex = false;
    keywords = calc.keywords ? calc.keywords.join(', ') : keywords;

    // Build rich Schema.org WebApplication & FAQPage JSON-LD
    const schemas: any[] = [
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: calc.name,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        description: calc.shortDescription,
        url: canonicalUrl,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        provider: {
          '@type': 'FinancialService',
          name: currentSiteName,
          url: baseUrl,
        },
      },
    ];

    if (calc.faqs && calc.faqs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: calc.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      });
    }

    schema = schemas;
  } else {
    // Standard SEOMetadata
    const seo = seoOrCalc as SEOMetadata;
    title = seo.title;
    description = seo.description;
    canonicalUrl = seo.canonicalUrl || (typeof window !== 'undefined' ? window.location.href : baseUrl);
    ogType = seo.ogType || 'website';
    noIndex = Boolean(seo.noIndex);
    ogImage = seo.ogImage || ogImage;
    keywords = seo.keywords || keywords;
    schema = seo.schema;
  }

  // 1. Update Title
  document.title = title;

  // 2. Helper to set/update meta tags
  const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
    if (!content) return;
    let el = document.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // Standard Meta
  setMeta('name', 'description', description);
  if (keywords) setMeta('name', 'keywords', keywords);

  // OpenGraph Tags
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', description);
  setMeta('property', 'og:type', ogType);
  setMeta('property', 'og:site_name', currentSiteName);
  setMeta('property', 'og:url', canonicalUrl);
  if (ogImage) {
    setMeta('property', 'og:image', ogImage);
    setMeta('property', 'og:image:width', '1200');
    setMeta('property', 'og:image:height', '630');
    setMeta('property', 'og:image:alt', `${currentSiteName} - ${title}`);
  }

  // Twitter Card Tags
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', description);
  if (stored.twitterHandle) {
    setMeta('name', 'twitter:site', stored.twitterHandle);
    setMeta('name', 'twitter:creator', stored.twitterHandle);
  }
  if (ogImage) {
    setMeta('name', 'twitter:image', ogImage);
  }

  // Google Search Console & Bing Webmaster Verification
  if (stored.googleSiteVerification) {
    setMeta('name', 'google-site-verification', stored.googleSiteVerification);
  }
  if (stored.bingSiteVerification) {
    setMeta('name', 'msvalidate.01', stored.bingSiteVerification);
  }

  // Robots meta tag for privacy/noindex
  let robotsMeta = document.querySelector('meta[name="robots"]');
  if (noIndex) {
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute('content', 'noindex, nofollow, noarchive');
  } else {
    if (robotsMeta) {
      robotsMeta.setAttribute('content', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    }
  }

  // 3. Update Canonical link
  if (canonicalUrl && !noIndex) {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);
  } else if (noIndex) {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.remove();
    }
  }

  // 4. Inject JSON-LD Schema
  let schemaScript = document.getElementById('dynamic-json-ld');
  if (schema && !noIndex) {
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'dynamic-json-ld';
      schemaScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify(schema);
  } else if (schemaScript) {
    schemaScript.remove();
  }
}
