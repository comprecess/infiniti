# Validation Feedback Report

**Project:** INFINITI Growth & Exit Program
**Sprint:** Validation Sprint (Finandy)
**Last Updated:** 2026-06-06

---

## Summary

| Total Issues | Critical | High | Medium | Low | Fixed | Open |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 9 | 1 | 5 | 3 | 0 | 9 | 0 |

---

## Issues

### ISSUE-001

| Field | Value |
|-------|-------|
| **ID** | ISSUE-001 |
| **Category** | Project Creation UX |
| **Problem** | After creating an Exit Deal project, the Projects list does not refresh automatically. The newly created project is not visible until manual page refresh. |
| **Root Cause** | `CreateNewProject.tsx` navigates to the projects list after success, but does not call `queryClient.invalidateQueries()` for the `['projectsList']` cache key. React Query serves stale cached data. |
| **Proposed Fix** | Import `useQueryClient`, call `queryClient.invalidateQueries({ queryKey: ['projectsList'] })` before `navigate()` in the success handler. |
| **Files Affected** | `frontend/src/pages/Admin/ProjectsPage/CreateNewProject/CreateNewProject.tsx` |
| **Effort** | 5 min (3 lines) |
| **Priority** | High |
| **Status** | **Fixed** — commit `5934c100` |

---

### ISSUE-002

| Field | Value |
|-------|-------|
| **ID** | ISSUE-002 |
| **Category** | Deal Room UI |
| **Problem** | Deal Room styling does not match the INFINITI dark design system. Section title is difficult to read and visually blends into the background. Light-theme colors used instead of platform tokens. |
| **Root Cause** | `DealRoomPage.module.scss` uses hardcoded light-theme colors (`white`, `#1a1a2e`, `#e9ecef`) instead of INFINITI design tokens (`$brand-800`, `$brand-900`, `$gray-*`). The platform uses a dark theme globally. |
| **Proposed Fix** | Rewrite SCSS file using INFINITI design variables. Replace `white` → `$brand-800`, text colors → `$gray-100`/`$gray-200`, borders → `$gray-600`, accents → `$brand-500`/`$cherry-500`. |
| **Files Affected** | `frontend/src/pages/Admin/ProjectsPage/ViewProjectPage/DealRoomPage/DealRoomPage.module.scss` |
| **Effort** | 20 min (full SCSS rewrite) |
| **Priority** | Medium |
| **Status** | **Fixed** — commit `5934c100` |

---

### ISSUE-003

| Field | Value |
|-------|-------|
| **ID** | ISSUE-003 |
| **Category** | Growth Plan Loading |
| **Problem** | Growth Plan page displays loading state but no clear empty-state explanation. User is unsure whether loading failed, data does not exist, or onboarding is incomplete. |
| **Root Cause** | When `items.length === 0` after loading, the page still renders summary stat cards (all showing 0) before the empty state card. This creates visual noise and ambiguity. The empty state text exists but is buried below meaningless zero-value cards. |
| **Proposed Fix** | Conditionally hide summary stat cards when `items.length === 0`. Show a prominent empty state with clear messaging and CTA button. |
| **Files Affected** | `frontend/src/pages/Admin/ProjectsPage/ViewProjectPage/GrowthPlanPage/GrowthPlanPage.tsx` |
| **Effort** | 10 min (~10 lines) |
| **Priority** | High |
| **Status** | **Fixed** — commit `5934c100` |

---

### ISSUE-004

| Field | Value |
|-------|-------|
| **ID** | ISSUE-004 |
| **Category** | Valuation Loading |
| **Problem** | Valuation screen shows cards with "—" and small "No valuation set" text. No clear explanation or CTA for first-time setup. |
| **Root Cause** | When `dashboard` is null or has no `current` valuation, the page renders three valuation cards with placeholder dashes. There is no dedicated empty state component to guide the user. |
| **Proposed Fix** | If `!dashboard?.current && !dashboard?.projected && !dashboard?.best_case`, render a dedicated empty state block with explanation text and "Create First Valuation" CTA button. |
| **Files Affected** | `frontend/src/pages/Admin/ProjectsPage/ViewProjectPage/ValuationPage/ValuationPage.tsx` |
| **Effort** | 10 min (~15 lines) |
| **Priority** | High |
| **Status** | **Fixed** — commit `5934c100` |

