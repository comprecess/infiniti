import styles from './Item.module.scss'
import { Routes } from '../../../../../app/router/routes'
import { ManageButtons } from '../../../../Main/RecentCard/ManageButtons/ManageButtons'
import styleItem from '../RecentOffers.module.scss'

interface ItemProps {
  subject: string
  amount: string
  dateCreated: string
  expiryDate: string
  publicCode: string
}

export const Item = ({
  subject,
  amount,
  dateCreated,
  expiryDate,
  publicCode,
}: ItemProps) => {
  const handleNavigateToView = () => {
    const url = `/${Routes.public}/${Routes.offer}/${Routes.view}/${publicCode}`

    window.open(url, '_blank')
  }

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
          firstClick={handleNavigateToView}
        />
      </div>
    </div>
  )
}
