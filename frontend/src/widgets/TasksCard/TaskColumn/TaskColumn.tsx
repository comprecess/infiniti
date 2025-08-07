import { useDroppable } from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { SetURLSearchParams } from 'react-router-dom'

import {
  ProjectsTasksData,
  ProjectsTasksFormData,
  ProjectsTasksInputData,
  RolesAccess,
} from '../../../app/constants/constants'
import styles from './TaskColumn.module.scss'
import { TaskItem } from './TaskItem/TaskItem'

interface TaskColumnProps {
  access: RolesAccess
  inputData: ProjectsTasksInputData
  taskIdFromUrl: string | null
  title: string
  columnId: string
  tasks: ProjectsTasksData[]
  activeTaskId?: string
  isDragging: boolean
  searchParams: URLSearchParams
  setSearchParams: SetURLSearchParams
  editSelectedTask: (
    idTask: number,
    form: Partial<ProjectsTasksFormData>,
  ) => void
  deleteSelectedTask: (idTask: number) => void
}

export const TaskColumn = ({
  access,
  inputData,
  taskIdFromUrl,
  title,
  columnId,
  tasks,
  activeTaskId,
  isDragging,
  searchParams,
  setSearchParams,
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
                    access={access}
                    taskIdFromUrl={taskIdFromUrl}
                    inputData={inputData}
                    task={task}
                    isSelected={isActive}
                    isDragging={isDragging}
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
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
