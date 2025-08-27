import { Routes } from '../../../../../app/router/routes'
import { ManageButtons } from '../../../../Main/RecentCard/ManageButtons/ManageButtons'
import styleItem from '../RecentTotal.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  subject: string
  total: string
  dateCreated: string
  validUntil: string
  public: string
}

export const Item = ({
  subject,
  total,
  dateCreated,
  validUntil,
  public: publicCode,
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
        {total}
      </span>
      <span
        className={`${styleItem.dateCreatedColumn} ${styles.dateCreatedItem}`}
      >
        {dateCreated}
      </span>
      <span
        className={`${styleItem.expiryDateColumn} ${styles.expiryDateItem}`}
      >
        {validUntil}
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
