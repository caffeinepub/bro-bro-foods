# APK Downloads Directory

This directory contains Android APK files that users can download directly from the website.

## Required Files

### Customer APK
- **Filename:** `brobro-foods-customer.apk`
- **Path:** `frontend/public/downloads/brobro-foods-customer.apk`
- **Purpose:** Main customer-facing Android app

### Admin APK (Optional)
- **Filename:** `brobro-foods-admin.apk`
- **Path:** `frontend/public/downloads/brobro-foods-admin.apk`
- **Purpose:** Admin dashboard Android app

## Build Instructions

To build and place APK files, follow the comprehensive guide in:
**`frontend/README-android-apk.md`**

### Quick Build Steps

1. **Verify frontend builds successfully:**
   ```bash
   cd frontend
   ./scripts/verify-build.sh
   ```

2. **Build the React app:**
   ```bash
   pnpm run build:skip-bindings
   ```

3. **Sync with Capacitor:**
   ```bash
   npx cap sync android
   ```

4. **Build APK in Android Studio:**
   ```bash
   npx cap open android
   # Then: Build → Build Bundle(s) / APK(s) → Build APK(s)
   ```

5. **Copy APK to this directory:**
   ```bash
   cp android/app/build/outputs/apk/debug/app-debug.apk public/downloads/brobro-foods-customer.apk
   ```

## Deployment Considerations

### Static Assets in Build
- APK files placed in `frontend/public/downloads/` are copied to the build output during `pnpm run build`
- The built files will be in `frontend/dist/downloads/`
- Ensure APKs are present **before** running the build command

### File Size Warning
- APK files are typically 5-50 MB
- Large files increase deployment time
- Consider hosting APKs on external CDN for production

### Availability Check
The app automatically checks APK availability by:
1. Sending a HEAD request to `/downloads/brobro-foods-customer.apk`
2. Checking for 200 status code
3. Reading Content-Length header for file size
4. Displaying size on download button (e.g., "Download App (8.5 MB)")

If APK is not available:
- Download button shows configured unavailable message
- No broken download links

## Version Control

### Do NOT Commit
- `*.apk` files (large binary files)
- Add to `.gitignore`:
  ```
  frontend/public/downloads/*.apk
  ```

### Do Commit
- `.gitkeep` file (preserves directory structure)
- This README.md

## Configuration

APK settings are centralized in:
**`frontend/src/config/apk.ts`**

Update this file to change:
- APK filenames
- Version numbers
- Download button labels
- Unavailable messages

## Local Development

During local development:
- APK files are optional
- App gracefully handles missing APKs
- Download button shows unavailable message if APK not found

## Production Deployment

Before deploying to production:
1. **Run build verification:**
   ```bash
   ./frontend/scripts/verify-build.sh
   ```
2. **Build and place APKs** (if offering app downloads)
3. **Rebuild frontend** to include APKs in dist
4. **Test download functionality** after deployment

## Troubleshooting

### APK Not Downloading
- Verify filename matches config: `brobro-foods-customer.apk`
- Check file exists in `frontend/public/downloads/`
- Rebuild frontend after adding APK
- Clear browser cache

### Size Not Showing
- Ensure server sends `Content-Length` header
- Check CORS settings if hosted on different domain
- Verify HEAD request is allowed

### Build Failures
- Run verification script first: `./scripts/verify-build.sh`
- Check TypeScript errors: `pnpm run typescript-check`
- Check lint errors: `pnpm run lint`
- Ensure all dependencies installed: `pnpm install`

---

For detailed build instructions and troubleshooting, see:
**`frontend/README-android-apk.md`**
