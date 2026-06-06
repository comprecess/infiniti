# INFINITI Platform Architecture Audit: Chakra UI vs SCSS Modules

**Date:** June 6, 2026
**Context:** Validation Feedback #011 — Clarification on Chakra UI usage
**Status:** Audit Complete — No Refactoring Required

---

## Executive Summary

The INFINITI frontend uses a **hybrid architecture** where SCSS Modules serve as the primary layout and styling system, while Chakra UI provides specific interactive components (modals, textareas, menus, tooltips). All mature reference modules follow this same pattern. The Growth & Exit pages have been implemented to match this architecture exactly.

---

## 1. Platform Statistics

| Metric | Value |
|:-------|:------|
| Total TSX files | 676 |
| Total SCSS Modules | 570 |
| Files importing `@chakra-ui` | 60 (9%) |
| Chakra usage ratio | 9% of components |

> **Conclusion:** SCSS Modules are the dominant styling approach. Chakra UI is a supplementary tool used for specific component types only.

---

## 2. Chakra UI Usage in Mature Reference Modules

### 2.1 Talents Catalog (`/pages/Admin/TanlentsPage/`)

| Layer | Chakra Usage | Primary Approach |
|:------|:-------------|:-----------------|
| Page component | **None** | `styles.wrapper` + SCSS Module |
| Features layer | `Textarea` only (3 files) | SCSS Modules |
| Layout | `<div className={styles.wrapper}>` | SCSS Module |
| Cards | `<div className={styles.itemCard}>` | SCSS Module |
| Buttons | Custom shared components | SCSS Module |

### 2.2 Customers (`/pages/Admin/CustomersPage/`)

| Layer | Chakra Usage | Primary Approach |
|:------|:-------------|:-----------------|
| Page component | **None** | SCSS Module |
| SummaryPage | `Textarea` only (1 file) | SCSS Module |
| Features layer | `Textarea` (3 files) | SCSS Modules |
| Layout | `<div className={styles.wrapper}>` | SCSS Module |

### 2.3 Invoices (`/pages/Admin/SalesPage/InvoicesPage/`)

| Layer | Chakra Usage | Primary Approach |
|:------|:-------------|:-----------------|
| Page component | **None** | SCSS Module |
| Features layer | `Menu`, `MenuButton`, `MenuItem`, `MenuList`, `Tooltip`, `Textarea` | SCSS Modules for layout |
| Layout | `<div className={styles.wrapper}>` | SCSS Module |

### 2.4 Activities (`/pages/Admin/UtilitiesPage/ActivityLogPage/`)

| Layer | Chakra Usage | Primary Approach |
|:------|:-------------|:-----------------|
| Page component | **None** | SCSS Module |
| Features layer | **None** | SCSS Modules |

### 2.5 Dashboard (`/pages/Admin/DashboardPage/`)

| Layer | Chakra Usage | Primary Approach |
|:------|:-------------|:-----------------|
| Page component | **None** | SCSS Module |
| Widgets | **None** | SCSS Modules |

---

## 3. Established INFINITI Architecture Pattern

Based on the audit of all mature modules, the platform follows this consistent pattern:

