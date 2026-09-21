import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), 'data');
const SETTINGS_FILE = path.join(DATA_DIR, 'site-settings.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Support JSON parsing in requests
app.use(express.json({ limit: '10mb' }));

// Helper to read current settings from file or defaults
function getStoredSettings(): Record<string, any> {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const content = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Failed to read settings file:', err);
  }
  return {};
}

// Helper to save settings to disk and sync static files
function saveSettings(settings: Record<string, any>) {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');

    // Also sync public/ files if available
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    if (settings.customAdsTxt) {
      fs.writeFileSync(path.join(publicDir, 'ads.txt'), settings.customAdsTxt, 'utf-8');
    }
    if (settings.customRobotsTxt) {
      fs.writeFileSync(path.join(publicDir, 'robots.txt'), settings.customRobotsTxt, 'utf-8');
    }
    if (settings.customSitemapXml) {
      fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), settings.customSitemapXml, 'utf-8');
    }
  } catch (err) {
    console.error('Failed to write settings/files to disk:', err);
  }
}

// 1. DYNAMIC ROUTE: /ads.txt
app.get('/ads.txt', (req, res) => {
  const settings = getStoredSettings();
  const adsTxt =
    settings.customAdsTxt ||
    `# ads.txt for Google AdSense Publisher Verification\ngoogle.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0\n`;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.send(adsTxt);
});

// 2. DYNAMIC ROUTE: /robots.txt
app.get('/robots.txt', (req, res) => {
  const settings = getStoredSettings();
  const robotsTxt =
    settings.customRobotsTxt ||
    `# robots.txt\nUser-agent: *\nAllow: /\n\nUser-agent: Mediapartners-Google\nAllow: /\n\nUser-agent: Google-Display-Ads-Bot\nAllow: /\n\nDisallow: /*admin*\nDisallow: /*dashboard*\nDisallow: /*settings*\n\nSitemap: https://omnicalc.pro/sitemap.xml\n`;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.send(robotsTxt);
});

// 3. DYNAMIC ROUTE: /sitemap.xml
app.get('/sitemap.xml', (req, res) => {
  const settings = getStoredSettings();
  let sitemapXml = settings.customSitemapXml;

  if (!sitemapXml) {
    const sitemapFile = path.join(process.cwd(), 'public', 'sitemap.xml');
    if (fs.existsSync(sitemapFile)) {
      sitemapXml = fs.readFileSync(sitemapFile, 'utf-8');
    } else {
      sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>https://omnicalc.pro/</loc>\n  </url>\n</urlset>`;
    }
  }

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.send(sitemapXml);
});

// 4. API ROUTE: GET /api/settings
app.get('/api/settings', (req, res) => {
  const settings = getStoredSettings();
  res.json({ success: true, settings });
});

// 5. API ROUTE: POST /api/settings
app.post('/api/settings', (req, res) => {
  const newSettings = req.body;
  if (!newSettings || typeof newSettings !== 'object') {
    return res.status(400).json({ success: false, error: 'Invalid settings payload' });
  }

  const current = getStoredSettings();
  const merged = { ...current, ...newSettings, lastUpdated: Date.now() };
  saveSettings(merged);

  res.json({ success: true, settings: merged });
});

// Helper to inject custom <head> and AdSense code into raw HTML
function injectHeadIntoHtml(html: string, settings: Record<string, any>): string {
  let headSnippet = '';

  // AdSense script if auto ads enabled
  if (settings.adsenseAutoAdsEnabled && settings.adsensePublisherId) {
    const pubId = settings.adsensePublisherId.trim().startsWith('ca-pub-')
      ? settings.adsensePublisherId.trim()
      : `ca-pub-${settings.adsensePublisherId.trim().replace(/^pub-/, '')}`;

    headSnippet += `\n<!-- Google AdSense Auto-Ads Tag -->\n<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}" crossorigin="anonymous"></script>\n`;
  }

  // Google Search Console / Bing meta verification
  if (settings.googleSiteVerification) {
    headSnippet += `\n<meta name="google-site-verification" content="${settings.googleSiteVerification}" />\n`;
  }
  if (settings.bingSiteVerification) {
    headSnippet += `\n<meta name="msvalidate.01" content="${settings.bingSiteVerification}" />\n`;
  }

  // Custom user head code
  if (settings.customHeadCode && settings.customHeadCode.trim()) {
    headSnippet += `\n<!-- Injected Custom Head Code -->\n${settings.customHeadCode}\n`;
  }

  if (headSnippet && html.includes('</head>')) {
    return html.replace('</head>', `${headSnippet}\n</head>`);
  }

  return html;
}

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });

    app.use(vite.middlewares);

    // Development HTML serving with custom head injection
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const indexHtmlPath = path.join(process.cwd(), 'index.html');
        let template = fs.readFileSync(indexHtmlPath, 'utf-8');
        template = await vite.transformIndexHtml(url, template);

        const settings = getStoredSettings();
        const finalHtml = injectHeadIntoHtml(template, settings);

        res.status(200).set({ 'Content-Type': 'text/html' }).end(finalHtml);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, { index: false }));

    app.get('*', (req, res) => {
      try {
        const indexHtmlPath = path.join(distPath, 'index.html');
        let html = fs.readFileSync(indexHtmlPath, 'utf-8');
        const settings = getStoredSettings();
        const finalHtml = injectHeadIntoHtml(html, settings);

        res.status(200).set({ 'Content-Type': 'text/html' }).send(finalHtml);
      } catch (err) {
        res.sendFile(path.join(distPath, 'index.html'));
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
