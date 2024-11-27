import { FC } from 'react'

import { CustomMiniButton } from '../../../../../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import styleItem from '../TransactionsPage.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  code: number
  date: string
  account: string
  type: string
  amount: string
  status: string
  description: string
  dr: string
  cr: string
  bal: string
}

export const Item: FC<ItemProps> = ({
  code,
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
        {code}
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
        <CustomMiniButton
          style='amber'
          icon='/icons/edit.svg'
          alt='Edit'
          tooltipTitle='Edit'
        />
      </div>
    </div>
  )
}
