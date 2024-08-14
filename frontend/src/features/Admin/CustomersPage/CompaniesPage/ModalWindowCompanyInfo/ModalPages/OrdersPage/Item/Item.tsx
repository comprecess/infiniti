import { FC } from 'react'

import { Status } from '../../../../../../../../shared/ui/Status/Status'
import styleItem from '../OrdersPage.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  id: number
  orderNum: string
  dateAdded: string
  account: string
  amount: string
  status: string
  onClick: (id: number) => void
}

export const Item: FC<ItemProps> = ({
  id,
  orderNum,
  dateAdded,
  account,
  amount,
  status,
  onClick,
}) => {
  const onClickItem = () => {
    onClick(id)
  }

  return (
    <div className={styles.wrapper}>
      <span className={`${styleItem.hashTagColumn} ${styles.orderNumItem}`}>
        {orderNum}
      </span>
      <span className={`${styleItem.dateColumn} ${styles.dateAddedItem}`}>
        {dateAdded}
      </span>
      <span
        className={`${styleItem.customerColumn} ${styles.accountItem}`}
        onClick={onClickItem}
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
