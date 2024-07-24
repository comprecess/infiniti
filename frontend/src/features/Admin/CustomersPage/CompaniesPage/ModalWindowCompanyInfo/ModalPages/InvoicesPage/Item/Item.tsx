import { FC } from 'react'

import { Status } from '../../../../../../../../shared/ui/Status/Status'
import styleItem from '../InvoicesPage.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  id: string
  customer: string
  amount: string
  invoiceDate: string
  dueDate: string
  status: string
}

export const Item: FC<ItemProps> = ({
  id,
  customer,
  amount,
  invoiceDate,
  dueDate,
  status,
}) => {
  return (
    <div className={styles.wrapper}>
      <span className={`${styleItem.hashTagColumn} ${styles.hashTagItem}`}>
        {id}
      </span>
      <span
        className={`${styleItem.customerColumn} ${styles.customerItem}`}
      >
        {customer}
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
      <div className={styleItem.statusColumn}>
        <Status title={status} status={status} />
      </div>
      <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
        <button className={styles.viewButton}>
          <img src='/icons/view.svg' alt='View' className={styles.icon} />
        </button>
        <button className={styles.buttonEdit}>
          <img src='/icons/edit.svg' alt='Star' className={styles.icon} />
        </button>
      </div>
    </div>
  )
}
