import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import {
  ProjectsColumnData,
  ProjectsTasksInputData,
  ProjectViewPageContext,
} from '../../../../../app/constants/constants'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getProjectsTasks } from '../../../../../shared/utils/api/Admin/Projects/get-projects-tasks'
import { getProjectsTasksInputData } from '../../../../../shared/utils/api/Admin/Projects/get-projects-tasks-input-data'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'
import { TasksCard } from '../../../../../widgets/TasksCard/TasksCard'
import styles from './TasksPage.module.scss'

export const AdminProjectsTasksPage = () => {
  const [tasksList, setTasksList] = useState<ProjectsColumnData | null>(
    null,
  )
  const [inputData, setInputData] =
    useState<ProjectsTasksInputData | null>(null)

  const context = useOutletContext<ProjectViewPageContext>()

  const getTasks = async () => {
    if (!context.idProject) return

    const response = await getProjectsTasks(context.idProject)

    if (!response.status) return

    setTasksList(response.data.data)
  }

  const getTasksInputData = async () => {
    if (!context.idProject) return

    const response = await getProjectsTasksInputData(context.idProject)

    if (!response.status) return

    setInputData(response.data)
  }

  useEffect(() => {
    getTasks()
    getTasksInputData()
  }, [context.idProject])

  useEffect(() => {
    document.title = 'infiniti | Project Tasks'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {tasksList && inputData ? (
          <RecentCard
            title='Project Tasks'
            style={styles.recentFullScreen}
            Component={ButtonBlue}
            componentProps={{
              titleNone: true,
              title: 'New Task',
              icon: '/icons/plus.svg',
              style: styles.buttonNewTask,
              onClick: () => {},
            }}
          >
            <TasksCard data={tasksList} />
          </RecentCard>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
    </div>
  )
}
