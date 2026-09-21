import React, { useState } from 'react';
import { BookOpen, Clock, FileText, CheckCircle2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { HowToUseArticle, HowToUseSection } from '../../data/calculatorHowToUse';
import { PageGuideArticle } from '../../data/pageGuides';

interface HowToUseArticleSectionProps {
  article: HowToUseArticle | PageGuideArticle;
  defaultExpanded?: boolean;
}

export const HowToUseArticleSection: React.FC<HowToUseArticleSectionProps> = ({
  article,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <section className="bg-white rounded-3xl border border-stone-200/90 shadow-xs p-6 sm:p-8 space-y-6 text-stone-800">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs tracking-wider uppercase">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Comprehensive User Guide & How-To Manual</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
            {article.title}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-3xl">
            {article.subtitle}
          </p>
        </div>

        {/* Read metrics & Expand button */}
        <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
          <div className="flex items-center gap-2 text-xs text-stone-600 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200">
            <Clock className="w-3.5 h-3.5 text-stone-600" />
            <span>{article.estimatedReadTime}</span>
            <span className="text-stone-300">•</span>
            <FileText className="w-3.5 h-3.5 text-stone-600" />
            <span>{article.characterCount.toLocaleString('en-US')} characters</span>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            aria-label={isExpanded ? 'Collapse guide' : 'Expand guide'}
            title={isExpanded ? 'Collapse guide' : 'Expand guide'}
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Article Body */}
      {isExpanded && (
        <div className="space-y-6 animate-in fade-in-50 duration-150">
          <div className="space-y-6">
            {article.sections.map((sec: HowToUseSection, idx: number) => (
              <div key={idx} className="space-y-2.5">
                <h3 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0 border border-emerald-200/60">
                    {idx + 1}
                  </span>
                  <span>{sec.heading}</span>
                </h3>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed pl-8">
                  {sec.content}
                </p>

                {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                  <ul className="pl-8 space-y-1.5 pt-1">
                    {sec.bulletPoints.map((bp, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2 text-xs text-stone-600 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                        <span>{bp}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Key Summary Takeaway Card */}
          {article.summaryTakeaway && (
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-xs sm:text-sm text-emerald-950 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-emerald-900 block mb-0.5">
                  Key Strategic Takeaway
                </strong>
                <p className="text-emerald-800 leading-relaxed">
                  {article.summaryTakeaway}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
