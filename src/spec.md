# Specification

## Summary
**Goal:** Move “Ad Settings / Owner Settings” out of the public customer UI into the Admin Dashboard, and protect access with PIN 7973.

**Planned changes:**
- Remove the “Ad Settings / Owner Settings” entry from the public site footer (including removing the arrow/chevron indicator) and ensure there is no customer-facing navigation path to it.
- Add an “Owner Settings” section inside the Admin Dashboard and render the existing Ads settings UI (reuse `AdsSettingsPanel`) only within the admin experience.
- Add PIN protection (7973) for accessing Owner Settings / Ad Settings, with a flow similar to the existing Admin Login modal: prompt when not authorized, show an English error on incorrect PIN, and avoid re-prompting within the same authorized session/state.

**User-visible outcome:** Customers no longer see “Ad Settings” in the footer (or anywhere else). Admin users can open “Owner Settings” in the Admin Dashboard and access Ad Settings after entering PIN 7973 (only once per authorized session).