```
┌─────────────────────────────────────────────────────────┐
│  PAGE LAYOUT                                            │
│  ─────────────────────────────────────────────────────  │
│  <div className={styles.wrapper}>                       │
│    <div className={styles.title}>                       │
│      <TitlePage />                                      │
│    </div>                                               │
│    <section className={styles.section}>                 │
│      <div className={styles.items}>                     │
│        ...content...                                    │
│      </div>                                             │
│    </section>                                           │
│  </div>                                                 │
│                                                         │
│  Styling: SCSS Module (.module.scss)                    │
│  Tokens: $brand-900, $brand-800, $gray-50, etc.        │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  FORM INPUTS                                            │
│  ─────────────────────────────────────────────────────  │
│  <CustomInput />      → shared/ui/CustomInput           │
│  <CustomSelect />     → shared/ui/CustomSelect          │
│  <ButtonBlue />       → shared/ui/ButtonBlue            │
│  <ButtonBrand />      → shared/ui/ButtonBrand           │
│  <CustomCheckBox />   → shared/ui/CustomCheckBox        │
│                                                         │
│  Styling: Each has its own SCSS Module                  │
│  Note: CustomSelect wraps Chakra Select internally      │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  CHAKRA UI — Limited to specific components             │
│  ─────────────────────────────────────────────────────  │
│  Modal / AlertDialog  → Dialogs and confirmations       │
│  Textarea             → Multi-line text input           │
│  Menu / MenuList      → Context menus / dropdowns       │
│  Tooltip              → Hover tooltips                  │
│  useToast             → Toast notifications             │
│  useDisclosure        → Modal open/close state          │
│                                                         │
│  NOT used for: Layout, Cards, Grids, Spacing, Pages     │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Growth & Exit Pages — Current Architecture

### 4.1 OnboardingPage

| Aspect | Implementation | Matches Platform? |
|:-------|:--------------|:-----------------|
| Layout | `<div className={styles.wrapper}>` | **Yes** ✅ |
| Form inputs | `CustomInput`, `CustomSelect` (shared/ui) | **Yes** ✅ |
| Buttons | `ButtonBlue` (shared/ui) | **Yes** ✅ |
| Cards | `<div className={styles.stepItem}>` | **Yes** ✅ |
| Direct Chakra imports | **None** | **Yes** ✅ |
| SCSS Module | `OnboardingPage.module.scss` | **Yes** ✅ |

### 4.2 GrowthPlanPage

| Aspect | Implementation | Matches Platform? |
|:-------|:--------------|:-----------------|
| Layout | `<div className={styles.wrapper}>` | **Yes** ✅ |
| Item cards | `<div className={styles.itemCard}>` | **Yes** ✅ |
| Buttons | `<button className={styles.btnAdd}>` | **Yes** ✅ |
| Modal (create/edit) | Chakra `Modal`, `FormControl`, `Grid` | **Yes** ✅ (same as Invoices) |
| AlertDialog | Chakra `AlertDialog` | **Yes** ✅ (same as Sales) |
| Toast | Chakra `useToast` | **Yes** ✅ |
| SCSS Module | `GrowthPlanPage.module.scss` | **Yes** ✅ |

### 4.3 ValuationPage

| Aspect | Implementation | Matches Platform? |
|:-------|:--------------|:-----------------|
| Layout | `<div className={styles.wrapper}>` | **Yes** ✅ |
| Valuation cards | `<div className={styles.valuationCard}>` | **Yes** ✅ |
| Table | `<table className={styles.historyTable}>` | **Yes** ✅ |
| Modal (run valuation) | Chakra `Modal`, `FormControl` | **Yes** ✅ |
| SCSS Module | `ValuationPage.module.scss` | **Yes** ✅ |

### 4.4 DealRoomPage

| Aspect | Implementation | Matches Platform? |
|:-------|:--------------|:-----------------|
| Layout | `<div className={styles.wrapper}>` | **Yes** ✅ |
| Document cards | `<div className={styles.documentCard}>` | **Yes** ✅ |
| Shared components | `LoadingSpinner` (shared/ui) | **Yes** ✅ |
| Direct Chakra imports | **None** | **Yes** ✅ |
| SCSS Module | `DealRoomPage.module.scss` | **Yes** ✅ |

### 4.5 ComingSoonPage (Buyer Pipeline, Investor Pipeline)

| Aspect | Implementation | Matches Platform? |
|:-------|:--------------|:-----------------|
| Layout | `<div className={styles.wrapper}>` | **Yes** ✅ |
| Direct Chakra imports | **None** | **Yes** ✅ |
| SCSS Module | `ComingSoonPage.module.scss` | **Yes** ✅ |

---

## 5. What Was NOT Removed

Chakra UI remains in Growth & Exit pages for:

1. **Modal / ModalOverlay / ModalContent** — for create/edit forms (GrowthPlanPage, ValuationPage)
2. **AlertDialog** — for delete confirmations (GrowthPlanPage)
3. **FormControl / FormLabel** — inside modals only (not page layout)
4. **Grid / GridItem** — inside modals only (form layout within modal)
5. **Input / Select / Textarea** — inside modals (Chakra form primitives)
6. **Button** — inside modals (modal actions: Save, Cancel)
7. **useDisclosure** — modal state management
8. **useToast** — toast notifications

This is **identical** to how Invoices and Sales modules use Chakra — only for interactive overlays and form primitives within those overlays.

---

## 6. Shared UI Components Used

The platform provides these shared components that internally may wrap Chakra but expose a consistent API:

| Component | Internal Implementation | Used By Growth & Exit |
|:----------|:-----------------------|:---------------------|
| `CustomModalWindow` | Wraps Chakra `Modal` | Available (not yet used) |
| `CustomInput` | Pure SCSS Module | **Yes** (OnboardingPage) |
| `CustomSelect` | Wraps Chakra `Select` | **Yes** (OnboardingPage) |
| `ButtonBlue` | Pure SCSS Module | **Yes** (OnboardingPage) |
| `ButtonBrand` | Pure SCSS Module | Available |
| `CustomCheckBox` | Wraps Chakra `Checkbox` | Available |
| `CustomToast` | Wraps Chakra `useToast` | **Yes** (OnboardingPage) |
| `LoadingSpinner` | Wraps Chakra `Spinner` | **Yes** (all pages) |
| `CustomSwitch` | Wraps Chakra `Switch` | Available |

---

## 7. Recommendation

### Option A: Keep Current Approach ✅ RECOMMENDED

The current implementation already matches the platform architecture:
- Page layout via SCSS Modules (same as Talents, Customers, Dashboard)
- Shared UI components for form inputs (same as all modules)
- Chakra for modals and interactive overlays (same as Invoices, Sales)

### Option B: Refactor to Use More Chakra ❌ NOT RECOMMENDED

This would **deviate** from the established platform pattern. The mature modules (Talents, Customers, Invoices, Activities, Dashboard) do NOT use Chakra for layout. Introducing Chakra `Box`, `Flex`, `Stack` for page layout would create inconsistency with the rest of the platform.

---

## 8. Conclusion

**No architectural refactoring is needed.** The Growth & Exit pages follow the exact same hybrid pattern as all mature INFINITI modules:

- **Layout** → SCSS Modules with design tokens
- **Form inputs** → Shared UI components (`CustomInput`, `CustomSelect`, `ButtonBlue`)
- **Modals** → Chakra UI (directly or via `CustomModalWindow`)
- **Toasts** → Chakra `useToast` (via `CustomToast`)
- **Loading** → Chakra `Spinner` (via `LoadingSpinner`)

The visual unification issue (ISSUE-011) was resolved by fixing the Chakra global body background override — not by changing the architecture.

---

## Appendix: File Counts by Category

```
SCSS Modules:           570 files
Total TSX components:   676 files
Chakra-importing files:  60 files (9%)

Breakdown of Chakra usage:
  shared/ui/           14 files (wrapper components)
  shared/themes/        6 files (Chakra theme overrides)
  features/            30 files (Textarea, Menu, Modal usage)
  pages/                7 files (minimal direct usage)
  widgets/              3 files
```
