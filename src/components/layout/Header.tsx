import React, { useState, useEffect, useRef } from 'react';
import {
  Calculator,
  Search,
  ChevronDown,
  Percent,
  PiggyBank,
  Home,
  TrendingUp,
  Bookmark,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Info,
  Mail,
  FileText,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { CATEGORIES } from '../../config/categories';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { SiteLogo } from '../common/SiteLogo';

interface HeaderProps {
  currentView:
    | { type: 'home' }
    | { type: 'category'; categorySlug: string }
    | { type: 'calculator'; slug: string }
    | { type: 'saved' }
    | { type: 'privacy' }
    | { type: 'terms' }
    | { type: 'about' }
    | { type: 'contact' }
    | { type: 'admin' };
  onNavigateHome: () => void;
  onNavigateCategory: (categorySlug: string) => void;
  onNavigateCalculator: (slug: string) => void;
  onNavigateSaved: () => void;
  onNavigateAbout?: () => void;
  onNavigateContact?: () => void;
  onNavigatePrivacy?: () => void;
  onNavigateTerms?: () => void;
  onOpenSearch: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigateHome,
  onNavigateCategory,
  onNavigateCalculator,
  onNavigateSaved,
  onNavigateAbout,
  onNavigateContact,
  onNavigatePrivacy,
  onNavigateTerms,
  onOpenSearch,
  savedCount,
}) => {
  const { settings, fullSiteName } = useSiteSettings();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const companyDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoryOpen(false);
      }
      if (
        companyDropdownRef.current &&
        !companyDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCompanyOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsCategoryOpen(false);
        setIsCompanyOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'finance-investment':
        return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      case 'retirement-calculators':
        return <PiggyBank className="w-4 h-4 text-amber-600" />;
      case 'loan-mortgage-calculators':
        return <Home className="w-4 h-4 text-blue-600" />;
      case 'stock-calculators':
        return <Percent className="w-4 h-4 text-indigo-600" />;
      default:
        return <Calculator className="w-4 h-4 text-emerald-600" />;
    }
  };

  const getCategoryColorStyles = (color: string) => {
    switch (color) {
      case 'emerald':
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          badge: 'bg-emerald-100 text-emerald-800',
          hoverBg: 'hover:bg-emerald-50/70',
        };
      case 'amber':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          border: 'border-amber-200',
          badge: 'bg-amber-100 text-amber-800',
          hoverBg: 'hover:bg-amber-50/70',
        };
      case 'blue':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-200',
          badge: 'bg-blue-100 text-blue-800',
          hoverBg: 'hover:bg-blue-50/70',
        };
      case 'indigo':
        return {
          bg: 'bg-indigo-50',
          text: 'text-indigo-700',
          border: 'border-indigo-200',
          badge: 'bg-indigo-100 text-indigo-800',
          hoverBg: 'hover:bg-indigo-50/70',
        };
      default:
        return {
          bg: 'bg-stone-50',
          text: 'text-stone-700',
          border: 'border-stone-200',
          badge: 'bg-stone-100 text-stone-800',
          hoverBg: 'hover:bg-stone-50',
        };
    }
  };

  const isCategoryActive = (slug: string) =>
    currentView.type === 'category' && currentView.categorySlug === slug;

  const isCompanyActive =
    currentView.type === 'about' ||
    currentView.type === 'contact' ||
    currentView.type === 'privacy' ||
    currentView.type === 'terms';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand Logo */}
          <div className="flex items-center gap-6">
            <button
              id="header-logo-btn"
              onClick={onNavigateHome}
              className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-hidden"
              aria-label={`${fullSiteName} Home`}
            >
              <div className="group-hover:scale-105 transition-transform">
                <SiteLogo settings={settings} size="md" />
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-bold tracking-tight text-stone-900 flex items-center gap-1.5 leading-none">
                  {settings.siteName || 'OmniCalc'}
                  {settings.siteNameSuffix && (
                    <span className="text-[10px] sm:text-xs font-semibold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {settings.siteNameSuffix}
                    </span>
                  )}
                </span>
                {settings.siteTagline && (
                  <span className="hidden sm:block text-[11px] font-medium text-stone-600 tracking-tight mt-0.5 max-w-[240px] truncate">
                    {settings.siteTagline}
                  </span>
                )}
              </div>
            </button>

            {/* Desktop Primary Nav */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              {/* All Tools (Home) */}
              <button
                id="nav-home-btn"
                onClick={onNavigateHome}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-xs lg:text-sm ${
                  currentView.type === 'home'
                    ? 'bg-stone-900 text-white font-semibold shadow-2xs'
                    : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
                }`}
              >
                All Tools
              </button>

              {/* Mega Categories Dropdown */}
              <div className="relative" ref={categoryDropdownRef}>
                <button
                  id="nav-categories-dropdown-btn"
                  onClick={() => {
                    setIsCategoryOpen(!isCategoryOpen);
                    setIsCompanyOpen(false);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-xs lg:text-sm ${
                    currentView.type === 'category' || isCategoryOpen
                      ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200/80'
                      : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
                  }`}
                  aria-expanded={isCategoryOpen}
                >
                  <span>Calculators</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isCategoryOpen ? 'rotate-180 text-emerald-700' : 'text-stone-600'
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isCategoryOpen && (
                  <div className="absolute top-full left-0 mt-2 w-[480px] bg-white rounded-2xl shadow-2xl border border-stone-200/90 p-3 z-50 animate-in fade-in-50 slide-in-from-top-2">
                    <div className="flex items-center justify-between px-2.5 py-1.5 mb-2 border-b border-stone-100">
                      <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                        4 Financial Suites (56 Calculators)
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-600" /> 2026 Rules
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {CATEGORIES.map((cat) => {
                        const style = getCategoryColorStyles(cat.color);
                        const isCurrent = isCategoryActive(cat.slug);

                        return (
                          <button
                            key={cat.id}
                            id={`dropdown-cat-${cat.slug}`}
                            onClick={() => {
                              onNavigateCategory(cat.slug);
                              setIsCategoryOpen(false);
                            }}
                            className={`flex flex-col p-2.5 rounded-xl text-left border transition-all cursor-pointer group ${
                              isCurrent
                                ? `${style.bg} ${style.border} ring-1 ring-emerald-500/20`
                                : `border-stone-100 hover:border-stone-200 ${style.hoverBg}`
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                <div className={`p-1.5 rounded-lg ${style.bg} border ${style.border}`}>
                                  {getCategoryIcon(cat.id)}
                                </div>
                                <span className="text-xs font-bold text-stone-900 group-hover:text-stone-950">
                                  {cat.shortName}
                                </span>
                              </div>
                              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${style.badge}`}>
                                {cat.calculatorsCount}
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-600 leading-snug line-clamp-2">
                              {cat.description}
                            </p>
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between px-2">
                      <button
                        onClick={() => {
                          onNavigateHome();
                          setIsCategoryOpen(false);
                        }}
                        className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        Browse all 56 calculator engines <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[11px] text-stone-600 font-medium">100% Client-Side</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick direct links for top domains on larger displays */}
              <div className="hidden lg:flex items-center gap-1">
                <button
                  id="nav-quick-retirement"
                  onClick={() => onNavigateCategory('retirement-calculators')}
                  className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer text-xs lg:text-sm ${
                    isCategoryActive('retirement-calculators')
                      ? 'bg-amber-50 text-amber-900 font-semibold border border-amber-200/80'
                      : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
                  }`}
                >
                  Retirement
                </button>
                <button
                  id="nav-quick-loans"
                  onClick={() => onNavigateCategory('loan-mortgage-calculators')}
                  className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer text-xs lg:text-sm ${
                    isCategoryActive('loan-mortgage-calculators')
                      ? 'bg-blue-50 text-blue-900 font-semibold border border-blue-200/80'
                      : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
                  }`}
                >
                  Loans & Mortgages
                </button>
                <button
                  id="nav-quick-finance"
                  onClick={() => onNavigateCategory('finance-investment')}
                  className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer text-xs lg:text-sm ${
                    isCategoryActive('finance-investment')
                      ? 'bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200/80'
                      : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
                  }`}
                >
                  Investing
                </button>
              </div>

              {/* Company / Information Dropdown */}
              <div className="relative" ref={companyDropdownRef}>
                <button
                  id="nav-company-dropdown-btn"
                  onClick={() => {
                    setIsCompanyOpen(!isCompanyOpen);
                    setIsCategoryOpen(false);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-xs lg:text-sm ${
                    isCompanyActive || isCompanyOpen
                      ? 'bg-stone-100 text-stone-950 font-semibold'
                      : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
                  }`}
                  aria-expanded={isCompanyOpen}
                >
                  <span>Company</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isCompanyOpen ? 'rotate-180 text-stone-900' : 'text-stone-600'
                    }`}
                  />
                </button>

                {isCompanyOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-200/90 py-1.5 z-50 animate-in fade-in-50 slide-in-from-top-2">
                    {onNavigateAbout && (
                      <button
                        onClick={() => {
                          onNavigateAbout();
                          setIsCompanyOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium transition-colors text-left cursor-pointer ${
                          currentView.type === 'about'
                            ? 'bg-stone-100 text-stone-950 font-bold'
                            : 'text-stone-700 hover:bg-stone-50 hover:text-stone-950'
                        }`}
                      >
                        <Info className="w-4 h-4 text-emerald-600" />
                        <span>About OmniCalc</span>
                      </button>
                    )}

                    {onNavigateContact && (
                      <button
                        onClick={() => {
                          onNavigateContact();
                          setIsCompanyOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium transition-colors text-left cursor-pointer ${
                          currentView.type === 'contact'
                            ? 'bg-stone-100 text-stone-950 font-bold'
                            : 'text-stone-700 hover:bg-stone-50 hover:text-stone-950'
                        }`}
                      >
                        <Mail className="w-4 h-4 text-blue-600" />
                        <span>Contact & Support</span>
                      </button>
                    )}

                    <div className="my-1 border-t border-stone-100" />

                    {onNavigatePrivacy && (
                      <button
                        onClick={() => {
                          onNavigatePrivacy();
                          setIsCompanyOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium transition-colors text-left cursor-pointer ${
                          currentView.type === 'privacy'
                            ? 'bg-stone-100 text-stone-950 font-bold'
                            : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                        }`}
                      >
                        <Lock className="w-4 h-4 text-stone-600" />
                        <span>Privacy Policy</span>
                      </button>
                    )}

                    {onNavigateTerms && (
                      <button
                        onClick={() => {
                          onNavigateTerms();
                          setIsCompanyOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium transition-colors text-left cursor-pointer ${
                          currentView.type === 'terms'
                            ? 'bg-stone-100 text-stone-950 font-bold'
                            : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                        }`}
                      >
                        <FileText className="w-4 h-4 text-stone-600" />
                        <span>Terms of Use</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Right Action Hub */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Search Trigger Button */}
            <button
              id="header-search-trigger-btn"
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-100/90 hover:bg-stone-200/70 text-stone-600 hover:text-stone-900 text-xs font-medium border border-stone-200/90 transition-all cursor-pointer shadow-2xs group"
              aria-label="Search all 56 financial calculators (Command+K)"
            >
              <Search className="w-3.5 h-3.5 text-stone-600 group-hover:text-stone-900" />
              <span className="hidden sm:inline">Search calculators...</span>
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono bg-white text-stone-600 rounded border border-stone-200 shadow-2xs">
                ⌘K
              </kbd>
            </button>

            {/* Saved Calculations Button */}
            <button
              id="header-saved-scenarios-btn"
              onClick={onNavigateSaved}
              className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                currentView.type === 'saved'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'text-stone-700 hover:text-stone-950 bg-stone-50 hover:bg-stone-100 border-stone-200/90'
              }`}
              title="Saved Scenarios"
              aria-label={`Saved Scenarios (${savedCount})`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${currentView.type === 'saved' ? 'text-white' : 'text-stone-600'}`} />
              <span className="hidden md:inline">Saved</span>
              {savedCount > 0 && (
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-bold rounded-full ${
                    currentView.type === 'saved'
                      ? 'bg-white text-emerald-800'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {savedCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-stone-700 hover:text-stone-950 hover:bg-stone-100 border border-stone-200 cursor-pointer transition-colors"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer Overlay & Content */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200/80 pt-3 pb-6 space-y-4 animate-in fade-in-50 duration-150 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {/* Quick Search inside Mobile drawer */}
            <div className="px-1">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenSearch();
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 bg-stone-100 hover:bg-stone-200/80 rounded-xl text-stone-700 text-xs font-medium border border-stone-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-stone-600" />
                  <span>Search all 56 financial calculators...</span>
                </div>
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white text-stone-600 rounded border border-stone-200">
                  Search
                </kbd>
              </button>
            </div>

            {/* All Tools & Saved Quick Buttons */}
            <div className="grid grid-cols-2 gap-2 px-1">
              <button
                onClick={() => {
                  onNavigateHome();
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold border text-center transition-colors cursor-pointer ${
                  currentView.type === 'home'
                    ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                    : 'bg-white text-stone-800 border-stone-200 hover:bg-stone-50'
                }`}
              >
                <Calculator className="w-4 h-4 text-emerald-600" />
                All 56 Tools
              </button>

              <button
                onClick={() => {
                  onNavigateSaved();
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold border text-center transition-colors cursor-pointer ${
                  currentView.type === 'saved'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-white text-stone-800 border-stone-200 hover:bg-stone-50'
                }`}
              >
                <Bookmark className="w-4 h-4 text-emerald-600" />
                Saved Plans ({savedCount})
              </button>
            </div>

            {/* Categories Suite Section */}
            <div className="space-y-1.5 px-1">
              <div className="flex items-center justify-between px-2 py-1">
                <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                  Calculator Suites
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  56 Engines
                </span>
              </div>

              <div className="space-y-1.5">
                {CATEGORIES.map((cat) => {
                  const style = getCategoryColorStyles(cat.color);
                  const isCurrent = isCategoryActive(cat.slug);

                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        onNavigateCategory(cat.slug);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isCurrent
                          ? `${style.bg} ${style.border} ring-1 ring-emerald-500/30`
                          : 'bg-white border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${style.bg} border ${style.border}`}>
                          {getCategoryIcon(cat.id)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-stone-900">{cat.name}</p>
                          <p className="text-[11px] text-stone-600 line-clamp-1">{cat.description}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md shrink-0 ml-2 ${style.badge}`}>
                        {cat.calculatorsCount}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Company & Legal Section */}
            <div className="pt-2 border-t border-stone-200/80 px-1 space-y-1">
              <span className="px-2 py-1 text-[11px] font-bold text-stone-600 uppercase tracking-wider block">
                Information & Support
              </span>

              <div className="grid grid-cols-2 gap-1.5">
                {onNavigateAbout && (
                  <button
                    onClick={() => {
                      onNavigateAbout();
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-medium text-left transition-colors ${
                      currentView.type === 'about'
                        ? 'bg-stone-100 text-stone-950 font-bold'
                        : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <Info className="w-3.5 h-3.5 text-emerald-600" />
                    About OmniCalc
                  </button>
                )}

                {onNavigateContact && (
                  <button
                    onClick={() => {
                      onNavigateContact();
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-medium text-left transition-colors ${
                      currentView.type === 'contact'
                        ? 'bg-stone-100 text-stone-950 font-bold'
                        : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    Contact & Help
                  </button>
                )}

                {onNavigatePrivacy && (
                  <button
                    onClick={() => {
                      onNavigatePrivacy();
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-medium text-left transition-colors ${
                      currentView.type === 'privacy'
                        ? 'bg-stone-100 text-stone-950 font-bold'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5 text-stone-600" />
                    Privacy Policy
                  </button>
                )}

                {onNavigateTerms && (
                  <button
                    onClick={() => {
                      onNavigateTerms();
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-medium text-left transition-colors ${
                      currentView.type === 'terms'
                        ? 'bg-stone-100 text-stone-950 font-bold'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-stone-600" />
                    Terms of Use
                  </button>
                )}
              </div>
            </div>

            {/* Live IRS Indicator */}
            <div className="pt-2 px-2 flex items-center justify-between text-xs text-stone-600">
              <span className="flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                SECURE 2.0 & IRS 2026 Live
              </span>
              <span className="text-[11px] font-mono text-stone-600">v2.4.0</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

