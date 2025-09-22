import styles from './Item.module.scss'
import { TalentsTag } from '../../../../shared/ui/TalentsTag/TalentsTag'

interface TagsProps {
  id: number
  propId: number
  value: string
}

interface ItemProps {
  title: string
  tags: TagsProps[]
}

export const Item = ({ title, tags }: ItemProps) => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>{title}</span>
      <div className={styles.list}>
        {tags &&
          tags.map(tag => {
            const updatedValue = tag.value.replace(/&amp;/g, '&')

            return <TalentsTag key={tag.id} title={updatedValue} />
          })}
      </div>
    </div>
  )
}
