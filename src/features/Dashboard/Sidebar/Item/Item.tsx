import React, { FC } from 'react'

import styles from './Item.module.scss'

interface ItemProps {
  title?: string
  icon: React.ReactNode
  isActive: boolean
  path: string
  style?: string
  onItemClick: (pageName: string) => void
}

export const Item: FC<ItemProps> = ({
  title,
  icon,
  isActive,
  path,
  style,
  onItemClick,
}) => {
  return (
    <div
      className={
        isActive
          ? `${styles.wrapperActive} ${style}`
          : `${styles.wrapperNotActive} ${style}`
      }
      onClick={() => onItemClick(path)}
    >
      <div className={styles.icon}>{icon}</div>
      {title || <span className={styles.title}>{title}</span>}
    </div>
  )
}
