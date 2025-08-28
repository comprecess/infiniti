import { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'

import { ProjectViewPageContext } from '../../../../../app/constants/constants'
import { sanitizeMessage } from '../../../../../shared/utils/TextEditor/sanitizeMessage'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'
import styles from './SummaryPage.module.scss'

export const AdminProjectsSummaryPage = () => {
  const context = useOutletContext<ProjectViewPageContext>()

  const projectInfo = context?.projectInfo || {}
  const members = projectInfo.members || []
  const completed = projectInfo.completed || {
    percent: 0,
    completed: 0,
    total: 0,
  }

  const isMembers = members.length > 0
  const isTasks = completed.total > 0

  const safeDetails = projectInfo.details
    ? sanitizeMessage(projectInfo.details)
    : null

  useEffect(() => {
    document.title = 'infiniti | Project Summary'
  }, [])

  return (
    <div className={styles.wrapper}>
      <RecentCard>
        <div className={styles.container}>
          <span className={styles.title}>
            {projectInfo.name || 'No project name'}
          </span>
          {(projectInfo.budget || projectInfo.expense) && (
            <div className={styles.budgetExpense}>
              {projectInfo.budget && (
                <div className={styles.budget}>
                  <span className={styles.budgetTitle}>Budget:</span>
                  <span className={styles.budgetAmount}>
                    {projectInfo.budget.format}
                  </span>
                </div>
              )}
              {projectInfo.expense && (
                <div className={styles.budget}>
                  <span className={styles.budgetTitle}>Expense:</span>
                  <span className={styles.budgetAmount}>
                    {projectInfo.expense.format}
                  </span>
                </div>
              )}
            </div>
          )}
          {safeDetails && (
            <div className={styles.details}>
              <span className={styles.budgetTitle}>Details:</span>
              <span
                dangerouslySetInnerHTML={{ __html: safeDetails }}
                className={styles.details}
              />
            </div>
          )}
          <div className={styles.dateList}>
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
                <span className={styles.startDate}>
                  {projectInfo.startDate || 'Not set'}
                </span>
              </div>
            </div>
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
                <span className={styles.startDate}>
                  {projectInfo.dueDate || 'Not set'}
                </span>
              </div>
            </div>
          </div>
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
          {isTasks && (
            <div className={styles.tasks}>
              <div className={styles.chart}>
                <div className={styles.chartTexts}>
                  <span className={styles.amount}>
                    {`${completed.percent}% tasks completed`}
                  </span>
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
          {projectInfo.budget && projectInfo.expense && (
            <div className={styles.tasks}>
              <div className={styles.chart}>
                <div className={styles.chartTexts}>
                  {(() => {
                    const percentSpent = Math.round(
                      (projectInfo.expense.value /
                        projectInfo.budget.value) *
                        100,
                    )

                    return (
                      <>
                        <span className={styles.amount}>
                          {`${percentSpent}% budget spent`}
                        </span>
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
                        (projectInfo.expense.value /
                          projectInfo.budget.value) *
                          100,
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
