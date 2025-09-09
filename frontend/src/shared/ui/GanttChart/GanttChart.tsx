import 'wx-react-gantt/dist/gantt.css'
import './GanttTheme.scss'

import { useEffect, useRef } from 'react'
import { Gantt } from 'wx-react-gantt'

import { ProjectsGanttChartData } from '../../../app/constants/constants'

const normalizeTasks = (tasks: ProjectsGanttChartData[]) =>
  tasks.map(t => {
    const startDate = new Date(t.start)
    const endDate = new Date(t.end)

    if (t.duration === 1 && startDate.getTime() === endDate.getTime()) {
      endDate.setHours(endDate.getHours() + 1)
    }

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

  console.log(tasks)

  const normalTasks = normalizeTasks(tasks)

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

  console.log(normalTasks)

  return (
    <div className='my-gantt-theme'>
      <Gantt
        apiRef={apiRef}
        tasks={normalTasks}
        cellWidth={35}
        cellHeight={35}
        init={(api: any) => {
          apiRef.current = api
        }}
      />
    </div>
  )
}
