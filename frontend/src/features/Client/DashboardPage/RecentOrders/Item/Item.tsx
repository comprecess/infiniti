import { FC } from 'react'

import { Status } from '../../../../../shared/ui/Status/Status'
import styleItem from '../RecentOrders.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  date: string
  order: string
  amount: string
  status: string
}

export const Item: FC<ItemProps> = ({ date, order, amount, status }) => {
  return (
    <div className={styles.wrapper}>
      <span className={`${styleItem.dateColumn} ${styles.dateItem}`}>
        {date}
      </span>
      <span className={`${styleItem.orderColumn} ${styles.orderItem}`}>
        {order}
      </span>
      <span className={`${styleItem.amountColumn} ${styles.amountItem}`}>
        {amount}
      </span>
      <div className={styleItem.statusColumn}>
        <Status title={status} status={status} />
      </div>
    </div>
  )
}
