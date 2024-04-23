import { FC } from 'react'

import styleItem from '../RecentTransactions.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  date: string
  account: string
  amount: string
  description: string
}

export const Item: FC<ItemProps> = ({
  date,
  account,
  amount,
  description,
}) => {
  return (
    <div className={styles.wrapper}>
      <span className={`${styleItem.dateColumn} ${styles.dateItem}`}>
        {date}
      </span>
      <span className={`${styleItem.accountColumn} ${styles.accountItem}`}>
        {account}
      </span>
      <span className={`${styleItem.amountColumn} ${styles.amountItem}`}>
        {amount}
      </span>
      <span className={styleItem.descriptionColumn}>{description}</span>
    </div>
  )
}
