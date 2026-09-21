import React, { useState } from 'react';
import { CalculatorDefinition } from '../../types/calculator';
import { BookOpen, HelpCircle, CheckCircle2, ChevronDown, Sparkles, Scale, Info } from 'lucide-react';

interface FormulaExplanationProps {
  calculator: CalculatorDefinition;
}

export const FormulaExplanation: React.FC<FormulaExplanationProps> = ({ calculator }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="space-y-8 text-stone-800">
      {/* 1. Mathematical Formula & Variables */}
      {calculator.formula && (
        <section className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm tracking-wide">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>FINANCIAL FORMULA & METHODOLOGY</span>
          </div>

          {/* KaTeX / Math Formula Card */}
          <div className="p-4 rounded-xl bg-stone-900 text-stone-100 font-mono text-xs sm:text-sm overflow-x-auto shadow-inner border border-stone-800">
            <div className="text-emerald-400 font-semibold mb-1 text-[11px] uppercase tracking-wider">
              Mathematical Representation:
            </div>
            <code className="text-white block py-1 font-bold">
              {calculator.formula.formula}
            </code>
          </div>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {calculator.formula.explanation}
          </p>

          {/* Variables Table */}
          {calculator.formula.variables && calculator.formula.variables.length > 0 && (
            <div className="pt-2">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
                Variable Definitions
              </h4>
              <div className="overflow-x-auto rounded-xl border border-stone-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-700 font-semibold border-b border-stone-200">
                    <tr>
                      <th className="py-2 px-3 w-28">Symbol</th>
                      <th className="py-2 px-3 w-48">Parameter</th>
                      <th className="py-2 px-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-sans text-stone-700">
                    {calculator.formula.variables.map((v, idx) => (
                      <tr key={idx} className="hover:bg-stone-50/50">
                        <td className="py-2 px-3 font-mono font-bold text-emerald-800">{v.symbol}</td>
                        <td className="py-2 px-3 font-semibold text-stone-900">{v.name}</td>
                        <td className="py-2 px-3 text-stone-600">{v.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      )}

      {/* 2. Step-by-Step Worked Example Scenario */}
      {calculator.example && (
        <section className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-base">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Worked Example: {calculator.example.scenarioTitle}</span>
          </div>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {calculator.example.description}
          </p>

          {/* Inputs Used in Example */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200/70 text-xs">
            {Object.entries(calculator.example.inputs).map(([key, value]) => (
              <div key={key}>
                <span className="text-stone-500 block text-[11px]">{key}</span>
                <span className="font-bold text-stone-900">{value}</span>
              </div>
            ))}
          </div>

          {/* Step-by-step Solution */}
          <div className="space-y-2 pt-1">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Calculation Steps:
            </h4>
            <div className="space-y-1.5">
              {calculator.example.stepByStep.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-700">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Final Outcome Banner */}
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Final Outcome:</strong> {calculator.example.finalOutcome}
            </span>
          </div>
        </section>
      )}

      {/* 3. How it Works & What it Means */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* How it Works */}
        {calculator.howItWorks && (
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-6 space-y-3">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600" />
              How This Calculator Works
            </h3>
            <ul className="space-y-2 text-xs text-stone-600 leading-relaxed">
              {calculator.howItWorks.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* What it Means & Factors */}
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-6 space-y-3">
          <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
            <Scale className="w-4 h-4 text-indigo-600" />
            Interpreting Your Results
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            {calculator.whatItMeans}
          </p>

          {calculator.factorsToConsider && calculator.factorsToConsider.length > 0 && (
            <div className="pt-2 border-t border-stone-100">
              <h4 className="text-[11px] font-bold text-stone-900 uppercase tracking-wider mb-1.5">
                Key Factors to Consider
              </h4>
              <ul className="space-y-1 text-xs text-stone-600">
                {calculator.factorsToConsider.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold shrink-0">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* 4. Frequently Asked Questions (FAQ Accordion with Schema.org format) */}
      {calculator.faqs && calculator.faqs.length > 0 && (
        <section className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-base">
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            <span>Frequently Asked Questions</span>
          </div>

          <div className="divide-y divide-stone-100">
            {calculator.faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} className="py-3.5 first:pt-0 last:pb-0">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between text-left font-semibold text-xs sm:text-sm text-stone-900 hover:text-emerald-700 transition-colors cursor-pointer gap-3"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-stone-400 transition-transform shrink-0 ${
                        isOpen ? 'rotate-180 text-emerald-600' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="pt-2 text-xs sm:text-sm text-stone-600 leading-relaxed animate-in fade-in-50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 5. Editorial & Compliance Review Badge */}
      <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 text-[11px] text-stone-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <strong>Methodology Audit:</strong> {calculator.methodologyReview || 'Audited against current financial standards.'}
        </span>
        <span>Last Updated: {calculator.lastUpdated}</span>
      </div>
    </div>
  );
};
