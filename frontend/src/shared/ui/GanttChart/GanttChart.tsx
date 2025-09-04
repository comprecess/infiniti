import 'wx-react-gantt/dist/gantt.css'
import './GanttTheme.scss'

import { useEffect, useRef } from 'react'
import { Gantt } from 'wx-react-gantt'

import { ProjectsGanttChartData } from '../../../app/constants/constants'

interface GanttChartProps {
  tasks: ProjectsGanttChartData[]
}

export const GanttChart = ({ tasks }: GanttChartProps) => {
  const apiRef = useRef<any>(null)

  useEffect(() => {
    if (!apiRef.current) return

    // Отслеживаем изменения задач после их обновления
    apiRef.current.on('update-task', ({ task }: { task: any }) => {
      console.log('Таск обновлён с актуальными датами:', {
        id: task.id,
        text: task.text,
        start: task.start,
        end: task.end,
      })
    })
  }, [])

  return (
    <div className='my-gantt-theme'>
      <Gantt
        apiRef={apiRef}
        tasks={tasks}
        cellWidth={35}
        cellHeight={35}
        init={(api: any) => {
          apiRef.current = api
        }}
      />
    </div>
  )
}
