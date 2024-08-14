import { FC } from 'react'

import { Status } from '../../../../../../../../shared/ui/Status/Status'
import styleItem from '../OffersPage.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  id: number
  code: number
  account: string
  subject: string
  total: string
  dateCreated: string
  validUntil: string
  stage: string
  onClick: (id: number) => void
}

export const Item: FC<ItemProps> = ({
  id,
  code,
  account,
  subject,
  total,
  dateCreated,
  validUntil,
  stage,
  onClick,
}) => {
  const onClickItem = () => {
    onClick(id)
  }

  return (
    <div className={styles.wrapper}>
      <span className={`${styleItem.hashTagColumn} ${styles.hashTagItem}`}>
        {code}
      </span>
      <span
        className={`${styleItem.customerColumn} ${styles.customerItem}`}
        onClick={onClickItem}
      >
        {account}
      </span>
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
