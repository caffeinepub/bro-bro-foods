/**
 * Runtime Environment Detection
 * 
 * Provides utilities to detect the runtime environment (web vs Capacitor native wrapper).
 */

/**
 * Detects if the app is running inside a Capacitor native wrapper
 * Uses safe feature detection to avoid false positives
 */
export function isCapacitorEnvironment(): boolean {
  // Check for Capacitor global object
  if (typeof window !== 'undefined' && 'Capacitor' in window) {
    return true;
  }

  // Check for common Capacitor plugins as fallback
  if (typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.()) {
    return true;
  }

  return false;
}

/**
 * Detects if the app is running in a standard web browser
 */
export function isWebEnvironment(): boolean {
  return !isCapacitorEnvironment();
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    Capacitor?: {
      isNativePlatform?: () => boolean;
      [key: string]: any;
    };
  }
}
