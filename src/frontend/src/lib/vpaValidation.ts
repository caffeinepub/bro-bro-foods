/**
 * VPA (Virtual Payment Address) validation utility
 * Validates UPI ID format and rejects common placeholder patterns
 */

/**
 * Common placeholder patterns that indicate an unconfigured VPA
 */
const PLACEHOLDER_PATTERNS = [
  /^paytmuser123@/i,
  /^test@/i,
  /^demo@/i,
  /^example@/i,
  /^placeholder@/i,
  /^dummy@/i,
  /^sample@/i,
  /^user123@/i,
];

/**
 * Validates if a VPA (UPI ID) is valid and configured
 * 
 * @param vpa - The UPI VPA to validate (e.g., "username@paytm")
 * @returns true if VPA is valid and not a placeholder, false otherwise
 * 
 * @example
 * isValidVPA('john@paytm') // true
 * isValidVPA('paytmuser123@paytm') // false (placeholder)
 * isValidVPA('invalid') // false (no @ symbol)
 * isValidVPA('') // false (empty)
 */
export function isValidVPA(vpa: string): boolean {
  // Check if VPA is empty or whitespace
  if (!vpa || !vpa.trim()) {
    return false;
  }

  // Basic UPI ID format: username@bank
  // Must contain exactly one @ symbol
  const parts = vpa.split('@');
  if (parts.length !== 2) {
    return false;
  }

  const [username, bank] = parts;

  // Username and bank parts must not be empty
  if (!username || !bank || username.length === 0 || bank.length === 0) {
    return false;
  }

  // Check against placeholder patterns
  for (const pattern of PLACEHOLDER_PATTERNS) {
    if (pattern.test(vpa)) {
      return false;
    }
  }

  return true;
}

/**
 * Get a user-friendly error message for invalid VPA
 */
export function getVPAErrorMessage(): string {
  return 'Payment link is not available right now. Please scan the QR code to pay.';
}
