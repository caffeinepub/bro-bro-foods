/**
 * Utility to build WhatsApp deep link with pre-filled message
 */

interface WhatsAppMessageParams {
  orderId: string;
  plateTypeName: string;
  quantity: number;
  totalAmount: number;
}

interface WhatsAppPaymentConfirmationParams {
  orderId: string;
  grandTotal: number;
  utr: string;
  paidVia: string;
}

interface WhatsAppScreenshotRequestParams {
  orderId: string;
  grandTotal: number;
}

export function buildWhatsAppLink({ orderId, plateTypeName, quantity, totalAmount }: WhatsAppMessageParams): string {
  const phoneNumber = '7973782618';
  const message = `Hello! I just placed an order on Bro Bro Foods.

Order ID: #${orderId}
Item: ${plateTypeName}
Quantity: ${quantity} plate${quantity > 1 ? 's' : ''}
Total Amount: ₹${totalAmount}

Please confirm my order. Thank you!`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}

export function buildWhatsAppPaymentConfirmationLink({ orderId, grandTotal, utr, paidVia }: WhatsAppPaymentConfirmationParams): string {
  const phoneNumber = '7973782618';
  const message = `Payment Completed for Order #${orderId}

Grand Total: ₹${grandTotal}
UPI Transaction ID (UTR): ${utr}
Paid via: ${paidVia}

Please confirm receipt. Thank you!`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}

export function buildWhatsAppScreenshotRequestLink({ orderId, grandTotal }: WhatsAppScreenshotRequestParams): string {
  const phoneNumber = '7973782618';
  const message = `Hello! I have completed the payment for my order.

Order ID: #${orderId}
Grand Total: ₹${grandTotal}

I am sending the payment screenshot for confirmation. Please verify and confirm my order. Thank you!`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}

export function openWhatsApp(params: WhatsAppMessageParams): boolean {
  const link = buildWhatsAppLink(params);
  const newWindow = window.open(link, '_blank', 'noopener,noreferrer');
  return newWindow !== null;
}

export function openWhatsAppPaymentConfirmation(params: WhatsAppPaymentConfirmationParams): boolean {
  const link = buildWhatsAppPaymentConfirmationLink(params);
  const newWindow = window.open(link, '_blank', 'noopener,noreferrer');
  return newWindow !== null;
}

export function openWhatsAppScreenshotRequest(params: WhatsAppScreenshotRequestParams): boolean {
  const link = buildWhatsAppScreenshotRequestLink(params);
  const newWindow = window.open(link, '_blank', 'noopener,noreferrer');
  return newWindow !== null;
}
