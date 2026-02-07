/**
 * Ad Configuration
 * 
 * This module provides the static ad configuration structure and helper functions
 * for generating Google AdSense snippets at runtime.
 * 
 * The actual runtime configuration is managed by useAdsConfig hook which combines
 * these templates with user-provided settings from localStorage.
 */

export interface AdsConfig {
  enabled: boolean;
  providerHeadSnippet: string;
  slots: {
    topBanner: string;
    bottomBanner: string;
  };
}

/**
 * Default configuration (safe-by-default: disabled with empty snippets)
 */
export const defaultAdsConfig: AdsConfig = {
  enabled: false,
  providerHeadSnippet: '',
  slots: {
    topBanner: '',
    bottomBanner: '',
  },
};

/**
 * Generate Google AdSense provider head script
 */
export function generateAdSenseHeadScript(clientId: string): string {
  if (!clientId || !clientId.startsWith('ca-pub-')) {
    return '';
  }

  return `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}" crossorigin="anonymous"></script>`;
}

/**
 * Generate Google AdSense ad slot snippet
 */
export function generateAdSenseSlot(clientId: string, slotId: string): string {
  if (!clientId || !slotId) {
    return '';
  }

  return `
    <ins class="adsbygoogle"
      style="display:block"
      data-ad-client="${clientId}"
      data-ad-slot="${slotId}"
      data-ad-format="auto"
      data-full-width-responsive="true"></ins>
    <script>
      (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
  `.trim();
}
