declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

export const GA_ID = 'G-5B7L2WNLNG';

export function pageview(path: string) {
  if (typeof window !== 'undefined') {
    if (window.gtag) {
      console.log('[Analytics] pageview:', path);
      window.gtag('config', GA_ID, {
        page_path: path,
      });
    } else if (window.dataLayer) {
      window.dataLayer.push({
        'event': 'page_view',
        'page_path': path,
        'page_title': document.title,
      });
      console.log('[Analytics] pageview via dataLayer:', path);
    }
  }
}

export function event(action: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    try {
      if (window.gtag) {
        console.log('[Analytics] event:', { action, params });
        window.gtag('event', action, {
          ...params,
        });
      } else if (window.dataLayer) {
        // Push directly to dataLayer if gtag not available yet
        window.dataLayer.push({
          'event': action,
          ...params,
        });
        console.log('[Analytics] event via dataLayer:', { action, params });
      } else {
        console.warn('[Analytics] gtag and dataLayer not available');
      }
    } catch (err) {
      console.error('[Analytics] Error sending event:', err);
    }
  }
}

const analyticsDefault = {
  pageview,
  event,
};

export default analyticsDefault;