---

### ISSUE-005

| Field | Value |
|-------|-------|
| **ID** | ISSUE-005 |
| **Category** | Navigation |
| **Problem** | Buyer Pipeline and Investor Pipeline menu items redirect back to the project summary page. Feels like broken navigation. |
| **Root Cause** | Template sections define `pipeline_buyers` and `pipeline_investors` codes which generate sidebar links to `/pipeline-buyers` and `/pipeline-investors`. However, `router.tsx` has no matching routes — the wildcard `path: '*'` catches them and redirects to `summary`. |
| **Proposed Fix** | Create a `ComingSoonPage.tsx` placeholder component. Register routes `pipeline-buyers` and `pipeline-investors` in the project router pointing to this component. Display "Coming Soon" with feature description. |
| **Files Affected** | `frontend/src/pages/Admin/ProjectsPage/ViewProjectPage/ComingSoonPage/ComingSoonPage.tsx` (new), `frontend/src/app/router/router.tsx` |
| **Effort** | 15 min (1 new component + 2 routes) |
| **Priority** | Critical |
| **Status** | **Fixed** — commit `5934c100` |

---

### ISSUE-006

| Field | Value |
|-------|-------|
| **ID** | ISSUE-006 |
| **Category** | Design System Compliance |
| **Problem** | Growth & Exit pages use white backgrounds, emojis, and light-theme colors that do not match the INFINITI dark design system. Creates impression of unfinished or foreign functionality. |
| **Root Cause** | Chakra UI components in GrowthPlanPage, ValuationPage, and ComingSoonPage use `bg="white"`, `color="gray.700"`, emoji icons, and `shadow="sm"` — all incompatible with the platform's dark theme. |
| **Proposed Fix** | Replace all light-theme Chakra props with dark-theme tokens (`brand.900`, `brand.800`, `white`, `gray.200`). Remove all emojis. Use SVG icons or text-based indicators. |
| **Files Affected** | `GrowthPlanPage.tsx`, `ValuationPage.tsx`, `ComingSoonPage.tsx`, `DealRoomPage.tsx`, `DealRoomPage.module.scss` |
| **Effort** | 45 min (bulk sed replacements + ComingSoon rewrite) |
| **Priority** | Medium |
| **Status** | **Fixed** — commit `28473ba3` |

---

### ISSUE-007

| Field | Value |
|-------|-------|
| **ID** | ISSUE-007 |
| **Category** | Onboarding Flow |
| **Problem** | The Onboarding Wizard exists in the codebase but is never triggered. Users skip data collection and land directly in empty workspaces. |
| **Root Cause** | The `OnboardingPage.tsx` is registered in the router but missing from the template sidebar (`clx_project_template_sections` DB table). There is no auto-redirect logic in `ViewProjectPage.tsx` to enforce completion. |
| **Proposed Fix** | 1) Add `onboarding` to `exit_deal` template sections in DB. 2) Add icon mapping in `useProjectTemplateSidebar.tsx`. 3) Add auto-redirect logic in `ViewProjectPage.tsx` based on `onboarding.status` metadata. |
| **Files Affected** | `ViewProjectPage.tsx`, `useProjectTemplateSidebar.tsx`, Database (`clx_project_template_sections`) |
| **Effort** | 45 min |
| **Priority** | High |
| **Status** | **Fixed** — commit `b02d19ba` |

---

## Change Log

| Date | Action |
|------|--------|
| 2026-06-06 | Initial report created with ISSUE-001 through ISSUE-005 |
| 2026-06-06 | All 5 issues fixed, built, deployed. Commit `5934c100` |
| 2026-06-06 | ISSUE-006 (Design System Compliance) fixed. Dark theme applied to all Growth & Exit pages. Commit `28473ba3` |
| 2026-06-06 | ISSUE-007 (Onboarding Flow Disconnect) identified and documented. Status: Open. |
| 2026-06-06 | ISSUE-007 fixed: Onboarding added to sidebar, auto-redirect on first visit, progress bar on Summary, completion handler with redirect to dashboard. Commit `b02d19ba` |
| 2026-06-06 | ISSUE-009 (Stale Build) identified and fixed. Frontend rebuilt with onboarding redirect code. |
| 2026-06-06 | ISSUE-010 (Design System Full Compliance) — Complete visual unification of all Growth & Exit pages. Commit `12be9726` |

