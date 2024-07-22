import { FC } from 'react'

import styles from './Item.module.scss'

interface ItemProps {
  title: string
  description: string
}

export const Item: FC<ItemProps> = ({ title, description }) => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>{title}</span>
      <span className={styles.description}>{description}</span>
    </div>
  )
}
