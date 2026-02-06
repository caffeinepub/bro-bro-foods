/**
 * Utility to build WhatsApp deep link with pre-filled message
 */

interface WhatsAppMessageParams {
  orderId: string;
  plateTypeName: string;
  quantity: number;
  totalAmount: number;
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

export function openWhatsApp(params: WhatsAppMessageParams): boolean {
  const link = buildWhatsAppLink(params);
  const newWindow = window.open(link, '_blank', 'noopener,noreferrer');
  return newWindow !== null;
}
