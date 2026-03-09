declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

export const GA_ID = 'G-5B7L2WNLNG';

export function pageview(path: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_ID, {
      page_path: path,
    });
  }
}

export function event({ action, category, label, value }: { action: string; category?: string; label?: string; value?: number; }) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value,
    });
  }
}

const analyticsDefault = {
  pageview,
  event,
};

export default analyticsDefault;
