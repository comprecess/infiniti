import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import {
  ProjectsGanttChartData,
  ProjectViewPageContext,
} from '../../../../../app/constants/constants'
import { GanttChart } from '../../../../../shared/ui/GanttChart/GanttChart'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getGanttChart } from '../../../../../shared/utils/api/Admin/Projects/get-gantt-chart'
import styles from './GanttChartPage.module.scss'

export const AdminProjectsGanttChartPage = () => {
  const [data, setData] = useState<ProjectsGanttChartData[] | null>(null)

  const context = useOutletContext<ProjectViewPageContext>()

  const getGanttChartData = async () => {
    const response = await getGanttChart(context.idProject)

    if (!response.status) return

    setData(response.data.data)
  }

  useEffect(() => {
    getGanttChartData()

    document.title = 'infiniti | Gantt Chart'
  }, [])

  return data ? (
    <GanttChart tasks={data} />
  ) : (
    <div className={styles.loading}>
      <LoadingSpinner size='xl' />
    </div>
  )
}
