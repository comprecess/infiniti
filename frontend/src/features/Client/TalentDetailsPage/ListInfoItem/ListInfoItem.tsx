import { ValuesProps } from '../../../../app/constants/constants'
import { Item } from './Item/Item'
import styles from './ListInfoItem.module.scss'

interface InfoItemProps {
  title: string
  list: ValuesProps[]
}

export const ListInfoItem = ({ title, list }: InfoItemProps) => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>{title}</span>
      <div className={styles.list}>
        {list.map(item => {
          const updatedValue = item.value.replace(/&amp;/g, '&')

          return <Item key={item.id} title={updatedValue} />
        })}
      </div>
    </div>
  )
}
