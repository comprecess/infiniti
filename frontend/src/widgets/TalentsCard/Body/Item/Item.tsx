import { FC } from 'react'

import { TalentsTag } from '../../../../shared/ui/TalentsTag/TalentsTag'
import styles from './Item.module.scss'

interface ItemProps {
  title: string
  tags: string[]
}

export const Item: FC<ItemProps> = ({ title, tags }) => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>{title}</span>
      <div className={styles.list}>
        {tags.map(tag => {
          return <TalentsTag key={tag} title={tag} />
        })}
      </div>
    </div>
  )
}
