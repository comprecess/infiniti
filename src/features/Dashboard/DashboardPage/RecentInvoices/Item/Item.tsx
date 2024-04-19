import { FC } from 'react'

import { Status } from '../../../../../shared/ui/Status/Status'
import styleItem from '../RecentInvoices.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  hashtag: string
  account: string
  amount: string
  invoiceDate: string
  dueDate: string
  status: string
}

export const Item: FC<ItemProps> = ({
  hashtag,
  account,
  amount,
  invoiceDate,
  dueDate,
  status,
}) => {
  return (
    <div className={styles.wrapper}>
      <span className={`${styleItem.hashtagColumn} ${styles.hashtagItem}`}>
        {hashtag}
      </span>
      <span className={`${styleItem.accountColumn} ${styles.accountItem}`}>
        {account}
      </span>
      <span className={`${styleItem.amountColumn} ${styles.amountItem}`}>
        {amount}
      </span>
      <span
        className={`${styleItem.invoiceDateColumn} ${styles.invoiceDateItem}`}
      >
        {invoiceDate}
      </span>
      <span className={`${styleItem.dueDateColumn} ${styles.dueDateItem}`}>
        {dueDate}
      </span>
      <div className={`${styleItem.statusColumn} ${styles.statusItem}`}>
        <Status title={status} status={status} />
      </div>
      <div className={`${styleItem.manageColumn} ${styles.manageItem}`} />
    </div>
  )
}
