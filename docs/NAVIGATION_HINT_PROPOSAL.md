# UX Audit & Navigation Hint Component Proposal

## 1. UX Audit: Horizontal Scrolling Areas

I conducted a comprehensive audit of the INFINITI console to identify areas where horizontal scrolling exists but lacks clear visual affordance.

### Existing Implementation Pattern
The console currently features a robust `<Scrollable>` component (located at `src/shared/ui/Scrollable/`) that implements the desired blue circular arrow pattern (›). However, this component is **not exported globally** and is only utilized in 4 specific locations (e.g., Client Dashboard stats cards and charts).

### Candidate Screens (Missing Navigation Hints)
I identified **32 instances** across the application where raw `overflow-x: auto` is used without any visual navigation hints. The most critical candidate screens include:

1. **Onboarding Page (Step Navigation)**
   - The horizontal tabs (Company Information, Financial Overview, Product Metrics, Team & Operations, Exit Preferences) use native overflow. On smaller screens, the rightmost tabs are cut off with no indication that the user can scroll to reveal them.
2. **Client Dashboard (Data Tables)**
   - "Recent Invoices" and "Recent Offers" tables overflow horizontally on mobile/tablet views, hiding critical action buttons (View/Download) without any visual cue.
3. **Valuation Page (History Table)**
   - The historical valuation data table overflows its container on smaller viewports.
4. **Leads & Contacts Pages**
   - Full-page data tables with numerous columns that require horizontal scrolling.
5. **Invoice/Offer Edit Pages**
   - Line item entry tables where the "Total" and action columns frequently overflow the viewport.

---

## 2. Proposed Reusable Component: `NavigationHint`

To standardize horizontal scrolling UX across the platform, I propose extracting the core functionality of the existing `<Scrollable>` component into a standalone, globally available `NavigationHint` wrapper.

### Component Architecture

```tsx
import React, { useRef, useState, useEffect } from 'react';
import styles from './NavigationHint.module.scss';

interface NavigationHintProps {
  children: React.ReactNode;
  scrollStep?: number; // Pixels to scroll per tap (default: 200)
  showLeftArrow?: boolean; // Default: true
  showRightArrow?: boolean; // Default: true
}

export const NavigationHint: React.FC<NavigationHintProps> = ({ 
  children, 
  scrollStep = 200,
  showLeftArrow = true,
  showRightArrow = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1); // -1 for rounding errors
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [children]);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: direction === 'left' ? -scrollStep : scrollStep,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={styles.wrapper}>
      {showLeftArrow && canScrollLeft && (
        <button 
          className={`${styles.arrow} ${styles.leftArrow}`} 
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          ‹
        </button>
      )}
      
      <div 
        className={styles.scrollContainer} 
        ref={containerRef} 
        onScroll={checkScroll}
      >
        {children}
      </div>

      {showRightArrow && canScrollRight && (
        <button 
          className={`${styles.arrow} ${styles.rightArrow}`} 
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          ›
        </button>
      )}
    </div>
  );
};
```

### Key Features
- **Automatic Edge Detection**: Arrows only appear when overflow exists and hide automatically when reaching the scroll boundaries.
- **Tap-to-Scroll**: Smooth scrolling behavior (`behavior: 'smooth'`) when arrows are clicked.
- **Unobtrusive**: The wrapper does not alter the layout of the child components.

---

## 3. Design System Documentation Update

The following entry should be added to the INFINITI Design System documentation (e.g., Storybook or internal UI wiki):

### `NavigationHint`

**Description:**
A wrapper component that provides visual affordance for horizontally scrolling content. It displays interactive, floating blue circular arrows when content overflows its container.

**Usage Guidelines:**
- **When to use:** Wrap any container that utilizes `overflow-x: auto` or `overflow-x: scroll`, particularly data tables, tab lists, and horizontal card carousels.
- **When NOT to use:** Do not use for vertically scrolling content or content that wraps to a new line (e.g., `flex-wrap: wrap`).

**Styling Specifications:**
- **Arrow Background:** `$brand-500` (INFINITI Blue)
- **Arrow Size:** `24px` width/height circle
- **Icon:** White chevron (`›` / `‹`)
- **Positioning:** `position: absolute`, vertically centered (`top: 50%; transform: translateY(-50%)`), slightly offset from the edges.
- **Z-Index:** Must be higher than the child content to ensure clickability.

---

## 4. Effort Estimate for Implementation

| Task | Estimated Time | Description |
| :--- | :--- | :--- |
| **Component Creation** | 30 minutes | Extract `<Scrollable>` logic into a clean, reusable `<NavigationHint>` component and add to `shared/ui/index.ts`. |
| **Styling Integration** | 15 minutes | Ensure SCSS perfectly matches the existing blue circular arrow design. |
| **Phase 1 Rollout (High Priority)** | 45 minutes | Implement wrapper on Onboarding tabs, Dashboard tables, and Valuation history. |
| **Phase 2 Rollout (Global)** | 60 minutes | Replace remaining 29 instances of raw `overflow-x: auto` across the application. |
| **Testing & QA** | 30 minutes | Verify smooth scrolling and edge detection across mobile, tablet, and desktop breakpoints. |
| **Total Effort** | **~3 hours** | Full global standardization of horizontal scrolling UX. |

---

## 5. Phase 1 Implementation Status

**Commit:** `c9119b64` (branch: `manus/feat-growth-exit-program`)
**Deployed:** 2026-06-07T18:13:56Z
**Build Info:** https://console.infiniti.stream/build-info.json

### Approach

Rather than creating a new `NavigationHint` component (which would duplicate logic), Phase 1 reuses the **existing `<Scrollable>` component** (`src/shared/ui/Scrollable/`) that already implements the blue circular arrow pattern. This component was already proven in 4 locations and simply needed to be wrapped around additional overflow areas.

### Phase 1 Areas — All DONE

| # | Area | File | Status | Evidence |
|---|------|------|--------|----------|
| 1 | Onboarding Step Tabs | `src/pages/Admin/ProjectsPage/ViewProjectPage/OnboardingPage/OnboardingPage.tsx` | ✅ DONE | Blue `›` arrow visible on narrow viewports |
| 2 | Files Table (Admin) | `src/pages/Admin/ProjectsPage/ViewProjectPage/FilesPage/FilesPage.tsx` | ✅ DONE | Blue `›` arrow visible when table overflows |
| 3 | Client Dashboard — Recent Invoices | `src/pages/Client/DashboardPage/DashboardPage.tsx` | ✅ DONE | Blue `›` arrow visible (table columns overflow at desktop) |
| 4 | Client Dashboard — Recent Offers | `src/pages/Client/DashboardPage/DashboardPage.tsx` | ✅ DONE | Wrapper applied; arrow renders only when content overflows (correct behavior — fewer columns fit at desktop, so arrow appears on narrower viewports) |

### Verification Screenshots

- `docs/screenshots/phase1_client_dashboard_top.webp` — Dashboard overview with stats `›` arrow
- `docs/screenshots/phase1_client_dashboard_invoices_offers.webp` — Recent Invoices `›` arrow visible, Recent Offers table
- `docs/screenshots/phase1_files_scrollable_arrow.webp` — Files page `›` arrow

### Phase 2 (Pending Approval)

32 remaining overflow areas identified in the audit can be wrapped with `<Scrollable>` in a follow-up sprint. No new component creation is needed — the existing `<Scrollable>` component handles all use cases.

**Estimated effort for Phase 2:** ~60 minutes (wrap remaining 32 instances) + 30 minutes QA.
