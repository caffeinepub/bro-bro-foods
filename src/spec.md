# Specification

## Summary
**Goal:** Enable safe Google AdSense monetization on customer-facing pages with runtime configuration from within the app, without backend changes.

**Planned changes:**
- Wire `frontend/src/config/ads.ts` to support real AdSense provider head script injection and at least one ad slot snippet, gated by an `enabled` flag and non-empty configuration.
- Render at least one `AdSlot` on the customer landing page only (not on admin dashboard routes), ensuring the provider script is injected only once per page load.
- Add an owner-accessible in-app settings panel (English UI) to input AdSense client ID (`ca-pub-...`) and ad slot IDs (Top Banner required; Bottom Banner optional), persist to browser storage, and apply at runtime without redeploy.
- Default ads to off when running in a Capacitor environment, and ensure ads are not mounted/injected in admin experiences unless explicitly overridden by configuration.

**User-visible outcome:** The site owner can enter their AdSense client and slot IDs in an in-app settings screen; once saved, ads appear on the public landing page on web (not in admin, and disabled by default in the mobile wrapper) without needing a redeploy.
