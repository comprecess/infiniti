import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'

import styles from './SummaryPage.module.scss'
import { ProjectViewPageContext } from '../../../../../app/constants/constants'
import { sanitizeMessage } from '../../../../../shared/utils/TextEditor/sanitizeMessage'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'
import { getProjectMetadataGroup } from '../../../../../shared/utils/api/Admin/Projects/project-metadata'

export const AdminProjectsSummaryPage = () => {
  const context = useOutletContext<ProjectViewPageContext>()

  const projectInfo = context?.projectInfo || {}
  const members = projectInfo.users.staff || []
  const aiTeam = projectInfo.users.aiTeam || []
  const aiFinancials = projectInfo.aiFinancials || null
  const completed = projectInfo.completed || {
    percent: 0,
    completed: 0,
    total: 0,
  }

  const isMembers = members.length > 0
  const isTasks = completed.total > 0

  const safeDetails = projectInfo.details ? sanitizeMessage(projectInfo.details) : null

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


  useEffect(() => {
    document.title = 'infiniti | Project Summary'
  }, [])

  return (
    <div className={styles.wrapper}>
      <RecentCard>
        <div className={styles.container}>
          <span className={styles.title}>{projectInfo.name || 'No project name'}</span>
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
                        : `Onboarding ${onboardingProgress}% Complete`}
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
                      width: `${onboardingProgress}%`,
                      backgroundColor: onboardingProgress === 100 ? '#4caf50' : '#ff9800',
                    }}
                  />
                </div>
              </div>
            </div>
          )}
          {(projectInfo.budget || projectInfo.expense) && (
            <div className={styles.budgetExpense}>
              {projectInfo.budget && (
                <div className={styles.budget}>
                  <span className={styles.budgetTitle}>Budget:</span>
                  <span className={styles.budgetAmount}>{projectInfo.budget.format}</span>
                </div>
              )}
              {projectInfo.expense && (
                <div className={styles.budget}>
                  <span className={styles.budgetTitle}>Expense:</span>
                  <span className={styles.budgetAmount}>{projectInfo.expense.format}</span>
                </div>
              )}
            </div>
          )}
          {safeDetails && (
            <div className={styles.details}>
              <span className={styles.budgetTitle}>Details:</span>
              <span
                dangerouslySetInnerHTML={{ __html: safeDetails }}
                className='dangerouslySetInnerHTML'
              />
            </div>
          )}
          {(projectInfo.startDate || projectInfo.dueDate) && (
            <div className={styles.dateList}>
              {projectInfo.startDate && (
                <div className={styles.date}>
                  <div className={styles.dateContainerFirst}>
                    <div className={styles.dateHeader}>
                      <img
                        src='/icons/clockWithArrow.svg'
                        alt='calendar'
                        className={styles.dateImgStart}
                      />
                      <span className={styles.dateText}>Start Date</span>
                    </div>
                    <span className={styles.startDate}>{projectInfo.startDate || 'Not set'}</span>
                  </div>
                </div>
              )}
              {projectInfo.dueDate && (
                <div className={styles.date}>
                  <div className={styles.dateContainerSecond}>
                    <div className={styles.dateHeader}>
                      <img
                        src='/icons/clockWithArrow.svg'
                        alt='calendar'
                        className={styles.dateImgDue}
                      />
                      <span className={styles.dateText}>Due Date</span>
                    </div>
                    <span className={styles.startDate}>{projectInfo.dueDate || 'Not set'}</span>
                  </div>
                </div>
              )}
            </div>
          )}
          {isMembers && (
            <div className={styles.members}>
              <span className={styles.teamMembersText}>Team Members</span>
              <div className={styles.profiles}>
                {members.map(member => (
                  <img
                    key={member.id}
                    alt='Avatar'
                    className={styles.member}
                    src={
                      member.img
                        ? `${member.img}?width=176&height=176`
                        : '/profileWithoutAvatar.svg'
                    }
                  />
                ))}
              </div>
            </div>
          )}
          {aiTeam.length > 0 && (
            <div className={styles.members}>
              <span className={styles.teamMembersText}>AI Workforce</span>
              <div className={styles.profiles}>
                {aiTeam.map((worker: any) => (
                  <div key={worker.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <img
                      alt={worker.account}
                      className={styles.member}
                      src={
                        worker.img
                          ? `${worker.img}?width=176&height=176`
                          : '/profileWithoutAvatar.svg'
                      }
                    />
                    <span style={{ fontSize: '10px', color: '#666', textAlign: 'center', maxWidth: '60px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{worker.account?.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {aiFinancials && (
            <div className={styles.tasks} style={{ marginTop: '8px' }}>
              <div className={styles.chart}>
                <div className={styles.chartTexts}>
                  <span className={styles.amount}>AI Workforce: {aiTeam.length} workers assigned</span>
                  <span className={styles.amount}>
                    {`$${aiFinancials.actual_ai_cost} / $${aiFinancials.equivalent_human_cost} equivalent`}
                  </span>
                </div>
                {aiFinancials.equivalent_human_cost > 0 && (
                  <div className={styles.tasksCompleted}>
                    <div
                      className={styles.segment}
                      style={{
                        width: `${Math.round((aiFinancials.actual_ai_cost / aiFinancials.equivalent_human_cost) * 100)}%`,
                        backgroundColor: '#10b981',
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          {isTasks && (
            <div className={styles.tasks}>
              <div className={styles.chart}>
                <div className={styles.chartTexts}>
                  <span className={styles.amount}>{`${completed.percent}% tasks completed`}</span>
                  <span className={styles.amount}>
                    {`${completed.completed} / ${completed.total}`}
                  </span>
                </div>
                <div className={styles.tasksCompleted}>
                  <div
                    className={styles.segment}
                    style={{
                      width: `${completed.percent}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}
          {projectInfo.budget.value > 0 && (
            <div className={styles.tasks}>
              <div className={styles.chart}>
                <div className={styles.chartTexts}>
                  {(() => {
                    const percentSpent = Math.round(
                      (projectInfo.expense.value / projectInfo.budget.value) * 100,
                    )

                    return (
                      <>
                        <span className={styles.amount}>{`${percentSpent}% budget spent`}</span>
                        <span className={styles.amount}>
                          {`${projectInfo.expense.format} / ${projectInfo.budget.format}`}
                        </span>
                      </>
                    )
                  })()}
                </div>
                <div className={styles.tasksCompleted}>
                  <div
                    className={styles.segmentBudget}
                    style={{
                      width: `${Math.min(
                        (projectInfo.expense.value / projectInfo.budget.value) * 100,
                        100,
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </RecentCard>
    </div>
  )
}
