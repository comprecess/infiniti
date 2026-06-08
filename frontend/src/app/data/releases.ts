/* eslint-disable max-len */
export interface ReleaseInfo {
  version: string
  date: string
  title: string
  features: string[]
  bugfixes: string[]
  improvements: string[]
}
export const releases: ReleaseInfo[] = [
  {
    version: '0.9.6-beta',
    date: '2026-06-08',
    title: 'UX Hardening & Files Fix',
    description: 'Deal Room file rendering, audit logs, onboarding mobile, circular avatars.',
    features: [
      'Deal Room: Documents now show title, type badge, and download button',
      'Deal Room: Folder counts exclude deleted documents',
      'Logs: File deletion now records file name and document ID',
      'Onboarding Wizard: Step indicators fit within mobile viewport',
      'Project Cards: Avatars enforced as perfect circles (aspect-ratio: 1)',
    ],
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
