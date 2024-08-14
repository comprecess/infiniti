import { FC } from 'react'

import styleItem from '../RecentLog.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  time: string
  ip: string
  description: string
}

export const Item: FC<ItemProps> = ({ time, ip, description }) => {
  return (
    <div className={styles.wrapper}>
      <span className={`${styleItem.timeColumn} ${styles.timeItem}`}>
        {time}
      </span>
      <span className={`${styleItem.ipColumn} ${styles.ipItem}`}>{ip}</span>
      <span
        className={`${styleItem.descriptionColumn} ${styles.descriptionItem}`}
      >
        {description}
      </span>
    </div>
  )
}
