import React, { FC } from 'react'

import { ChevronDownIcon } from '../../../../shared/icons/ChevronDownIcon'
import styles from './Item.module.scss'

interface ItemProps {
  title?: string
  icon: React.ReactNode
  chevron: boolean
  isActive: boolean
  path: string
  style?: string
  isMini?: boolean
  onItemClick: (pageName: string) => void
}

export const Item: FC<ItemProps> = ({
  title,
  icon,
  chevron,
  isActive,
  path,
  style,
  isMini,
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
      <div className={isMini ? styles.itemsIsMini : styles.items}>
        <div className={styles.leftItems}>
          <div className={styles.icon}>{icon}</div>
          {isMini || <span className={styles.title}>{title}</span>}
        </div>
        {!chevron || <ChevronDownIcon />}
      </div>
    </div>
  )
}
