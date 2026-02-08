#!/usr/bin/env bash
# Complete build verification sequence with strict error handling

set -euo pipefail

# Trap errors and print the failing command
trap 'echo "❌ Build verification failed at line $LINENO: $BASH_COMMAND"' ERR

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo "🔍 Starting build verification..."
echo ""

# Step 1: Verify static assets
echo "📦 Step 1/5: Verifying static assets..."
bash "$SCRIPT_DIR/verify-static-assets.sh"
echo ""

# Step 2: Install dependencies
echo "📦 Step 2/5: Installing dependencies..."
cd "$PROJECT_ROOT/frontend"
pnpm install --frozen-lockfile
echo "✅ Dependencies installed"
echo ""

# Step 3: TypeScript type check
echo "🔍 Step 3/5: Running TypeScript type check..."
pnpm typescript-check
echo "✅ TypeScript check passed"
echo ""

# Step 4: Lint check
echo "🔍 Step 4/5: Running lint check..."
pnpm lint
echo "✅ Lint check passed"
echo ""

# Step 5: Build
echo "🏗️  Step 5/5: Building frontend..."
pnpm build:skip-bindings
echo "✅ Build completed successfully"
echo ""

echo "✅ All verification steps passed!"
