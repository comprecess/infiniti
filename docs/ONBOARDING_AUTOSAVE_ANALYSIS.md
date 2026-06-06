# Onboarding Wizard — Autosave Analysis

---

## Current Behavior

| Question | Answer |
|:---------|:-------|
| Are values saved only after clicking Save? | **Yes.** `handleSaveStep()` is called only by the Save button click. |
| Are values saved when clicking Next? | **Yes.** `handleNext()` calls `await handleSaveStep()` before advancing. |
| Are partially completed steps restored after reload? | **Yes.** `loadMetadata()` on mount fetches all groups from API. |
| What happens if user leaves without Save/Next? | **Data is lost.** `handleInputChange` only updates local React state. |

### Data Flow

```
User types → handleInputChange() → setState (local only)
                                          ↓
User clicks Save → handleSaveStep() → POST /api/.../metadata → DB
User clicks Next → handleSaveStep() + setCurrentStep()
User leaves page → state lost (no persistence)
```

### Risk Scenarios (data loss)

1. User fills 3 fields, closes browser → **lost**
2. User fills fields, clicks browser back → **lost**
3. User fills fields, internet drops, clicks Save → **error toast, data in state but not persisted**
4. User fills fields, receives call, phone locks → **lost if browser reloads**
5. User fills fields, switches to another project tab → **lost**

---

## Recommended Fix

### Approach: Debounced Autosave (1.5s after last keystroke)

```
User types → handleInputChange() → setState
                                       ↓
                              debounce(1500ms)
                                       ↓
                              autoSave() → POST /api/.../metadata → DB
                                       ↓
                              setSaveStatus('saved')
```

### Implementation Details

| Aspect | Solution |
|:-------|:---------|
| Trigger | Every field change, debounced 1500ms |
| Scope | Save entire current step group (same as Save button) |
| Status indicator | Small text below progress bar: "Saving..." / "Saved" / "Unsaved changes" |
| Conflict handling | Last-write-wins (same as current Save button) |
| Error handling | Silent retry once; if fails, show "Unsaved changes" with manual Save available |
| Network detection | `navigator.onLine` check before save attempt |
| Keep Save button | Yes — for explicit user control and confidence |
| Keep Next saves | Yes — as confirmation before step transition |

### Code Changes Required

1. **Add `useRef` for debounce timer** — track timeout ID
2. **Add `saveStatus` state** — `'idle' | 'saving' | 'saved' | 'unsaved'`
3. **Modify `handleInputChange`** — after setState, trigger debounced autosave
4. **Add `autoSave` function** — same logic as `handleSaveStep` but silent (no toast)
5. **Add status indicator** — 3-4 lines of JSX in the header area
6. **Add SCSS for status** — `.saveStatus`, `.saving`, `.saved`, `.unsaved` classes

### No Backend Changes Required

The existing `POST /api/.../metadata` endpoint already does upsert (insert or update). Calling it more frequently is safe — it's idempotent.

---

## Estimated Effort

| Item | Time |
|:-----|:-----|
| Debounce logic + autoSave function | 20 min |
| Save status state + indicator UI | 15 min |
| SCSS for status indicator | 5 min |
| Edge case handling (offline, errors) | 15 min |
| Testing | 15 min |
| **Total** | **~1 hour** |

---

## Risks

| Risk | Mitigation |
|:-----|:-----------|
| Too many API calls | Debounce at 1500ms ensures max 1 call per field interaction |
| Race conditions | Only save current step; sequential (not parallel) saves |
| User confusion | Status indicator makes save state visible |
| Server load | Metadata endpoint is lightweight (single table upsert) |

---

## Decision Required

Confirm to proceed with implementation. No architectural changes needed — this is a UX enhancement within the existing OnboardingPage component only.
