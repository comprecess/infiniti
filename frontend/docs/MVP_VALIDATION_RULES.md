# MVP Validation Operating Rules

**Date:** 2026-06-07
**Status:** Active — applies to all validation sprint work

---

## 1. Verification Timeout Policy (Permanent Operating Rule)

Automated browser verification is helpful but MUST NEVER block progress or consume excessive time/tokens.

### Limits

| Parameter | Value |
|:----------|:------|
| **Maximum verification time** | 5 minutes |
| **Preferred verification time** | 2–3 minutes |
| **Maximum retries** | 3 |
| **Maximum wait per page load** | 30 seconds |

### Timeout Procedure

If automated browser verification cannot be completed within 5 minutes:

1. **Stop** browser-agent investigation immediately.
2. **Report** the following to the user:
   - Root cause (if identified)
   - Files changed
   - Commit hash
   - Deployment status
   - build-info.json commit
3. **Hand off** to manual validation by Paul.
4. **Continue** with the next task.

### Prohibited Actions

Do NOT spend time on:
- Repeated refresh loops
- Repeated DOM polling
- Waiting 30+ seconds for React to mount
- Endless browser retries
- Multiple consecutive `sleep` commands hoping the page loads

### Source of Truth

During MVP validation, **manual validation by Paul is the source of truth**. Browser verification is a convenience tool, not a blocker.

---

## 2. Deployment Discipline

| Rule | Detail |
|:-----|:-------|
| **Deploy script** | `./deploy-frontend.sh` only |
| **Verification** | `https://console.infiniti.stream/build-info.json` |
| **Release notes** | Required for user-visible changes |
| **Versioning** | `0.9.x-beta` during MVP validation |
| **No 1.0.0** | Until first validated real client case |

---

## 3. Issue Tracking

All bugs, UX findings, product improvements, release tasks, infrastructure tasks, and validation tasks MUST be tracked in the **INFINITI Console Evolution** project (ID: 45).

### Task Workflow

| Status | When to use |
|:-------|:------------|
| **Not Started** | New issues, planned work |
| **In Progress** | Active development |
| **Waiting** | Blocked by dependency or approval |
| **Completed** | Done, with summary comment |
| **Deferred** | Deprioritized, not abandoned |

---

## 4. Communication Protocol

- Root cause analysis → save to documentation, not chat
- Validation findings → create task in project 45
- Architecture decisions → update `GROWTH_EXIT_IMPLEMENTATION_REPORT.md`
- Bug fixes → update `VALIDATION_FEEDBACK_REPORT.md`

---

## 5. Definition of Done (Frontend Deployments)

1. Update version in `releases.ts`
2. Add release notes entry
3. Deploy via `./deploy-frontend.sh`
4. Verify `build-info.json`
5. Confirm release popup appears (Admin + Client/Founder)
6. Confirm popup shown once per version
7. If browser verification times out → hand off to Paul

---

## 6. Versioning Rules

- `0.9.x-beta` during MVP validation
- Patch bump for bug fixes (e.g., `0.9.12-beta` → `0.9.13-beta`)
- Minor bump for meaningful workflow additions (e.g., `0.9.x` → `0.10.0-beta`)
- No `1.0.0` until first validated real client case

---

## 7. Scope Rules for Release Notes

**Required** when the change affects what Admin, Founder, Investor, Buyer, or Deal Manager can see or do.

**Not required** for:
- Internal refactoring
- Documentation-only changes
- Invisible backend changes
- Dev tooling updates
