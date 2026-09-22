import fs from 'fs';
import path from 'path';
import { ALL_CALCULATORS } from '../src/data/calculatorRegistry';
import { CATEGORIES } from '../src/config/categories';
import { DEFAULT_SITE_SETTINGS } from '../src/types/siteSettings';
import { renderPageToString } from '../src/utils/ssrRenderer';

/**
 * Static Site Generation (SSG) Pre-renderer
 * Generates physical .html files in dist/ for all 56 calculators and category routes.
 */

async function buildStaticPages() {
  const distDir = path.join(process.cwd(), 'dist');
  const indexHtmlPath = path.join(distDir, 'index.html');

  if (!fs.existsSync(indexHtmlPath)) {
    console.warn('dist/index.html not found. Run vite build first.');
    return;
  }

  const template = fs.readFileSync(indexHtmlPath, 'utf-8');
  const settings = DEFAULT_SITE_SETTINGS;

  console.log('Generating pre-rendered static HTML files for 100% crawler visibility...');

  // Helper to process template with SSR content
  function generateHtml(urlPath: string) {
    const ssr = renderPageToString(urlPath, settings);
    let html = template;

    if (ssr.title) {
      html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${ssr.title}</title>`);
    }

    let headSnippet = `\n  <meta name="description" content="${ssr.metaDescription || settings.siteDescription}" />\n  <link rel="canonical" href="${ssr.canonicalUrl}" />\n  <meta property="og:title" content="${ssr.title}" />\n  <meta property="og:description" content="${ssr.metaDescription || settings.siteDescription}" />\n  <meta property="og:url" content="${ssr.canonicalUrl}" />\n  <meta property="og:type" content="website" />\n`;

    if (ssr.keywords) {
      headSnippet += `  <meta name="keywords" content="${ssr.keywords}" />\n`;
    }
    if (ssr.schemaJsonLd) {
      headSnippet += `  <script type="application/ld+json">\n${ssr.schemaJsonLd}\n  </script>\n`;
    }

    if (html.includes('</head>')) {
      html = html.replace('</head>', `${headSnippet}</head>`);
    }

    if (ssr.bodyHtml && html.includes('<div id="root"></div>')) {
      html = html.replace('<div id="root"></div>', `<div id="root">${ssr.bodyHtml}</div>`);
    }

    return html;
  }

  // 1. Generate Category Pages
  for (const cat of CATEGORIES) {
    const catDir = path.join(distDir, 'category', cat.slug);
    fs.mkdirSync(catDir, { recursive: true });
    const html = generateHtml(`/category/${cat.slug}`);
    fs.writeFileSync(path.join(catDir, 'index.html'), html, 'utf-8');
  }

  // 2. Generate Calculator Pages (all 56)
  for (const calc of ALL_CALCULATORS) {
    const calcDir = path.join(distDir, 'calculator', calc.slug);
    fs.mkdirSync(calcDir, { recursive: true });
    const html = generateHtml(`/calculator/${calc.slug}`);
    fs.writeFileSync(path.join(calcDir, 'index.html'), html, 'utf-8');
  }

  // 3. Generate Static Legal & Info Pages
  const staticRoutes = ['privacy', 'terms', 'about', 'contact', 'saved'];
  for (const route of staticRoutes) {
    const routeDir = path.join(distDir, route);
    fs.mkdirSync(routeDir, { recursive: true });
    const html = generateHtml(`/${route}`);
    fs.writeFileSync(path.join(routeDir, 'index.html'), html, 'utf-8');
  }

  console.log(`Successfully generated static HTML pages for all 56 calculators, ${CATEGORIES.length} categories, and legal pages!`);
}

buildStaticPages().catch(console.error);
