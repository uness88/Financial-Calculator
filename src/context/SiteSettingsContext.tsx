import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SiteSettings, DEFAULT_SITE_SETTINGS } from '../types/siteSettings';
import { injectCustomHeadCode } from '../utils/headInjector';

const SITE_SETTINGS_STORAGE_KEY = 'omnicalc_site_settings_v2';

interface SiteSettingsContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  resetSettings: () => void;
  exportSettings: () => string;
  importSettings: (jsonString: string) => { success: boolean; error?: string };
  headInjectionStatus: { success: boolean; count: number; error?: string };
  fullSiteName: string;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const stored = localStorage.getItem(SITE_SETTINGS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_SITE_SETTINGS, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to load stored site settings', e);
    }
    return DEFAULT_SITE_SETTINGS;
  });

  const [headInjectionStatus, setHeadInjectionStatus] = useState<{
    success: boolean;
    count: number;
    error?: string;
  }>({ success: true, count: 0 });

  // 1. On initial load, try to fetch fresh settings from backend server (/api/settings)
  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && data.settings && Object.keys(data.settings).length > 0) {
          setSettings((prev) => {
            const merged = { ...DEFAULT_SITE_SETTINGS, ...prev, ...data.settings };
            try {
              localStorage.setItem(SITE_SETTINGS_STORAGE_KEY, JSON.stringify(merged));
            } catch {}
            return merged;
          });
        }
      })
      .catch((err) => {
        // In client-only fallback, silent catch
        console.debug('Loaded settings from local storage cache');
      });

    // Cross-tab real-time sync: Listen for storage changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === SITE_SETTINGS_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setSettings((prev) => ({ ...DEFAULT_SITE_SETTINGS, ...prev, ...parsed }));
        } catch (err) {
          console.warn('Failed to parse synchronized settings', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 2. Sync custom head code & Google AdSense Auto-Ads whenever settings change
  useEffect(() => {
    let combinedHeadCode = settings.customHeadCode || '';

    // If AdSense Auto Ads is enabled and a publisher ID is present, inject Google AdSense script
    if (settings.adsenseAutoAdsEnabled && settings.adsensePublisherId.trim()) {
      const pubId = settings.adsensePublisherId.trim().startsWith('ca-pub-')
        ? settings.adsensePublisherId.trim()
        : `ca-pub-${settings.adsensePublisherId.trim().replace(/^pub-/, '')}`;

      const adsenseScript = `\n<!-- Google AdSense Auto-Ads Script -->\n<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}" crossorigin="anonymous"></script>\n`;
      if (!combinedHeadCode.includes('pagead2.googlesyndication.com')) {
        combinedHeadCode += adsenseScript;
      }
    }

    const res = injectCustomHeadCode(combinedHeadCode);
    setHeadInjectionStatus(res);
  }, [settings.customHeadCode, settings.adsenseAutoAdsEnabled, settings.adsensePublisherId]);

  // 3. Save to localStorage AND synchronize to server API (/api/settings) so /ads.txt, /robots.txt, and /sitemap.xml update in real-time
  const updateSettings = useCallback(async (partial: Partial<SiteSettings>) => {
    const updated: SiteSettings = {
      ...settings,
      ...partial,
      lastUpdated: Date.now(),
    };

    setSettings(updated);

    try {
      localStorage.setItem(SITE_SETTINGS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to persist site settings to LocalStorage', e);
    }

    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (e) {
      console.debug('Saved locally; server sync deferred');
    }
  }, [settings]);

  const resetSettings = useCallback(async () => {
    setSettings(DEFAULT_SITE_SETTINGS);
    try {
      localStorage.setItem(SITE_SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_SITE_SETTINGS));
    } catch (e) {
      console.warn('Failed to reset site settings in LocalStorage', e);
    }

    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(DEFAULT_SITE_SETTINGS),
      });
    } catch {}
  }, []);

  const exportSettings = useCallback(() => {
    return JSON.stringify(settings, null, 2);
  }, [settings]);

  const importSettings = useCallback((jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') {
        return { success: false, error: 'Invalid JSON format' };
      }
      const merged: SiteSettings = {
        ...DEFAULT_SITE_SETTINGS,
        ...parsed,
        lastUpdated: Date.now(),
      };
      setSettings(merged);
      localStorage.setItem(SITE_SETTINGS_STORAGE_KEY, JSON.stringify(merged));

      fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merged),
      }).catch(() => {});

      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Failed to parse JSON' };
    }
  }, []);

  const fullSiteName = settings.siteNameSuffix
    ? `${settings.siteName} ${settings.siteNameSuffix}`
    : settings.siteName;

  return (
    <SiteSettingsContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
        exportSettings,
        importSettings,
        headInjectionStatus,
        fullSiteName,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
};

export function useSiteSettings(): SiteSettingsContextType {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
}
