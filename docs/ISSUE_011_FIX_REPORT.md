# ISSUE-011: White Container Pattern on Onboarding Page

## Status: FIXED

## Problem

The Onboarding Wizard page displayed white/light containers that visually conflicted with the INFINITI dark design system. Specifically:

1. White body background (`rgb(255, 255, 255)`)
2. White form section container
3. White step indicator cards
4. White progress bar container

## Root Cause Analysis

The issue was **NOT** in the OnboardingPage SCSS module (which was correctly using dark tokens like `$brand-900`, `$brand-800`). The root cause was in **Chakra UI's global styles system**.

### Technical Details

In `main.tsx`, the Chakra theme was configured with:

```typescript
styles: {
  global: {
    body: {
      bg: 'brand.1000',
      color: 'whiteAlpha.900',
    },
  },
},
```

However, Chakra UI v2's emotion CSS engine was generating an inline stylesheet with:

```css
body {
  background: var(--chakra-colors-white);
  color: var(--chakra-colors-white);
}
```

This happened because Chakra's **object-based** global styles format was not properly overriding the default reset styles. The default Chakra reset sets body background to `white`, and the object format was being merged incorrectly.

### Fix Applied

Changed the global styles from an **object** to a **function** format:

```typescript
styles: {
  global: () => ({
    body: {
      bg: 'brand.1000',
      color: 'whiteAlpha.900',
      transition: 'background-color 0.2s ease',
    },
  }),
},
```

The function format forces Chakra to **replace** the default body styles rather than merge with them, ensuring the dark background is applied.

### Additional Fixes

1. Added `config: { initialColorMode: "dark", useSystemColorMode: false }` to prevent color mode flicker
2. Added inline `<style>` in `index.html` with `body { background-color: #0f1119 }` to prevent white flash during initial load
3. Added `<script>` to set `localStorage['chakra-ui-color-mode'] = 'dark'` before app initialization

## Verification

### Computed Styles After Fix

| Element | Background Color | Token |
|:--------|:----------------|:------|
| `body` | `rgb(15, 17, 25)` | `$brand-1000` |
| `.formSection` | `rgb(21, 23, 32)` | `$brand-900` |
| `.stepItem` | `rgb(27, 30, 41)` | `$brand-800` |
| `.wrapper` | `transparent` | inherits |

### Pages Verified

- Onboarding Page: Dark background, dark cards, dark form section ✅
- Growth Plan Page: Dark background, no white containers ✅
- Valuation Page: Dark background, no white containers ✅
- Deal Room Page: Dark cards with subtle borders ✅
- Talents Page (reference): Same dark background ✅

## Screenshots

- **BEFORE**: `docs/screenshots/onboarding_BEFORE.webp`
- **AFTER**: `docs/screenshots/onboarding_AFTER.webp`

## Commit

`2c92f064` - fix(theme): Force dark body background via Chakra global styles function
