import { useNavigate } from 'react-router-dom'

import { Routes } from '../../../../../../../../app/router/routes'
import { CustomMiniButton } from '../../../../../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import styleItem from '../RecentTransactions.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  id: number
  date: string
  account: string
  type: string
  amount: string
  description: string
  dr: string
  cr: string
}

export const Item = ({
  id,
  date,
  account,
  type,
  amount,
  description,
  dr,
  cr,
}: ItemProps) => {
  const navigate = useNavigate()

  const handleNavigateToEditTransaction = () => {
    navigate(
      `/${Routes.adminPages}/${Routes.accounting}/${Routes.edit}/${Routes.transaction}/${id}`,
    )
  }

  return (
    <div className={styles.wrapper}>
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
      <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
        <CustomMiniButton
          style='amber'
          icon='/icons/edit.svg'
          alt='Edit'
          tooltipTitle='Edit'
          onClick={handleNavigateToEditTransaction}
        />
      </div>
    </div>
  )
}
