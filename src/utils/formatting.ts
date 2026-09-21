/**
 * High precision locale-aware number and currency formatting utilities
 */

export function formatCurrency(
  value: number,
  currency: string = 'USD',
  minimumFractionDigits: number = 2,
  maximumFractionDigits: number = 2
): string {
  if (isNaN(value) || !isFinite(value)) return '$0.00';
  
  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'CA$',
    AUD: 'A$',
    JPY: '¥',
    CHF: 'CHF ',
  };

  const symbol = currencySymbols[currency] || '$';

  const formattedNum = new Intl.NumberFormat('en-US', {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(Math.abs(value));

  return value < 0 ? `-${symbol}${formattedNum}` : `${symbol}${formattedNum}`;
}

export function formatPercentage(
  value: number,
  decimals: number = 2
): string {
  if (isNaN(value) || !isFinite(value)) return '0.00%';
  return `${value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}%`;
}

export function formatNumber(
  value: number,
  decimals: number = 0
): string {
  if (isNaN(value) || !isFinite(value)) return '0';
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatCompactNumber(value: number): string {
  if (isNaN(value) || !isFinite(value)) return '0';
  if (Math.abs(value) >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (Math.abs(value) >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}k`;
  }
  return formatCurrency(value);
}

export function formatFinancialValue(
  value: number | string | undefined | null,
  format: 'currency' | 'percentage' | 'number' | 'text' | 'years' = 'currency',
  currency: string = 'USD'
): string {
  if (value === undefined || value === null) return '-';
  if (typeof value === 'string') return value;

  switch (format) {
    case 'currency':
      return formatCurrency(value, currency);
    case 'percentage':
      return formatPercentage(value);
    case 'number':
      return formatNumber(value, Number.isInteger(value) ? 0 : 2);
    case 'years':
      return `${formatNumber(value, 1)} Yrs`;
    case 'text':
    default:
      return String(value);
  }
}
