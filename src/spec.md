# Specification

## Summary
**Goal:** Add an admin-only dashboard (and separate Admin APK download) to track orders with time/date, payment details, and a status timeline.

**Planned changes:**
- Add an admin-only dashboard route/entry gated by an admin token in the URL hash (continuing support for `#caffeineAdminToken=...`) and ensure admin data is not accessible without the token.
- Implement an admin orders list/table showing: Order ID, item name, quantity, total amount, created date/time, payment status, UTR (when available), and paid date/time (when available), using English-only labels.
- Add an order detail view (modal or section) to inspect all stored fields and display a chronological timeline (created time, status changes, and paid time when available).
- Extend the backend order model to store current order status and a persisted status-change history (timeline) with server-side timestamps and the actor/admin action as the changer.
- Add backend APIs to update an order’s status (appending a timeline event) and to fetch orders including status + timeline data needed by the admin UI.
- Add admin UI actions: status dropdown (Pending/Accepted/Preparing/Out for Delivery/Delivered/Cancelled) and list filters (newest-first default, filter by payment status, filter by order status).
- Add separate configuration for customer APK vs admin APK, and add an admin-only “Download Admin App” button that checks availability and downloads the admin APK (or shows a clear English message if unavailable).

**User-visible outcome:** When opening the app with the valid admin hash token, an Admin Dashboard is available to review and filter orders, inspect full details and timelines, update order statuses, and download a separate Admin APK; without the token, admin screens and order data are not accessible.
