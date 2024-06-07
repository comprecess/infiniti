import { FC } from 'react'

import { Item } from './Item/Item'
import styles from './ListInfoItem.module.scss'

interface InfoItemProps {
  title: string
  list: string[]
}

export const ListInfoItem: FC<InfoItemProps> = ({ title, list }) => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>{title}</span>
      <div className={styles.list}>
        {list.map(text => {
          return <Item key={text} title={text} />
        })}
      </div>
    </div>
  )
}
