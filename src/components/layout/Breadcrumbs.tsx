import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { CATEGORIES } from '../../config/categories';

export interface BreadcrumbItem {
  label: string;
  url?: string;
  onClick?: () => void;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="py-2.5">
      <ol className="flex items-center flex-wrap gap-1.5 text-xs text-stone-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-1.5">
              {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />}

              {index === 0 && (
                <button
                  onClick={item.onClick}
                  className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded transition-colors cursor-pointer"
                  aria-label="Home"
                >
                  <Home className="w-3.5 h-3.5" />
                </button>
              )}

              {isLast ? (
                <span className="font-semibold text-stone-900 line-clamp-1 max-w-xs sm:max-w-md" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <button
                  onClick={item.onClick}
                  className="hover:text-emerald-700 hover:underline transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
