const fs = require('fs');
const filePath = '/var/www/Infiniti/frontend/src/pages/Admin/ProjectsPage/ViewProjectPage/OnboardingPage/OnboardingPage.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add useNavigate import
content = content.replace(
  "import { useOutletContext } from 'react-router-dom'",
  "import { useNavigate, useOutletContext } from 'react-router-dom'"
);

// 2. Add navigate declaration after context
content = content.replace(
  'const context = useOutletContext<ProjectViewPageContext>()',
  'const context = useOutletContext<ProjectViewPageContext>()\n  const navigate = useNavigate()'
);

// 3. Add handleCompleteOnboarding before handleNext
const completeHandler = `
  const handleCompleteOnboarding = async () => {
    if (!context.idProject) return
    const step = steps[currentStep]
    const stepData = formData[step.group] || {}
    setSaving(true)
    const response = await saveProjectMetadata(context.idProject, step.group, stepData)
    if (response.status) {
      await saveProjectMetadata(context.idProject, 'onboarding', {
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      setCompletedSteps(prev => new Set([...prev, currentStep]))
      showToast({
        title: 'Onboarding Complete',
        description: 'Your project setup is complete. Redirecting to dashboard...',
        status: 'success',
      })
      setTimeout(() => navigate('../summary', { replace: true }), 1500)
    } else {
      showToast({
        title: 'Error',
        description: response.message || 'Failed to save',
        status: 'error',
      })
    }
    setSaving(false)
  }
`;

content = content.replace(
  '  const handleNext = async () => {',
  completeHandler + '\n  const handleNext = async () => {'
);

// 4. Replace the Complete Onboarding button to use handleCompleteOnboarding
content = content.replace(
  "title={saving ? 'Completing...' : 'Complete Onboarding'}\n              onClick={handleSaveStep}",
  "title={saving ? 'Completing...' : 'Complete Onboarding'}\n              onClick={handleCompleteOnboarding}"
);

fs.writeFileSync(filePath, content);
console.log('OnboardingPage completion patch applied');
