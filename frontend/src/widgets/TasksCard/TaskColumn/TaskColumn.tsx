import { useDroppable } from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

import { ProjectsTasksData } from '../../../app/constants/constants'
import styles from './TaskColumn.module.scss'
import { TaskItem } from './TaskItem/TaskItem'

interface TaskColumnProps {
  title: string
  columnId: string
  tasks: ProjectsTasksData[]
  activeTaskId?: string
}

export const TaskColumn = ({
  title,
  columnId,
  tasks,
  activeTaskId,
}: TaskColumnProps) => {
  const { setNodeRef } = useDroppable({ id: columnId })

  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.titleWrapper} ${
          styles[`title_${title.replace(' ', '_')}`]
        }`}
      >
        <span className={styles.title}>{title}</span>
      </div>
      <div ref={setNodeRef} className={styles.droppable}>
        <SortableContext
          items={tasks.map(t => t.id.toString())}
          strategy={verticalListSortingStrategy}
        >
          <div className={styles.tasks}>
            {tasks.map(task => {
              const isActive = task.id.toString() === activeTaskId

              return (
                <div
                  key={task.id}
                  style={
                    isActive
                      ? {
                        opacity: 0,
                        height: 'fit-content',
                      }
                      : undefined
                  }
                >
                  <TaskItem task={task} isSelected={isActive} />
                </div>
              )
            })}
          </div>
        </SortableContext>
      </div>
    </div>
  )
}
