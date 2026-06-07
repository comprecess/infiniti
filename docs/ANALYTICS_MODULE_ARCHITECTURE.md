# INFINITI Console — Analytics Module MVP Architecture

**Version:** 0.1.0 (Architecture Only)
**Status:** Proposed
**Author:** Athena Morgan (AI CTO)
**Date:** 2026-06-08

---

## 1. Overview

The Analytics Module provides project-level intelligence using existing data structures. No new database tables are required for MVP. All metrics are computed from existing `sys_tasks`, `project_times`, `project_logs`, `catalog_user_value`, and `clx_projects` tables.

---

## 2. Data Sources (Existing)

| Table | Provides |
|-------|----------|
| `sys_tasks` | Task counts, statuses, assignments, dates |
| `project_times` | Time logged per user per task |
| `project_logs` | Activity history (comments, uploads, changes) |
| `catalog_user_value` | Hourly/daily rates for budget calculation |
| `clx_projects` | Project metadata, budget, dates |
| `catalog_user` | Team member profiles |

---

## 3. Module Sections

### 3.1 Project Health

| Metric | Source | Calculation |
|--------|--------|-------------|
| Completion % | `sys_tasks` | `COUNT(status='Completed') / COUNT(*)` |
| Remaining Tasks | `sys_tasks` | `COUNT(status NOT IN ('Completed'))` |
| Blocked Tasks | `sys_tasks` | `COUNT(status='Waiting')` |
| Forecast Completion | `sys_tasks` + velocity | Average tasks/week × remaining |

### 3.2 Team Performance

| Metric | Source | Calculation |
|--------|--------|-------------|
| Total Hours Logged | `project_times` | `SUM(hours)` |
| Hours by Person | `project_times` | `GROUP BY user_id` |
| Hours by Role | `project_times` + `catalog_user_block` | Join on user → role |

### 3.3 Budget Control

| Metric | Source | Calculation |
|--------|--------|-------------|
| Total Budget | `clx_projects.budget` | Direct field |
| Spent | `project_times` × `catalog_user_value.hourly_rate` | Join hours × rate |
| Remaining | Budget - Spent | Computed |
| Burn Rate | Spent / weeks elapsed | Computed |
| Forecast Overrun | Burn rate × remaining weeks > remaining budget | Boolean |

### 3.4 Task Analytics

| Metric | Source | Calculation |
|--------|--------|-------------|
| By Status | `sys_tasks` | `GROUP BY status` |
| By Priority | `sys_tasks` | `GROUP BY priority` |
| By Assignee | `sys_tasks` | `GROUP BY assigned_to` |
| Overdue | `sys_tasks` | `WHERE due_date < NOW() AND status != 'Completed'` |
| Avg Cycle Time | `sys_tasks` | `AVG(updated_at - created_at) WHERE status='Completed'` |

### 3.5 Activity Analytics

| Metric | Source | Calculation |
|--------|--------|-------------|
| Comments This Week | `project_logs` | `WHERE type='comment' AND created_at > 7d` |
| Uploads This Week | `project_logs` | `WHERE type='upload' AND created_at > 7d` |
| Status Changes | `project_logs` | `WHERE type='status_change'` |
| Most Active Member | `project_logs` | `GROUP BY user_id ORDER BY COUNT DESC` |

### 3.6 AI Workforce Analytics

| Metric | Source | Calculation |
|--------|--------|-------------|
| Assigned Tasks | `sys_tasks` | `WHERE assigned_to IN (AI talent IDs)` |
| Estimated Cost | Tasks × avg hours × hourly rate | Computed |
| Estimated Hours | Tasks × avg hours per task type | Computed |
| Human Equivalent Cost | Sum of all AI rates as if human | Direct from rates |

### 3.7 Project Recommendations (AI-Generated)

| Recommendation Type | Logic |
|---------------------|-------|
| Bottleneck Alert | Tasks in "Waiting" > 3 days |
| Budget Warning | Burn rate projects overrun |
| Unassigned Work | Tasks with no assignee |
| Stale Tasks | In Progress > 7 days without activity |
| Next Best Action | Highest priority unblocked task |

---

## 4. Frontend Architecture

### 4.1 Component Structure

