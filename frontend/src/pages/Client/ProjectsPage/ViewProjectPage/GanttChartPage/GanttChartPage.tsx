import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import styles from './GanttChartPage.module.scss'
import {
  ProjectsGanttChartData,
  ProjectViewPageContext,
} from '../../../../../app/constants/constants'
import { GanttChart } from '../../../../../shared/ui/GanttChart/GanttChart'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getGanttChart } from '../../../../../shared/utils/api/Client/Projects/get-gantt-chart'

export const ClientGanttChartPage = () => {
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
    data.length > 0 ? (
      <GanttChart
        access={{ all: 0, view: 1, edit: 0, delete: 0, create: 0 }}
        tasks={data}
        changeTask={() => {}}
      />
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
