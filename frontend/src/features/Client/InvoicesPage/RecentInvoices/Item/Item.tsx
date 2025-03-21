import { Status } from '../../../../../shared/ui/Status/Status'
import { ManageButtons } from '../../../../Main/RecentCard/ManageButtons/ManageButtons'
import styleItem from '../RecentInvoices.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  hashtag: string
  amount: string
  invoiceDate: string
  dueDate: string
  status: string
}

export const Item = ({
  hashtag,
  amount,
  invoiceDate,
  dueDate,
  status,
}: ItemProps) => {
  return (
    <div className={styles.wrapper}>
      <a
        href=''
        className={`${styleItem.hashtagColumn} ${styles.hashtagItem}`}
      >
        {hashtag}
      </a>
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
      <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
        <ManageButtons
          firstButtonTitle='View'
          secondButtonTitle='Print'
          thirdButtonTitle='Download'
        />
      </div>
    </div>
  )
}
