# INFINITI Design System Compliance Audit

**Date:** 2026-06-06
**Scope:** Growth & Exit Program Modules (Deal Room, Valuation, Growth Plan, Pipeline Pages)

## 1. Existing Design Patterns (Mature Modules)

Based on an analysis of the mature modules (`SummaryPage`, `RecentCard`, `TasksPage`, `variables/_colors.scss`, `main.tsx`), the INFINITI platform follows a strict dark-theme design language.

### Typography
- **Primary Font:** `Inter` (sans-serif) for body text and UI elements.
- **Secondary/Display Font:** `Space Grotesk` for headers, numbers, and key metrics.
- **Header Colors:** `$white` or `$gray-100` (`#c5c6d4`).
- **Body Colors:** `$gray-200` (`#9ea0b7`) and `$gray-300` (`#666984`).

### Colors (Dark Theme Core)
- **Background (App):** `$brand-1000` (`#0f1119`).
- **Cards/Containers:** `$brand-900` (`#151720`).
- **Inner Elements/Inputs:** `$brand-800` (`#1b1e29`).
- **Primary Accent:** `$brand-500` (`#303fe1`).
- **Secondary Accents:** `$mint-500` (Success/Active), `$cherry-500` (Warning/Alert), `$amber-500` (Pending/Warning).

### Cards & Containers
- **Style:** Flat dark background (`$brand-900`), no heavy shadows, subtle borders if necessary.
- **Border Radius:** `8px` to `12px`.
- **Padding:** Generous padding (`24px` to `32px` for main cards).

### Icons
- **System:** Custom SVG icons stored in `public/icons/` (e.g., `fileWhite.svg`, `check.svg`, `infoBlue.svg`).
- **Usage:** Monochromatic SVGs that inherit colors or use specific brand accents.
- **Prohibited:** Emojis are **not** used in the mature UI.

### Empty & Loading States
- **Loading:** Centralized `LoadingSpinner` component using `brand.500` color.
- **Empty States:** Clean, centered text with a descriptive message (e.g., "No data found") and a clear CTA button. They do not use emojis or massive placeholder graphics.

---

## 2. Growth & Exit Compliance Review

### 2.1. Deal Room (`DealRoomPage.tsx` / `.scss`)
- **Current State:** Recently patched to use dark tokens, but structural alignment with `RecentCard` is missing.
- **Expected State:** Should use standard `RecentCard` or match the `SummaryPage` layout structure exactly.
- **Required Changes:** Refactor to use Chakra UI with `brand.900` backgrounds or align SCSS perfectly with standard widgets.
- **Effort:** Medium.

### 2.2. Valuation (`ValuationPage.tsx`)
- **Current State:** Uses Chakra UI `Card` with `bg="white"`, `color="gray.700"`, and emojis in empty states.
- **Expected State:** Must use dark theme tokens (`bg="brand.900"`, `color="white"`). No emojis.
- **Required Changes:** Replace all light-theme Chakra props with dark-theme equivalents defined in `main.tsx`. Replace emoji with an SVG icon or remove it.
- **Effort:** Medium.

### 2.3. Growth Plan (`GrowthPlanPage.tsx`)
- **Current State:** Uses `bg="white"`, light gray borders, and emojis in the empty state.
- **Expected State:** Must use dark theme tokens. No emojis.
- **Required Changes:** Update Chakra UI props to match the dark theme (`bg="brand.900"`, `borderColor="brand.800"`). Replace emoji in empty state.
- **Effort:** Medium.

### 2.4. Buyer & Investor Pipeline (`ComingSoonPage.tsx`)
- **Current State:** Uses `bg="white"`, `color="gray.700"`, purple accents, and large emojis.
- **Expected State:** Dark theme card (`bg="brand.900"`), standard brand accents (`brand.500`), and SVG icons instead of emojis.
- **Required Changes:** Rewrite Chakra UI props. Remove emojis. Use `brand.500` for badges/accents.
- **Effort:** Low.
