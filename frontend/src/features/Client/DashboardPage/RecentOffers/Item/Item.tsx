import { ManageButtons } from '../../../../Main/RecentCard/ManageButtons/ManageButtons'
import styleItem from '../RecentOffers.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  subject: string
  amount: string
  dateCreated: string
  expiryDate: string
}

export const Item = ({
  subject,
  amount,
  dateCreated,
  expiryDate,
}: ItemProps) => {
  return (
    <div className={styles.wrapper}>
      <span className={`${styleItem.subjectColumn} ${styles.subjectItem}`}>
        {subject}
      </span>
      <span className={`${styleItem.amountColumn} ${styles.amountItem}`}>
        {amount}
      </span>
      <span
        className={`${styleItem.dateCreatedColumn} ${styles.dateCreatedItem}`}
      >
        {dateCreated}
      </span>
      <span
        className={`${styleItem.expiryDateColumn} ${styles.expiryDateItem}`}
      >
        {expiryDate}
      </span>
      <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
        <ManageButtons
          firstButtonTitle='View'
          secondButtonTitle='Print'
          thirdButtonTitle='Delete'
        />
      </div>
    </div>
  )
}
