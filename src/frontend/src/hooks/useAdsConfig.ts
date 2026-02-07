/**
 * Runtime Ads Configuration Hook
 * 
 * Provides reactive runtime ads configuration that combines:
 * - User settings from localStorage
 * - Environment detection (Capacitor vs web)
 * - Admin context awareness
 * - Dynamic AdSense snippet generation
 */

import { useState, useEffect } from 'react';
import { defaultAdsConfig, generateAdSenseHeadScript, generateAdSenseSlot } from '@/config/ads';
import { loadAdsSettings, onAdsSettingsChange, type AdsOwnerSettings } from '@/lib/adsOwnerSettings';
import { isCapacitorEnvironment } from '@/lib/runtimeEnvironment';
import type { AdsConfig } from '@/config/ads';

interface UseAdsConfigOptions {
  /**
   * Whether the app is currently in admin mode
   * Ads are always disabled in admin mode
   */
  isAdminMode?: boolean;
}

/**
 * Hook that provides runtime ads configuration
 * Automatically updates when settings change
 */
export function useAdsConfig(options: UseAdsConfigOptions = {}): {
  adsConfig: AdsConfig;
  isEnabled: boolean;
  settings: AdsOwnerSettings;
} {
  const { isAdminMode = false } = options;
  const [settings, setSettings] = useState<AdsOwnerSettings>(loadAdsSettings);

  // Subscribe to settings changes
  useEffect(() => {
    const unsubscribe = onAdsSettingsChange((newSettings) => {
      setSettings(newSettings);
    });

    return unsubscribe;
  }, []);

  // Compute effective ads configuration
  const adsConfig: AdsConfig = (() => {
    // Always disable in admin mode
    if (isAdminMode) {
      return defaultAdsConfig;
    }

    // Check Capacitor environment
    const isCapacitor = isCapacitorEnvironment();
    if (isCapacitor && !settings.enableOnCapacitor) {
      return defaultAdsConfig;
    }

    // Check if settings are valid and enabled
    if (!settings.enabled || !settings.adsenseClientId || !settings.topBannerSlotId) {
      return defaultAdsConfig;
    }

    // Generate runtime configuration
    return {
      enabled: true,
      providerHeadSnippet: generateAdSenseHeadScript(settings.adsenseClientId),
      slots: {
        topBanner: generateAdSenseSlot(settings.adsenseClientId, settings.topBannerSlotId),
        bottomBanner: settings.bottomBannerSlotId
          ? generateAdSenseSlot(settings.adsenseClientId, settings.bottomBannerSlotId)
          : '',
      },
    };
  })();

  return {
    adsConfig,
    isEnabled: adsConfig.enabled,
    settings,
  };
}
