import { useDroppable } from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

import {
  ProjectsTasksData,
  ProjectsTasksFormData,
  ProjectsTasksInputData,
} from '../../../app/constants/constants'
import styles from './TaskColumn.module.scss'
import { TaskItem } from './TaskItem/TaskItem'

interface TaskColumnProps {
  inputData: ProjectsTasksInputData
  title: string
  columnId: string
  tasks: ProjectsTasksData[]
  activeTaskId?: string
  isDragging: boolean
  editSelectedTask: (
    idTask: number,
    form: Partial<ProjectsTasksFormData>,
  ) => void
  deleteSelectedTask: (idTask: number) => void
}

export const TaskColumn = ({
  inputData,
  title,
  columnId,
  tasks,
  activeTaskId,
  isDragging,
  editSelectedTask,
  deleteSelectedTask,
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
      <div
        ref={setNodeRef}
        className={
          isDragging ? styles.droppableDragging : styles.droppable
        }
      >
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
                  <TaskItem
                    inputData={inputData}
                    task={task}
                    isSelected={isActive}
                    isDragging={isDragging}
                    deleteSelectedTask={deleteSelectedTask}
                    editSelectedTask={editSelectedTask}
                  />
                </div>
              )
            })}
          </div>
        </SortableContext>
      </div>
    </div>
  )
}
