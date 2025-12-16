import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useEffect, useState } from 'react'
import { SetURLSearchParams, useNavigate } from 'react-router-dom'

import styles from './TaskItem.module.scss'
import {
  ProjectsTasksData,
  ProjectsTasksFormData,
  ProjectsTasksInputData,
  RolesAccess,
} from '../../../../app/constants/constants'
import { EditTaskModal } from '../../../../features/Admin/Projects/ViewProject/EditTaskModal/EditTaskModal'
import { ViewTaskModal } from '../../../../features/Admin/Projects/ViewProject/ViewTaskModal/ViewTaskModal'
import { useDeviceDetect } from '../../../../shared/utils/hooks/useDeviceDetect'

interface TaskItemProps {
  access?: RolesAccess
  isClientView: boolean
  task: ProjectsTasksData
  taskIdFromUrl?: string | null
  filterStatus: string
  isSelected: boolean
  isDragging: boolean
  inputData?: ProjectsTasksInputData | null
  searchParams?: URLSearchParams
  updateFilterStatus: (name: string) => void
  setSearchParams?: SetURLSearchParams
  editSelectedTask: (idTask: number, form: Partial<ProjectsTasksFormData>) => void
  deleteSelectedTask: (idTask: number) => void
}

export const TaskItem = ({
  access,
  isClientView,
  inputData,
  taskIdFromUrl,
  filterStatus,
  task,
  isSelected,
  isDragging,
  searchParams,
  updateFilterStatus,
  setSearchParams,
  editSelectedTask,
  deleteSelectedTask,
}: TaskItemProps) => {
  const [isEdited, setIsEdited] = useState<boolean>(false)
  const [isViewed, setIsViewed] = useState(false)

  const canDrag = access?.edit === 1

  const { attributes, listeners, transform, transition, setNodeRef, setActivatorNodeRef } =
    useSortable({
      id: task.id.toString(),
      disabled: !canDrag,
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
    searchParams.delete('filter')

    setSearchParams(searchParams)

    const timer = setTimeout(() => {
      setIsEdited(prev => !prev)
    }, 100)

    return () => clearTimeout(timer)
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigate(`?task=${task.id}&filter=Main`)
  }

  useEffect(() => {
    if (taskIdFromUrl && parseInt(taskIdFromUrl) === task.id && access?.view === 1) {
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
        className={`${isSelected ? styles.wrapperSelected : styles.wrapper} ${
          canDrag ? styles.grab : styles.default
        }`}
        onClick={handleClick}
      >
        <div className={styles.header}>
          {task.users && task.users.length > 0 ? (
            task.users.length === 1 ? (
              <>
                <img
                  alt='avatar'
                  className={styles.avatar}
                  src={
                    task.users[0].img
                      ? `${task.users[0].img}?width=176&height=176`
                      : '/profileWithoutAvatar.svg'
                  }
                />
                <span className={styles.account}>{task.users[0].account || '-'}</span>
              </>
            ) : (
              <div className={styles.multiAvatars}>
                {task.users.slice(0, 3).map(user => (
                  <img
                    key={user.id}
                    alt='avatar'
                    className={styles.avatarOverlap}
                    src={
                      user.img ? `${user.img}?width=176&height=176` : '/profileWithoutAvatar.svg'
                    }
                  />
                ))}
              </div>
            )
          ) : (
            <>
              <img alt='avatar' className={styles.avatar} src='/profileWithoutAvatar.svg' />
              <span className={styles.account}>-</span>
            </>
          )}

          {isMobile && (
            <div ref={setActivatorNodeRef} className={styles.dragHandle} {...listeners}>
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
          isClientView={isClientView}
          access={access}
          task={task}
          filterStatus={filterStatus}
          modalOpen={isViewed}
          updateFilterStatus={updateFilterStatus}
          handleIsEditTask={handleSetIsEdited}
          deleteSelectedTask={deleteSelectedTask}
          handleOpenCloseModal={() => {
            if (!searchParams || !setSearchParams) return

            setIsViewed(false)

            searchParams.delete('task')
            searchParams.delete('filter')

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
