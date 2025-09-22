import styles from './Item.module.scss'
import styleItem from '../LatestIncome.module.scss'

interface ItemProps {
  date: string
  amount: string
  description: string
}

export const Item = ({ date, amount, description }: ItemProps) => {
  return (
    <div className={styles.wrapper}>
      <span className={`${styleItem.dateColumn} ${styles.dateItem}`}>
        {date}
      </span>
      <span
        className={`${styleItem.descriptionColumn} ${styles.descriptionItem}`}
      >
        {description}
      </span>
      <span className={`${styleItem.amountColumn} ${styles.amountItem}`}>
        {amount}
      </span>
    </div>
  )
}
