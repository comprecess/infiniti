import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ProjectsData } from '../../app/constants/constants'
import { Routes } from '../../app/router/routes'
import { ConfirmationModal } from '../../shared/ui/ConfirmationModal/ConfirmationModal'
import { CustomMiniButton } from '../../shared/ui/CustomMiniButton/CustomMiniButton'
import { Status } from '../../shared/ui/Status/Status'
import styles from './ProjectCard.module.scss'

interface ProjectCardProps {
  project: ProjectsData
  deleteProject: (id: number) => void
}

export const ProjectCard = ({
  project,
  deleteProject,
}: ProjectCardProps) => {
  const [modalDelete, setModalDelete] = useState<boolean>(false)

  const navigate = useNavigate()

  const handleOpenConfirmationModal = () => {
    setModalDelete(state => !state)
  }

  const handleNavigateToEditProject = () => {
    navigate(
      `/${Routes.adminPages}/${Routes.projects}/${Routes.edit}/${Routes.project}/${project.id}`,
    )
  }

  const handleNavigateToViewProject = () => {
    navigate(
      `/${Routes.adminPages}/${Routes.projects}/${Routes.view}/${Routes.project}/${project.id}/summary`,
    )
  }

  return (
    <>
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
                project.admin.img !== ''
                  ? `${project.admin.img}?width=176&height=176`
                  : '/profileWithoutAvatar.svg'
              }
            />
            <span className={styles.name}>{project.admin.account}</span>
          </div>
          <div className={styles.container}>
            <div className={styles.budget}>
              {`Budget: ${project.budgetCurrency}`}
            </div>
            {project.summary && (
              <div className={styles.description}>{project.summary}</div>
            )}
          </div>
          <div className={styles.dateList}>
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
                  <img
                    src='/icons/calendar.svg'
                    alt='calendar'
                    className={styles.dateImgStart}
                  />
                  <span className={styles.dateText}>Start Date</span>
                </div>
                <div>
                  <span className={styles.startDate}>
                    {project.startDate}
                  </span>
                </div>
              </div>
            </div>
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
                  <img
                    src='/icons/calendar.svg'
                    alt='calendar'
                    className={styles.dateImgDue}
                  />
                  <span className={styles.dateText}>Due Date</span>
                </div>
                <span className={styles.startDate}>{project.dueDate}</span>
              </div>
            </div>
          </div>
          {project.members && project.members.length > 0 && (
            <div className={styles.profiles}>
              {project.members.map(member => (
                <img
                  key={member.id}
                  alt='Avatar'
                  className={styles.member}
                  src={
                    member.img !== ''
                      ? `${member.img}?width=176&height=176`
                      : '/profileWithoutAvatar.svg'
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
                  {`${project.completed.completed}/${project.completed.total}`}
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
        </div>
        <div className={styles.buttons}>
          <CustomMiniButton
            style='mint'
            icon='/icons/view.svg'
            alt='View'
            tooltipTitle='View'
            onClick={handleNavigateToViewProject}
          />
          <CustomMiniButton
            style='amber'
            icon='/icons/edit.svg'
            alt='Edit'
            tooltipTitle='Edit'
            onClick={handleNavigateToEditProject}
          />
          <CustomMiniButton
            style='cherry'
            icon='/icons/trash.svg'
            alt='Delete'
            tooltipTitle='Delete'
            onClick={handleOpenConfirmationModal}
          />
        </div>
      </div>
      {modalDelete && (
        <ConfirmationModal
          isOpened={modalDelete}
          handleOpenCloseModal={handleOpenConfirmationModal}
          agree={() => deleteProject(project.id)}
        />
      )}
    </>
  )
}
