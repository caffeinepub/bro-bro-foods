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
 * Get APK size in MB from Content-Length header
 * Returns formatted string like "12.4 MB" or null if unavailable
 */
async function getApkSizeForConfig(config: ApkConfig): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(config.url, {
      method: 'HEAD',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return null;
    }

    const contentLength = response.headers.get('Content-Length');
    if (!contentLength) {
      return null;
    }

    const bytes = parseInt(contentLength, 10);
    if (isNaN(bytes)) {
      return null;
    }

    const megabytes = bytes / (1024 * 1024);
    return `${megabytes.toFixed(1)} MB`;
  } catch (error) {
    return null;
  }
}

/**
 * Initiate APK download
 */
function downloadApkFromConfig(config: ApkConfig): void {
  const link = document.createElement('a');
  link.href = config.url;
  link.download = config.filename;
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

export async function getApkSize(): Promise<string | null> {
  return getApkSizeForConfig(CUSTOMER_APK);
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

export async function getAdminApkSize(): Promise<string | null> {
  return getApkSizeForConfig(ADMIN_APK);
}

export function downloadAdminApk(): void {
  downloadApkFromConfig(ADMIN_APK);
}

export function getAdminApkUnavailableMessage(): string {
  return getUnavailableMessageForConfig(ADMIN_APK);
}
