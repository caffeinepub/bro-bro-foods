/**
 * APK configuration for customer and admin apps
 */

export interface ApkConfig {
  url: string;
  version: string;
  label: string;
  filename: string;
  unavailableMessage: string;
}

// Customer APK configuration
export const CUSTOMER_APK: ApkConfig = {
  url: '/downloads/bro-bro-foods.apk',
  version: '1.0.0',
  label: 'Bro Bro Foods',
  filename: 'bro-bro-foods.apk',
  unavailableMessage: 'The app is being prepared. Please check back in a few minutes.',
};

// Admin APK configuration
export const ADMIN_APK: ApkConfig = {
  url: '/downloads/bro-bro-foods-admin.apk',
  version: '1.0.0',
  label: 'Bro Bro Foods Admin',
  filename: 'bro-bro-foods-admin.apk',
  unavailableMessage: 'Admin app is being prepared. Please check back later.',
};

// Default export for backward compatibility (customer APK)
export default CUSTOMER_APK;
