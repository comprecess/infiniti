# Deployment Target Audit & Workflow

**Date:** 2026-06-06 (Updated 2026-06-07)
**Issue:** SSH access denied during ISSUE-013 deployment & Release Notes Workflow Integration

---

## 1. Release Notes Workflow (New Deployment Discipline)

To ensure all user-visible changes are properly communicated to Admin and Client/Founder users, the **Release Notes Workflow** is now a mandatory part of the deployment discipline.

### Definition of Done (Frontend Deployments)

Before any user-visible frontend deployment is considered complete, the following steps MUST be executed:

1. **Update Version:** Increment the version number in `frontend/src/app/data/releases.ts` according to the versioning rules.
2. **Add Release Notes:** Add a new entry to the `releases` array in `releases.ts` detailing:
   - New features
   - UX improvements
   - Bug fixes
   - Infrastructure/deployment updates (if user-relevant)
3. **Deploy Exclusively via Script:** Deploy the application using ONLY the official script: `./deploy-frontend.sh`.
4. **Verify Build Info:** Confirm the deployment by checking `https://console.infiniti.stream/build-info.json` and ensuring the commit hash matches the deployed version.
5. **Verify Popup Visibility:** Confirm the Release Notes popup appears for both **Admin** and **Client/Founder** users when the version has changed.
6. **Verify Popup State:** Confirm the popup is shown **only once** per user per version (managed via `localStorage`).

*Note: Not every internal change requires a visible release popup. Release notes are required ONLY when the change affects what an Admin, Founder, Investor, Buyer, or Deal Manager can see or do.*

### Versioning Rules

- **MVP Validation Phase:** Continue using the `0.9.x-beta` format.
- **Bug Fixes:** Bump the patch version (e.g., `0.9.12-beta` → `0.9.13-beta`).
- **Meaningful Additions:** Bump the minor version for significant workflow or feature additions (e.g., `0.9.x-beta` → `0.10.0-beta`).
- **Production Launch:** Do NOT use `1.0.0` until after the first validated real client case.

---

## 2. Verification Timeout Policy (Permanent Operating Rule)

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

## 3. IP Address Finding (Historical)

The deployment failure on 2026-06-06 was caused by **targeting the wrong IP address** (`77.73.71.176`). The correct server (`80.74.24.250`) was identified and confirmed accessible.

| Parameter | Wrong (used in failed attempt) | Correct (confirmed) |
|:----------|:-------------------------------|:--------------------|
| **IP** | `77.73.71.176` | `80.74.24.250` |
| **SSH Access** | Permission denied | Connected successfully |
| **Hostname** | Unknown | `infiniti.stream` |
| **DNS Resolution** | Does not match `console.infiniti.stream` | Matches `console.infiniti.stream` |

**Conclusion:** The wrong IP was likely introduced during a previous task session through context compression or an incorrect assumption. It was never documented in the project. Use `80.74.24.250` for all future deployments.

---

## 4. Server Verification

```bash
$ ssh root@80.74.24.250
Connected successfully
hostname: infiniti.stream
```

**Frontend source:** `/var/www/Infiniti/frontend/src/`
**Built assets:** `/var/www/Infiniti/dist/`

---

## 5. Current Hosting Map

| Service | Server | IP |
|:--------|:-------|:---|
| `console.infiniti.stream` (frontend) | infiniti.stream | `80.74.24.250` |
| Backend API | infiniti.stream | `80.74.24.250` |
| Gitea (source control) | infiniti.stream | `80.74.24.250:3000` |
| `infiniti.stream` (marketing site) | Cloudflare | `2606:4700:3033::6815:21fc` |

---

## 6. Deployment Credentials (Confirmed Working)

```yaml
Host: 80.74.24.250
User: root
Password: ldm29Gc6OGesrQApKov9B
Frontend Path: /var/www/Infiniti/frontend/src/
Build Output: /var/www/Infiniti/dist/
Deploy Script: ./deploy-frontend.sh
```
