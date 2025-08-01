import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useEffect, useState } from 'react'
import { SetURLSearchParams, useNavigate } from 'react-router-dom'

import {
  ProjectsTasksData,
  ProjectsTasksFormData,
  ProjectsTasksInputData,
} from '../../../../app/constants/constants'
import { EditTaskModal } from '../../../../features/Admin/Projects/ViewProject/EditTaskModal/EditTaskModal'
import { ViewTaskModal } from '../../../../features/Admin/Projects/ViewProject/ViewTaskModal/ViewTaskModal'
import { useDeviceDetect } from '../../../../shared/utils/hooks/useDeviceDetect'
import styles from './TaskItem.module.scss'

interface TaskItemProps {
  task: ProjectsTasksData
  taskIdFromUrl?: string | null
  isSelected: boolean
  isDragging: boolean
  inputData?: ProjectsTasksInputData | null
  searchParams?: URLSearchParams
  setSearchParams?: SetURLSearchParams
  editSelectedTask: (
    idTask: number,
    form: Partial<ProjectsTasksFormData>,
  ) => void
  deleteSelectedTask: (idTask: number) => void
}

export const TaskItem = ({
  inputData,
  taskIdFromUrl,
  task,
  isSelected,
  isDragging,
  searchParams,
  setSearchParams,
  editSelectedTask,
  deleteSelectedTask,
}: TaskItemProps) => {
  const [isEdited, setIsEdited] = useState<boolean>(false)
  const [isViewed, setIsViewed] = useState(false)

  const {
    attributes,
    listeners,
    transform,
    transition,
    setNodeRef,
    setActivatorNodeRef,
  } = useSortable({
    id: task.id.toString(),
  })

  const { isMobile } = useDeviceDetect()
  const navigate = useNavigate()

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleSetIsEdited = () => {
    if (!searchParams || !setSearchParams) return

    setIsViewed(false)
    searchParams.delete('task')
    setSearchParams(searchParams)

    const timer = setTimeout(() => {
      setIsEdited(prev => !prev)
    }, 100)

    return () => clearTimeout(timer)
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigate(`?task=${task.id}`)
  }

  useEffect(() => {
    if (taskIdFromUrl && parseInt(taskIdFromUrl) === task.id) {
      setIsViewed(true)
    } else {
      setIsViewed(false)
    }
  }, [taskIdFromUrl, task.id])

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...(isMobile ? attributes : { ...attributes, ...listeners })}
        className={isSelected ? styles.wrapperSelected : styles.wrapper}
        onClick={handleClick}
      >
        <div className={styles.header}>
          <img
            alt='avatar'
            className={styles.avatar}
            src={
              task.admin && task.admin.img
                ? `${task.admin.img}?width=176&height=176`
                : '/profileWithoutAvatar.svg'
            }
          />
          <span className={styles.account}>
            {task.admin ? task.admin.account : '-'}
          </span>
          {isMobile && (
            <div
              ref={setActivatorNodeRef}
              className={styles.dragHandle}
              {...listeners}
            >
              ⠿
            </div>
          )}
        </div>
        <div className={styles.description}>{task.title}</div>
        <div className={styles.footer}>
          <span className={styles.created}>{task.created}</span>
        </div>
      </div>
      {isViewed && !isDragging && inputData && (
        <ViewTaskModal
          task={task}
          modalOpen={isViewed}
          handleIsEditTask={handleSetIsEdited}
          deleteSelectedTask={deleteSelectedTask}
          handleOpenCloseModal={() => {
            if (!searchParams || !setSearchParams) return

            setIsViewed(false)
            searchParams.delete('task')
            setSearchParams(searchParams)
          }}
        />
      )}
      {isEdited && !isDragging && inputData && (
        <EditTaskModal
          task={task}
          modalOpen={isEdited}
          inputData={inputData}
          handleOpenCloseModal={handleSetIsEdited}
          editTask={editSelectedTask}
        />
      )}
    </>
  )
}
