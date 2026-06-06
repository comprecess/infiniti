import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { ProjectViewPageContext } from '../../../../../app/constants/constants'
import { useCustomToast } from '../../../../../shared/ui/CustomToast/CustomToast'
import {
  getProjectMetadataGroup,
  saveProjectMetadata,
} from '../../../../../shared/utils/api/Admin/Projects/project-metadata'
import { CustomInput } from '../../../../../shared/ui/CustomInput/CustomInput'
import { CustomSelect } from '../../../../../shared/ui/CustomSelect/CustomSelect'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import styles from './OnboardingPage.module.scss'

/**
 * Onboarding Wizard — Universal multi-step form for project metadata.
 *
 * Designed to work with any template type (Exit Deal, Fundraising, Venture Building, etc.)
 * All data is stored via clx_shared_preferences with dot-notation keys.
 *
 * Steps are defined per template. For Exit Deal:
 * 1. Company Info (onboarding.*)
 * 2. Financials (financials.*)
 * 3. Product Metrics (product_metrics.*)
 * 4. Team (team.*)
 * 5. Exit Preferences (exit.*)
 */

interface WizardStep {
  id: string
  title: string
  group: string
  fields: WizardField[]
}

interface WizardField {
  key: string
  label: string
  type: 'text' | 'number' | 'select' | 'textarea'
  placeholder?: string
  options?: { id: number; name: string }[]
  required?: boolean
}

// Exit Deal wizard steps configuration
// This can be loaded from API in the future for full template-driven configurability
const EXIT_DEAL_STEPS: WizardStep[] = [
  {
    id: 'company',
    title: 'Company Information',
    group: 'onboarding',
    fields: [
      { key: 'company_name', label: 'Company Name', type: 'text', required: true },
      { key: 'industry', label: 'Industry', type: 'text', required: true },
      { key: 'country', label: 'Country', type: 'text' },
      { key: 'founded_year', label: 'Year Founded', type: 'number' },
      { key: 'website', label: 'Website', type: 'text' },
      { key: 'description', label: 'Business Description', type: 'textarea' },
    ],
  },
  {
    id: 'financials',
    title: 'Financial Overview',
    group: 'financials',
    fields: [
      { key: 'mrr', label: 'Monthly Recurring Revenue (MRR)', type: 'number', required: true },
      { key: 'arr', label: 'Annual Recurring Revenue (ARR)', type: 'number' },
      { key: 'ebitda', label: 'EBITDA', type: 'number' },
      { key: 'revenue_annual', label: 'Annual Revenue', type: 'number', required: true },
      { key: 'gross_margin', label: 'Gross Margin (%)', type: 'number' },
      { key: 'net_margin', label: 'Net Margin (%)', type: 'number' },
      { key: 'burn_rate', label: 'Monthly Burn Rate', type: 'number' },
      { key: 'runway_months', label: 'Runway (months)', type: 'number' },
    ],
  },
  {
    id: 'product',
    title: 'Product Metrics',
    group: 'product_metrics',
    fields: [
      { key: 'mau', label: 'Monthly Active Users (MAU)', type: 'number' },
      { key: 'dau', label: 'Daily Active Users (DAU)', type: 'number' },
      { key: 'churn_rate', label: 'Monthly Churn Rate (%)', type: 'number' },
      { key: 'ltv', label: 'Customer Lifetime Value (LTV)', type: 'number' },
      { key: 'cac', label: 'Customer Acquisition Cost (CAC)', type: 'number' },
      { key: 'nps', label: 'Net Promoter Score (NPS)', type: 'number' },
    ],
  },
  {
    id: 'team',
    title: 'Team & Operations',
    group: 'team',
    fields: [
      { key: 'team_size', label: 'Total Team Size', type: 'number', required: true },
      { key: 'tech_team_size', label: 'Engineering Team Size', type: 'number' },
      { key: 'founder_dependency', label: 'Founder Dependency (1-10)', type: 'number' },
      { key: 'key_person_risk', label: 'Key Person Risk (1-10)', type: 'number' },
      { key: 'documented_processes', label: 'Documented Processes (1-10)', type: 'number' },
    ],
  },
  {
    id: 'exit',
    title: 'Exit Preferences',
    group: 'exit',
    fields: [
      { key: 'target_price', label: 'Target Exit Price ($)', type: 'number', required: true },
      { key: 'minimum_price', label: 'Minimum Acceptable Price ($)', type: 'number' },
      { key: 'timeline_months', label: 'Desired Timeline (months)', type: 'number', required: true },
      {
        key: 'preferred_buyer_type',
        label: 'Preferred Buyer Type',
        type: 'select',
        options: [
          { id: 1, name: 'Strategic Buyer' },
          { id: 2, name: 'Financial Buyer (PE)' },
          { id: 3, name: 'Individual Buyer' },
          { id: 4, name: 'Any' },
        ],
      },
      { key: 'reason_for_exit', label: 'Reason for Exit', type: 'textarea' },
      { key: 'deal_breakers', label: 'Deal Breakers', type: 'textarea' },
    ],
  },
]

