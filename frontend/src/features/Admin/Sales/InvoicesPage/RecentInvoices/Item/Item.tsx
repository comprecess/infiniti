import { FC } from 'react'

import { ViewInvoicesRecentData } from '../../../../../../app/constants/constants'
import { Status } from '../../../../../../shared/ui/Status/Status'
import styleItem from '../RecentInvoices.module.scss'
import styles from './Item.module.scss'
import { Type } from './Type/Type'

interface ItemProps extends ViewInvoicesRecentData {
  idAccount: number
  deleteInvoice: (idInvoice: number) => void
  stopRecurringInvoice: (
    idInvoice: number,
    type: '/clone' | '/stopRecurring',
  ) => void
  navigateToViewInvoice: (idInvoice: number) => void
  navigateToSelectAccount: (idAccount: number) => void
  navigateToSelectInvoice: (idInvoice: number) => void
}

export const Item: FC<ItemProps> = ({
  id,
  idAccount,
  code,
  account,
  amount,
  invoiceDate,
  dueDate,
  status,
  type,
  deleteInvoice,
  stopRecurringInvoice,
  navigateToViewInvoice,
  navigateToSelectAccount,
  navigateToSelectInvoice,
}) => {
  const handleNavigateSelectedAccount = () => {
    navigateToSelectAccount(idAccount)
  }

  const handleDeleteInvoice = () => {
    deleteInvoice(id)
  }

  const handleNavigateInvoice = () => {
    navigateToSelectInvoice(id)
  }

  const handleStopRecurring = () => {
    stopRecurringInvoice(id, '/stopRecurring')
  }

  const handleCloneInvoice = () => {
    stopRecurringInvoice(id, '/clone')
  }

  const handleNavigateViewInvoice = () => {
    navigateToViewInvoice(id)
  }

  return (
    <div className={styles.wrapper}>
      <span
        className={`${styleItem.codeColumn} ${styles.codeItem}`}
        onClick={handleNavigateViewInvoice}
      >
        {code}
      </span>
      <div
        className={`${styleItem.accountColumn} ${styles.container}`}
        onClick={handleNavigateSelectedAccount}
      >
        <span className={styles.accountItem}>{account.account}</span>
        <span className={styles.companyNameItem}>
          {account.company?.name}
        </span>
      </div>
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
      <div className={styleItem.typeColumn}>
        <Type type={type} />
      </div>
      <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
        <button className={styles.viewButton}>
          <img src='/icons/view.svg' alt='View' className={styles.icon} />
        </button>
        <button
          className={styles.buttonClone}
          onClick={handleCloneInvoice}
        >
          <img
            src='/icons/clone.svg'
            alt='Clone'
            className={styles.icon}
          />
        </button>
        <button
          className={styles.buttonEdit}
          onClick={handleNavigateInvoice}
        >
          <img src='/icons/edit.svg' alt='Edit' className={styles.icon} />
        </button>
        {type === 1 && (
          <button
            className={styles.buttonStopRecurring}
            onClick={handleStopRecurring}
          >
            <img
              src='/icons/stop.svg'
              alt='StopRecurring'
              className={styles.icon}
            />
          </button>
        )}
        <button
          className={styles.buttonTrash}
          onClick={handleDeleteInvoice}
        >
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
