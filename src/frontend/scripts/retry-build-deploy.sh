#!/usr/bin/env bash
# Full build+deploy runner with comprehensive logging

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$PROJECT_ROOT/build-deploy-$TIMESTAMP.log"

echo "🍿 Starting full build+deploy sequence..."
echo "📝 Logging to: $LOG_FILE"
echo ""

# Function to log and execute a command
run_step() {
  local step_name="$1"
  local step_command="$2"
  
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a "$LOG_FILE"
  echo "🔧 $step_name" | tee -a "$LOG_FILE"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a "$LOG_FILE"
  echo "" | tee -a "$LOG_FILE"
  
  if eval "$step_command" 2>&1 | tee -a "$LOG_FILE"; then
    echo "" | tee -a "$LOG_FILE"
    echo "✅ $step_name - SUCCESS" | tee -a "$LOG_FILE"
    echo "" | tee -a "$LOG_FILE"
    return 0
  else
    local exit_code=$?
    echo "" | tee -a "$LOG_FILE"
    echo "❌ $step_name - FAILED (exit code: $exit_code)" | tee -a "$LOG_FILE"
    echo "" | tee -a "$LOG_FILE"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a "$LOG_FILE"
    echo "❌ BUILD/DEPLOY FAILED AT: $step_name" | tee -a "$LOG_FILE"
    echo "📝 Full log: $LOG_FILE" | tee -a "$LOG_FILE"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a "$LOG_FILE"
    return $exit_code
  fi
}

cd "$PROJECT_ROOT"

# Step 1: Pre-deploy verification
if ! run_step "Pre-deploy Verification" "bash frontend/scripts/predeploy-verify.sh"; then
  exit 1
fi

# Step 2: Generate backend bindings
if ! run_step "Generate Backend Bindings" "dfx generate backend"; then
  exit 1
fi

# Step 3: Build backend
if ! run_step "Build Backend" "dfx build backend"; then
  exit 1
fi

# Step 4: Deploy/Install canisters
if ! run_step "Deploy Canisters" "dfx deploy"; then
  exit 1
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a "$LOG_FILE"
echo "✅ BUILD+DEPLOY COMPLETED SUCCESSFULLY" | tee -a "$LOG_FILE"
echo "📝 Full log: $LOG_FILE" | tee -a "$LOG_FILE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a "$LOG_FILE"
