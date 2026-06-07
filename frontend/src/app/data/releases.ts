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
