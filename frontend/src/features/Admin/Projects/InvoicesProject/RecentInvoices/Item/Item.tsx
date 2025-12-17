import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './Item.module.scss'
import { RolesAccess, ViewInvoicesRecentData } from '../../../../../../app/constants/constants'
import { Routes } from '../../../../../../app/router/routes'
import { ConfirmationModal } from '../../../../../../shared/ui/ConfirmationModal/ConfirmationModal'
import { CustomMiniButton } from '../../../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import { Status } from '../../../../../../shared/ui/Status/Status'
import { Type } from '../../../../Sales/InvoicesPage/RecentInvoices/Item/Type/Type'
import styleItem from '../RecentInvoices.module.scss'

interface ItemProps extends ViewInvoicesRecentData {
  access: RolesAccess | undefined
  isClientView: boolean
  deleteInvoice: (idInvoice: number) => void
}

export const Item = ({
  isClientView,
  id,
  code,
  account,
  amount,
  invoiceDate,
  dueDate,
  status,
  type,
  blockEdit,
  access,
  deleteInvoice,
}: ItemProps) => {
  const [modalDelete, setModalDelete] = useState<boolean>(false)

  const navigate = useNavigate()

  const handleOpenConfirmationModal = () => {
    setModalDelete(state => !state)
  }

  const handleDeleteInvoice = () => {
    deleteInvoice(id)
    handleOpenConfirmationModal()
  }

  const handleNavigateSelectedAccount = () => {
    if (isClientView) return

    navigate(
      `/${Routes.adminPages}/${Routes.customers}/${Routes.view}/${account.id}/${Routes.summary}`,
    )
  }

  const handleNavigateEditInvoice = () => {
    if (isClientView) return

    navigate(`/${Routes.adminPages}/${Routes.sales}/${Routes.edit}/${Routes.invoice}/${id}`)
  }

  const handleNavigateViewInvoice = () => {
    if (isClientView) return

    navigate(`/${Routes.adminPages}/${Routes.sales}/${Routes.invoice}/${Routes.view}/${id}`)
  }

  return (
    <>
      <div className={styles.wrapper}>
        <span
          className={`${styleItem.codeColumn} ${styles.codeItem}`}
          style={{ cursor: isClientView ? 'default' : 'pointer' }}
          onClick={handleNavigateViewInvoice}
        >
          {code}
        </span>
        <div
          className={`${styleItem.accountColumn} ${styles.container}`}
          style={{ cursor: isClientView ? 'default' : 'pointer' }}
          onClick={handleNavigateSelectedAccount}
        >
          <span className={styles.accountItem}>{account.account}</span>
          <span className={styles.companyNameItem}>{account.company?.name}</span>
        </div>
        <span className={`${styleItem.amountColumn} ${styles.amountItem}`}>{amount}</span>
        <span className={`${styleItem.invoiceDateColumn} ${styles.invoiceDateItem}`}>
          {invoiceDate}
        </span>
        <span className={`${styleItem.dueDateColumn} ${styles.dueDateItem}`}>{dueDate}</span>
        <div className={styleItem.statusColumn}>
          <Status title={status} status={status} />
        </div>
        <div className={styleItem.typeColumn}>
          <Type type={type} />
        </div>
        {!isClientView && (
          <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
            {access && access.view === 0 ? (
              <div style={{ display: 'none' }} />
            ) : (
              <CustomMiniButton
                style='mint'
                icon='/icons/view.svg'
                alt='View'
                tooltipTitle='View'
                onClick={handleNavigateViewInvoice}
              />
            )}
            {access && access.edit === 0 && !blockEdit ? (
              <div style={{ display: 'none' }} />
            ) : (
              <CustomMiniButton
                style='amber'
                icon='/icons/edit.svg'
                alt='Edit'
                tooltipTitle='Edit'
                onClick={handleNavigateEditInvoice}
              />
            )}
            {access && access.delete === 0 ? (
              <div style={{ display: 'none' }} />
            ) : (
              <CustomMiniButton
                style='cherry'
                icon='/icons/trash.svg'
                alt='Delete'
                tooltipTitle='Delete'
                onClick={handleOpenConfirmationModal}
              />
            )}
          </div>
        )}
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
