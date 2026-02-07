/**
 * Admin access control utilities
 * Validates admin hash token from URL fragment
 */

const ADMIN_TOKEN = '91bfa54128abedefcfe01e097af6ca29c994dd64108e32a63467963e477fde15';

/**
 * Parse admin token from URL hash
 */
export function getAdminTokenFromHash(): string | null {
  if (typeof window === 'undefined') return null;
  
  const hash = window.location.hash;
  const match = hash.match(/caffeineAdminToken=([a-f0-9]+)/);
  return match ? match[1] : null;
}

/**
 * Check if current session has valid admin access
 */
export function isAdminAuthorized(): boolean {
  const token = getAdminTokenFromHash();
  return token === ADMIN_TOKEN;
}

/**
 * Check if admin token exists in URL (regardless of validity)
 */
export function hasAdminToken(): boolean {
  return getAdminTokenFromHash() !== null;
}
