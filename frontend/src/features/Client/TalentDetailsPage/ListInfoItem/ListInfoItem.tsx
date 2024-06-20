import { FC } from 'react'

import { ValuesProps } from '../../../../app/constants/constants'
import { Item } from './Item/Item'
import styles from './ListInfoItem.module.scss'

interface InfoItemProps {
  title: string
  list: ValuesProps[]
}

export const ListInfoItem: FC<InfoItemProps> = ({ title, list }) => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>{title}</span>
      <div className={styles.list}>
        {list.map(item => {
          return <Item key={item.id} title={item.value} />
        })}
      </div>
    </div>
  )
}
