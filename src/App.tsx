import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { SearchModal } from './components/layout/SearchModal';
import { CookieConsentBanner } from './components/common/CookieConsentBanner';
import { HomePage } from './components/pages/HomePage';
import { CategoryPage } from './components/pages/CategoryPage';
import { CalculatorPage } from './components/pages/CalculatorPage';
import { SavedScenariosPage, SavedScenario } from './components/pages/SavedScenariosPage';
import { PrivacyPolicyPage } from './components/pages/PrivacyPolicyPage';
import { TermsOfUsePage } from './components/pages/TermsOfUsePage';
import { AboutUsPage } from './components/pages/AboutUsPage';
import { ContactUsPage } from './components/pages/ContactUsPage';
import { AdminDashboardPage } from './components/pages/AdminDashboardPage';
import { getCalculatorBySlug } from './data/calculatorRegistry';
import { getCategoryBySlug } from './config/categories';
import { CalculationOutput } from './types/calculator';
import { SiteSettingsProvider } from './context/SiteSettingsContext';

export type AppView =
  | { type: 'home' }
  | { type: 'category'; categorySlug: string }
  | { type: 'calculator'; slug: string }
  | { type: 'saved' }
  | { type: 'privacy' }
  | { type: 'terms' }
  | { type: 'about' }
  | { type: 'contact' }
  | { type: 'admin' };

const SAVED_SCENARIOS_STORAGE_KEY = 'omnicalc_saved_scenarios_v1';

