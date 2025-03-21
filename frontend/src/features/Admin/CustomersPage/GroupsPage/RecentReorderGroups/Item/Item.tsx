import { useDrag, useDrop } from 'react-dnd'

import styles from './Item.module.scss'

interface ItemProps {
  index: number
  name: string
  moveItem: (dragIndex: number, hoverIndex: number) => void
  sort: () => void
}

export const Item = ({ index, name, moveItem, sort }: ItemProps) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'ITEM',
    item: { index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: 'ITEM',
    hover: (item: { index: number }) => {
      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) {
        return
      }

      moveItem(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
    drop: () => {
      sort()
    },
  })

  const opacity = isDragging ? 0.5 : 1

  return (
    <div
      ref={node => drag(drop(node))}
      className={styles.wrapper}
      style={{ opacity }}
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
