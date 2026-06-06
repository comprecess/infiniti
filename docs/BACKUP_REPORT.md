# INFINITI Growth & Exit Sprint — Backup & Recovery Report

**Date:** 2026-06-06  
**Author:** Manus AI  
**Version:** v1.0 Candidate  

## 1. Backup Summary

Before concluding the Visual Unification Sprint, a complete snapshot of the system was taken to ensure rollback capability if needed. The backup includes the database, frontend build, and documentation.

## 2. Backup Files Created

The following backup files were generated on the production server (`80.74.24.250`):

| Type | File Path | Size | Description |
|------|-----------|------|-------------|
| **Database** | `/tmp/infiniti_v1.0_candidate_20260606_152853.sql.gz` | ~1.2 MB | Full MySQL dump of the `infiniti` database. |
| **Frontend** | `/tmp/infiniti_frontend_build_v1.0_candidate.tar.gz` | ~7.1 MB | Archive of the `/var/www/Infiniti/frontend/dist` directory containing the compiled React application. |
| **Docs** | `/tmp/infiniti_docs_v1.0_candidate.tar.gz` | ~650 KB | Archive of the `/home/ubuntu/infiniti-console/docs` directory containing all sprint documentation. |
| **Pre-Sprint DB**| `/root/backups/infiniti_pre_growth_exit_20260605_233608.sql` | ~10.6 MB | Database snapshot taken before the sprint started. |

## 3. Offsite Storage (Yandex Disk)

All candidate backup files have been successfully uploaded to the configured Yandex Disk remote via `rclone`.

**Destination Path:** `yadisk:INFINITI Backups/growth-exit-v1.0-candidate/`

**Verification:**
```bash
rclone ls yadisk:"INFINITI Backups/growth-exit-v1.0-candidate/"
   654821 infiniti_docs_v1.0_candidate.tar.gz
  7170787 infiniti_frontend_build_v1.0_candidate.tar.gz
  1275614 infiniti_v1.0_candidate_20260606_152853.sql.gz
```

## 4. Git Tags & Branches

The codebase state has been preserved in Git:

- **Branch:** `manus/feat-growth-exit-program` (Contains all sprint commits)
- **Tag:** `growth-exit-v1.0-candidate` (Points to the final commit `1ac4aaa7`)
- **Pre-Sprint Tag:** `pre-growth-exit-v1` (Points to the state before sprint changes)

## 5. Recovery Procedures

If a rollback is required, follow these steps:

### 5.1 Restore Database
```bash
# SSH to server
ssh root@80.74.24.250

# Unzip and restore the SQL dump
gunzip < /tmp/infiniti_v1.0_candidate_20260606_152853.sql.gz | mysql -u root -p infiniti
```

### 5.2 Restore Frontend Build
```bash
# SSH to server
ssh root@80.74.24.250

# Extract the backup over the active dist directory
tar -xzf /tmp/infiniti_frontend_build_v1.0_candidate.tar.gz -C /var/www/Infiniti/dist --strip-components=1
```

### 5.3 Restore Codebase (Git)
```bash
# SSH to server
ssh root@80.74.24.250

# Navigate to frontend repo
cd /var/www/Infiniti/frontend

# Checkout the pre-sprint tag
git checkout pre-growth-exit-v1

# Rebuild frontend
npx vite build
cp -r dist/* ../dist/
```
