import React, { useState } from 'react';
import { AmortizationRow } from '../../types/calculator';
import { Download, Search, ChevronLeft, ChevronRight, FileSpreadsheet } from 'lucide-react';
import { formatCurrency } from '../../utils/formatting';

interface AmortizationTableProps {
  monthlySchedule?: AmortizationRow[];
  yearlySchedule?: AmortizationRow[];
  title?: string;
}

export const AmortizationTable: React.FC<AmortizationTableProps> = ({
  monthlySchedule,
  yearlySchedule,
  title = 'Amortization & Schedule Breakdown',
}) => {
  const [viewMode, setViewMode] = useState<'yearly' | 'monthly'>('yearly');
  const [page, setPage] = useState(1);
  const [searchFilter, setSearchFilter] = useState('');
  const rowsPerPage = 12;

  const currentSchedule = viewMode === 'yearly' ? yearlySchedule || [] : monthlySchedule || [];

  const filteredRows = currentSchedule.filter((row) => {
    if (!searchFilter) return true;
    const term = searchFilter.toLowerCase();
    return (
      String(row.period).includes(term) ||
      (row.date && row.date.toLowerCase().includes(term))
    );
  });

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
  const displayedRows = filteredRows.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleExportCSV = () => {
    if (currentSchedule.length === 0) return;
    const headers = [
      viewMode === 'yearly' ? 'Year' : 'Payment #',
      'Payment Amount',
      'Principal',
      'Interest',
      'Extra Principal',
      'Remaining Balance',
      'Total Interest Paid',
    ];
    const csvContent = [
      headers.join(','),
      ...currentSchedule.map((r) =>
        [
          r.period,
          r.payment.toFixed(2),
          r.principal.toFixed(2),
          r.interest.toFixed(2),
          (r.extraPayment || 0).toFixed(2),
          r.remainingBalance.toFixed(2),
          r.totalInterestPaid.toFixed(2),
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `amortization_schedule_${viewMode}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (currentSchedule.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-5 sm:p-6 space-y-4">
      {/* Header with Switcher and Download */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100">
        <div>
          <h3 className="text-base font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            {title}
          </h3>
          <p className="text-xs text-stone-500">
            {filteredRows.length} scheduled periods ({viewMode === 'yearly' ? 'Annualized' : 'Monthly'})
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Yearly vs Monthly Switch */}
          {monthlySchedule && yearlySchedule && (
            <div className="flex rounded-xl bg-stone-100 p-1 text-xs font-medium text-stone-600">
              <button
                id="btn-schedule-yearly"
                onClick={() => {
                  setViewMode('yearly');
                  setPage(1);
                }}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'yearly' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : ''
                }`}
              >
                Annual Summary
              </button>
              <button
                id="btn-schedule-monthly"
                onClick={() => {
                  setViewMode('monthly');
                  setPage(1);
                }}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'monthly' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : ''
                }`}
              >
                Monthly Schedule
              </button>
            </div>
          )}

          <button
            id="btn-download-csv"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer border border-stone-200 shadow-2xs"
            title="Download CSV Spreadsheet"
          >
            <Download className="w-3.5 h-3.5 text-stone-600" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Search Filter for Table */}
      {currentSchedule.length > 12 && (
        <div className="relative max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
          <input
            type="text"
            placeholder={`Filter ${viewMode === 'yearly' ? 'years' : 'months'}...`}
            value={searchFilter}
            onChange={(e) => {
              setSearchFilter(e.target.value);
              setPage(1);
            }}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-stone-200/80">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50/90 text-stone-600 font-semibold border-b border-stone-200">
            <tr>
              <th className="py-2.5 px-3.5">{viewMode === 'yearly' ? 'Year' : 'Payment #'}</th>
              <th className="py-2.5 px-3.5 text-right">Payment</th>
              <th className="py-2.5 px-3.5 text-right">Principal</th>
              <th className="py-2.5 px-3.5 text-right">Interest</th>
              {currentSchedule.some((r) => (r.extraPayment || 0) > 0) && (
                <th className="py-2.5 px-3.5 text-right text-emerald-600">Extra Paid</th>
              )}
              <th className="py-2.5 px-3.5 text-right">Remaining Balance</th>
              <th className="py-2.5 px-3.5 text-right">Cumulative Interest</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 font-mono text-stone-700">
            {displayedRows.map((row) => (
              <tr key={row.period} className="hover:bg-stone-50/80 transition-colors">
                <td className="py-2.5 px-3.5 font-sans font-semibold text-stone-900">
                  {viewMode === 'yearly' ? `Year ${row.period}` : `#${row.period}`}
                </td>
                <td className="py-2.5 px-3.5 text-right text-stone-900 font-medium">
                  {formatCurrency(row.payment)}
                </td>
                <td className="py-2.5 px-3.5 text-right text-blue-700 font-medium">
                  {formatCurrency(row.principal)}
                </td>
                <td className="py-2.5 px-3.5 text-right text-rose-600 font-medium">
                  {formatCurrency(row.interest)}
                </td>
                {currentSchedule.some((r) => (r.extraPayment || 0) > 0) && (
                  <td className="py-2.5 px-3.5 text-right text-emerald-700 font-semibold">
                    {row.extraPayment ? formatCurrency(row.extraPayment) : '-'}
                  </td>
                )}
                <td className="py-2.5 px-3.5 text-right font-semibold text-stone-900">
                  {formatCurrency(row.remainingBalance)}
                </td>
                <td className="py-2.5 px-3.5 text-right text-stone-500">
                  {formatCurrency(row.totalInterestPaid)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 text-xs text-stone-500">
          <span>
            Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredRows.length)} of{' '}
            {filteredRows.length} entries
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium text-stone-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
