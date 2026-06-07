# INFINITI Console — Infrastructure Reference

## Status: Single Source of Truth

This document is the permanent infrastructure reference for all INFINITI Console operations.

**Before any SSH operation:**

1. Read this document
2. Verify server address
3. Verify `build-info.json`
4. Continue work

---

## Production Environment

| Parameter | Value |
|-----------|-------|
| **Production Server** | `80.74.24.250` |
| **Hostname** | `infiniti.stream` |
| **SSH User** | `root` |
| **Repository** | `http://80.74.24.250:3000/paul/infiniti-console.git` |
| **Frontend Path** | `/var/www/Infiniti/dist` |
| **Backend Path** | `/var/www/infiniti-console/backend` |
| **Deploy Script** | `./deploy-frontend.sh` |
| **Build Verification** | `https://console.infiniti.stream/build-info.json` |
| **Source Control** | Gitea only |
| **GitHub** | NOT USED for deployment |

---

## Deployment Discipline

### Deploy Command

```bash
./deploy-frontend.sh
```

### Verification After Deploy

```bash
curl -s https://console.infiniti.stream/build-info.json | jq .
```

### Definition of Done (User-Visible Changes)

1. Update version in `releases.ts`
2. Add release notes entry
3. Deploy via `./deploy-frontend.sh`
4. Verify `build-info.json`
5. Confirm release popup appears
6. Confirm popup shown once per version

---

## Versioning

| Rule | Value |
|------|-------|
| Format | `0.9.x-beta` |
| Patch bump | Bug fixes |
| Minor bump | New features |
| Major bump | Not until first validated real client |

---

## Verification Timeout Policy

| Parameter | Value |
|-----------|-------|
| Maximum browser verification | 5-7 minutes |
| Maximum retries | 3 |
| Preferred duration | 2-3 minutes |

If verification cannot complete within timeout:

1. Stop browser-agent investigation
2. Report: root cause, files changed, commit hash, deployment status, build-info.json
3. Hand off to manual validation by Paul
4. Continue with next task

---

## Prohibited Servers

| Server | Status |
|--------|--------|
| `77.237.234.247` | **DO NOT USE** unless explicitly instructed |

---

## SSH Connection Template

```bash
sshpass -p 'ldm29Gc6OGesrQApKov9B' ssh -o StrictHostKeyChecking=no root@80.74.24.250 "COMMAND"
```

---

## Directory Structure

```
/var/www/infiniti-console/
├── backend/          # Laravel PHP backend
│   ├── app/
│   ├── routes/
│   └── .env
├── frontend/         # React TypeScript frontend
│   ├── src/
│   ├── docs/
│   └── deploy-frontend.sh
└── ...

/var/www/Infiniti/dist/   # Deployed frontend build output
```

---

## Last Updated

2026-06-07
