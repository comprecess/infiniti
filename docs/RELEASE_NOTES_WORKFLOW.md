# INFINITI Release Notes Workflow

This document outlines the standard operating procedure for communicating user-visible changes through the INFINITI Console application. The Release Notes Workflow is a mandatory part of the deployment discipline.

## 1. Overview

The Release Notes system is a frontend-only mechanism designed to inform users (Admins, Founders, Investors, Buyers, Deal Managers) about new features, improvements, and critical bug fixes.

- **Trigger:** The modal automatically appears upon login or page load when the user's browser detects a new version string.
- **State Management:** The `infiniti_last_seen_version` key in `localStorage` ensures the modal is only shown once per version per user.
- **Scope:** Wraps both Admin routes and Client/Founder routes via `VersionProvider`.
- **Data Source:** `frontend/src/app/data/releases.ts`

## 2. Definition of Done (Frontend Deployments)

Before any user-visible frontend deployment is considered complete, developers MUST execute the following checklist:

1. **Update Version:** Increment the version number in `frontend/src/app/data/releases.ts` according to the versioning rules.
2. **Add Release Notes Entry:** Add a new entry to the `releases` array in `releases.ts`.
3. **Deploy Exclusively via Script:** Deploy the application using ONLY the official script: `./deploy-frontend.sh`.
4. **Verify Build Info:** Confirm the deployment by checking `https://console.infiniti.stream/build-info.json` and ensuring the commit hash matches the deployed version.
5. **Verify Popup Visibility:** Confirm the Release Notes popup appears for both Admin and Client/Founder users when the version has changed.
6. **Verify Popup State:** Confirm the popup is shown only once per user per version.

## 3. Versioning Rules

We follow a semantic-like versioning scheme tailored for our current validation phase:

- **MVP Validation Phase:** Continue using the `0.9.x-beta` format.
- **Bug Fixes:** Bump the patch version (e.g., `0.9.12-beta` → `0.9.13-beta`).
- **Meaningful Additions:** Bump the minor version for significant workflow or feature additions (e.g., `0.9.x-beta` → `0.10.0-beta`).
- **Production Launch:** Do NOT use `1.0.0` until after the first validated real client case.

## 4. When to Write Release Notes

**Not every internal change requires a visible release popup.**

- **DO** write release notes when the change affects what an Admin, Founder, Investor, Buyer, or Deal Manager can see or do.
  - *Examples:* New Deal Room upload workflow, new navigation hints, fixing a broken button, adding a new project template.
- **DO NOT** write release notes for invisible backend refactoring, internal tool updates, or minor typo fixes that don't impact workflows.
  - *Examples:* Updating a deployment script, refactoring a React component without UI changes, updating internal documentation.

## 5. Updating `releases.ts`

The `releases.ts` file contains an array of `ReleaseInfo` objects. When creating a new release, add the newest release to the **top** (index 0) of the array.

### Data Structure

```typescript
export interface ReleaseInfo {
  version: string
  date: string
  title: string
  features: string[]
  bugfixes: string[]
  improvements: string[]
}
```

### Example Entry

```typescript
{
  version: '0.9.0-beta',
  date: '2026-06-07',
  title: 'Validation Sprint & Platform Stability',
  features: [
    'Deal Room upload workflow with category assignment',
    'Onboarding autosave for step progress',
  ],
  bugfixes: [
    'Founder Exit Deal sidebar navigation fixed',
    'Document deletion no longer navigates to 404',
  ],
  improvements: [
    'Mobile UX improvements for scrollable tables',
  ],
}
```

## 6. Testing the Modal Locally

To test the Release Notes modal locally during development:

1. Open the application in your browser.
2. Open Developer Tools (F12) → Application tab → Local Storage.
3. Delete the `infiniti_last_seen_version` key.
4. Refresh the page. The modal should appear.

## 7. Architecture Components

- `VersionContext.tsx`: The React context provider that manages the `localStorage` state and fetches `build-info.json` to display build details.
- `ReleaseNotesModal.tsx`: The UI component (Chakra UI Modal) that renders the release notes.
- `releases.ts`: The static data source for release history.
- `deploy-frontend.sh`: The deployment script that generates `build-info.json` during the build process.
