#!/bin/bash
# Apply all ISSUE-001 through ISSUE-005 fixes
set -e

FRONTEND="/var/www/Infiniti/frontend/src"

echo "=== ISSUE-001: Fix project list refresh ==="
# Already prepared as a file, will be copied separately

echo "=== ISSUE-002: Fix Deal Room styling ==="
# Already prepared as a file, will be copied separately

echo "=== ISSUE-003: Fix Growth Plan empty state ==="
cd /var/www/Infiniti
python3 /tmp/patch_growth_plan.py

echo "=== ISSUE-004: Fix Valuation empty state ==="
python3 /tmp/patch_valuation.py

echo "=== ISSUE-005: Create ComingSoonPage and register routes ==="
# Create directory for ComingSoonPage
mkdir -p "$FRONTEND/pages/Admin/ProjectsPage/ViewProjectPage/ComingSoonPage"
# File will be copied separately

# Add import to routes.tsx
sed -i "69a import { AdminProjectsComingSoonPage } from '../../pages/Admin/ProjectsPage/ViewProjectPage/ComingSoonPage/ComingSoonPage'" "$FRONTEND/app/router/routes.tsx"

# Add page entry to Pages object (after line 377 - adminProjectsGrowthPlanPage)
sed -i '377a\  adminProjectsComingSoonPage: <AdminProjectsComingSoonPage />,' "$FRONTEND/app/router/routes.tsx"

# Add routes to router.tsx (before the wildcard catch-all route at the growth-plan entry + 4 lines)
# Find the line with 'growth-plan' and add after the closing brace
sed -i '/growth-plan/,/}/{
  /}/a\          {\
            path: '\''pipeline-buyers'\'',\
            element: Pages.adminProjectsComingSoonPage,\
          },\
          {\
            path: '\''pipeline-investors'\'',\
            element: Pages.adminProjectsComingSoonPage,\
          },
}' "$FRONTEND/app/router/router.tsx"

echo "=== All patches applied ==="
