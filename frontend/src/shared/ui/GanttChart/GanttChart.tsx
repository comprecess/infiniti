import 'wx-react-gantt/dist/gantt.css'
import './GanttTheme.scss'

import { useEffect, useRef } from 'react'
import { Gantt } from 'wx-react-gantt'

import {
  ProjectsGanttChartData,
  RolesAccess,
} from '../../../app/constants/constants'

interface GanttChartProps {
  access: RolesAccess
  tasks: ProjectsGanttChartData[]
  changeTask: (idTask: number, start: string, end: string) => void
}

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

export const GanttChart = ({
  access,
  tasks,
  changeTask,
}: GanttChartProps) => {
  const apiRef = useRef<any>(null)

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

  return (
    <div className='my-gantt-theme'>
      <Gantt
        apiRef={apiRef}
        readonly={access.edit === 1 ? false : true}
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