function InnerApp() {
  const [currentView, setCurrentView] = useState<AppView>({ type: 'home' });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>(() => {
    try {
      const stored = localStorage.getItem(SAVED_SCENARIOS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync route with URL hash on load and popstate
  useEffect(() => {
    const parseHash = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (!hash) {
        setCurrentView({ type: 'home' });
        return;
      }

      if (hash.startsWith('calculator/')) {
        const slug = hash.replace('calculator/', '');
        if (getCalculatorBySlug(slug)) {
          setCurrentView({ type: 'calculator', slug });
          return;
        }
      }

      if (hash.startsWith('category/')) {
        const catSlug = hash.replace('category/', '');
        if (getCategoryBySlug(catSlug)) {
          setCurrentView({ type: 'category', categorySlug: catSlug });
          return;
        }
      }

      if (hash === 'saved') {
        setCurrentView({ type: 'saved' });
        return;
      }

      if (hash === 'privacy') {
        setCurrentView({ type: 'privacy' });
        return;
      }

      if (hash === 'terms') {
        setCurrentView({ type: 'terms' });
        return;
      }

      if (hash === 'about') {
        setCurrentView({ type: 'about' });
        return;
      }

      if (hash === 'contact') {
        setCurrentView({ type: 'contact' });
        return;
      }

      if (hash === 'admin' || hash === 'admin-settings' || hash === 'dashboard' || hash === 'private-admin') {
        setCurrentView({ type: 'admin' });
        return;
      }

      // Default
      setCurrentView({ type: 'home' });
    };

    parseHash();
    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  }, []);

  // Global keyboard shortcut: Ctrl+Shift+A or Cmd+Shift+A opens Admin Dashboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        navigateToAdmin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Navigation helpers that update URL hash & scroll to top
  const navigateToHome = () => {
    window.location.hash = '';
    setCurrentView({ type: 'home' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCategory = (categorySlug: string) => {
    window.location.hash = `category/${categorySlug}`;
    setCurrentView({ type: 'category', categorySlug });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCalculator = (slug: string) => {
    window.location.hash = `calculator/${slug}`;
    setCurrentView({ type: 'calculator', slug });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToSaved = () => {
    window.location.hash = 'saved';
    setCurrentView({ type: 'saved' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToPrivacy = () => {
    window.location.hash = 'privacy';
    setCurrentView({ type: 'privacy' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToTerms = () => {
    window.location.hash = 'terms';
    setCurrentView({ type: 'terms' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAbout = () => {
    window.location.hash = 'about';
    setCurrentView({ type: 'about' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToContact = () => {
    window.location.hash = 'contact';
    setCurrentView({ type: 'contact' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAdmin = () => {
    window.location.hash = 'admin-settings';
    setCurrentView({ type: 'admin' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Saved scenarios persistence
  const handleSaveScenario = (
    calcSlug: string,
    calcName: string,
    inputs: Record<string, any>,
    output: CalculationOutput
  ) => {
    const newScenario: SavedScenario = {
      id: `${calcSlug}_${Date.now()}`,
      calcSlug,
      calcName,
      timestamp: Date.now(),
      inputs,
      primaryResult: {
        label: output.primaryResult.label,
        value: output.primaryResult.value,
        format: output.primaryResult.format,
      },
    };

    setSavedScenarios((prev) => {
      // Prevent duplicate identical saves
      const filtered = prev.filter((s) => s.calcSlug !== calcSlug);
      const updated = [newScenario, ...filtered].slice(0, 30);
      try {
        localStorage.setItem(SAVED_SCENARIOS_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn('LocalStorage save failed', err);
      }
      return updated;
    });
  };

  const handleDeleteScenario = (id: string) => {
    setSavedScenarios((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      try {
        localStorage.setItem(SAVED_SCENARIOS_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn('LocalStorage save failed', err);
      }
      return updated;
    });
  };

  const handleClearAllScenarios = () => {
    setSavedScenarios([]);
    try {
      localStorage.removeItem(SAVED_SCENARIOS_STORAGE_KEY);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col antialiased selection:bg-emerald-600 selection:text-white">
      {/* Header Bar */}
      <Header
        currentView={currentView}
        onNavigateHome={navigateToHome}
        onNavigateCategory={navigateToCategory}
        onNavigateCalculator={navigateToCalculator}
        onNavigateSaved={navigateToSaved}
        onNavigateAbout={navigateToAbout}
        onNavigateContact={navigateToContact}
        onNavigatePrivacy={navigateToPrivacy}
        onNavigateTerms={navigateToTerms}
        onOpenSearch={() => setIsSearchOpen(true)}
        savedCount={savedScenarios.length}
      />

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {currentView.type === 'home' && (
          <HomePage
            onSelectCalculator={navigateToCalculator}
            onSelectCategory={navigateToCategory}
          />
        )}

        {currentView.type === 'category' && (
          (() => {
            const cat = getCategoryBySlug(currentView.categorySlug);
            return cat ? (
              <CategoryPage
                category={cat}
                onSelectCalculator={navigateToCalculator}
                onSelectCategory={navigateToCategory}
                onNavigateHome={navigateToHome}
              />
            ) : (
              <HomePage
                onSelectCalculator={navigateToCalculator}
                onSelectCategory={navigateToCategory}
              />
            );
          })()
        )}

        {currentView.type === 'calculator' && (
          (() => {
            const calc = getCalculatorBySlug(currentView.slug);
            return calc ? (
              <CalculatorPage
                calculator={calc}
                onNavigateHome={navigateToHome}
                onNavigateCategory={navigateToCategory}
                onSelectCalculator={navigateToCalculator}
                onSaveScenario={handleSaveScenario}
                isSaved={savedScenarios.some((s) => s.calcSlug === calc.slug)}
              />
            ) : (
              <HomePage
                onSelectCalculator={navigateToCalculator}
                onSelectCategory={navigateToCategory}
              />
            );
          })()
        )}

        {currentView.type === 'saved' && (
          <SavedScenariosPage
            scenarios={savedScenarios}
            onSelectCalculator={navigateToCalculator}
            onDeleteScenario={handleDeleteScenario}
            onClearAll={handleClearAllScenarios}
            onNavigateHome={navigateToHome}
          />
        )}

        {currentView.type === 'privacy' && (
          <PrivacyPolicyPage
            onNavigateHome={navigateToHome}
            onNavigateContact={navigateToContact}
          />
        )}

        {currentView.type === 'terms' && (
          <TermsOfUsePage
            onNavigateHome={navigateToHome}
            onNavigateContact={navigateToContact}
          />
        )}

        {currentView.type === 'about' && (
          <AboutUsPage
            onNavigateHome={navigateToHome}
            onNavigateCategory={navigateToCategory}
            onSelectCalculator={navigateToCalculator}
            onNavigateContact={navigateToContact}
          />
        )}

        {currentView.type === 'contact' && (
          <ContactUsPage
            onNavigateHome={navigateToHome}
            onNavigateAbout={navigateToAbout}
          />
        )}

        {currentView.type === 'admin' && (
          <AdminDashboardPage
            onNavigateHome={navigateToHome}
          />
        )}
      </main>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectCalculator={navigateToCalculator}
        onSelectCategory={navigateToCategory}
      />

      {/* Cookie & GDPR Consent Banner for AdSense */}
      <CookieConsentBanner onNavigatePrivacy={navigateToPrivacy} />

      {/* Comprehensive SEO Footer */}
      <Footer
        onNavigateCategory={navigateToCategory}
        onNavigateCalculator={navigateToCalculator}
        onNavigateHome={navigateToHome}
        onNavigatePrivacy={navigateToPrivacy}
        onNavigateTerms={navigateToTerms}
        onNavigateAbout={navigateToAbout}
        onNavigateContact={navigateToContact}
        onNavigateAdmin={navigateToAdmin}
      />
    </div>
  );
}

export default function App() {
  return (
    <SiteSettingsProvider>
      <InnerApp />
    </SiteSettingsProvider>
  );
}
