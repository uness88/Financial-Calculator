/**
 * Privacy-friendly Analytics and Google Tag Manager Event Dispatcher
 */

export type AnalyticsEventName = 
  | 'calculator_started'
  | 'calculator_completed'
  | 'calculator_reset'
  | 'calculator_error'
  | 'related_calculator_clicked'
  | 'guide_clicked'
  | 'amortization_exported'
  | 'calculation_shared';

export function trackEvent(eventName: AnalyticsEventName, eventParams: Record<string, any> = {}) {
  // Safe execution in browser environment without crashing or collecting PII
  if (typeof window !== 'undefined') {
    // 1. Google Analytics 4 (gtag)
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', eventName, eventParams);
    }
    
    // 2. Google Tag Manager (dataLayer)
    if (Array.isArray((window as any).dataLayer)) {
      (window as any).dataLayer.push({
        event: eventName,
        ...eventParams,
        timestamp: new Date().toISOString(),
      });
    }

    // Dev logging
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics Event] ${eventName}:`, eventParams);
    }
  }
}
