import { useNavigate } from 'react-router-dom'

import styles from './ProjectCard.module.scss'
import { ProjectsData, UserInfo } from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { Status } from '../../../../shared/ui/Status/Status'

interface ProjectCardProps {
  project: ProjectsData
  user: UserInfo
}

export const ProjectCard = ({ project, user }: ProjectCardProps) => {
  const navigate = useNavigate()

  const handleNavigateToViewProject = () => {
    navigate(
      `/${Routes.clientPages}/${Routes.projects}/${Routes.view}/${Routes.project}/${project.id}/summary`,
    )
  }

  const handleNavigateToEditProject = () => {
    navigate(
      `/${Routes.clientPages}/${Routes.projects}/${Routes.edit}/${Routes.project}/${project.id}`,
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapperContainer}>
        <div className={styles.header}>
          <span className={styles.title}>{project.name}</span>
          <Status title={project.status} status={project.status} />
        </div>
        <div className={styles.profile}>
          <img
            alt='Avatar'
            className={styles.avatar}
            src={
              project.users?.admin?.img
                ? `${project.users.admin.img}?width=176&height=176`
                : '/profileWithoutAvatar.svg'
            }
          />
          <span className={styles.name}>{project.users?.admin?.account ?? '-'}</span>
        </div>
        <div className={styles.container}>
          <div>
            {project.budget && (
              <div className={styles.budget}>{`Budget: ${project.budget.format}`}</div>
            )}
            {project.expense && (
              <div className={styles.budget}>{`Expense: ${project.expense.format}`}</div>
            )}
          </div>
          {project.summary && <div className={styles.description}>{project.summary}</div>}
        </div>
        {(project.startDate || project.dueDate) && (
          <div className={styles.dateList}>
            {project.startDate && (
              <div className={styles.date}>
                <div className={styles.dateContainerFirst}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: '4px',
                      width: 'fit-content',
                    }}
                  >
                    <img src='/icons/calendar.svg' alt='calendar' className={styles.dateImgStart} />
                    <span className={styles.dateText}>Start Date</span>
                  </div>
                  <div>
                    <span className={styles.startDate}>{project.startDate}</span>
                  </div>
                </div>
              </div>
            )}
            {project.dueDate && (
              <div className={styles.date}>
                <div className={styles.dateContainerSecond}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <img src='/icons/calendar.svg' alt='calendar' className={styles.dateImgDue} />
                    <span className={styles.dateText}>Due Date</span>
                  </div>
                  <span className={styles.startDate}>{project.dueDate}</span>
                </div>
              </div>
            )}
          </div>
        )}
        {project.users.staff.length > 0 && (
          <div className={styles.profiles}>
            {project.users.staff.map(member => (
              <img
                key={member.id}
                alt='Avatar'
                className={styles.member}
                src={
                  member?.img ? `${member.img}?width=176&height=176` : '/profileWithoutAvatar.svg'
                }
              />
            ))}
          </div>
        )}
        {project.completed && project.completed.total > 0 && (
          <div className={styles.chart}>
            <div className={styles.chartTexts}>
              <span className={styles.amount}>
                {`${project.completed.percent}% tasks completed`}
              </span>
              <span className={styles.amount}>
                {`${project.completed.completed} / ${project.completed.total}`}
              </span>
            </div>
            <div className={styles.tasksCompleted}>
              <div
                className={styles.segment}
                style={{
                  width: `${project.completed.percent}%`,
                }}
              />
            </div>
          </div>
        )}
        {project.budget && project.budget.value > 0 && (
          <div className={styles.chart}>
            <div className={styles.chartTexts}>
              {(() => {
                const percentSpent = Math.round(
                  (project.expense.value / project.budget.value) * 100,
                )

                return (
                  <>
                    <span className={styles.amount}>{`${percentSpent}% budget spent`}</span>
                    <span className={styles.amount}>
                      {`${project.expense.format} / ${project.budget.format}`}
                    </span>
                  </>
                )
              })()}
            </div>
            <div className={styles.tasksCompleted}>
              <div
                className={styles.segmentBudget}
                style={{
                  width: `${Math.min((project.expense.value / project.budget.value) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        )}
        <div className={styles.buttons}>
          <ButtonBlue
            title='View Details'
            style={styles.button}
            onClick={handleNavigateToViewProject}
          />
          {!user.status.isSupplier && (
            <ButtonBlue
              title='Edit Project'
              style={styles.button}
              onClick={handleNavigateToEditProject}
            />
          )}
        </div>
      </div>
    </div>
  )
}
