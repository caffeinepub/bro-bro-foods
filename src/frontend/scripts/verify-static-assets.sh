#!/usr/bin/env bash
# Verify that all required static assets exist before build/deploy

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
ASSETS_DIR="$PROJECT_ROOT/frontend/public/assets/generated"

# List of required static assets
REQUIRED_ASSETS=(
  "brobro-logo.dim_512x512.png"
  "hero-momos-bg.dim_1920x1080.png"
  "founder-dilkhush.dim_512x512.jpg"
  "founder-dilkhush.dim_128x128.jpg"
  "founder-rohit.dim_512x512.jpg"
  "founder-rohit.dim_128x128.jpg"
  "profile-placeholder.dim_512x512.png"
  "android-app-icon.dim_1024x1024.png"
)

echo "🔍 Verifying static assets in $ASSETS_DIR..."

MISSING_FILES=()

for asset in "${REQUIRED_ASSETS[@]}"; do
  if [[ ! -f "$ASSETS_DIR/$asset" ]]; then
    MISSING_FILES+=("$asset")
  fi
done

if [[ ${#MISSING_FILES[@]} -eq 0 ]]; then
  echo "✅ All required static assets are present"
  exit 0
else
  echo "❌ Missing static assets:"
  for file in "${MISSING_FILES[@]}"; do
    echo "  - $file"
  done
  echo ""
  echo "Please ensure all required assets are placed in frontend/public/assets/generated/"
  exit 1
fi
