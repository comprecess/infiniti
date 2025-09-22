import { useNavigate } from 'react-router-dom'

import styles from './Item.module.scss'
import { RolesAccess } from '../../../../../../../../app/constants/constants'
import { Routes } from '../../../../../../../../app/router/routes'
import { CustomMiniButton } from '../../../../../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import styleItem from '../TransactionsPage.module.scss'

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
  roles?: { [key: string]: RolesAccess }
}

export const Item = ({
  code,
  date,
  account,
  type,
  amount,
  description,
  dr,
  cr,
  bal,
  roles,
}: ItemProps) => {
  const navigate = useNavigate()

  const handleNavigateToEditTransaction = () => {
    navigate(
      `/${Routes.adminPages}/${Routes.accounting}/${Routes.edit}/${Routes.transaction}/${code}`,
    )
  }

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
        {roles && roles.transactions.edit === 0 ? (
          <div style={{ display: 'none' }} />
        ) : (
          <CustomMiniButton
            style='amber'
            icon='/icons/edit.svg'
            alt='Edit'
            tooltipTitle='Edit'
            onClick={handleNavigateToEditTransaction}
          />
        )}
      </div>
    </div>
  )
}