---

### ISSUE-009

| Field | Value |
|-------|-------|
| **ID** | ISSUE-009 |
| **Category** | Build / Deployment |
| **Problem** | Opening `/admin/projects/view/project/42/summary` redirects to Dashboard instead of triggering Onboarding auto-redirect. |
| **Root Cause** | The production `dist` was built at 04:27 UTC but the `ViewProjectPage.tsx` with onboarding redirect logic was modified at 04:47 UTC. The deployed JavaScript bundle did not contain the onboarding redirect code. The stale `index-D558eGSt.js` was being served instead of the updated `index-DfKVJSmo.js`. |
| **Proposed Fix** | Rebuild frontend with `npx vite build`, remove stale JS file, reload nginx. |
| **Files Affected** | `dist/assets/index-DfKVJSmo.js` (rebuilt), `dist/index.html` (updated reference) |
| **Effort** | 5 min (rebuild + cleanup) |
| **Priority** | High |
| **Status** | **Fixed** — rebuilt at 10:00 UTC, nginx reloaded |

---

### ISSUE-010

| Field | Value |
|-------|-------|
| **ID** | ISSUE-010 |
| **Category** | Design System Full Compliance |
| **Problem** | Growth & Exit pages (OnboardingPage, GrowthPlanPage, ValuationPage, ComingSoonPage) use light theme colors, Chakra UI page-level components, and do not match the visual language of mature INFINITI modules (Talents, Customers, Invoices, Activities). |
| **Root Cause** | OnboardingPage.module.scss uses hardcoded light HEX values (`#1a1a2e`, `white`, `#f8f9fa`, `#e9ecef`, `#dee2e6`). GrowthPlanPage and ValuationPage use Chakra UI `Box`, `Card`, `Flex` for page layout instead of SCSS modules. ComingSoonPage uses Chakra UI components. All violate the INFINITI design system rule of SCSS modules + dark theme tokens. |
| **Proposed Fix** | 1) Rewrite OnboardingPage.module.scss replacing all light colors with SCSS tokens ($brand-900, $brand-800, $gray-50, $gray-600). 2) Rewrite GrowthPlanPage.tsx to use SCSS modules for page layout (keep Chakra only for modals). 3) Rewrite ValuationPage.tsx same approach. 4) Rewrite ComingSoonPage.tsx to pure SCSS modules. |
| **Files Affected** | `OnboardingPage.module.scss`, `GrowthPlanPage.tsx`, `GrowthPlanPage.module.scss`, `ValuationPage.tsx`, `ValuationPage.module.scss`, `ComingSoonPage.tsx`, `ComingSoonPage.module.scss` (new) |
| **Effort** | 120 min (4 page rewrites + SCSS creation) |
| **Priority** | Medium |
| **Status** | **Fixed** — commit `12be9726` |

**Changes Applied:**
- OnboardingPage: All 15+ light-theme HEX values replaced with SCSS tokens. Progress bar gradient replaced with `$brand-500`. Step active/completed states use `$brand-500`/`$mint-500` borders.
- GrowthPlanPage: Removed Chakra UI `Box`, `Card`, `Flex`, `Heading`, `Text`, `Badge`, `Tag`, `Progress`, `IconButton`, `Menu` from page layout. Created full SCSS module with stats grid, item cards, badge system, action buttons. Modals remain Chakra (acceptable for overlays).
- ValuationPage: Same approach — native HTML + SCSS module for cards, progress bars, history table. Modals remain Chakra.
- ComingSoonPage: Fully replaced Chakra UI with native HTML + SCSS module. Zero Chakra imports.
- All pages now follow RecentCard pattern: `$brand-900` background, 24px padding, 8px border-radius.
- Typography uses `$fontSpaceGrotesk` for headings, proper letter-spacing.
- Mobile responsive with `$bpL` breakpoint.