```
src/features/Admin/AnalyticsPage/
├── AnalyticsPage.tsx
├── AnalyticsPage.module.scss
├── ProjectHealth/
│   ├── ProjectHealth.tsx
│   └── ProjectHealth.module.scss
├── TeamPerformance/
│   ├── TeamPerformance.tsx
│   └── TeamPerformance.module.scss
├── BudgetControl/
│   ├── BudgetControl.tsx
│   └── BudgetControl.module.scss
├── TaskAnalytics/
│   ├── TaskAnalytics.tsx
│   └── TaskAnalytics.module.scss
├── ActivityFeed/
│   ├── ActivityFeed.tsx
│   └── ActivityFeed.module.scss
├── AIWorkforce/
│   ├── AIWorkforce.tsx
│   └── AIWorkforce.module.scss
└── Recommendations/
    ├── Recommendations.tsx
    └── Recommendations.module.scss
```

### 4.2 API Endpoints (New)

| Endpoint | Method | Returns |
|----------|--------|---------|
| `/api/v1/admin/projects/{id}/analytics/health` | GET | Project health metrics |
| `/api/v1/admin/projects/{id}/analytics/team` | GET | Team performance data |
| `/api/v1/admin/projects/{id}/analytics/budget` | GET | Budget control metrics |
| `/api/v1/admin/projects/{id}/analytics/tasks` | GET | Task breakdown |
| `/api/v1/admin/projects/{id}/analytics/activity` | GET | Activity feed metrics |
| `/api/v1/admin/projects/{id}/analytics/ai` | GET | AI workforce metrics |
| `/api/v1/admin/projects/{id}/analytics/recommendations` | GET | AI recommendations |

### 4.3 Visualization Library

Use **Chart.js** (already available via Chakra UI ecosystem) for:
- Donut charts (task status distribution)
- Bar charts (hours by person, budget burn)
- Line charts (velocity over time)
- Progress bars (completion %, budget usage)

---

## 5. Backend Architecture

### 5.1 Controller

```php
// app/Http/Controllers/Api/Resident/Project/AnalyticsController.php
class AnalyticsController extends Controller
{
    public function health(Project $project) { ... }
    public function team(Project $project) { ... }
    public function budget(Project $project) { ... }
    public function tasks(Project $project) { ... }
    public function activity(Project $project) { ... }
    public function ai(Project $project) { ... }
    public function recommendations(Project $project) { ... }
}
```

### 5.2 Service Layer

```php
// app/Services/Analytics/ProjectAnalyticsService.php
class ProjectAnalyticsService
{
    public function getHealthMetrics(int $projectId): array { ... }
    public function getTeamMetrics(int $projectId): array { ... }
    public function getBudgetMetrics(int $projectId): array { ... }
    public function getTaskMetrics(int $projectId): array { ... }
    public function getActivityMetrics(int $projectId): array { ... }
    public function getAIMetrics(int $projectId): array { ... }
    public function getRecommendations(int $projectId): array { ... }
}
```

---

## 6. Implementation Effort

| Phase | Effort | Priority |
|-------|--------|----------|
| Backend API (7 endpoints) | 4-6 hours | High |
| Frontend components (7 sections) | 6-8 hours | High |
| Chart.js integration | 2-3 hours | Medium |
| AI Recommendations logic | 2-3 hours | Medium |
| Testing & polish | 2-3 hours | Medium |
| **Total** | **16-23 hours** | |

---

## 7. MVP Scope (Phase 1)

For immediate implementation, focus on:

1. **Project Health** — completion %, remaining, blocked
2. **Task Analytics** — status breakdown, overdue count
3. **AI Workforce** — assigned tasks, estimated cost

These 3 sections use only `sys_tasks` and `catalog_user_value` — no new backend logic needed beyond simple SQL aggregations.

---

## 8. Design System Compliance

- Dark theme (`$brand-1000` background)
- INFINITI blue accent (`$brand-500`) for primary metrics
- Space Grotesk typography
- Card-based layout with subtle borders
- Shimmer loading states (using new `LoadingShimmer` component)
- Responsive: mobile-first grid

---

## 9. Dependencies

- No new npm packages required
- Chart.js already available
- No database migrations
- No new tables
- Backend: 1 new controller + 1 service class
- Frontend: 1 new page + 7 feature components

---

## 10. Risk Assessment

| Risk | Mitigation |
|------|------------|
| Performance on large datasets | Add query caching (Redis) |
| Inaccurate recommendations | Start with rule-based, upgrade to AI later |
| Missing time tracking data | Show "No data" gracefully |
| Budget field not populated | Use estimated rates × task count as fallback |
