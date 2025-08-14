import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import styles from './Item.module.scss'

interface ItemProps {
  id: number
  index: number
  name: string
  isOverlay?: boolean
}

export const Item = ({
  id,
  index,
  name,
  isOverlay = false,
}: ItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging && !isOverlay ? 0.5 : 1,
    cursor: 'grab',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={styles.wrapper}
    >
      <div className={styles.circleWrapper}>
        <div className={styles.circleMini}>
          <span className={styles.circleIndex}>{index + 1}</span>
        </div>
      </div>
      <span className={styles.name}>{name}</span>
    </div>
  )
}
