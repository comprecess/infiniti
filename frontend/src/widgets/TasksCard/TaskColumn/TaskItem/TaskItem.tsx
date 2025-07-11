import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { ProjectsTasksData } from '../../../../app/constants/constants'
import styles from './TaskItem.module.scss'

interface TaskItemProps {
  task: ProjectsTasksData
  isSelected: boolean
}

export const TaskItem = ({ task, isSelected }: TaskItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id.toString() })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={isSelected ? styles.wrapperSelected : styles.wrapper}
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
      </div>
      <div className={styles.description}>{task.title}</div>
      <div className={styles.footer}>
        <span className={styles.dueDate}>{task.dueDate}</span>
        <span className={styles.created}>{task.created}</span>
      </div>
    </div>
  )
}
