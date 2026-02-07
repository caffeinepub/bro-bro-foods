import { CUSTOMER_APK, ADMIN_APK, type ApkConfig } from '@/config/apk';

/**
 * Check if an APK is available for download
 */
async function checkApkAvailabilityForConfig(config: ApkConfig): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(config.url, {
      method: 'HEAD',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Initiate APK download
 */
function downloadApkFromConfig(config: ApkConfig): void {
  const link = document.createElement('a');
  link.href = config.url;
  link.download = `${config.label.toLowerCase().replace(/\s+/g, '-')}.apk`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Get unavailable message for an APK config
 */
function getUnavailableMessageForConfig(config: ApkConfig): string {
  return config.unavailableMessage;
}

// Customer APK functions (default exports for backward compatibility)
export async function checkApkAvailability(): Promise<boolean> {
  return checkApkAvailabilityForConfig(CUSTOMER_APK);
}

export function downloadApk(): void {
  downloadApkFromConfig(CUSTOMER_APK);
}

export function getUnavailableMessage(): string {
  return getUnavailableMessageForConfig(CUSTOMER_APK);
}

// Admin APK functions
export async function checkAdminApkAvailability(): Promise<boolean> {
  return checkApkAvailabilityForConfig(ADMIN_APK);
}

export function downloadAdminApk(): void {
  downloadApkFromConfig(ADMIN_APK);
}

export function getAdminApkUnavailableMessage(): string {
  return getUnavailableMessageForConfig(ADMIN_APK);
}
