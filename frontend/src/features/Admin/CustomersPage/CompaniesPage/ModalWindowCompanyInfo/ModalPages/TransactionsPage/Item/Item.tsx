import { FC } from 'react'

import { TransactionsViewCompany } from '../../../../../../../../app/constants/constants'
import styleItem from '../TransactionsPage.module.scss'
import styles from './Item.module.scss'

export const Item: FC<TransactionsViewCompany> = ({
  id,
  date,
  account,
  type,
  amount,
  description,
  dr,
  cr,
  bal,
}) => {
  return (
    <div className={styles.wrapper}>
      <span className={`${styleItem.hashTagColumn} ${styles.hashTagItem}`}>
        {id}
      </span>
      <span className={`${styleItem.dateColumn} ${styles.dateItem}`}>
        {date}
      </span>
      <span className={`${styleItem.accountColumn} ${styles.accountItem}`}>
        {account}
      </span>
      <span className={`${styleItem.typeColumn} ${styles.typeItem}`}>
        {type}
      </span>
      <span className={`${styleItem.amountColumn} ${styles.amountItem}`}>
        {amount}
      </span>
      <span
        className={`${styleItem.descriptionColumn} ${styles.descriptionItem}`}
      >
        {description}
      </span>
      <span className={`${styleItem.drColumn} ${styles.drItem}`}>
        {dr}
      </span>
      <span className={`${styleItem.crColumn} ${styles.crItem}`}>
        {cr}
      </span>
      <span className={`${styleItem.balanceColumn} ${styles.balanceItem}`}>
        {bal}
      </span>
      <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
        <button className={styles.buttonEdit}>
          <img src='/icons/edit.svg' alt='Star' className={styles.icon} />
        </button>
      </div>
    </div>
  )
}
