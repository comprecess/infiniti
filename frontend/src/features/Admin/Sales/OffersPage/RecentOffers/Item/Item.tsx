import { FC } from 'react'

import { Status } from '../../../../../../shared/ui/Status/Status'
import styleItem from '../RecentOffers.module.scss'
import styles from './Item.module.scss'

export interface ItemProps {
  id: number
  idAccount: number
  code: string
  account: string
  subject: string
  amount: string
  dateCreated: string
  expiryDate: string
  stage: string
  navigateToViewOffer: (idOffer: number) => void
  navigateToEditOffer: (idOffer: number) => void
  navigateToSelectAccount: (idAccount: number) => void
  deleteOffer: (idOffer: number) => void
}

export const Item: FC<ItemProps> = ({
  id,
  idAccount,
  code,
  account,
  subject,
  amount,
  dateCreated,
  expiryDate,
  stage,
  navigateToViewOffer,
  navigateToEditOffer,
  navigateToSelectAccount,
  deleteOffer,
}) => {
  const handleNavigateToViewOffer = () => {
    navigateToViewOffer(id)
  }

  const handleNavigateToEditOffer = () => {
    navigateToEditOffer(id)
  }

  const handleNavigateToSelectAccount = () => {
    navigateToSelectAccount(idAccount)
  }

  const handleDeleteOffer = () => {
    deleteOffer(id)
  }

  return (
    <div className={styles.wrapper}>
      <span
        className={`${styleItem.codeColumn} ${styles.codeItem}`}
        onClick={handleNavigateToViewOffer}
      >
        {code}
      </span>
      <span
        className={`${styleItem.accountColumn} ${styles.accountItem}`}
        onClick={handleNavigateToSelectAccount}
      >
        {account}
      </span>
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
      <div className={styleItem.stageColumn}>
        <Status title={stage} status={stage} />
      </div>
      <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
        <button
          className={styles.viewButton}
          onClick={handleNavigateToViewOffer}
        >
          <img src='/icons/view.svg' alt='View' className={styles.icon} />
        </button>
        <button
          className={styles.buttonEdit}
          onClick={handleNavigateToEditOffer}
        >
          <img src='/icons/edit.svg' alt='Edit' className={styles.icon} />
        </button>
        <button className={styles.buttonTrash} onClick={handleDeleteOffer}>
          <img
            src='/icons/trash.svg'
            alt='Trash'
            className={styles.icon}
          />
        </button>
      </div>
    </div>
  )
}
