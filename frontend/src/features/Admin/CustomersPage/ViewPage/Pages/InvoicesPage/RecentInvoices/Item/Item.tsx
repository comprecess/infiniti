import { useNavigate } from 'react-router-dom'

import styles from './Item.module.scss'
import {
  RolesAccess,
  ViewInvoicesProps,
} from '../../../../../../../../app/constants/constants'
import { Routes } from '../../../../../../../../app/router/routes'
import { CustomMiniButton } from '../../../../../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import { Status } from '../../../../../../../../shared/ui/Status/Status'
import styleItem from '../RecentInvoices.module.scss'

interface ItemProps {
  access: RolesAccess | undefined
  item: ViewInvoicesProps
}

export const Item = ({ access, item }: ItemProps) => {
  const navigate = useNavigate()

  const handleNavigateToViewInvoice = () => {
    navigate(
      `/${Routes.adminPages}/${Routes.sales}/${Routes.invoice}/${Routes.view}/${item.id}`,
    )
  }

  const handleNavigateToEditInvoice = () => {
    navigate(
      `/${Routes.adminPages}/${Routes.sales}/${Routes.edit}/${Routes.invoice}/${item.id}`,
    )
  }

  return (
    <div className={styles.wrapper}>
      <span className={`${styleItem.codeColumn} ${styles.codeItem}`}>
        {item.code}
      </span>
      <span className={`${styleItem.accountColumn} ${styles.accountItem}`}>
        {item.account}
      </span>
      <span className={`${styleItem.amountColumn} ${styles.amountItem}`}>
        {item.total}
      </span>
      <span
        className={`${styleItem.invoiceDateColumn} ${styles.invoiceDateItem}`}
      >
        {item.date}
      </span>
      <span className={`${styleItem.dueDateColumn} ${styles.dueDateItem}`}>
        {item.dueDate}
      </span>
      <div className={styleItem.statusColumn}>
        <Status title={item.status} status={item.status} />
      </div>
      <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
        {access && access.view === 0 ? (
          <div style={{ display: 'none' }} />
        ) : (
          <CustomMiniButton
            style='mint'
            icon='/icons/view.svg'
            alt='View'
            tooltipTitle='View'
            onClick={handleNavigateToViewInvoice}
          />
        )}
        {access && access.edit === 0 ? (
          <div style={{ display: 'none' }} />
        ) : (
          <CustomMiniButton
            style='amber'
            icon='/icons/edit.svg'
            alt='Edit'
            tooltipTitle='Edit'
            onClick={handleNavigateToEditInvoice}
          />
        )}
      </div>
    </div>
  )
}
