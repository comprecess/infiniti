# INFINITI Design System Rules

**Version:** 1.0
**Target:** Frontend Developers

This document defines the strict visual rules for building new modules and pages within the INFINITI platform. All new components must comply with these rules to ensure a seamless, native user experience.

## 1. The Core Rule: Dark Theme Only
INFINITI is a dark-theme application. **Never use `white` backgrounds for main content areas, cards, or modals.**

## 2. Approved Colors (SCSS & Chakra UI)

When styling components, use only the following approved color tokens:

| Element | SCSS Token | Chakra UI Token | Hex Value |
|---------|------------|-----------------|-----------|
| **App Background** | `$brand-1000` | `brand.1000` | `#0f1119` |
| **Card Background** | `$brand-900` | `brand.900` | `#151720` |
| **Input/Inner Bg** | `$brand-800` | `brand.800` | `#1b1e29` |
| **Primary Accent** | `$brand-500` | `brand.500` | `#303fe1` |
| **Primary Text** | `$white` | `white` | `#ffffff` |
| **Secondary Text** | `$gray-100` | `gray.100` | `#c5c6d4` |
| **Muted Text** | `$gray-300` | `gray.300` | `#666984` |
| **Success/Active** | `$mint-500` | `mint.500` | `#10b7b7` |
| **Warning/Pending** | `$amber-500` | `amber.500` | `#f59f0a` |
| **Danger/Alert** | `$cherry-500` | `cherry.500` | `#ef4382` |

## 3. Typography Rules
- **Headers & Numbers:** Must use `Space Grotesk`.
- **Body Text:** Must use `Inter`.
- **Color:** Use `$white` for main headings and `$gray-100` or `$gray-300` for descriptions. Never use `gray.700` or black text.

## 4. Approved Card Styles
When creating a new section or widget, wrap it in the standard card style:
- **Background:** `brand.900`
- **Border Radius:** `8px`
- **Padding:** `24px` or `32px`
- **Shadow:** None (flat design).

If using Chakra UI:
```tsx
<Card bg="brand.900" shadow="none" borderRadius="8px">
  <CardBody p={6}>
    {/* Content */}
  </CardBody>
</Card>
```

## 5. Icons: SVGs Only, No Emojis
- **Rule:** Never use emojis (📊, 📋, 🚀, etc.) in the UI.
- **Implementation:** Use the SVG icons provided in the `public/icons/` directory.
- **Styling:** Icons should be monochromatic, inheriting the text color or using a brand accent color.

## 6. Empty States
Empty states must look deliberate but unobtrusive.
- **Container:** Standard card (`brand.900`).
- **Visual:** Use an SVG icon (e.g., `fileEmpty.svg` or `infoBlue.svg`), not an emoji.
- **Text:** Clear, concise heading (e.g., "No Data Yet") in `$white`.
- **Description:** Helpful context in `$gray-300`.
- **Action:** Primary button (`brand.500`) to create the first item.

## 7. Loading States
- **Rule:** Always use the shared `LoadingSpinner` component.
- **Color:** `brand.500`.
- **Positioning:** Centered within the container or page.

## 8. Mobile Layout Rules
- **Containers:** Must use `width: 100%` with horizontal padding (`16px`).
- **Grids:** Convert multi-column grids to `1fr` (single column) on mobile (`@include mobileBreakpoint('max', $bpL)` or `templateColumns={{ base: '1fr', md: 'repeat(X, 1fr)' }}`).
- **Navigation:** Ensure sidebars collapse and use the hamburger menu overlay pattern defined in `ViewProjectPage`.
