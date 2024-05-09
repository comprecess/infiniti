import React, { FC } from 'react'

import styles from './Item.module.scss'

interface ItemProps {
  title?: string
  icon?: React.ReactNode
  isActive: boolean
  path: string
  isMini?: boolean
  onItemClick: (pageName: string) => void
}

export const Item: FC<ItemProps> = ({
  title,
  icon,
  isActive,
  path,
  isMini,
  onItemClick,
}) => {
  return (
    <div
      className={isActive ? styles.wrapperActive : styles.wrapperNotActive}
      onClick={() => onItemClick(path)}
    >
      <div className={isMini ? styles.itemsIsMini : styles.items}>
        <div className={styles.leftItems}>
          <div className={styles.icon}>{icon}</div>
          {isMini || <span className={styles.title}>{title}</span>}
        </div>
      </div>
    </div>
  )
}
