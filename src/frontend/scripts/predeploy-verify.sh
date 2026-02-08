#!/usr/bin/env bash
# Pre-deploy verification wrapper that aborts on failure

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Running pre-deploy verification..."
echo ""

if bash "$SCRIPT_DIR/verify-build.sh"; then
  echo ""
  echo "✅ Pre-deploy verification passed - ready to deploy"
  exit 0
else
  echo ""
  echo "❌ Pre-deploy verification failed - aborting deployment"
  echo "Please fix the errors above before deploying"
  exit 1
fi
