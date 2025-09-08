import 'wx-react-gantt/dist/gantt.css'
import './GanttTheme.scss'

import { useEffect, useRef } from 'react'
import { Gantt } from 'wx-react-gantt'

import { ProjectsGanttChartData } from '../../../app/constants/constants'

const normalizeTasks = (tasks: ProjectsGanttChartData[]) =>
  tasks.map(t => {
    const startDate = new Date(t.start)
    const endDate = new Date(t.end)

    return {
      ...t,
      start: startDate,
      end: endDate,
    }
  })

interface GanttChartProps {
  tasks: ProjectsGanttChartData[]
  changeTask: (idTask: number, start: string, end: string) => void
}

export const GanttChart = ({ tasks, changeTask }: GanttChartProps) => {
  const apiRef = useRef<any>(null)

  useEffect(() => {
    if (!apiRef.current) return

    apiRef.current.on(
      'update-task',
      ({ task }: { task: ProjectsGanttChartData }) => {
        const formatDate = (dateStr: string) =>
          new Date(dateStr).toLocaleDateString('en-CA')

        changeTask(task.id, formatDate(task.start), formatDate(task.end))
      },
    )
  }, [])

  return (
    <div className='my-gantt-theme'>
      <Gantt
        apiRef={apiRef}
        tasks={normalizeTasks(tasks)}
        cellWidth={35}
        cellHeight={35}
        init={(api: any) => {
          apiRef.current = api
        }}
      />
    </div>
  )
}
