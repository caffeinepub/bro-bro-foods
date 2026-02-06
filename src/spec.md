# Specification

## Summary
**Goal:** Enhance the Order Now flow to support selecting a plate quantity, display a live computed total amount, and enforce a configurable minimum delivery order rule.

**Planned changes:**
- Update the Order Now form UI to include a quantity control (min 1) alongside selecting exactly one plate type, and show an English-only price breakdown (unit price, quantity, total).
- Add a minimum delivery order validation (defined as a single easy-to-change constant) that blocks order submission and shows an English validation message when not met.
- Extend the backend order model and `createOrder` API to accept `quantity`, compute `totalAmount` (unit price × quantity), persist both, and return them via order APIs.
- Wire the end-to-end flow: update frontend types and `useCreateOrder` payload/response handling, and include quantity + total amount (₹) in the WhatsApp deep-link message while keeping the success UI functional.

**User-visible outcome:** Customers can choose Half/Full plate and a quantity, immediately see the total amount, and can only place an order when the minimum delivery order requirement is satisfied; the confirmation/WhatsApp message includes quantity and total amount.
