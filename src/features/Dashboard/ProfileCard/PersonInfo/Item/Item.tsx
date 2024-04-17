import { FC } from 'react'

import styles from './Item.module.scss'

interface ItemProps {
  title: string
  info: string
}

export const Item: FC<ItemProps> = ({ title, info }) => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>{title}</span>
      <span className={styles.info} contentEditable={false}>
        {info}
      </span>
    </div>
  )
}
