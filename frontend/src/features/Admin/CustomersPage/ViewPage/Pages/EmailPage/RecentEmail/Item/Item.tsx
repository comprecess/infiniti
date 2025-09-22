import styles from './Item.module.scss'
import styleItem from '../RecentEmail.module.scss'

interface ItemProps {
  subject: string
  date: string
}

export const Item = ({ subject, date }: ItemProps) => {
  return (
    <div className={styles.wrapper}>
      <span className={`${styleItem.subjectColumn} ${styles.subjectItem}`}>
        {subject}
      </span>
      <span className={`${styleItem.dateColumn} ${styles.dateItem}`}>
        {date}
      </span>
    </div>
  )
}
