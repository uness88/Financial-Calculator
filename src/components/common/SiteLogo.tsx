import React, { useState } from 'react';
import {
  Calculator,
  TrendingUp,
  PiggyBank,
  Home,
  Percent,
  DollarSign,
  Landmark,
  BadgePercent,
  BarChart3,
  Coins,
  Wallet,
  ShieldCheck,
  Sparkles,
  Activity,
  LucideIcon,
} from 'lucide-react';
import { SiteSettings } from '../../types/siteSettings';

interface SiteLogoProps {
  settings: SiteSettings;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ICON_REGISTRY: Record<string, LucideIcon> = {
  Calculator,
  TrendingUp,
  PiggyBank,
  Home,
  Percent,
  DollarSign,
  Landmark,
  BadgePercent,
  BarChart3,
  Coins,
  Wallet,
  ShieldCheck,
  Sparkles,
  Activity,
};

export const BG_THEME_CLASSES: Record<
  SiteSettings['logoBgTheme'],
  { bg: string; text: string; shadow: string; border?: string }
> = {
  emerald: {
    bg: 'bg-gradient-to-tr from-emerald-600 to-teal-700',
    text: 'text-white',
    shadow: 'shadow-emerald-700/20',
  },
  blue: {
    bg: 'bg-gradient-to-tr from-blue-600 to-indigo-700',
    text: 'text-white',
    shadow: 'shadow-blue-700/20',
  },
  indigo: {
    bg: 'bg-gradient-to-tr from-indigo-600 to-violet-700',
    text: 'text-white',
    shadow: 'shadow-indigo-700/20',
  },
  violet: {
    bg: 'bg-gradient-to-tr from-purple-600 to-fuchsia-700',
    text: 'text-white',
    shadow: 'shadow-purple-700/20',
  },
  amber: {
    bg: 'bg-gradient-to-tr from-amber-500 to-orange-600',
    text: 'text-white',
    shadow: 'shadow-amber-700/20',
  },
  rose: {
    bg: 'bg-gradient-to-tr from-rose-500 to-red-700',
    text: 'text-white',
    shadow: 'shadow-rose-700/20',
  },
  slate: {
    bg: 'bg-gradient-to-tr from-slate-700 to-stone-900',
    text: 'text-white',
    shadow: 'shadow-slate-900/20',
  },
  dark: {
    bg: 'bg-black',
    text: 'text-emerald-400',
    shadow: 'shadow-black/30',
  },
};

export const SiteLogo: React.FC<SiteLogoProps> = ({ settings, size = 'md', className = '' }) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: { box: 'w-7 h-7 rounded-lg', icon: 'w-4 h-4', text: 'text-sm' },
    md: { box: 'w-9 h-9 rounded-xl', icon: 'w-5 h-5', text: 'text-base' },
    lg: { box: 'w-12 h-12 rounded-2xl', icon: 'w-7 h-7', text: 'text-2xl' },
  }[size];

  const themeStyle = BG_THEME_CLASSES[settings.logoBgTheme] || BG_THEME_CLASSES.emerald;

  // 1. Custom Image URL
  if (settings.logoType === 'image' && settings.logoImageUrl && !imgError) {
    return (
      <div
        className={`${sizeClasses.box} overflow-hidden border border-stone-200/80 shadow-xs flex items-center justify-center bg-white ${className}`}
      >
        <img
          src={settings.logoImageUrl}
          alt={settings.siteName}
          className="w-full h-full object-contain p-0.5"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // 2. Custom Emoji
  if (settings.logoType === 'emoji' && settings.logoEmoji) {
    return (
      <div
        className={`${sizeClasses.box} ${themeStyle.bg} shadow-sm ${themeStyle.shadow} flex items-center justify-center select-none ${className}`}
      >
        <span className={sizeClasses.text}>{settings.logoEmoji}</span>
      </div>
    );
  }

  // 3. Raw SVG Code
  if (settings.logoType === 'svg' && settings.logoSvgCode) {
    return (
      <div
        className={`${sizeClasses.box} ${themeStyle.bg} shadow-sm ${themeStyle.shadow} flex items-center justify-center overflow-hidden p-1.5 ${themeStyle.text} ${className}`}
        dangerouslySetInnerHTML={{ __html: settings.logoSvgCode }}
      />
    );
  }

  // 4. Default / Selected Lucide Icon
  const SelectedIcon = ICON_REGISTRY[settings.logoIconName] || Calculator;

  return (
    <div
      className={`${sizeClasses.box} ${themeStyle.bg} ${themeStyle.text} shadow-sm ${themeStyle.shadow} flex items-center justify-center ${className}`}
    >
      <SelectedIcon className={sizeClasses.icon} />
    </div>
  );
};
