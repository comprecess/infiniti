import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'

import {
  ProjectsTasksData,
  ProjectsTasksFormData,
  ProjectsTasksInputData,
} from '../../../../app/constants/constants'
import { ViewTaskModal } from '../../../../features/Admin/Projects/ViewProject/ViewTaskModal/ViewTaskModal'
import { useDeviceDetect } from '../../../../shared/utils/hooks/useDeviceDetect'
import styles from './TaskItem.module.scss'

interface TaskItemProps {
  task: ProjectsTasksData
  isSelected: boolean
  isDragging: boolean
  inputData?: ProjectsTasksInputData | null
  editSelectedTask: (
    idTask: number,
    form: Partial<ProjectsTasksFormData>,
  ) => void
  deleteSelectedTask: (idTask: number) => void
}

export const TaskItem = ({
  inputData,
  task,
  isSelected,
  isDragging,
  editSelectedTask,
  deleteSelectedTask,
}: TaskItemProps) => {
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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsViewed(true)
  }

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
              task.admin.img
                ? `${task.admin.img}?width=176&height=176`
                : '/profileWithoutAvatar.svg'
            }
          />
          <span className={styles.account}>{task.admin.account}</span>
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
          inputData={inputData}
          task={task}
          modalOpen={isViewed}
          handleOpenCloseModal={() => setIsViewed(false)}
          editSelectedTask={editSelectedTask}
          deleteSelectedTask={deleteSelectedTask}
        />
      )}
    </>
  )
}
