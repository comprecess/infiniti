import styleItem from '../TableUnclearedTransactions.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  id: number
  date: string
  account: string
  description: string
  amount: string
}

export const Item = ({
  id,
  date,
  account,
  description,
  amount,
}: ItemProps) => {
  return (
    <div className={styles.wrapper}>
      <span className={`${styleItem.idColumn} ${styles.idItem}`}>
        {id}
      </span>
      <span className={`${styleItem.dateColumn} ${styles.dateItem}`}>
        {date}
      </span>
      <span className={`${styleItem.accountColumn} ${styles.accountItem}`}>
        {account}
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
