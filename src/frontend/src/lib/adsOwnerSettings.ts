/**
 * Ad Owner Settings Persistence
 * 
 * Manages local storage of AdSense configuration settings.
 * Provides validation and notification mechanisms for runtime updates.
 */

const STORAGE_KEY = 'brobro_ads_settings';
const SETTINGS_CHANGE_EVENT = 'ads-settings-changed';

export interface AdsOwnerSettings {
  enabled: boolean;
  adsenseClientId: string;
  topBannerSlotId: string;
  bottomBannerSlotId: string;
  enableOnCapacitor: boolean;
}

/**
 * Default settings (ads disabled by default)
 */
const defaultSettings: AdsOwnerSettings = {
  enabled: false,
  adsenseClientId: '',
  topBannerSlotId: '',
  bottomBannerSlotId: '',
  enableOnCapacitor: false,
};

/**
 * Load settings from localStorage
 */
export function loadAdsSettings(): AdsOwnerSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return defaultSettings;
    }
    
    const parsed = JSON.parse(stored);
    return {
      ...defaultSettings,
      ...parsed,
    };
  } catch (error) {
    console.error('Failed to load ad settings:', error);
    return defaultSettings;
  }
}

/**
 * Save settings to localStorage and notify listeners
 */
export function saveAdsSettings(settings: AdsOwnerSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    
    // Dispatch custom event to notify components
    window.dispatchEvent(new CustomEvent(SETTINGS_CHANGE_EVENT, { detail: settings }));
  } catch (error) {
    console.error('Failed to save ad settings:', error);
    throw error;
  }
}

/**
 * Clear all settings
 */
export function clearAdsSettings(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(SETTINGS_CHANGE_EVENT, { detail: defaultSettings }));
  } catch (error) {
    console.error('Failed to clear ad settings:', error);
  }
}

/**
 * Validate settings for required fields
 */
export function validateAdsSettings(settings: AdsOwnerSettings): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (settings.enabled) {
    if (!settings.adsenseClientId.trim()) {
      errors.push('AdSense Client ID is required');
    } else if (!settings.adsenseClientId.startsWith('ca-pub-')) {
      errors.push('AdSense Client ID must start with "ca-pub-"');
    }

    if (!settings.topBannerSlotId.trim()) {
      errors.push('Top Banner Slot ID is required');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Subscribe to settings changes
 */
export function onAdsSettingsChange(callback: (settings: AdsOwnerSettings) => void): () => void {
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<AdsOwnerSettings>;
    callback(customEvent.detail);
  };

  window.addEventListener(SETTINGS_CHANGE_EVENT, handler);

  // Return unsubscribe function
  return () => {
    window.removeEventListener(SETTINGS_CHANGE_EVENT, handler);
  };
}