---

### ISSUE-011

| Field | Value |
|-------|-------|
| **ID** | ISSUE-011 |
| **Category** | Global Styles / White Containers |
| **Problem** | Pages still show white background containers or flashes of white despite SCSS module rewrites. |
| **Root Cause** | Chakra UI's `extendTheme` with `styles.global` defined as an object was injecting `body { background: white }` due to a known issue with emotion/Chakra global style specificity. |
| **Proposed Fix** | Change `styles.global` from object format to function format in `main.tsx` to properly override default Chakra light theme body background. Add dark mode init script to `index.html`. |
| **Files Affected** | `frontend/src/main.tsx`, `frontend/index.html` |
| **Effort** | 15 min |
| **Priority** | High |
| **Status** | **Fixed** — commit `2c92f064` |

---

### ISSUE-012

| Field | Value |
|-------|-------|
| **ID** | ISSUE-012 |
| **Category** | Onboarding UX |
| **Problem** | User data in Onboarding wizard is only saved when clicking Next/Previous. If user closes browser or navigates away mid-step, data is lost. |
| **Root Cause** | Save logic only triggered on step transition buttons. |
| **Proposed Fix** | Implement debounced autosave (1.5s) on form field changes. Add visual status indicator (Unsaved / Saving... / Saved) to the header. |
| **Files Affected** | `OnboardingPage.tsx`, `OnboardingPage.module.scss` |
| **Effort** | 30 min |
| **Priority** | Medium |
| **Status** | **Fixed** — commit `375e771e` |

---

### ISSUE-013

| Field | Value |
|-------|-------|
| **ID** | ISSUE-013 |
| **Category** | Onboarding Logic |
| **Problem** | Step 3 (Traction & Metrics) is never marked as completed even when all fields are filled. |
| **Root Cause** | The `isStepCompleted` function used `every()` on the required fields array. Step 3 had no explicitly required fields, causing an empty array check which failed the overall step completion logic. |
| **Proposed Fix** | Change logic for steps without required fields to use `some()` — if any field has a value, consider the step completed. |
| **Files Affected** | `OnboardingPage.tsx` |
| **Effort** | 15 min |
| **Priority** | High |
| **Status** | **Fixed** — commit `76fdc788` |

---

### ISSUE-014

| Field | Value |
|-------|-------|
| **ID** | ISSUE-014 |
| **Category** | UI Polish |
| **Problem** | Project status badges show raw database values like `in_progress` or `active` instead of human-readable labels. |
| **Root Cause** | The `Status.tsx` component was rendering the raw `status` string directly without mapping it to a display label. |
| **Proposed Fix** | Add `normalizeStatus()` function to `Status.tsx` to map raw DB values to human-readable labels (e.g., `in_progress` -> `Started`, `draft` -> `Draft`). Apply appropriate pill styling classes. |
| **Files Affected** | `Status.tsx`, `Status.module.scss` |
| **Effort** | 20 min |
| **Priority** | Medium |
| **Status** | **Fixed** — commit `9ef75fec` |

---

### ISSUE-015

| Field | Value |
|-------|-------|
| **ID** | ISSUE-015 |
| **Category** | UI Polish |
| **Problem** | The newly standardized status badges (Draft, Started, etc.) on the Recent Projects table and Project Cards wrap to multiple lines if the container is narrow, breaking the pill shape. |
| **Root Cause** | Missing `white-space: nowrap` and `flex-shrink: 0` on the badge container. |
| **Proposed Fix** | Add `white-space: nowrap`, `flex-shrink: 0`, and `align-items: center` to `Status.module.scss` and the `ProjectCard.module.scss` header sections. |
| **Files Affected** | `Status.module.scss`, `frontend/src/pages/Admin/ProjectsPage/ProjectCard/ProjectCard.module.scss`, `frontend/src/pages/Client/ProjectsPage/ProjectCard/ProjectCard.module.scss` |
| **Effort** | 10 min |
| **Priority** | High |
| **Status** | **Fixed** — commit `1ac4aaa7` |
