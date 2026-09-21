import React, { useState } from 'react';
import {
  CalculationOutput,
  CalculationResultMetric,
} from '../../types/calculator';
import { formatFinancialValue } from '../../utils/formatting';
import {
  Share2,
  Bookmark,
  Printer,
  Check,
  Info,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import confetti from 'canvas-confetti';

interface CalculatorResultsProps {
  output: CalculationOutput;
  calculatorName: string;
  onSaveScenario?: () => void;
  isSaved?: boolean;
}

export const CalculatorResults: React.FC<CalculatorResultsProps> = ({
  output,
  calculatorName,
  onSaveScenario,
  isSaved = false,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeVisualTab, setActiveVisualTab] = useState<'chart' | 'breakdown'>('chart');

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleTriggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#059669', '#10b981', '#34d399', '#f59e0b'],
    });
  };

  const getBadgeStyle = (changeType?: 'positive' | 'negative' | 'neutral') => {
    switch (changeType) {
      case 'positive':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'negative':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-5 sm:p-6 space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100">
        <div>
          <h2 className="text-base font-bold text-stone-900 tracking-tight">Calculation Results</h2>
          <p className="text-xs text-stone-600">Live output based on standard financial modeling</p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            id="btn-copy-share-link"
            onClick={handleCopyShareLink}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
            title="Copy direct share link with current parameters"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Copied!' : 'Share'}</span>
          </button>

          {onSaveScenario && (
            <button
              id="btn-save-scenario"
              onClick={() => {
                onSaveScenario();
                handleTriggerConfetti();
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-emerald-100 text-emerald-800 font-semibold'
                  : 'text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200'
              }`}
              title="Save this calculation to bookmarks"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          )}

          <button
            id="btn-print-results"
            onClick={handlePrint}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
            title="Print this financial summary report"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Hero Primary Result Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-stone-900 via-stone-900 to-emerald-950 text-white p-5 sm:p-6 shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-1.5">
          <span className="text-xs font-medium text-emerald-300 tracking-wide uppercase">
            {output.primaryResult.label}
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            {formatFinancialValue(output.primaryResult.value, output.primaryResult.format)}
          </div>
          {output.summaryText && (
            <p className="text-xs sm:text-sm text-stone-300 pt-2 leading-relaxed">
              {output.summaryText}
            </p>
          )}
        </div>
        {/* Subtle background glow element */}
        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Secondary Key Metrics Grid */}
      {output.metrics && output.metrics.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {output.metrics.map((metric: CalculationResultMetric) => (
            <div
              key={metric.id}
              className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1 hover:border-stone-300 transition-all"
            >
              <span className="text-xs text-stone-600 line-clamp-1">{metric.label}</span>
              <div className="flex items-center justify-between gap-2">
                <span className="text-base font-bold text-stone-900 tracking-tight">
                  {formatFinancialValue(metric.value, metric.format)}
                </span>
                {metric.changeType && (
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${getBadgeStyle(
                      metric.changeType
                    )}`}
                  >
                    {metric.changeType === 'positive' ? 'Optimal' : metric.changeType === 'negative' ? 'Alert' : 'Standard'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Visual Chart / Breakdown Visualizer */}
      {(output.chartData || (output.breakdownItems && output.breakdownItems.length > 0)) && (
        <div className="space-y-4 pt-2 border-t border-stone-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              {output.chartData?.title || 'Visual Allocation & Trajectory'}
            </h3>
            {output.breakdownItems && output.breakdownItems.length > 0 && output.chartData && (
              <div className="flex rounded-lg bg-stone-100 p-0.5 text-xs font-medium text-stone-600">
                <button
                  onClick={() => setActiveVisualTab('chart')}
                  className={`px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                    activeVisualTab === 'chart' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : ''
                  }`}
                >
                  Trend
                </button>
                <button
                  onClick={() => setActiveVisualTab('breakdown')}
                  className={`px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                    activeVisualTab === 'breakdown' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : ''
                  }`}
                >
                  Breakdown
                </button>
              </div>
            )}
          </div>

          {/* Render Recharts Line/Area Chart */}
          {output.chartData && (activeVisualTab === 'chart' || !output.breakdownItems) && (
            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={output.chartData.data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickLine={false}
                    tickFormatter={(val) =>
                      val >= 1000000
                        ? `$${(val / 1000000).toFixed(1)}M`
                        : val >= 1000
                        ? `$${(val / 1000).toFixed(0)}k`
                        : `$${val}`
                    }
                  />
                  <RechartsTooltip
                    formatter={(val: any) => [`$${Number(val).toLocaleString('en-US')}`, '']}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  {output.chartData.series.map((s) => (
                    <Line
                      key={s.key}
                      type="monotone"
                      dataKey={s.key}
                      name={s.name}
                      stroke={s.color || '#10b981'}
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 5 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Render Donut / Pie Breakdown */}
          {output.breakdownItems && output.breakdownItems.length > 0 && (activeVisualTab === 'breakdown' || !output.chartData) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={output.breakdownItems}
                      dataKey="amount"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                    >
                      {output.breakdownItems.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || '#3b82f6'} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(val: any) => [`$${Number(val).toLocaleString('en-US')}`, '']}
                      contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Breakdown Legend Swatches */}
              <div className="space-y-2">
                {output.breakdownItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-stone-50">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color || '#3b82f6' }} />
                      <span className="font-medium text-stone-700">{item.label}</span>
                    </div>
                    <span className="font-bold text-stone-900">${Math.round(item.amount).toLocaleString('en-US')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Insights & Advisory Callout */}
      {output.insights && output.insights.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-stone-100">
          {output.insights.map((insight, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 p-3.5 rounded-xl border text-xs leading-relaxed ${
                insight.type === 'tip'
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                  : insight.type === 'warning'
                  ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                  : 'bg-blue-50/70 border-blue-200 text-blue-900'
              }`}
            >
              {insight.type === 'tip' && <Lightbulb className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
              {insight.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />}
              {insight.type === 'info' && <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />}
              <div>
                <strong className="block font-semibold pb-0.5">{insight.title}</strong>
                <span>{insight.message}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