export const AdminProjectsOnboardingPage = () => {
  const context = useOutletContext<ProjectViewPageContext>()
  const navigate = useNavigate()
  const showToast = useCustomToast()

  const [currentStep, setCurrentStep] = useState<number>(0)
  const [formData, setFormData] = useState<Record<string, Record<string, string>>>({})
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  const steps = EXIT_DEAL_STEPS

  // Load all metadata on mount
  const loadMetadata = useCallback(async () => {
    if (!context.idProject) return
    setLoading(true)

    const loaded: Record<string, Record<string, string>> = {}
    const completed = new Set<number>()

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i]
      const response = await getProjectMetadataGroup(context.idProject, step.group)
      if (response.status && response.data) {
        const groupData = response.data as unknown as Record<string, string>
        loaded[step.group] = groupData
        // Mark step as completed if at least one required field is filled
        const hasRequiredFilled = step.fields
          .filter(f => f.required)
          .some(f => groupData[f.key] && groupData[f.key].trim() !== '')
        if (hasRequiredFilled) {
          completed.add(i)
        }
      }
    }

    setFormData(loaded)
    setCompletedSteps(completed)
    setLoading(false)
  }, [context.idProject])

  useEffect(() => {
    loadMetadata()
  }, [loadMetadata])

  useEffect(() => {
    document.title = 'infiniti | Onboarding'
  }, [])

  const handleInputChange = (group: string, key: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [group]: {
        ...(prev[group] || {}),
        [key]: String(value),
      },
    }))
  }

  const handleSaveStep = async () => {
    if (!context.idProject) return
    const step = steps[currentStep]
    const stepData = formData[step.group] || {}

    setSaving(true)
    const response = await saveProjectMetadata(context.idProject, step.group, stepData)
    setSaving(false)

    if (response.status) {
      showToast({
        title: 'Saved',
        description: `${step.title} saved successfully`,
        status: 'success',
      })
      setCompletedSteps(prev => new Set([...prev, currentStep]))
    } else {
      showToast({
        title: 'Error',
        description: response.message || 'Failed to save',
        status: 'error',
      })
    }
  }


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

  const handleNext = async () => {
    await handleSaveStep()
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepClick = (index: number) => {
    setCurrentStep(index)
  }

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <LoadingSpinner size='xl' />
      </div>
    )
  }

  const step = steps[currentStep]
  const stepData = formData[step.group] || {}
  const progress = Math.round((completedSteps.size / steps.length) * 100)

  return (
    <div className={styles.wrapper}>
      {/* Progress Header */}
      <div className={styles.header}>
        <h3 className={styles.title}>Onboarding Wizard</h3>
        <div className={styles.progressInfo}>
          <span className={styles.progressText}>{progress}% Complete</span>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Step Navigation */}
      <div className={styles.stepNav}>
        {steps.map((s, index) => (
          <div
            key={s.id}
            className={`${styles.stepItem} ${index === currentStep ? styles.stepActive : ''} ${completedSteps.has(index) ? styles.stepCompleted : ''}`}
            onClick={() => handleStepClick(index)}
          >
            <div className={styles.stepNumber}>
              {completedSteps.has(index) ? '✓' : index + 1}
            </div>
            <span className={styles.stepTitle}>{s.title}</span>
          </div>
        ))}
      </div>

      {/* Form Fields */}
      <div className={styles.formSection}>
        <h4 className={styles.sectionTitle}>{step.title}</h4>
        <div className={styles.fieldsGrid}>
          {step.fields.map(field => (
            <div key={field.key} className={styles.fieldWrapper}>
              {field.type === 'select' && field.options ? (
                <CustomSelect
                  title={field.label}
                  idList={field.options.map(o => o.id)}
                  nameList={field.options.map(o => o.name)}
                  value={Number(stepData[field.key]) || undefined}
                  onChange={(_name, value) => handleInputChange(step.group, field.key, value)}
                />
              ) : field.type === 'textarea' ? (
                <div className={styles.textareaWrapper}>
                  <label className={styles.textareaLabel}>
                    {field.label}
                    {field.required && <span className={styles.required}>*</span>}
                  </label>
                  <textarea
                    className={styles.textarea}
                    placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                    value={stepData[field.key] || ''}
                    onChange={e => handleInputChange(step.group, field.key, e.target.value)}
                    rows={3}
                  />
                </div>
              ) : (
                <CustomInput
                  title={`${field.label}${field.required ? ' *' : ''}`}
                  type={field.type === 'number' ? 'number' : 'text'}
                  id={field.key}
                  name={field.key}
                  placeHolder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                  value={stepData[field.key] || ''}
                  onChange={(_name, value) => handleInputChange(step.group, field.key, value)}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className={styles.navigation}>
        <div className={styles.navLeft}>
          {currentStep > 0 && (
            <button className={styles.btnPrev} onClick={handlePrev}>
              ← Previous
            </button>
          )}
        </div>
        <div className={styles.navRight}>
          <button className={styles.btnSave} onClick={handleSaveStep} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
          {currentStep < steps.length - 1 ? (
            <ButtonBlue
              title='Next →'
              onClick={handleNext}
            />
          ) : (
            <ButtonBlue
              title={saving ? 'Completing...' : 'Complete Onboarding'}
              onClick={handleCompleteOnboarding}
            />
          )}
        </div>
      </div>
    </div>
  )
}
