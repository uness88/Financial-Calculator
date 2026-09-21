import React from 'react';
import { Breadcrumbs } from '../layout/Breadcrumbs';
import { Bookmark, Trash2, ArrowRight, Calculator } from 'lucide-react';
import { formatFinancialValue } from '../../utils/formatting';
import { HowToUseArticleSection } from '../common/HowToUseArticleSection';
import { SITEWIDE_PAGE_GUIDES } from '../../data/pageGuides';

export interface SavedScenario {
  id: string;
  calcSlug: string;
  calcName: string;
  timestamp: number;
  inputs: Record<string, any>;
  primaryResult: {
    label: string;
    value: number | string;
    format: any;
  };
}

interface SavedScenariosPageProps {
  scenarios: SavedScenario[];
  onSelectCalculator: (slug: string) => void;
  onDeleteScenario: (id: string) => void;
  onClearAll: () => void;
  onNavigateHome: () => void;
}

export const SavedScenariosPage: React.FC<SavedScenariosPageProps> = ({
  scenarios,
  onSelectCalculator,
  onDeleteScenario,
  onClearAll,
  onNavigateHome,
}) => {
  return (
    <div className="space-y-8 pb-16">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Home', onClick: onNavigateHome },
          { label: 'Saved Scenarios' },
        ]}
      />

      <div className="flex items-center justify-between pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2.5">
            <Bookmark className="w-7 h-7 text-emerald-600" />
            Saved Scenarios & Bookmarks
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Access your pinned financial calculations across sessions
          </p>
        </div>

        {scenarios.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs font-semibold text-rose-600 hover:text-rose-800 p-2 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      {scenarios.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-stone-200 space-y-3">
          <Bookmark className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="text-base font-bold text-stone-800">No saved calculations yet</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Click the "Save" bookmark button on any calculator result card to save your custom parameters and outcomes here.
          </p>
          <button
            onClick={onNavigateHome}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Calculator className="w-4 h-4" />
            <span>Browse 56 Calculators</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarios.map((sc) => (
            <div
              key={sc.id}
              className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-stone-600">
                  <span>{new Date(sc.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <button
                    onClick={() => onDeleteScenario(sc.id)}
                    className="text-stone-400 hover:text-rose-600 transition-colors cursor-pointer p-1"
                    title="Remove from saved"
                    aria-label={`Remove saved scenario for ${sc.calcName}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-bold text-stone-900 text-sm">
                  {sc.calcName}
                </h3>

                {/* Primary Result Preview */}
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/70 space-y-1">
                  <span className="text-[11px] text-stone-600 block">{sc.primaryResult.label}</span>
                  <span className="text-lg font-extrabold text-stone-900">
                    {formatFinancialValue(sc.primaryResult.value, sc.primaryResult.format)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onSelectCalculator(sc.calcSlug)}
                className="w-full flex items-center justify-between pt-3 border-t border-stone-100 text-xs font-semibold text-emerald-700 hover:text-emerald-900 cursor-pointer"
              >
                <span>Re-open Calculator</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Comprehensive Saved Scenarios How-To User Guide */}
      <HowToUseArticleSection article={SITEWIDE_PAGE_GUIDES.saved} />
    </div>
  );
};
