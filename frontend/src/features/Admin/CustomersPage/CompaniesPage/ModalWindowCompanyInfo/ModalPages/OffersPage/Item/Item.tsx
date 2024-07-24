import { FC } from 'react'

import { OffersViewCompany } from '../../../../../../../../app/constants/constants'
import { Status } from '../../../../../../../../shared/ui/Status/Status'
import styleItem from '../OffersPage.module.scss'
import styles from './Item.module.scss'

export const Item: FC<OffersViewCompany> = ({
  id,
  account,
  code,
  total,
  dateCreated,
  validUntil,
  stage,
}) => {
  return (
    <div className={styles.wrapper}>
      <span className={`${styleItem.hashTagColumn} ${styles.hashTagItem}`}>
        {id}
      </span>
      <span
        className={`${styleItem.customerColumn} ${styles.customerItem}`}
      >
        {account}
      </span>
      <span className={`${styleItem.subjectColumn} ${styles.subjectItem}`}>
        {code}
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
      <div className={styleItem.stageColumn}>
        <Status title={stage} status={stage} />
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
