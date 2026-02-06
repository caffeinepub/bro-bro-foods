# Specification

## Summary
**Goal:** After an order is successfully placed, show a single post-order confirmation UI that includes a Paytm QR code for payment and a clear bill breakdown in English.

**Planned changes:**
- Add a post-order confirmation modal/screen that is shown only after backend order creation succeeds, and include the Paytm QR code image in it.
- In the confirmation UI, display a bill breakdown showing Items Total (from the created order’s returned total amount), Delivery Charge (₹20), and Grand Total (Items Total + ₹20).
- Ensure the same confirmation UI (with Paytm QR + bill breakdown) is shown regardless of whether WhatsApp auto-open succeeds or a popup-block fallback link is presented, without showing duplicate modals.

**User-visible outcome:** After placing an order, the user sees a single confirmation screen/modal in English with a Paytm QR code to pay and a bill breakdown (items total, ₹20 delivery charge, and grand total), even if WhatsApp opens or a fallback link is shown.
