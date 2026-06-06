# Validation Feedback Report

**Project:** INFINITI Growth & Exit Program
**Sprint:** Validation Sprint (Finandy)
**Last Updated:** 2026-06-06

---

## Summary

| Total Issues | Critical | High | Medium | Low | Fixed | Open |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 7 | 1 | 4 | 2 | 0 | 6 | 1 |

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
| **Status** | **Open** (Pending approval for implementation) |

---

## Change Log

| Date | Action |
|------|--------|
| 2026-06-06 | Initial report created with ISSUE-001 through ISSUE-005 |
| 2026-06-06 | All 5 issues fixed, built, deployed. Commit `5934c100` |
| 2026-06-06 | ISSUE-006 (Design System Compliance) fixed. Dark theme applied to all Growth & Exit pages. Commit `28473ba3` |
| 2026-06-06 | ISSUE-007 (Onboarding Flow Disconnect) identified and documented. Status: Open. |
