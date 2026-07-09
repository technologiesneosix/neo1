import { useEffect } from 'react';
import { useSiteSettings } from '@/api/hooks';

/**
 * Updates the browser tab favicon whenever site settings change.
 * Call this once at the App root level.
 */
export function useFavicon() {
  const { settings } = useSiteSettings();

  useEffect(() => {
    const faviconUrl = settings?.faviconUrl;
    if (!faviconUrl) return;

    // Update or create the <link rel="icon"> tag
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = faviconUrl;

    // Also update shortcut icon if present
    let shortcut = document.querySelector<HTMLLinkElement>('link[rel="shortcut icon"]');
    if (shortcut) {
      shortcut.href = faviconUrl;
    }

    // Update document title to site name if available
    if (settings?.siteName) {
      // Only update if title hasn't been overridden by a page-level helmet
      const currentTitle = document.title;
      if (!currentTitle || currentTitle === 'Vite App') {
        document.title = settings.siteName;
      }
    }
  }, [settings?.faviconUrl, settings?.siteName]);
}
