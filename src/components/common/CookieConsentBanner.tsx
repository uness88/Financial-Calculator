import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, X, Check, ArrowRight } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';

interface CookieConsentBannerProps {
  onNavigatePrivacy: () => void;
}

const COOKIE_CONSENT_KEY = 'omnicalc_cookie_consent_v1';

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({ onNavigatePrivacy }) => {
  const { settings, fullSiteName } = useSiteSettings();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show if setting is enabled and not yet acknowledged
    if (!settings.enableAdsenseCookieBanner) {
      setIsVisible(false);
      return;
    }

    try {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!consent) {
        // Small delay for smooth entry after initial paint
        const timer = setTimeout(() => setIsVisible(true), 800);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, [settings.enableAdsenseCookieBanner]);

  const handleAccept = () => {
    try {
      localStorage.setItem(
        COOKIE_CONSENT_KEY,
        JSON.stringify({
          status: 'accepted',
          timestamp: Date.now(),
          version: '1.0',
        })
      );
    } catch {}
    setIsVisible(false);
  };

  const handleEssentialOnly = () => {
    try {
      localStorage.setItem(
        COOKIE_CONSENT_KEY,
        JSON.stringify({
          status: 'essential_only',
          timestamp: Date.now(),
          version: '1.0',
        })
      );
    } catch {}
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Cookie and Privacy Consent"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="bg-stone-900/95 backdrop-blur-md text-white border border-stone-700/80 shadow-2xl rounded-2xl p-5 space-y-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Cookie className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white tracking-tight">
                Cookie &amp; Advertising Compliance
              </h4>
              <p className="text-[10px] text-stone-400">Google AdSense &amp; Privacy Standards</p>
            </div>
          </div>
          <button
            onClick={handleEssentialOnly}
            className="text-stone-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
            aria-label="Dismiss cookie notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-stone-300 leading-relaxed">
          {fullSiteName} uses cookies and browser storage for client-side calculation state and compliant Google AdSense monetization. We respect your financial privacy and never store your private input numbers on remote servers.
        </p>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-800">
          <button
            onClick={onNavigatePrivacy}
            className="text-[11px] text-emerald-400 hover:text-emerald-300 underline underline-offset-2 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Privacy Policy</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleEssentialOnly}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium border border-stone-700 transition-colors cursor-pointer"
            >
              Essential Only
            </button>
            <button
              onClick={handleAccept}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Accept All</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
