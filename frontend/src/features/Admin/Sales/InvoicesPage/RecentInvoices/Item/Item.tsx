import { useState } from 'react'

import {
  RolesAccess,
  ViewInvoicesRecentData,
} from '../../../../../../app/constants/constants'
import { ConfirmationModal } from '../../../../../../shared/ui/ConfirmationModal/ConfirmationModal'
import { CustomMiniButton } from '../../../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import { Status } from '../../../../../../shared/ui/Status/Status'
import styleItem from '../RecentInvoices.module.scss'
import styles from './Item.module.scss'
import { Type } from './Type/Type'

interface ItemProps extends ViewInvoicesRecentData {
  access: RolesAccess
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

export const Item = ({
  access,
  id,
  idAccount,
  code,
  account,
  amount,
  invoiceDate,
  dueDate,
  status,
  type,
  blockEdit,
  deleteInvoice,
  stopRecurringInvoice,
  navigateToViewInvoice,
  navigateToSelectAccount,
  navigateToSelectInvoice,
}: ItemProps) => {
  const [modalDelete, setModalDelete] = useState<boolean>(false)

  const handleOpenConfirmationModal = () => {
    setModalDelete(state => !state)
  }

  const handleNavigateSelectedAccount = () => {
    navigateToSelectAccount(idAccount)
  }

  const handleDeleteInvoice = () => {
    deleteInvoice(id)
    handleOpenConfirmationModal()
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
    <>
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
        <span
          className={`${styleItem.dueDateColumn} ${styles.dueDateItem}`}
        >
          {dueDate}
        </span>
        <div className={styleItem.statusColumn}>
          <Status title={status} status={status} />
        </div>
        <div className={styleItem.typeColumn}>
          <Type type={type} />
        </div>
        <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
          {access.view === 1 && (
            <CustomMiniButton
              style='mint'
              icon='/icons/view.svg'
              alt='View'
              tooltipTitle='View'
              onClick={handleNavigateViewInvoice}
            />
          )}
          {access.create === 1 && (
            <CustomMiniButton
              style='blue'
              icon='/icons/clone.svg'
              alt='Clone'
              tooltipTitle='Clone'
              onClick={handleCloneInvoice}
            />
          )}
          {access.edit === 1 && !blockEdit && (
            <CustomMiniButton
              style='amber'
              icon='/icons/edit.svg'
              alt='Edit'
              tooltipTitle='Edit'
              onClick={handleNavigateInvoice}
            />
          )}
          {access.edit === 1 && type === 1 && (
            <CustomMiniButton
              style='cherry'
              icon='/icons/stop.svg'
              alt='Stop Recurring'
              tooltipTitle='Stop Recurring'
              onClick={handleStopRecurring}
            />
          )}
          {access.delete === 1 && (
            <CustomMiniButton
              style='cherry'
              icon='/icons/trash.svg'
              alt='Delete'
              tooltipTitle='Delete'
              onClick={handleOpenConfirmationModal}
            />
          )}
        </div>
      </div>
      {modalDelete && (
        <ConfirmationModal
          isOpened={modalDelete}
          handleOpenCloseModal={handleOpenConfirmationModal}
          agree={handleDeleteInvoice}
        />
      )}
    </>
  )
}
