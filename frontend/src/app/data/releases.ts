/* eslint-disable max-len */
export interface ReleaseInfo {
  version: string
  date: string
  title: string
  features?: string[]
  bugfixes?: string[]
  improvements?: string[]
  breakingChanges?: string[]
}
export const releases: ReleaseInfo[] = [
  {
    version: '0.9.15-beta',
    date: '2026-06-09',
    title: 'Valuation Intelligence — Venture OS Decision Tool',
    features: [
      'Valuation Assumptions panel: ARR, growth rate, multiple, comparable transactions',
      'Confidence Analysis: contributing factors with scores and explanations',
      'Key Value Drivers: ARR Growth, Market Expansion, Partnerships, Product Milestones',
      'Recommended Next Action: AI-generated from valuation context with action steps',
      'Estimated Valuation Impact: quantified impact of recommended action',
    ],
    bugFixes: [
      'Removed colored border-top lines from valuation cards (style refinement)',
      'Fixed formatCurrency crash when API returns string values',
    ],
    improvements: [
      'Tab-based navigation for cleaner UX across valuation panels',
      'Responsive design for all new panels (mobile-first)',
      'Backend enrichment: ValuationController returns assumptions, drivers, recommendations',
    ],
  },
  {
    version: '0.9.14-beta',
    date: '2026-06-09',
    title: 'Pipeline Pages + Venture OS Context Fix',
    features: [
      'Investor Pipeline: Full board/list view with stage columns (Initial Contact → Term Sheet)',
      'Buyer Pipeline: Full board/list view with stage columns and company details',
      'Pipeline API: GET /api/v1/resident/project/{id}/pipeline/{type} endpoint',
    ],
    bugfixes: [
      'Valuation page: Fixed outlet context mismatch (was receiving undefined project.id)',
      'Growth Plan page: Fixed outlet context mismatch (same root cause)',
      'Both pages now correctly read idProject from ViewProjectPage outlet context',
    ],
    improvements: [
      'Pipeline pages support Board and List view toggle',
      'Pipeline cards show lead name, company, and source badge',
      'Mobile-responsive pipeline columns stack vertically on small screens',
    ],
    breakingChanges: [],
  },
  {
    version: '0.9.13-beta',
    date: '2026-06-09',
    title: 'Donut Chart Mobile Fix + Venture OS Demo Data',
    features: [
      'Venture OS demo data: Growth Plan (8 items), Valuation (4 scenarios), Investor Pipeline (10), Buyer Pipeline (10)',
      'Project Brain placeholder created as Knowledge Asset for Finandy (P44)',
      'Deal Room populated with 7 categorized demo documents (investor memo, valuation, growth strategy)',
    ],
    bugfixes: [
      'Donut chart mobile overflow fixed: center label hidden at 480px breakpoint',
      'Total cost value now displayed below chart on mobile instead of inside donut',
      'ViewTaskModal tabs now horizontally scrollable (prevents wrapping on mobile)',
    ],
    improvements: [
      'Mobile tab navigation uses overflow-x:auto with hidden scrollbar for clean UX',
      'Analytics page responsive breakpoints refined for 320px-480px range',
    ],
    breakingChanges: [],
  },
  {
    version: '0.9.12-beta',
    date: '2026-06-09',
    title: 'Mobile Auth Scroll Fix + Release Governance',
    features: [
      'Release Governance: package.json is now the single authoritative version source',
      'Definition of Done enforced: package.json, releases.ts, build-info.json, and release popup must all match',
    ],
    bugfixes: [
      'Mobile login/register/reset-password scroll regression fixed (REG-001)',
      'AuthOutlet now has its own scroll container (overflow-y:auto, 100dvh height)',
      'Desktop Chrome scroll fix preserved (body overflow:hidden unchanged)',
    ],
    improvements: [
      'build-info.json now includes explicit version field read from package.json',
      'Version synchronization enforced across all deployment artifacts',
    ],
    breakingChanges: [],
  },
  {
    version: '0.9.11-beta',
    date: '2026-06-08',
    title: 'Knowledge Operating System',
    features: [
      'Knowledge OS: 6 new entity types (Context, Assets, Decisions, Prompts, Validations, Outcomes)',
      'Task Workspace: Knowledge tab added to task modal with sub-tabs for all entities',
      'Full CRUD API for all Knowledge OS entities under /api/v1/resident/task/{id}/knowledge',
      'Athena continuity model: zero chat-history dependency for AI task understanding',
    ],
    bugfixes: [],
    improvements: [
      'Database: 6 new tables (sys_decision_records, sys_prompt_records, sys_validation_records, sys_task_contexts, sys_knowledge_assets, sys_outcome_records)',
      'Eloquent models with soft deletes and task relationships',
    ],
    breakingChanges: [],
  },
  {
    version: '0.9.10-beta',
    date: '2026-06-08',
    title: 'Chrome Scroll Fix (Final)',
    features: [],
    bugfixes: [
      'Chrome desktop scroll permanently fixed: eliminated all document.body.style.overflow mutations',
      'Scroll now controlled entirely via CSS (body overflow-y: scroll) with .scroll-locked class for mobile only',
      'All Chakra Modals set to blockScrollOnMount=false to prevent scroll lock',
      'Safety CSS override: html body[data-scroll-locked] { overflow-y: scroll } prevents any residual Chakra lock',
      'Removed position:fixed body hack from survey state (was causing scroll position loss)',
    ],
    improvements: [
      'Scroll architecture simplified: no JS ever mutates body overflow on desktop',
      'Mobile sidebar/chat scroll lock uses classList toggle instead of inline styles',
    ],
    breakingChanges: [],
  },
  {
    version: '0.9.9-beta',
    date: '2026-06-08',
    title: 'Chrome Scroll Fix & Deal Room Preview',
    features: [
      'Deal Room file preview: images open in modal, text/md readable inline, PDF opens in browser',
      'AI workforce avatars now visible on all project cards',
    ],
    bugfixes: [
      'Chrome desktop scroll fully fixed: removed nested overflow-y containers, disabled Chakra blockScrollOnMount',
      'Oval avatar rendering fixed: aspect-ratio 1, flex-shrink 0, min-width/height enforced everywhere',
      'Athena/Atlas avatar cache invalidated with new hashes',
      'Admin ViewProjectPage overflow typo fixed (overflowYY -> overflowY)',
      'CustomersPage and ChatGPT widget overflow lock fixed',
    ],
    improvements: [
      'Budget calculation verified consistent across ProjectCard, SummaryPage, and AnalyticsPage',
      'All avatar classes use unified circular styling (border-radius 50%, aspect-ratio 1, flex-shrink 0)',
      'Removed !important from global overflow rules to prevent Chakra conflicts',
    ],
    breakingChanges: [],
  },
  {
    version: '0.9.8-beta',
    date: '2026-06-08',
    title: 'Validation Round 4 — UX Hardening',
    features: [
      'Total tracked time display in task Time Spent tab',
      'Rich time log details: duration, task name, entry ID',
      'Log API now returns type, data, and taskId fields',
    ],
    bugfixes: [
      'Chrome desktop scroll fixed (body overflow-y: auto)',
      'Deal Room 500 error fixed (missing if-guard in DealRoomService)',
      'Project card budget numeric value synced with progress bar',
      'Avatar hash updated for cache invalidation (Athena, Atlas)',
    ],
    improvements: [
      'Avatar aspect-ratio: 1 enforced across Summary, Analytics, and ProjectCard',
      'MainOutlet and ViewProjectPage use overflowY instead of overflow',
      'Time log templates include hours logged, task name, and entry ID',
    ],
    breakingChanges: [],
  },
  {
    version: '0.9.7-beta',
    date: '2026-06-08',
    title: 'Validation Round 3 — Avatar & Chart Fixes',
    features: [
      'AI Worker avatars updated to professional human-first style (Athena Morgan, Atlas Walker)',
    ],
    bugfixes: [
      'Donut chart total value now displayed below chart on mobile for readability',
      'Budget sync: Project cards and Summary page include AI cost in spent calculation',
    ],
    improvements: [
      'Avatar visual consistency across all AI team members',
    ],
    breakingChanges: [],
  },
  {
    version: '0.9.6-beta',
    date: '2026-06-08',
    title: 'UX Hardening & Files Fix',
    features: [
      'Deal Room: Documents now show title, type badge, and download button',
      'Deal Room: Folder counts exclude deleted documents',
      'Logs: File deletion now records file name and document ID',
      'Onboarding Wizard: Step indicators fit within mobile viewport',
      'Project Cards: Avatars enforced as perfect circles (aspect-ratio: 1)',
    ],
    bugfixes: [],
    improvements: [],
  },
  {
    version: '0.9.5-beta',
    date: '2026-06-08',
    title: 'Project Card Budget Sync + Donut Chart Readability',
    features: [],
    bugfixes: [
      'Project card budget bar now includes AI workforce cost (was showing $0.00)',
      'Budget percentage on project list reflects total spend (transactions + AI cost)',
    ],
    improvements: [
      'Donut chart center text improved: separate name/value labels with proper spacing',
      'Mobile donut chart uses smaller font sizes and reduced donut size for readability',
      'Data labels removed from donut slices to reduce visual clutter',
      'Legend item spacing improved for mobile readability',
    ],
  },
  {
    version: '0.9.4-beta',
    date: '2026-06-08',
    title: 'C3.1 Analytics Dashboard — Validation Fixes',
    features: [],
    bugfixes: [
      'Budget Spent now includes AI workforce cost from ProjectFinancialService',
      'Analytics page route registered in router (was missing after branch merge)',
      'Analytics menu item visible in exit_deal template navigation',
      'Dark theme styling applied — matches INFINITI brand palette',
      'Saved Budget badge shows positive percentage (was showing negative)',
      'Number formatting standardized with commas and 2 decimal places',
    ],
    improvements: [
      'Mobile responsive workforce table replaced with compact cards',
      'Chart tooltips and legends use dark theme colors',
      'Worker comparison table shows avatars and role badges',
    ],
  },
  {
    version: '0.9.3-beta',
    date: '2026-06-08',
    title: 'C3.1 AI Workforce Financial Dashboard',
    features: [
      'AI Workforce Analytics page with financial dashboard',
      'Project Budget metrics: Total Budget, Spent, Remaining with progress bar',
      'AI Cost Efficiency metrics: AI Cost, Human Equivalent, Saved Budget, Total Hours',
      'Hours by AI Worker bar chart (ApexCharts)',
      'Cost Distribution donut chart with worker breakdown',
      'Workforce Comparison table with per-worker savings',
    ],
    bugfixes: [
      'ProjectFinancialService HH:MM time parsing fixed (was truncating minutes)',
    ],
    improvements: [
      'Backup script updated with local retention and integrity verification',
    ],
  },
  {
    version: '0.9.2-beta',
    date: '2026-06-08',
    title: 'AI Workforce, Analytics Architecture & Loading Experience',
    features: [
      'AI Workforce team (13 talents) added to Talent Directory',
      'INFINITI Console Evolution project (Project 45) with 48 tasks across 4 phases',
      'Analytics Module MVP architecture designed (7 dashboard sections)',
      'LoadingShimmer component — contextual skeleton loading states',
      'Verification Timeout Policy for automated validation workflows',
    ],
    bugfixes: [
      'File preview/download fixed for Client Documents page (ISSUE-022)',
      'File download URLs now use full API path with Bearer auth token',
    ],
    improvements: [
      'Loading experience upgraded from spinners to shimmer skeletons',
      'Infrastructure documentation updated for new server migration',
      'Deployment audit documentation expanded with release notes workflow',
    ],
  },
  {
    version: '0.9.0-beta',
    date: '2026-06-07',
    title: 'Validation Sprint & Platform Stability',
    features: [
      'Deal Room upload workflow with category assignment',
      'Files → Deal Room category linking for documents',
      'Onboarding autosave for step progress',
      'Build info tracking (build-info.json) for deployments',
      'Automated deployment pipeline (deploy-frontend.sh)',
      'Navigation hints on horizontal overflow areas',
    ],
    bugfixes: [
      'Founder Exit Deal sidebar navigation fixed',
      'Document deletion no longer navigates to 404',
      'Deployment stale bundle caching issue resolved',
    ],
    improvements: [
      'Mobile UX improvements for scrollable tables',
      'Client Dashboard responsive layout enhanced',
      'Project Files page with pagination and search',
    ],
  },
  {
    version: '0.0.40-alpha.40vy',
    date: '2026-05-20',
    title: 'Client Projects & UI Polish',
    features: [
      'Projects module added for Client/Founder users',
    ],
    bugfixes: [],
    improvements: [
      'All padding values standardized across the platform',
      'Invoice Add Payment reminder auto-fills input value',
      'Client Business Plan migrated to WebSocket updates',
      'Accounting Payer dropdown filtered by selected company',
    ],
  },
  {
    version: '0.0.39-alpha.39js',
    date: '2026-05-10',
    title: 'Client Projects Launch',
    features: [
      'Client-side project management added',
    ],
    bugfixes: [],
    improvements: [],
  },
]
