import { FC } from 'react'

import styleItem from '../LatestExpense.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  date: string
  amount: string
  description: string
}

export const Item: FC<ItemProps> = ({ date, amount, description }) => {
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
