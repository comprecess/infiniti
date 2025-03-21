import { Status } from '../../../../../shared/ui/Status/Status'
import styleItem from '../RecentInvoices.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  hashtag: string
  account: string
  amount: string
  created: string
  due: string
  status: string
}

export const Item = ({
  hashtag,
  account,
  amount,
  created,
  due,
  status,
}: ItemProps) => {
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
      <span className={`${styleItem.createdColumn} ${styles.createdItem}`}>
        {created}
      </span>
      <span className={`${styleItem.dueColumn} ${styles.dueItem}`}>
        {due}
      </span>
      <div className={`${styleItem.statusColumn} ${styles.statusItem}`}>
        <Status title={status} status={status} />
      </div>
    </div>
  )
}
