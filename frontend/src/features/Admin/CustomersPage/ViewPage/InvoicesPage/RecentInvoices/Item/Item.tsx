import { FC } from 'react'

import { ViewInvoicesProps } from '../../../../../../../app/constants/constants'
import { Status } from '../../../../../../../shared/ui/Status/Status'
import styleItem from '../RecentInvoices.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  item: ViewInvoicesProps
}

export const Item: FC<ItemProps> = ({ item }) => {
  return (
    <div className={styles.wrapper}>
      <span className={`${styleItem.codeColumn} ${styles.codeItem}`}>
        {item.code}
      </span>
      <span className={`${styleItem.accountColumn} ${styles.accountItem}`}>
        {item.account}
      </span>
      <span className={`${styleItem.amountColumn} ${styles.amountItem}`}>
        {item.total}
      </span>
      <span
        className={`${styleItem.invoiceDateColumn} ${styles.invoiceDateItem}`}
      >
        {item.date}
      </span>
      <span className={`${styleItem.dueDateColumn} ${styles.dueDateItem}`}>
        {item.dueDate}
      </span>
      <div className={styleItem.statusColumn}>
        <Status title={item.status} status={item.status} />
      </div>
      <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
        <button className={styles.buttonView}>
          <img src='/icons/view.svg' alt='View' className={styles.icon} />
        </button>
        <button className={styles.buttonEdit}>
          <img src='/icons/edit.svg' alt='Edit' className={styles.icon} />
        </button>
      </div>
    </div>
  )
}
