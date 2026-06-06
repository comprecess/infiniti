# ISSUE-014: Unified Project Status Badges

**Status:** FIXED
**Commit:** `9ef75fec`
**Build:** 4,590.92 kB JS, 632.67 kB CSS, 32.48s

---

## Problem

Project status badges on Dashboard and Recent Projects were visually inconsistent:

| DB Value | Before (Rendered) | Issue |
|:---------|:------------------|:------|
| `active` | plain text, no badge | Not matched by switch case (lowercase) |
| `Draft` | styled pill | OK |
| `in_progress` | raw value "in_progress" | Not matched, underscore shown |
| `Started` | styled pill | OK |
| `Completed` | styled pill | OK |

## Root Cause

The `Status` component used a strict `switch` statement matching exact case-sensitive strings. Database values like `active` (lowercase) and `in_progress` (with underscore) did not match any case.

## Fix Applied

**File:** `frontend/src/shared/ui/Status/Status.tsx`

Added `normalizeStatus()` function that:
1. Lowercases and normalizes input (`in_progress`, `active`, etc.)
2. Maps to human-readable label (`In Progress`, `Active`)
3. Maps to correct style key for the existing SCSS classes
4. Falls back to `Draft` style for unknown values

## After Fix

| DB Value | Rendered Label | Badge Style |
|:---------|:---------------|:------------|
| `active` | Active | Green (mint) pill |
| `Draft` | Draft | Gray pill |
| `in_progress` | In Progress | Purple (brand) pill |
| `Started` | Started | Purple (brand) pill |
| `Completed` | Completed | Green (mint) pill |

## Verification

All 5 project statuses now render as consistent rounded pills with:
- Dark theme compatible colors
- Muted background with readable text
- Consistent 24px height, 100px border-radius
- Same spacing and typography

## Changed Files

| File | Change |
|:-----|:-------|
| `frontend/src/shared/ui/Status/Status.tsx` | Added normalizeStatus(), replaced switch with lookup |

## No Changes To

- Business logic
- Database values
- Backend API
- Other components
- SCSS styling (existing classes reused)

---

## Additional: Password Recovery (ceo@infiniti.stream)

**Context:** After browser cache/history clear, resident login failed.

**Root Cause:** Unknown previous password for `sys_users.id=1` (username: `ceo@infiniti.stream`).

**Fix:** Reset password field using `password_hash(PASSWORD_DEFAULT)` — compatible with existing `crypt()` verification in `AuthPasswordTrait`.

**Scope:** Only `sys_users.password` field for ID=1 was changed. No auth architecture, roles, permissions, or frontend modifications.
