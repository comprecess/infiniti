const fs = require('fs');
const filePath = '/var/www/Infiniti/frontend/src/pages/Admin/ProjectsPage/ViewProjectPage/SummaryPage/SummaryPage.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add useState and useCallback imports
content = content.replace(
  "import { useEffect } from 'react'",
  "import { useCallback, useEffect, useState } from 'react'"
);

// 2. Add useNavigate import
content = content.replace(
  "import { useOutletContext } from 'react-router-dom'",
  "import { useNavigate, useOutletContext } from 'react-router-dom'"
);

// 3. Add getProjectMetadataGroup import
content = content.replace(
  "import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'",
  "import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'\nimport { getProjectMetadataGroup } from '../../../../../shared/utils/api/Admin/Projects/project-metadata'"
);

// 4. Add onboarding progress state and logic after context declarations
const onboardingLogic = `
  const navigate = useNavigate()
  const templateCode = (context as any)?.templateCode
  const [onboardingProgress, setOnboardingProgress] = useState<number | null>(null)
  const [onboardingStatus, setOnboardingStatus] = useState<string>('')

  const checkOnboardingProgress = useCallback(async () => {
    if (!context?.idProject || templateCode !== 'exit_deal') return
    const response = await getProjectMetadataGroup(context.idProject, 'onboarding')
    if (response.status && response.data) {
      const data = response.data as Record<string, string>
      if (data.status === 'completed') {
        setOnboardingProgress(100)
        setOnboardingStatus('completed')
      } else {
        // Count filled fields across all onboarding groups
        const totalSteps = 5
        const filledKeys = Object.keys(data).filter(k => k !== 'status' && k !== 'completed_at' && data[k])
        const progress = Math.round((filledKeys.length / (totalSteps * 3)) * 100)
        setOnboardingProgress(Math.min(progress, 95))
        setOnboardingStatus('in_progress')
      }
    } else {
      setOnboardingProgress(0)
      setOnboardingStatus('not_started')
    }
  }, [context?.idProject, templateCode])

  useEffect(() => {
    checkOnboardingProgress()
  }, [checkOnboardingProgress])
`;

content = content.replace(
  "  const safeDetails = projectInfo.details ? sanitizeMessage(projectInfo.details) : null",
  "  const safeDetails = projectInfo.details ? sanitizeMessage(projectInfo.details) : null\n" + onboardingLogic
);

// 5. Add onboarding progress card after the title in the return JSX
const onboardingCard = `
          {/* Onboarding Progress (Exit Deal only) */}
          {templateCode === 'exit_deal' && onboardingProgress !== null && (
            <div className={styles.tasks} style={{ marginTop: '16px' }}>
              <div className={styles.chart}>
                <div className={styles.chartTexts}>
                  <span className={styles.amount}>
                    {onboardingStatus === 'completed'
                      ? 'Onboarding Complete'
                      : onboardingStatus === 'not_started'
                        ? 'Onboarding Not Started'
                        : \`Onboarding \${onboardingProgress}% Complete\`}
                  </span>
                  {onboardingStatus !== 'completed' && (
                    <span
                      className={styles.amount}
                      style={{ cursor: 'pointer', textDecoration: 'underline' }}
                      onClick={() => navigate('../onboarding')}
                    >
                      Continue Setup
                    </span>
                  )}
                </div>
                <div className={styles.tasksCompleted}>
                  <div
                    className={styles.segment}
                    style={{
                      width: \`\${onboardingProgress}%\`,
                      backgroundColor: onboardingProgress === 100 ? '#4caf50' : '#ff9800',
                    }}
                  />
                </div>
              </div>
            </div>
          )}`;

// Insert after the title span
content = content.replace(
  "          <span className={styles.title}>{projectInfo.name || 'No project name'}</span>",
  "          <span className={styles.title}>{projectInfo.name || 'No project name'}</span>" + onboardingCard
);

fs.writeFileSync(filePath, content);
console.log('Summary onboarding progress patch applied');
