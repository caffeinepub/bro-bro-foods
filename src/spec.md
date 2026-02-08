# Specification

## Summary
**Goal:** Retry the full build and deployment to reproduce and identify the exact deployment failure, fix missing static asset issues (especially under `/assets/generated`), and add a fast-fail pre-deploy verification step for the frontend.

**Planned changes:**
- Re-run an end-to-end build and deploy (frontend build, backend build, canister deploy/install) while capturing and surfacing the exact failing command output.
- Verify all frontend-referenced static assets exist at deploy time, and add any missing `/assets/generated/*` files into `frontend/public/assets/generated` to prevent missing-file build/deploy errors.
- Add a lightweight pre-deploy step that runs the existing frontend verification script (e.g., `frontend/scripts/verify-build.sh`) and aborts deployment early with actionable logs if it fails.

**User-visible outcome:** Deployment either completes successfully with a reachable, working app, or the exact failing step and error output is clearly surfaced so the issue can be fixed.
