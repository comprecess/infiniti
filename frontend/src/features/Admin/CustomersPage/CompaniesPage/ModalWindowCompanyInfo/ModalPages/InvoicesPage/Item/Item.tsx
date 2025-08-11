import { useNavigate } from 'react-router-dom'

import { RolesAccess } from '../../../../../../../../app/constants/constants'
import { Routes } from '../../../../../../../../app/router/routes'
import { CustomMiniButton } from '../../../../../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import { Status } from '../../../../../../../../shared/ui/Status/Status'
import styleItem from '../InvoicesPage.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  id: number
  idInvoice: number
  code: string
  customer: string
  amount: string
  invoiceDate: string
  dueDate: string
  status: string
  roles?: { [key: string]: RolesAccess }
  onClick: (id: number) => void
}

export const Item = ({
  id,
  idInvoice,
  code,
  customer,
  amount,
  invoiceDate,
  dueDate,
  status,
  roles,
  onClick,
}: ItemProps) => {
  const navigate = useNavigate()

  const onClickItem = () => {
    onClick(id)
  }

  const handleNavigateToViewInvoice = () => {
    navigate(
      `/${Routes.adminPages}/${Routes.sales}/${Routes.invoice}/${Routes.view}/${idInvoice}`,
    )
  }

  const handleNavigateToEditInvoice = () => {
    navigate(
      `/${Routes.adminPages}/${Routes.sales}/${Routes.edit}/${Routes.invoice}/${idInvoice}`,
    )
  }

  return (
    <div className={styles.wrapper}>
      <span
        className={`${styleItem.hashTagColumn} ${styles.hashTagItem}`}
        onClick={handleNavigateToViewInvoice}
      >
        {code}
      </span>
      <span
        className={`${styleItem.customerColumn} ${styles.customerItem}`}
        onClick={onClickItem}
      >
        {customer}
      </span>
      <span className={`${styleItem.amountColumn} ${styles.amountItem}`}>
        {amount}
      </span>
      <span
        className={`${styleItem.invoiceDateColumn} ${styles.invoiceDateItem}`}
      >
        {invoiceDate}
      </span>
      <span className={`${styleItem.dueDateColumn} ${styles.dueDateItem}`}>
        {dueDate}
      </span>
      <div className={styleItem.statusColumn}>
        <Status title={status} status={status} />
      </div>
      <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
        {roles && roles.sales.view === 0 ? (
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
        {roles && roles.sales.edit === 0 ? (
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
