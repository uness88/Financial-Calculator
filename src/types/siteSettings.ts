export type LogoType = 'icon' | 'image' | 'emoji' | 'svg';

export interface SiteSettings {
  // Brand & Identity
  siteName: string;
  siteNameSuffix: string;
  siteTagline: string;
  siteTitle: string;
  siteDescription: string;

  // Contact & Communications
  supportEmail: string;
  contactEmail: string;

  // Logo Configuration
  logoType: LogoType;
  logoIconName: string;
  logoBgTheme: 'emerald' | 'blue' | 'indigo' | 'violet' | 'amber' | 'rose' | 'slate' | 'dark';
  logoImageUrl: string;
  logoEmoji: string;
  logoSvgCode: string;

  // Custom <head> Code Injection (Analytics, Custom Meta, Tracking, CSS, Scripts)
  customHeadCode: string;

  // Custom Footer & Copyright
  customFooterNote: string;

  // Security & Privacy Controls
  adminSecretPath: string;
  enablePinProtection: boolean;
  adminSecurityPin: string;

  // Advanced SEO & Webmaster Configuration
  canonicalBaseUrl: string;
  googleSiteVerification: string;
  bingSiteVerification: string;
  defaultOgImage: string;
  twitterHandle: string;
  keywords: string;
  schemaOrgType: 'FinancialService' | 'Organization' | 'WebApplication';

  // Google AdSense & Monetization Settings
  adsensePublisherId: string;
  adsenseAutoAdsEnabled: boolean;
  adsenseAccountStatus: 'ready' | 'pending' | 'not_connected';
  customAdsTxt: string;
  enableAdsenseCookieBanner: boolean;

  // Editable Files (sitemap.xml and robots.txt)
  customRobotsTxt: string;
  customSitemapXml: string;

  // Metadata
  lastUpdated: number;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: 'OmniCalc',
  siteNameSuffix: 'Pro',
  siteTagline: '56 Certified Financial Calculators',
  siteTitle: 'Financial Calculators - Free Online Finance, Loan & Investment Tools',
  siteDescription:
    'Free financial calculators for loans, mortgages, investments, retirement, stocks, savings, taxes, and personal finance. Calculate payments, returns, growth, and more.',
  supportEmail: 'support@omnicalc.pro',
  contactEmail: 'support@omnicalc.pro',
  logoType: 'icon',
  logoIconName: 'Calculator',
  logoBgTheme: 'emerald',
  logoImageUrl: '',
  logoEmoji: '🧮',
  logoSvgCode: '',
  customHeadCode: '<!-- Example: Add your Google Analytics, Meta Pixel, or custom CSS here -->\n',
  customFooterNote: '© 2026 OmniCalc Pro Financial Suite. All rights reserved.',
  adminSecretPath: 'admin-settings',
  enablePinProtection: true,
  adminSecurityPin: '1234',

  // SEO & Webmaster defaults
  canonicalBaseUrl: 'https://omnicalc.pro',
  googleSiteVerification: '',
  bingSiteVerification: '',
  defaultOgImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&h=630&q=80',
  twitterHandle: '@OmniCalcPro',
  keywords: 'financial calculators, mortgage calculator, 401k calculator, retirement calculator, investment calculators, loan amortization, stock profit calculator',
  schemaOrgType: 'FinancialService',

  // AdSense defaults
  adsensePublisherId: '',
  adsenseAutoAdsEnabled: false,
  adsenseAccountStatus: 'not_connected',
  customAdsTxt: `google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0\n`,
  enableAdsenseCookieBanner: true,

  // Editable files defaults
  customRobotsTxt: `# robots.txt for Financial Calculator Suite
# Optimized for Googlebot, Bingbot, and Google AdSense Crawlers

User-agent: *
Allow: /

# Google AdSense Crawler Optimization (Mediapartners-Google & Google-Display-Ads-Bot)
# Ensures Google AdSense review bots can inspect content without restrictions
User-agent: Mediapartners-Google
Allow: /

User-agent: Google-Display-Ads-Bot
Allow: /

# Disallow private administration and dashboard paths
Disallow: /*admin*
Disallow: /*dashboard*
Disallow: /*settings*
Disallow: /#admin*
Disallow: /#dashboard*
Disallow: /#settings*

# Disallow API and internal state routes
Disallow: /api/
Disallow: /assets/private/

# XML Sitemap Location
Sitemap: https://omnicalc.pro/sitemap.xml
`,
  customSitemapXml: '',
  lastUpdated: Date.now(),
};
