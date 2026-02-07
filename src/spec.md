# Specification

## Summary
**Goal:** Show the Founder Dilkhush photo across the site wherever the default owner photo is currently used.

**Planned changes:**
- Add a square, web-optimized Founder Dilkhush photo asset under `frontend/public/assets/` using the provided generated filenames.
- Update all places that currently render the generic/default `OwnerPhoto` (including header, About, and the Owner/Meet-the-Owners section in `frontend/src/App.tsx`) to use the new founder image with alt text `"Founder Dilkhush"`.
- Update `frontend/src/components/OwnerPhoto.tsx` so its default `imageSrc` points to the new founder image asset (and remove `/assets/IMG-20260207-WA0000.jpg` as the default).
- Keep the existing on-error fallback behavior to `/assets/generated/profile-placeholder.dim_512x512.png`, and ensure the image is served as a static public asset (no backend routing).

**User-visible outcome:** The site displays Founder Dilkhush’s photo consistently in the header, About, and Meet-the-Owners sections, with a placeholder shown if the image fails to load.
