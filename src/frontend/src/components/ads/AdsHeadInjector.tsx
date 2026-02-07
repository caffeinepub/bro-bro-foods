import { useEffect } from 'react';
import { useAdsConfig } from '@/hooks/useAdsConfig';
import { injectProviderScript } from '@/lib/ads';

/**
 * AdsHeadInjector Component
 * 
 * Responsible for injecting the ad provider's head script into the document at runtime.
 * This component renders nothing visible but performs the injection as a side effect.
 * 
 * The injection happens only once per page load and only when ads are enabled.
 * Uses runtime configuration from useAdsConfig hook with extracted AdSense client ID.
 */
export default function AdsHeadInjector() {
  const { adsConfig } = useAdsConfig();

  useEffect(() => {
    // Only inject if ads are enabled and provider snippet is configured
    if (!adsConfig.enabled || !adsConfig.providerHeadSnippet.trim()) {
      return;
    }

    // Inject the provider script into the document head
    injectProviderScript(adsConfig.providerHeadSnippet);
  }, [adsConfig.enabled, adsConfig.providerHeadSnippet]);

  // This component renders nothing
  return null;
}
