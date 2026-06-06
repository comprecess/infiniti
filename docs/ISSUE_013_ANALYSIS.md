# ISSUE-013: Step 3 Completion State Resets on Reload

## Observed Behavior

1. Complete all onboarding steps → progress 100%
2. Leave onboarding → return → Step 3 (Product Metrics) appears incomplete
3. All data values are still present in the fields
4. Press Save → progress returns to 100%
5. Leave and return → Step 3 becomes incomplete again

---

## Root Cause

The completion check logic uses `.some()` on **required fields only**, but **Step 3 (Product Metrics) has NO required fields**.

```typescript
// OnboardingPage.tsx, line 185-189 (loadMetadata)
const hasRequiredFilled = step.fields
  .filter(f => f.required)
  .some(f => groupData[f.key] && groupData[f.key].trim() !== '')
if (hasRequiredFilled) {
  completed.add(i)
}
```

**Step 3 field definitions (lines 88-96):**

```typescript
{
  id: 'product',
  title: 'Product Metrics',
  group: 'product_metrics',
  fields: [
    { key: 'mau', label: 'Monthly Active Users (MAU)', type: 'number' },
    { key: 'dau', label: 'Daily Active Users (DAU)', type: 'number' },
    { key: 'churn_rate', label: 'Monthly Churn Rate (%)', type: 'number' },
    { key: 'ltv', label: 'Customer Lifetime Value (LTV)', type: 'number' },
    { key: 'cac', label: 'Customer Acquisition Cost (CAC)', type: 'number' },
    { key: 'nps', label: 'Net Promoter Score (NPS)', type: 'number' },
  ],
}
```

**None of these fields have `required: true`.**

When `step.fields.filter(f => f.required)` returns an empty array, `.some()` on an empty array always returns `false`. Therefore `hasRequiredFilled` is always `false` for Step 3, and the step is never marked as completed during `loadMetadata`.

---

## Why It Works After Manual Save

The `handleSaveStep` function (line 308) uses a different logic:

```typescript
setCompletedSteps(prev => new Set([...prev, currentStep]))
```

This unconditionally marks the current step as completed after a successful save. But this state is **in-memory only** — it's not persisted. On reload, `loadMetadata` recalculates from the API data using the flawed logic.

---

## Why Autosave Also Fails

The `performAutosave` function (lines 232-239) uses the same flawed logic:

```typescript
const hasRequiredFilled = step.fields
  .filter(f => f.required)
  .some(f => stepData[f.key] && stepData[f.key].trim() !== '')
if (hasRequiredFilled) {
  next.add(stepIndex)
}
```

Same bug — empty required array → never marks as completed.

---

## Affected Files

| File | Location |
|:-----|:---------|
| `OnboardingPage.tsx` | Line 185-189 (`loadMetadata` completion check) |
| `OnboardingPage.tsx` | Line 232-239 (`performAutosave` completion check) |

---

## Proposed Fix

Replace the completion check with a unified function that handles both cases:

```typescript
/**
 * Determine if a step is "completed" based on saved data.
 * Rules:
 * 1. If step has required fields → at least ALL required fields must be filled
 * 2. If step has NO required fields → at least ONE field must be filled
 */
const isStepCompleted = (step: WizardStep, data: Record<string, string>): boolean => {
  const requiredFields = step.fields.filter(f => f.required)
  
  if (requiredFields.length > 0) {
    // All required fields must be filled
    return requiredFields.every(f => data[f.key] && String(data[f.key]).trim() !== '')
  }
  
  // No required fields — step is complete if ANY field has data
  return step.fields.some(f => data[f.key] && String(data[f.key]).trim() !== '')
}
```

Apply this function in three places:
1. `loadMetadata` (line 185)
2. `performAutosave` (line 232)
3. `handleSaveStep` — make it consistent (currently unconditional)

**Additional improvement:** Change the required-field logic from `.some()` to `.every()` — currently a step is marked complete if ANY required field is filled, but logically it should require ALL required fields.

---

## Estimated Effort

**15 minutes** — single function extraction + 3 call sites updated.

---

## Summary

| Aspect | Detail |
|:-------|:-------|
| **Root Cause** | Completion check uses `.some()` on required fields; Step 3 has zero required fields → empty array → always `false` |
| **Data Loss** | None — data is saved correctly, only UI state is wrong |
| **Scope** | Frontend only — `OnboardingPage.tsx` |
| **Fix Type** | Logic fix — add fallback for steps with no required fields |
| **Risk** | Low — isolated to completion badge calculation |
| **Effort** | 15 minutes |
