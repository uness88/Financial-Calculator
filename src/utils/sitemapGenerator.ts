import { ALL_CALCULATORS } from '../data/calculatorRegistry';
import { CATEGORIES } from '../config/categories';

export const DEFAULT_ROBOTS_TXT = `# robots.txt for OKColoring Financial Suite
# Optimized for Googlebot, Bingbot, and Google AdSense Crawlers

User-agent: *
Allow: /

# Google AdSense Crawler Optimization (Mediapartners-Google & Google-Display-Ads-Bot)
# Ensures Google AdSense review bots can inspect content without restrictions
User-agent: Mediapartners-Google
Allow: /

User-agent: Google-Display-Ads-Bot
Allow: /

# Googlebot Full Site Access
User-agent: Googlebot
Allow: /

# Disallow private administration and dashboard paths
Disallow: /*admin*
Disallow: /*dashboard*
Disallow: /*settings*

# Disallow API and internal state routes
Disallow: /api/
Disallow: /assets/private/

# XML Sitemap Location
Sitemap: https://www.okcoloring.com/sitemap.xml
`;

export const DEFAULT_ADS_TXT = `# ads.txt for Google AdSense Publisher Verification
google.com, pub-2702216338646199, DIRECT, f08c47fec0942fa0
`;

/**
 * Generates clean, well-formed XML Sitemap conforming to sitemaps.org schema
 */
export function generateSitemapXml(baseUrl: string = 'https://www.okcoloring.com'): string {
  const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
  const today = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n`;
  xml += `        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n`;

  // 1. Home
  xml += `  <!-- Primary Landing Page -->\n`;
  xml += `  <url>\n`;
  xml += `    <loc>${cleanBaseUrl}/</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `    <changefreq>daily</changefreq>\n`;
  xml += `    <priority>1.0</priority>\n`;
  xml += `  </url>\n\n`;

  // 2. Categories
  xml += `  <!-- Category Hubs -->\n`;
  CATEGORIES.forEach((cat) => {
    xml += `  <url>\n`;
    xml += `    <loc>${cleanBaseUrl}/category/${cat.slug}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.9</priority>\n`;
    xml += `  </url>\n`;
  });
  xml += `\n`;

  // 3. Static Pages
  xml += `  <!-- Sitewide Information & Support Pages -->\n`;
  const staticPages = [
    { path: 'saved', priority: '0.6', freq: 'monthly' },
    { path: 'about', priority: '0.8', freq: 'monthly' },
    { path: 'contact', priority: '0.8', freq: 'monthly' },
    { path: 'privacy', priority: '0.6', freq: 'monthly' },
    { path: 'terms', priority: '0.6', freq: 'monthly' },
  ];
  staticPages.forEach((p) => {
    xml += `  <url>\n`;
    xml += `    <loc>${cleanBaseUrl}/${p.path}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${p.freq}</changefreq>\n`;
    xml += `    <priority>${p.priority}</priority>\n`;
    xml += `  </url>\n`;
  });
  xml += `\n`;

  // 4. Calculators (all 56)
  xml += `  <!-- All 56 Financial Calculators -->\n`;
  ALL_CALCULATORS.forEach((calc) => {
    xml += `  <url>\n`;
    xml += `    <loc>${cleanBaseUrl}/calculator/${calc.slug}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>\n`;
  return xml;
}

/**
 * Validates XML well-formedness using browser DOMParser
 */
export function validateXml(xmlString: string): { valid: boolean; error?: string; urlCount: number } {
  if (typeof DOMParser === 'undefined') {
    return { valid: true, urlCount: 0 };
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, 'application/xml');
    const parserError = doc.querySelector('parsererror');

    if (parserError) {
      return {
        valid: false,
        error: parserError.textContent || 'XML syntax error',
        urlCount: 0,
      };
    }

    const urls = doc.querySelectorAll('url');
    return {
      valid: true,
      urlCount: urls.length,
    };
  } catch (err: any) {
    return {
      valid: false,
      error: err?.message || 'Failed to parse XML string',
      urlCount: 0,
    };
  }
}

/**
 * Utility to download raw text/xml/txt files client-side
 */
export function downloadFile(filename: string, content: string, mimeType: string = 'text/plain') {
  if (typeof document === 'undefined') return;

  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
