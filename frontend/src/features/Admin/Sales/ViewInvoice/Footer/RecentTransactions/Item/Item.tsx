import { FC } from 'react'

import { SalesViewInvoiceTransactions } from '../../../../../../../app/constants/constants'
import styleItem from '../RecentTransactions.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  data: SalesViewInvoiceTransactions
}

export const Item: FC<ItemProps> = ({ data }) => {
  return (
    <div className={styles.wrapper}>
      <span className={`${styleItem.dateColumn} ${styles.dateItem}`}>
        {data.date}
      </span>
      <span className={`${styleItem.accountColumn} ${styles.accountItem}`}>
        {data.account}
      </span>
      <span className={`${styleItem.amountColumn} ${styles.amountItem}`}>
        {data.amount}
      </span>
      <span
        className={`${styleItem.descriptionColumn} ${styles.descriptionItem}`}
      >
        {data.description}
      </span>
    </div>
  )
}
