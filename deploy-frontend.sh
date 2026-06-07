#!/bin/bash
# =============================================================================
# INFINITI Frontend Deploy Script
# =============================================================================
# Single source of truth for production frontend deployment.
#
# Production path: /var/www/Infiniti/dist
# Source path:     /var/www/Infiniti/frontend
#
# Usage:
#   ./deploy-frontend.sh          — Full build + deploy
#   ./deploy-frontend.sh --skip-build  — Deploy existing build (from frontend/dist)
#
# This script:
#   1. Builds the frontend with vite
#   2. Generates build-info.json with commit, branch, timestamps
#   3. Atomically replaces the production dist directory
#   4. Verifies the deployment
#   5. Cleans up temporary files
# =============================================================================

set -euo pipefail

# --- Configuration ---
PROJECT_ROOT="/var/www/Infiniti"
FRONTEND_DIR="${PROJECT_ROOT}/frontend"
PRODUCTION_DIR="${PROJECT_ROOT}/dist"
BACKUP_DIR="${PROJECT_ROOT}/dist.bak"
BUILD_DIR="${FRONTEND_DIR}/dist"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# --- Colors ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# --- Functions ---
log_info()  { echo -e "${GREEN}[DEPLOY]${NC} $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

cleanup_stale_public_dist() {
    # Remove the stale nested dist inside frontend/public/ that causes confusion
    if [ -d "${FRONTEND_DIR}/public/dist" ]; then
        log_warn "Removing stale ${FRONTEND_DIR}/public/dist/ (old build artifact)"
        rm -rf "${FRONTEND_DIR}/public/dist"
    fi
}

get_git_info() {
    cd "${PROJECT_ROOT}"
    GIT_COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
    GIT_COMMIT_FULL=$(git rev-parse HEAD 2>/dev/null || echo "unknown")
    GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
    GIT_MESSAGE=$(git log -1 --pretty=%s 2>/dev/null || echo "unknown")
}

build_frontend() {
    log_info "Building frontend..."
    cd "${FRONTEND_DIR}"

    # Clean previous build
    rm -rf "${BUILD_DIR}"

    # Run vite build
    npx vite build 2>&1 | tail -5

    if [ ! -f "${BUILD_DIR}/index.html" ]; then
        log_error "Build failed — no index.html in ${BUILD_DIR}"
        exit 1
    fi

    log_info "Build completed successfully."
}

generate_build_info() {
    log_info "Generating build-info.json..."

    cat > "${BUILD_DIR}/build-info.json" << EOF
{
  "commit": "${GIT_COMMIT}",
  "commit_full": "${GIT_COMMIT_FULL}",
  "branch": "${GIT_BRANCH}",
  "message": "${GIT_MESSAGE}",
  "build_timestamp": "${TIMESTAMP}",
  "deploy_timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "target_path": "${PRODUCTION_DIR}",
  "node_version": "$(node --version 2>/dev/null || echo 'unknown')",
  "vite_version": "$(npx vite --version 2>/dev/null || echo 'unknown')"
}
EOF

    log_info "build-info.json generated."
}

deploy_to_production() {
    log_info "Deploying to production: ${PRODUCTION_DIR}"

    # Backup current production (keep only last backup)
    if [ -d "${PRODUCTION_DIR}" ]; then
        rm -rf "${BACKUP_DIR}"
        cp -a "${PRODUCTION_DIR}" "${BACKUP_DIR}"
        log_info "Backup created at ${BACKUP_DIR}"
    fi

    # Atomic-ish replacement: remove old assets, copy new ones
    # Keep static assets that are NOT part of the vite build (icons, images, logos, etc.)
    # but replace index.html and assets/ directory

    # Remove old hashed assets
    rm -rf "${PRODUCTION_DIR}/assets"

    # Copy new build output
    cp -f "${BUILD_DIR}/index.html" "${PRODUCTION_DIR}/index.html"
    cp -rf "${BUILD_DIR}/assets" "${PRODUCTION_DIR}/assets"
    cp -f "${BUILD_DIR}/build-info.json" "${PRODUCTION_DIR}/build-info.json"

    # Update sw.js and manifest.json if they exist in the build
    [ -f "${BUILD_DIR}/sw.js" ] && cp -f "${BUILD_DIR}/sw.js" "${PRODUCTION_DIR}/sw.js"
    [ -f "${BUILD_DIR}/manifest.json" ] && cp -f "${BUILD_DIR}/manifest.json" "${PRODUCTION_DIR}/manifest.json"

    log_info "Production files updated."
}

verify_deployment() {
    log_info "Verifying deployment..."

    # Check index.html references match actual asset files
    local JS_FILE=$(grep -oP 'src="/assets/\K[^"]+' "${PRODUCTION_DIR}/index.html")
    local CSS_FILE=$(grep -oP 'href="/assets/\K[^"]+' "${PRODUCTION_DIR}/index.html")

    if [ -f "${PRODUCTION_DIR}/assets/${JS_FILE}" ]; then
        log_info "  JS bundle verified: ${JS_FILE}"
    else
        log_error "  JS bundle MISSING: ${JS_FILE}"
        rollback
        exit 1
    fi

    if [ -f "${PRODUCTION_DIR}/assets/${CSS_FILE}" ]; then
        log_info "  CSS bundle verified: ${CSS_FILE}"
    else
        log_error "  CSS bundle MISSING: ${CSS_FILE}"
        rollback
        exit 1
    fi

    if [ -f "${PRODUCTION_DIR}/build-info.json" ]; then
        log_info "  build-info.json verified."
        cat "${PRODUCTION_DIR}/build-info.json"
    else
        log_warn "  build-info.json missing (non-critical)."
    fi

    echo ""
    log_info "=== Deployment successful ==="
    log_info "  Commit:    ${GIT_COMMIT} (${GIT_BRANCH})"
    log_info "  Built at:  ${TIMESTAMP}"
    log_info "  Target:    ${PRODUCTION_DIR}"
    echo ""
}

rollback() {
    log_error "Deployment failed. Rolling back..."
    if [ -d "${BACKUP_DIR}" ]; then
        rm -rf "${PRODUCTION_DIR}"
        mv "${BACKUP_DIR}" "${PRODUCTION_DIR}"
        log_info "Rollback complete."
    else
        log_error "No backup available for rollback!"
    fi
}

# --- Main ---
log_info "=== INFINITI Frontend Deploy ==="
log_info "Timestamp: ${TIMESTAMP}"

# Parse arguments
SKIP_BUILD=false
for arg in "$@"; do
    case $arg in
        --skip-build) SKIP_BUILD=true ;;
        *) log_warn "Unknown argument: $arg" ;;
    esac
done

# Get git info
get_git_info
log_info "Git: ${GIT_COMMIT} on ${GIT_BRANCH}"

# Remove stale public/dist
cleanup_stale_public_dist

# Build (unless skipped)
if [ "$SKIP_BUILD" = false ]; then
    build_frontend
else
    log_info "Skipping build (--skip-build flag)"
    if [ ! -f "${BUILD_DIR}/index.html" ]; then
        log_error "No existing build found at ${BUILD_DIR}. Cannot deploy."
        exit 1
    fi
fi

# Generate build-info.json
generate_build_info

# Deploy
deploy_to_production

# Verify
verify_deployment

log_info "Done. Frontend is live at https://console.infiniti.stream"
