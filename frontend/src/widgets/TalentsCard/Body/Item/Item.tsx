import { FC } from 'react'

import { TalentsTag } from '../../../../shared/ui/TalentsTag/TalentsTag'
import styles from './Item.module.scss'

interface TagsProps {
  id: number
  propId: number
  value: string
}

interface ItemProps {
  title: string
  tags: TagsProps[]
}

export const Item: FC<ItemProps> = ({ title, tags }) => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>{title}</span>
      <div className={styles.list}>
        {tags.map(tag => {
          const updatedValue = tag.value.replace(/&amp;/g, '&')

          return <TalentsTag key={tag.id} title={updatedValue} />
        })}
      </div>
    </div>
  )
}
