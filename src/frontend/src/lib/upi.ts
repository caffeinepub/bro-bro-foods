/**
 * UPI deep-link utility for opening payment apps
 */

import { BUSINESS_NAME } from '../config/payment';

interface UPIPaymentParams {
  vpa: string; // UPI ID (e.g., paytmuser123@paytm)
  amount: number;
  name?: string;
  note?: string;
}

/**
 * Build a UPI payment deep link
 */
export function buildUPILink({ vpa, amount, name = BUSINESS_NAME, note = 'Order Payment' }: UPIPaymentParams): string {
  const params = new URLSearchParams({
    pa: vpa,
    pn: name,
    am: amount.toString(),
    cu: 'INR',
    tn: note,
  });
  
  return `upi://pay?${params.toString()}`;
}

/**
 * Attempt to open Paytm app with UPI payment
 * Returns true if successful, false if blocked/unsupported
 */
export function openPaytm(params: UPIPaymentParams): boolean {
  const upiLink = buildUPILink(params);
  const paytmLink = `paytmmp://pay?${new URLSearchParams({
    pa: params.vpa,
    pn: params.name || BUSINESS_NAME,
    am: params.amount.toString(),
    cu: 'INR',
  }).toString()}`;
  
  // Try Paytm-specific deep link first, fallback to generic UPI
  try {
    const newWindow = window.open(paytmLink, '_blank');
    if (newWindow === null) {
      // Fallback to generic UPI link
      const fallbackWindow = window.open(upiLink, '_blank');
      return fallbackWindow !== null;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Attempt to open Google Pay with UPI payment
 * Returns true if successful, false if blocked/unsupported
 */
export function openGooglePay(params: UPIPaymentParams): boolean {
  const upiLink = buildUPILink(params);
  const gpayLink = `tez://upi/pay?${new URLSearchParams({
    pa: params.vpa,
    pn: params.name || BUSINESS_NAME,
    am: params.amount.toString(),
    cu: 'INR',
  }).toString()}`;
  
  try {
    const newWindow = window.open(gpayLink, '_blank');
    if (newWindow === null) {
      // Fallback to generic UPI link
      const fallbackWindow = window.open(upiLink, '_blank');
      return fallbackWindow !== null;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Attempt to open any UPI app with payment
 * Returns true if successful, false if blocked/unsupported
 */
export function openUPIApp(params: UPIPaymentParams): boolean {
  const upiLink = buildUPILink(params);
  
  try {
    const newWindow = window.open(upiLink, '_blank');
    return newWindow !== null;
  } catch {
    return false;
  }
}

/**
 * Copy UPI link to clipboard
 */
export async function copyUPILink(params: UPIPaymentParams): Promise<boolean> {
  const upiLink = buildUPILink(params);
  try {
    await navigator.clipboard.writeText(upiLink);
    return true;
  } catch {
    return false;
  }
}
