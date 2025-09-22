import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import styles from './GanttChartPage.module.scss'
import {
  ProjectsGanttChartData,
  ProjectViewPageContext,
  RolesAccess,
} from '../../../../../app/constants/constants'
import { useCustomToast } from '../../../../../shared/ui/CustomToast/CustomToast'
import { GanttChart } from '../../../../../shared/ui/GanttChart/GanttChart'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getGanttChart } from '../../../../../shared/utils/api/Admin/Projects/get-gantt-chart'
import { patchEditTaskGanttChart } from '../../../../../shared/utils/api/Admin/Projects/patch-edit-task-gantt-chart'

export const AdminProjectsGanttChartPage = () => {
  const [data, setData] = useState<ProjectsGanttChartData[] | null>(null)
  const [access, setAccess] = useState<RolesAccess | null>(null)

  const showToast = useCustomToast()

  const context = useOutletContext<ProjectViewPageContext>()

  const getGanttChartData = async () => {
    const response = await getGanttChart(context.idProject)

    if (!response.status) return

    setAccess(response.data.access)
    setData(response.data.data)
  }

  const changeTask = async (
    idTask: number,
    start: string,
    end: string,
  ) => {
    const { status, message } = await patchEditTaskGanttChart(
      context.idProject,
      idTask,
      start,
      end,
    )

    if (!status) {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  useEffect(() => {
    getGanttChartData()

    document.title = 'infiniti | Gantt Chart'
  }, [])

  return data && access ? (
    data.length > 0 ? (
      <GanttChart access={access} tasks={data} changeTask={changeTask} />
    ) : (
      <div className={styles.nothingFound}>
        <span className={styles.nothingFoundText}>Nothing Found</span>
      </div>
    )
  ) : (
    <div className={styles.loading}>
      <LoadingSpinner size='xl' />
    </div>
  )
}
