import { FC } from 'react'

import styleItem from '../RecentTransactions.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  date: string
  account: string
  type: string
  amount: string
  description: string
  dr: string
  cr: string
}

export const Item: FC<ItemProps> = ({
  date,
  account,
  type,
  amount,
  description,
  dr,
  cr,
}) => {
  return (
    <div className={styles.wrapper}>
      <span className={`${styleItem.dateColumn} ${styles.dateItem}`}>
        {date}
      </span>
      <span className={`${styleItem.accountColumn} ${styles.accountItem}`}>
        {account}
      </span>
      <span className={`${styleItem.typeColumn} ${styles.typeItem}`}>
        {type}
      </span>
      <span className={`${styleItem.amountColumn} ${styles.amountItem}`}>
        {amount}
      </span>
      <span
        className={`${styleItem.descriptionColumn} ${styles.descriptionItem}`}
      >
        {description}
      </span>
      <span className={`${styleItem.drColumn} ${styles.drItem}`}>{dr}</span>
      <span className={`${styleItem.crColumn} ${styles.crItem}`}>{cr}</span>
      <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
        <button className={styles.buttonEdit}>
          <img src='/icons/edit.svg' alt='Edit' className={styles.icon} />
        </button>
      </div>
    </div>
  )
}
