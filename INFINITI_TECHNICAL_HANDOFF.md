# INFINITI Console — Technical Handoff Document
> Version: 1.0 | Date: 2026-06-05 | Prepared for: Manus AI / New AI Developer

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Repository / Gitea](#3-repository--gitea)
4. [Server / Deployment](#4-server--deployment)
5. [Existing Modules](#5-existing-modules)
6. [Database](#6-database)
7. [Yandex Disk Backups](#7-yandex-disk-backups)
8. [Development Rules](#8-development-rules)
9. [Recommended Integration Approach](#9-recommended-integration-approach)
10. [Risks and Warnings](#10-risks-and-warnings)

---

## 1. Project Overview

### What is INFINITI Console?
INFINITI Console (`console.infiniti.stream`) is a **B2B SaaS platform** for business management. It serves as a white-label CRM + project management + financial tool for a consulting/investment company (INFINITI).

### Business Logic
- **Residents** (admins/staff) manage clients, projects, invoices, offers, accounting
- **Clients** access their portal: view invoices, projects, orders, business plans
- **Public** pages: invoice/offer view by token, business plan/model public view
- Core revenue flow: Catalog → Cart → Offer → Invoice → Payment → Transaction

### User Roles
| Role | Description |
|------|-------------|
| `Resident` (Admin) | Full access — manages everything |
| `Client` | Limited portal — own data only |
| `Public` | No auth — invoice/offer/plan view by token |

### Implemented Sections / Modules
- Dashboard (cashflow stats)
- Customers (CRM: contacts, groups, companies)
- Talents (catalog of specialists)
- Sales (invoices, offers/proposals)
- Projects (tasks, kanban, logs, invoices, expenses)
- Accounting (transactions, accounts, assets, bills, transfers)
- Business Plan (AI-generated, public shareable)
- Business Model (admin + public view, KPI, passport fields)
- Documents (file storage)
- Settings (roles, permissions, users, currencies, custom fields)
- Support / Tickets (knowledge base, popular questions, replies)
- Leads (HubSpot integration)
- ChatGPT assistant (context-aware)
- Notifications (push via OneSignal + WebSocket)
- Meetings (Zoom integration)
- Profile settings

---

## 2. Technology Stack

### Frontend
| Component | Technology |
|-----------|-----------|
| Framework | React 18 + TypeScript |
| Build tool | Vite 5 |
| Routing | React Router v6 |
| State | React Context API + local state |
| Styling | CSS Modules + SCSS |
| Package manager | **Yarn** (not npm — use yarn!) |
| UI components | Custom (no Material UI / Ant Design) |
| HTTP client | Custom `customFetch` wrapper |
| WebSocket | Custom WebSocketProvider |
| Push notifications | OneSignal SDK |

### Backend
| Component | Technology |
|-----------|-----------|
| Framework | Laravel 10 (PHP 8.3) |
| API | REST JSON API (`/api/v1/`) |
| Auth | Laravel Sanctum (token-based) |
| Queue | Redis + Laravel Queue workers |
| Cache | Redis |
| Sessions | File |
| Mail | SMTP (Beget) |
| AI | OpenAI GPT-4 (chat, business plan generation) |
| Meetings | Zoom API (OAuth) |
| Push | OneSignal REST API |
| PDF | DomPDF (barryvdh/laravel-dompdf) |

### Infrastructure
| Component | Technology |
|-----------|-----------|
| Server OS | Ubuntu 24.04 LTS |
| Web server | Nginx 1.24 |
| Database | MySQL 8.0 |
| Cache/Queue | Redis 7.0 |
| PHP | 8.3.6 (php8.3-fpm) |
| Node.js | v20.19.6 |
| SSL | Let's Encrypt (auto-renew via Certbot) |
| Backup | rclone → Yandex Disk |

### Key Commands
```bash
# Frontend (always use yarn, not npm)
cd /var/www/Infiniti/frontend
yarn install          # install dependencies
yarn dev              # local dev server
yarn build            # production build → dist/

# Backend
cd /var/www/Infiniti/backend
composer install      # install PHP dependencies
php artisan migrate   # run migrations
php artisan config:cache  # cache config (required after .env changes)
php artisan queue:restart # restart queue workers after deploy
php artisan queue:work    # start queue worker manually
```

---

## 3. Repository / Gitea

### Gitea Server
| Parameter | Value |
|-----------|-------|
| URL | `http://80.74.24.250:3000` |
| User | `paul` |
| Repo | `paul/infiniti-console` |
| Clone URL | `http://80.74.24.250:3000/paul/infiniti-console.git` |
| Gitea Actions Runner | Installed on VPS, service: `gitea-runner` |

### Branches
| Branch | Purpose |
|--------|---------|
| `main` | **Production** — deployed to live server |
| `genspark_ai_developer` | AI developer working branch |
| `clean-baseline` | Stable snapshot (do not delete) |
| `clawd/leads` | Leads module development |
| `genspark/knowledge-base-*` | KB module iterations |
| `genspark/tickets-workflow` | Tickets module |
| `manus/ai-assistant-upgrade` | Manus AI branch |

### Branch Rules
```
✅ Create new branch from: main
✅ Naming: manus/<feature-name> or feature/<name>
❌ NEVER push directly to main
❌ NEVER force push to main
✅ Merge to main only after build passes
```

### Commit Rules
```
feat(module): description     # new feature
fix(module): description      # bug fix
refactor(module): description # refactor
security: description         # security fix
ci: description               # CI/CD changes
```

### Git Workflow
```bash
# Before starting work
git checkout main
git pull origin main
git checkout -b manus/your-feature-name

# During work
git add .
git commit -m "feat(module): description"
git push origin manus/your-feature-name

# To deploy — merge to main via PR in Gitea
# Auto-deploy triggers on push to main
```

### Protected Files (do NOT change without approval)
- `backend/.env` — never commit, never push
- `frontend/.env` — never commit, never push
- `backend/config/socket.php` — WebSocket config
- `backend/config/app.php` — app config
- `.github/workflows/deploy.yml` — old GitHub CI (reference only)
- `.gitea/workflows/deploy.yml` — **active** Gitea CI/CD

---

## 4. Server / Deployment

### Server Details
| Parameter | Value |
|-----------|-------|
| IP | `80.74.24.250` |
| Hostname | `infiniti.stream` |
| OS | Ubuntu 24.04 LTS |
| SSH | `ssh root@80.74.24.250` |
| SSH Password | `ldm29Gc6OGesrQApKov9B` |

### Project Path
```
/var/www/Infiniti/
├── backend/          # Laravel app
│   ├── .env          # ⚠️ NEVER commit this
│   ├── public/       # Nginx document root for /api
│   └── storage/      # file uploads, logs
├── frontend/         # React app source
│   └── .env          # ⚠️ NEVER commit this
└── dist/             # Built frontend (served by Nginx)
    └── sw.js         # Service Worker (copied after build)
```

### Services Running
```bash
systemctl status nginx          # Web server
systemctl status php8.3-fpm     # PHP FastCGI
systemctl status mysql          # Database
systemctl status redis-server   # Cache/Queue
systemctl status gitea          # Git server (port 3000)
systemctl status gitea-runner   # CI/CD runner
```

### Queue Workers
```bash
# Check if queue workers are running
ps aux | grep artisan
# Restart after deploy (mandatory!)
php artisan queue:restart
```

### Safe Deploy Steps
```bash
cd /var/www/Infiniti

# 1. Pull latest
git fetch origin
git reset --hard origin/main

# 2. Backend
cd backend
composer install --no-interaction --prefer-dist --optimize-autoloader
php artisan migrate --force
php artisan config:cache
php artisan queue:restart

# 3. Frontend
cd ../frontend
yarn install
node_modules/.bin/vite build

# 4. Move dist
rm -rf /var/www/Infiniti/dist
mv /var/www/Infiniti/frontend/dist /var/www/Infiniti/dist
cp /var/www/Infiniti/frontend/public/sw.js /var/www/Infiniti/dist/sw.js

echo "Deploy done at $(date)"
```

### Rollback
```bash
cd /var/www/Infiniti
git log --oneline -10               # find previous commit hash
git reset --hard <previous-hash>    # rollback code
cd backend && php artisan config:cache && php artisan queue:restart
# Re-build frontend if needed
cd ../frontend && node_modules/.bin/vite build
rm -rf /var/www/Infiniti/dist
mv /var/www/Infiniti/frontend/dist /var/www/Infiniti/dist
```

### Nginx Config
```
/etc/nginx/sites-enabled/console.infiniti.stream   # main app
/etc/nginx/sites-enabled/gitea                     # git server
/etc/nginx/sites-enabled/infiniti.stream           # landing page
```

---

## 5. Existing Modules

### 5.1 Authentication / Users
- **Frontend**: `frontend/src/features/Auth/` + `frontend/src/pages/Auth/`
- **Backend**: `backend/app/Http/Controllers/Api/AuthController.php`
- **Routes**: `POST /api/v1/client/login`, `POST /api/v1/resident/login`, `POST /api/v1/logout`
- **Tables**: `sys_users`, `personal_access_tokens`
- **Auth**: Laravel Sanctum token in Authorization header
- **Social**: Google OAuth (`/api/v1/social/auth/google/redirect`)

### 5.2 Projects
- **Frontend**: `frontend/src/features/Admin/Projects/`
  - `ViewProject/` — Kanban board (tasks by status), task modals
  - `CreateNewProject/`, `EditProject/` — project CRUD
  - `InvoicesProject/` — project invoices
  - `ExpensesProject/` — project expenses
  - `LogsProject/` — activity logs
- **Backend**: `backend/app/Http/Controllers/Api/Resident/Project/`
- **Routes**: `/api/v1/resident/project`
- **Tables**: `clx_projects`, `clx_projects_log`, `sys_tasks`, `sys_tasks_time`
- **Task statuses**: defined in project settings, drive Kanban columns
- **Dependencies**: Invoices, Transactions, Customers

### 5.3 Kanban
- **Frontend**: Inside `ViewProject/` — tasks rendered as columns by status
- **Components**: `CreateTaskModal`, `EditTaskModal`, `ViewTaskModal`
- **Tables**: `sys_tasks`, `sys_tasks_time`
- **Note**: Kanban is NOT a separate module — it lives inside Projects

### 5.4 Sales — Invoices
- **Frontend**: `frontend/src/features/Admin/Sales/InvoicesPage/`, `NewInvoice/`, `EditInvoice/`, `ViewInvoice/`
- **Backend**: `backend/app/Http/Controllers/Api/Resident/Sale/InvoiceController.php`
- **Routes**: `/api/v1/resident/invoice/*`
- **Tables**: `sys_invoices`, `sys_invoiceitems`
- **Public access**: `/api/v1/invoice/token/:token` — view/pay without auth
- **PDF**: generated via DomPDF
- **Dependencies**: Customers, Transactions, File Storage

### 5.5 Sales — Offers / Commercial Proposals
- **Frontend**: `frontend/src/features/Admin/Sales/NewOfferPage/`, `OffersPage/`, `ViewOfferPage/`, `EditOffer/`
- **Backend**: `backend/app/Http/Controllers/Api/Resident/Sale/OfferController.php`
- **Routes**: `/api/v1/resident/offer/*`
- **Tables**: `sys_quotes`, `sys_quoteitems`
- **Public access**: `/api/v1/offer/token/:token` — client can accept/decline
- **Dependencies**: Customers, Catalog/Talents, Invoices

### 5.6 Customers (CRM)
- **Frontend**: `frontend/src/features/Admin/CustomersPage/`
- **Backend**: `backend/app/Http/Controllers/Api/Resident/Client/`
- **Routes**: `/api/v1/resident/client/*`
- **Tables**: `sys_users` (clients), `sys_companies`, `crm_groups`, `crm_customfields`, `crm_customfieldsvalues`
- **Features**: contacts, companies, groups, custom fields, password manager, activity log
- **Dependencies**: Invoices, Offers, Transactions, Documents, Projects

### 5.7 Accounting
- **Frontend**: `frontend/src/features/Admin/AccountingPage/`
  - Accounts, Transactions, Assets, Bills, Deposits, Expenses, Transfers
- **Backend**: `backend/app/Http/Controllers/Api/Resident/Transactions/`
- **Routes**: `/api/v1/resident/transactions/*`
- **Tables**: `sys_transactions`, `account_balances`, `assets`, `asset_categories`, `bills`
- **Multi-currency**: via `sys_currencies`, `sys_currency_history`
- **Dependencies**: Invoices, Customers

### 5.8 Business Plan (AI-generated)
- **Frontend**: `frontend/src/features/Admin/BusinessPlanPage/`, `frontend/src/features/Client/BusinessPlan/`
- **Public view**: `frontend/src/pages/Public/BusinessPlan/`
- **Backend**: `backend/app/Http/Controllers/Api/Resident/BusinessPlan/`
- **Routes**: `/api/v1/resident/business-plan/*`, `/api/v1/business-plan/view/:token`
- **Tables**: `app_business_plan`, `questions`
- **AI**: OpenAI GPT-4 via `GeneratePlan` listener + Queue
- **WebSocket**: real-time progress during generation
- **Public**: shareable link with read-only view

### 5.9 Business Model
- **Frontend Admin**: `frontend/src/features/Admin/` → `ViewBusinessModel/`, `ViewBusinessModelsPage/`
- **Frontend Public**: `frontend/src/pages/Public/BusinessModel/BusinessModelViewPage/`
- **Backend**: `backend/app/Http/Controllers/Api/BusinessModelController.php`, `backend/app/Http/Controllers/Api/Resident/BusinessPlan/`
- **Routes**: `/api/v1/resident/business-model/*`, `/api/v1/business-model/*`
- **Tables**: `business_model`, `business_model_prop`, `business_model_prop_value`, `business_model_value`
- **Features**: 7-tab navigation, KPI grid, passport fields, public shareable page
- **Recently added**: editable KPI fields, 5 passport fields, SaaS Marketplace seed data

### 5.10 Documents / Files
- **Frontend**: `frontend/src/features/Admin/DocumentsPage/`, `frontend/src/features/Client/DocumentsPage/`
- **Backend**: `backend/app/Http/Controllers/Api/FileController.php`, `backend/app/Http/Controllers/Api/Resident/DocumentController.php`
- **Routes**: `/api/v1/resident/document/*`, `/api/v1/file/:id`
- **Tables**: `file_storages`, `sys_documents`
- **Storage**: `/var/www/Infiniti/backend/storage/app/`
- **Access**: files served via signed URL or public token

### 5.11 Roles / Permissions
- **Frontend**: `frontend/src/features/Admin/Settings/`
- **Backend**: `backend/app/Http/Controllers/Api/Resident/Settings/RoleController.php`
- **Routes**: `/api/v1/resident/settings/role/*`
- **Tables**: `sys_roles`, `sys_permissions`, `sys_staffpermissions`
- **Warning**: Do not rename or delete default roles — they are hardcoded in places

### 5.12 Support / Tickets / Knowledge Base
- **Frontend Admin**: `frontend/src/features/Admin/SupportPage/`
- **Frontend Client**: `frontend/src/features/Client/TicketsPage/`, `KnowledgeBasePage/`
- **Backend**: `backend/app/Http/Controllers/Api/Resident/Support/`, `KnowledgeBaseAdminController.php`
- **Routes**: `/api/v1/resident/` tickets, KB endpoints
- **Tables**: `sys_tickets`, `sys_ticketreplies`, `sys_ticketdepartments`, `ib_kb`, `ib_kb_groups`, `ib_kb_replies`, `kb_popular_questions`
- **Features**: ticket workflow, file attachments, admin reply, client notifications, KB popular questions

### 5.13 Talents / Catalog
- **Frontend**: `frontend/src/features/Admin/TalentsPage/`
- **Backend**: `backend/app/Http/Controllers/Api/Resident/Talents/`, `CatalogController.php`
- **Routes**: `/api/v1/resident/talent/*`, `/api/v1/catalog/*`
- **Tables**: `catalog_user`, `catalog_team`, `catalog_prop`, `catalog_user_employment`
- **Flow**: Talent → Cart → Offer

### 5.14 Leads (HubSpot)
- **Frontend**: `frontend/src/features/Admin/LeadsPage/`
- **Backend**: `backend/app/Http/Controllers/Api/Resident/LeadsController.php`
- **Routes**: `/api/v1/resident/leads/*`
- **External**: HubSpot API (`HUBSPOT_TOKEN` in .env)
- **Tables**: `crm_leads`, `crm_lead_status`, `crm_lead_sources`

### 5.15 ChatGPT Assistant
- **Frontend**: Sidebar widget (ChatGPTProvider context)
- **Backend**: `backend/app/Http/Controllers/Api/Resident/ChatGPTController.php`
- **Routes**: `/api/v1/resident/chat-gpt/*`
- **Tables**: `chat_gpt`
- **Context**: includes business model passport fields, KPI, user data

### 5.16 Meetings (Zoom)
- **Backend**: `backend/app/Services/Zoom/`, `MeetingController.php`
- **Routes**: `/api/v1/meeting/*`
- **Tables**: `meetings`, `catalog_user_employment`
- **Webhook**: `/api/v1/zoom/webhook`

### 5.17 Notifications
- **Backend**: `backend/app/Http/Controllers/Api/NotificationController.php`
- **Routes**: `/api/v1/notification/*`
- **Tables**: `notifications`, `push_subscriptions`
- **Transport**: OneSignal + WebSocket real-time
- **Tables**: `sys_users.push_token`

---

## 6. Database

### Connection Details
```
Host: 127.0.0.1
Port: 3306
Database: infiniti
User: infiniti
Password: (see /var/www/Infiniti/backend/.env)
```

### Key Tables
| Table | Module | Notes |
|-------|--------|-------|
| `sys_users` | Auth, CRM | All users (residents + clients) |
| `sys_roles` | Roles | Role definitions |
| `sys_permissions` | Roles | Permission matrix |
| `sys_invoices` | Sales | Invoices |
| `sys_quotes` | Sales | Offers/proposals |
| `sys_transactions` | Accounting | All financial transactions |
| `account_balances` | Accounting | Account balance snapshots |
| `clx_projects` | Projects | Project records |
| `sys_tasks` | Projects/Kanban | Task records |
| `business_model` | Business Model | BM records |
| `app_business_plan` | Business Plan | BP records |
| `sys_tickets` | Support | Support tickets |
| `ib_kb` | Knowledge Base | KB articles |
| `file_storages` | Files | File metadata |
| `chat_gpt` | ChatGPT | Chat history |
| `notifications` | Notifications | Notification records |
| `meetings` | Zoom | Meeting records |

### Migrations
```bash
# Run all pending migrations
php artisan migrate

# Rollback last batch
php artisan migrate:rollback

# Migration files location
/var/www/Infiniti/backend/database/migrations/
```

### File Storage
- **Physical path**: `/var/www/Infiniti/backend/storage/app/`
- **Public files**: `/var/www/Infiniti/backend/storage/app/public/`
- **Access**: via `/api/v1/file/:id` endpoint

### Database Backup
```bash
# Manual backup
mysqldump --all-databases --single-transaction --routines --triggers \
  | gzip > /tmp/infiniti-backup-$(date +%Y%m%d).sql.gz

# Restore
gunzip < backup.sql.gz | mysql -u root infiniti
```

### ⚠️ Tables NOT to modify directly
- `migrations` — managed by Laravel only
- `sys_permissions` — edit via admin UI or migration
- `sys_roles` — edit via admin UI
- `personal_access_tokens` — managed by Sanctum

---

## 7. Yandex Disk Backups

### Configuration
- **Tool**: `rclone` v1.74.2
- **Remote**: `yadisk:` (WebDAV, Yandex account: `premiuminvest`)
- **Config**: `/root/.config/rclone/rclone.conf`

### Backup Location
```
Yandex Disk: /backups/vps-infiniti/YYYY-MM-DD_HH-MM/
  ├── git-infiniti.tar.gz       # Full .git repo bundle
  ├── git-growthmentor.tar.gz   # GrowthMentor repo
  ├── env-files.tar.gz          # All .env files (secrets!)
  ├── mysql-all-YYYY-MM-DD.sql.gz  # Full MySQL dump
  └── nginx-configs.tar.gz      # Nginx configuration
```

### Schedule
```bash
# Runs every night at 03:00
crontab -l | grep backup
# 0 3 * * * /usr/local/bin/backup-to-yadisk.sh

# Retention: last 14 backups (2 weeks)
```

### Manual Backup
```bash
/usr/local/bin/backup-to-yadisk.sh

# Check logs
tail -50 /var/log/backup-yadisk.log
```

### Verify Backup
```bash
rclone lsd yadisk:backups/vps-infiniti/
rclone ls yadisk:backups/vps-infiniti/ | tail -20
```

### Restore from Backup
```bash
# 1. Download backup
rclone copy yadisk:backups/vps-infiniti/2026-05-28_03-00/ /tmp/restore/

# 2. Restore MySQL
gunzip < /tmp/restore/mysql-all-2026-05-28.sql.gz | mysql -u root

# 3. Restore git repo
cd /var/www && tar -xzf /tmp/restore/git-infiniti.tar.gz

# 4. Restore .env files
tar -xzf /tmp/restore/env-files.tar.gz -C /

# 5. Restore nginx configs
tar -xzf /tmp/restore/nginx-configs.tar.gz -C /
nginx -t && systemctl reload nginx
```

---

## 8. Development Rules

### ⚠️ MANDATORY — Follow every time

```
1. BEFORE ANY WORK:
   - git pull origin main
   - create new branch: git checkout -b manus/feature-name
   - check server status: ensure app is healthy

2. NEVER:
   - push directly to main
   - commit .env files (they are in .gitignore)
   - run migrations without testing locally
   - delete existing migrations
   - modify sys_permissions/sys_roles directly in SQL

3. ALWAYS:
   - use yarn (not npm) for frontend
   - run `php artisan config:cache` after .env changes
   - run `php artisan queue:restart` after backend deploy
   - copy sw.js after frontend build
   - test build before merge to main

4. COMMITS:
   - small, focused commits
   - use conventional commit format: type(scope): message
   - write in English

5. MIGRATIONS:
   - one migration per logical change
   - always provide `down()` rollback method
   - test with: php artisan migrate --pretend

6. CONFLICTS:
   - STOP and describe the conflict in detail
   - do NOT auto-resolve complex conflicts
   - prefer remote (main) code over local changes

7. AFTER DEPLOY:
   - verify app responds: curl -I https://console.infiniti.stream
   - check error logs: tail -100 /var/log/nginx/console_error.log
   - check Laravel logs: tail -100 /var/www/Infiniti/backend/storage/logs/laravel.log
```

---

## 9. Recommended Integration Approach

### New Module: Growth & Exit Program / M&A Deal Room

**Concept**: Add as a new **Project Type** inside the existing Projects module.

#### Architecture Decision
```
❌ DO NOT create a separate top-level module
✅ Add project_type field to clx_projects
✅ Reuse existing: Kanban, Gantt, Files, Participants, Invoices, Offers
✅ Add Deal Room-specific pages as sub-routes of Projects
```

#### Implementation Plan

**Step 1 — Backend**
```php
// Migration: add type to projects
Schema::table('clx_projects', function (Blueprint $table) {
    $table->string('project_type')->default('standard');
    // types: 'standard', 'deal_room', 'growth_program'
});
```

**Step 2 — Onboarding Wizard**
```
Route: /admin/projects/create/deal-room
Component: frontend/src/features/Admin/Projects/DealRoomWizard/
Steps:
  1. Company info
  2. Deal type (M&A, investment, exit)
  3. Valuation input
  4. Participants / roles
  5. Deal Room folder structure (auto-created)
```

**Step 3 — Deal Room Folder Structure**
```
Files module extension:
  /deal-room/{project_id}/
    ├── NDA/
    ├── Financial Statements/
    ├── Legal Documents/
    ├── Due Diligence/
    ├── Valuation Reports/
    └── Term Sheets/
```

**Step 4 — Valuation Page**
```
Route: /admin/projects/:id/valuation
New table: deal_valuations
  - project_id, method (DCF/multiples/asset), value, currency, notes, created_at
```

**Step 5 — Investor/Buyer Access Roles**
```
Extend sys_roles with:
  - 'investor' — read-only access to deal room files + valuation
  - 'buyer' — can view + download + sign documents
  - 'advisor' — full deal room access

Use existing: sys_permissions matrix
```

**Step 6 — Admin Settings**
```
Route: /admin/settings/deal-room-templates
New tables: deal_stages, deal_templates
Reuse: existing Settings module structure
```

---

## 10. Risks and Warnings

### 🔴 Most Fragile Parts

| Area | Risk | Notes |
|------|------|-------|
| WebSocket | Breaks silently | `config/socket.php` must match `.env` SOCKET_PORT |
| Queue workers | Stop after deploy | Always run `php artisan queue:restart` |
| Business Plan generation | Race conditions | Uses WebSocket + Queue — test both paths |
| File storage | Permissions | `/var/www/Infiniti/backend/storage/` must be writable |
| SSL certificate | Expires | Auto-renewed by Certbot, but check if cron is running |
| Gitea runner | Stops | Check `systemctl status gitea-runner` |

### 🔴 Files — Do NOT Touch Without Extreme Care

```
backend/config/socket.php          # WebSocket config
backend/config/app.php             # APP_KEY must never change (breaks encryption)
backend/app/Http/Middleware/       # Auth middleware — changes break all API
backend/routes/api.php             # Public routes — wrong change breaks client access
frontend/src/app/router/router.tsx # Main routing — wrong change breaks navigation
frontend/src/shared/utils/api/     # customFetch, Auth — used everywhere
.gitea/workflows/deploy.yml        # Auto-deploy config
/etc/nginx/sites-enabled/console.infiniti.stream  # Nginx — wrong config = downtime
```

### 🔴 Where Bugs Were Most Common
1. **WebSocket** — `env()` vs `config()` in PHP (always use `config()` after caching)
2. **4-byte UTF-8** — MySQL `utf8` vs `utf8mb4` — emojis break MySQL inserts
3. **Queue jobs** — not restarting workers after deploy = old code running
4. **Frontend .env** — Vite requires `VITE_` prefix on all variables
5. **Business Plan** — OpenAI timeout (set `OPENAI_REQUEST_TIMEOUT=120` in .env)

### ✅ Mandatory Pre-Deploy Checklist
```
□ git pull origin main (latest code)
□ yarn build (no errors)
□ php artisan migrate --pretend (check migrations)
□ php artisan config:cache (clear config cache)
□ php artisan queue:restart (restart workers)
□ cp sw.js to dist/ (service worker)
□ curl -I https://console.infiniti.stream (verify 200 OK)
□ check Laravel log for errors
□ test login (both resident and client)
```

### 🔑 Credentials Reference
| Service | Credentials |
|---------|------------|
| Server SSH | `root@80.74.24.250` / `ldm29Gc6OGesrQApKov9B` |
| Gitea | `http://80.74.24.250:3000` / `paul` / `NL0b3TsAeWsccFJBFLSEDg` |
| Gitea API token | `f269284cb186058cfc9f951cf7966e32a045e14c` |
| MySQL DB | `infiniti` / see backend `.env` on server |
| Yandex Disk | `premiuminvest` / see rclone config on server |
| App URL | `https://console.infiniti.stream` |

---

*End of INFINITI Console Technical Handoff Document*
*Prepared: 2026-06-05 | Author: Genspark AI Developer*
