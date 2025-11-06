import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Dispatch, SetStateAction } from 'react'
import { SetURLSearchParams } from 'react-router-dom'

import styles from './TaskColumn.module.scss'
import { TaskItem } from './TaskItem/TaskItem'
import {
  ProjectsTasksData,
  ProjectsTasksFormData,
  ProjectsTasksInputData,
  RolesAccess,
} from '../../../app/constants/constants'

interface TaskColumnProps {
  access: RolesAccess
  visibleCount: number
  filterStatus: string

  inputData: ProjectsTasksInputData
  taskIdFromUrl: string | null
  title: string
  columnId: string
  tasks: ProjectsTasksData[]
  activeTaskId?: string
  isDragging: boolean
  searchParams: URLSearchParams
  setVisibleCount: Dispatch<SetStateAction<number>>
  updateFilterStatus: (name: string) => void
  setSearchParams: SetURLSearchParams
  editSelectedTask: (idTask: number, form: Partial<ProjectsTasksFormData>) => void
  deleteSelectedTask: (idTask: number) => void
}

export const TaskColumn = ({
  access,
  visibleCount,
  inputData,
  filterStatus,
  taskIdFromUrl,
  title,
  columnId,
  tasks,
  activeTaskId,
  isDragging,
  searchParams,
  updateFilterStatus,
  setVisibleCount,
  setSearchParams,
  editSelectedTask,
  deleteSelectedTask,
}: TaskColumnProps) => {
  const { setNodeRef } = useDroppable({ id: columnId })

  const handleShowMore = () => {
    setVisibleCount(prev => prev + 6)
  }

  const visibleTasks = tasks.slice(0, visibleCount)

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.titleWrapper} ${styles[`title_${title.replace(' ', '_')}`]}`}>
        <span className={styles.title}>{title}</span>
      </div>
      <div ref={setNodeRef} className={isDragging ? styles.droppableDragging : styles.droppable}>
        <SortableContext
          items={tasks.map(t => t.id.toString())}
          strategy={verticalListSortingStrategy}
        >
          <div className={styles.tasks}>
            {visibleTasks.map(task => {
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
                    filterStatus={filterStatus}
                    taskIdFromUrl={taskIdFromUrl}
                    inputData={inputData}
                    task={task}
                    isSelected={isActive}
                    isDragging={isDragging}
                    searchParams={searchParams}
                    updateFilterStatus={updateFilterStatus}
                    setSearchParams={setSearchParams}
                    deleteSelectedTask={deleteSelectedTask}
                    editSelectedTask={editSelectedTask}
                  />
                </div>
              )
            })}
          </div>
        </SortableContext>
        {tasks.length > visibleCount && (
          <div className={styles.showMore} onClick={handleShowMore}>
            <span className={styles.showMoreText}>
              Show more (
              {tasks.length - visibleCount}
              )
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
