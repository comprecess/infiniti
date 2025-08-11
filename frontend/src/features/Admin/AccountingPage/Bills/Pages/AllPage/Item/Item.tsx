import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { RolesAccess } from '../../../../../../../app/constants/constants'
import { Routes } from '../../../../../../../app/router/routes'
import { ConfirmationModal } from '../../../../../../../shared/ui/ConfirmationModal/ConfirmationModal'
import { CustomMiniButton } from '../../../../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import styleItem from '../AllPage.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  id: number
  title: string
  amount: string
  nextDate: string
  access: RolesAccess
  deleteBill: (idBill: number) => void
}

export const Item = ({
  id,
  title,
  amount,
  nextDate,
  access,
  deleteBill,
}: ItemProps) => {
  const [modalDelete, setModalDelete] = useState<boolean>(false)

  const navigate = useNavigate()

  const handleOpenConfirmationModal = () => {
    setModalDelete(state => !state)
  }

  const handleDeleteBill = () => {
    deleteBill(id)
    handleOpenConfirmationModal()
  }

  const navigateToEditBill = () => {
    navigate(
      `/${Routes.adminPages}/${Routes.accounting}/${Routes.bills}/${Routes.edit}/${Routes.bill}/${id}`,
    )
  }

  return (
    <>
      <div className={styles.wrapper}>
        <span className={`${styleItem.titleColumn} ${styles.titleItem}`}>
          {title}
        </span>
        <span className={`${styleItem.amountColumn} ${styles.amountItem}`}>
          {amount}
        </span>
        <span className={`${styleItem.dueColumn} ${styles.dueItem}`}>
          {nextDate}
        </span>
        <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
          {access.edit === 1 && (
            <CustomMiniButton
              style='amber'
              icon='/icons/edit.svg'
              alt='Edit'
              tooltipTitle='Edit'
              onClick={navigateToEditBill}
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
          agree={handleDeleteBill}
        />
      )}
    </>
  )
}
