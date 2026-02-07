/**
 * APK configuration for customer and admin apps
 */

export interface ApkConfig {
  url: string;
  version: string;
  label: string;
  unavailableMessage: string;
}

// Customer APK configuration
export const CUSTOMER_APK: ApkConfig = {
  url: 'https://meaningful-coffee-oyw-draft.caffeine.xyz/downloads/bro-bro-foods.apk',
  version: '1.0.0',
  label: 'Bro Bro Foods',
  unavailableMessage: 'The app is being prepared. Please check back in a few minutes.',
};

// Admin APK configuration
export const ADMIN_APK: ApkConfig = {
  url: 'https://meaningful-coffee-oyw-draft.caffeine.xyz/downloads/bro-bro-foods-admin.apk',
  version: '1.0.0',
  label: 'Bro Bro Foods Admin',
  unavailableMessage: 'Admin app is being prepared. Please check back later.',
};

// Default export for backward compatibility (customer APK)
export default CUSTOMER_APK;
