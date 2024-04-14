import React, { FC } from 'react'

import styles from './Item.module.scss'

interface ItemProps {
  title: string
  icon: React.ReactNode
  isActive: boolean
  path: string
  onItemClick: (pageName: string) => void
}

export const Item: FC<ItemProps> = ({
  title,
  icon,
  isActive,
  path,
  onItemClick,
}) => {
  return (
    <div
      className={isActive ? styles.wrapperActive : styles.wrapperNotActive}
      onClick={() => onItemClick(path)}
    >
      <div className={styles.icon}>{icon}</div>
      <span className={styles.title}>{title}</span>
    </div>
  )
}
