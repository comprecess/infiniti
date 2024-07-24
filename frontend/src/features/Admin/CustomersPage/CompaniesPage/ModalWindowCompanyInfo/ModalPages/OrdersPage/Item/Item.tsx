import { FC } from 'react'

import { OrdersViewCompany } from '../../../../../../../../app/constants/constants'
import { Status } from '../../../../../../../../shared/ui/Status/Status'
import styleItem from '../OrdersPage.module.scss'
import styles from './Item.module.scss'

export const Item: FC<OrdersViewCompany> = ({
  orderNum,
  dateAdded,
  account,
  amount,
  status,
}) => {
  return (
    <div className={styles.wrapper}>
      <span
        className={`${styleItem.hashTagColumn} ${styles.orderNumItem}`}
      >
        {orderNum}
      </span>
      <span className={`${styleItem.dateColumn} ${styles.dateAddedItem}`}>
        {dateAdded}
      </span>
      <span
        className={`${styleItem.customerColumn} ${styles.accountItem}`}
      >
        {account}
      </span>
      <span className={`${styleItem.totalColumn} ${styles.amountItem}`}>
        {amount}
      </span>
      <div className={styleItem.statusColumn}>
        <Status title={status} status={status} />
      </div>
    </div>
  )
}
