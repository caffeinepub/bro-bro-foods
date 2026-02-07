/**
 * Admin access control utilities
 * Validates admin PIN from URL fragment and provides helpers for setting/clearing PINs
 */

const ADMIN_PIN = '7973';

/**
 * Parse admin token from URL hash
 */
export function getAdminTokenFromHash(): string | null {
  if (typeof window === 'undefined') return null;
  
  const hash = window.location.hash;
  if (!hash) return null;
  
  // Parse hash parameters more robustly
  const params = new URLSearchParams(hash.substring(1));
  return params.get('caffeineAdminToken');
}

/**
 * Check if current session has valid admin access
 */
export function isAdminAuthorized(): boolean {
  const token = getAdminTokenFromHash();
  return token === ADMIN_PIN;
}

/**
 * Check if admin token exists in URL (regardless of validity)
 */
export function hasAdminToken(): boolean {
  return getAdminTokenFromHash() !== null;
}

/**
 * Set admin token in URL hash
 */
export function setAdminToken(token: string): void {
  if (typeof window === 'undefined') return;
  
  const params = new URLSearchParams(window.location.hash.substring(1));
  params.set('caffeineAdminToken', token);
  window.location.hash = params.toString();
}

/**
 * Clear admin token from URL hash
 */
export function clearAdminToken(): void {
  if (typeof window === 'undefined') return;
  
  const params = new URLSearchParams(window.location.hash.substring(1));
  params.delete('caffeineAdminToken');
  
  const newHash = params.toString();
  if (newHash) {
    window.location.hash = newHash;
  } else {
    // Remove hash entirely if no other params
    // Use pushState to avoid triggering hashchange when clearing
    const newUrl = window.location.pathname + window.location.search;
    window.history.pushState(null, '', newUrl);
    // Manually trigger hashchange event for reactive hooks
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  }
}

/**
 * Validate if a token matches the expected admin PIN
 */
export function validateAdminToken(token: string): boolean {
  return token === ADMIN_PIN;
}
