#!/bin/bash
set -e

echo "🔍 Starting frontend build verification..."
echo ""

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
cd frontend
pnpm install
echo "✅ Dependencies installed"
echo ""

# Step 2: Run TypeScript type check (if configured)
if grep -q "typescript-check" package.json; then
  echo "🔎 Running TypeScript type check..."
  pnpm run typescript-check
  echo "✅ TypeScript check passed"
  echo ""
fi

# Step 3: Run linter (if configured)
if grep -q "\"lint\":" package.json; then
  echo "🧹 Running linter..."
  pnpm run lint
  echo "✅ Lint check passed"
  echo ""
fi

# Step 4: Build frontend
echo "🏗️  Building frontend..."
pnpm run build:skip-bindings
echo "✅ Frontend build successful"
echo ""

echo "✨ All verification steps passed!"
echo "Your frontend is ready for deployment."
