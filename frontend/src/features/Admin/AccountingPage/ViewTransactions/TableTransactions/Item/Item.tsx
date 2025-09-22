import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './Item.module.scss'
import { RolesAccess } from '../../../../../../app/constants/constants'
import { Routes } from '../../../../../../app/router/routes'
import { ConfirmationModal } from '../../../../../../shared/ui/ConfirmationModal/ConfirmationModal'
import { CustomMiniButton } from '../../../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import styleItem from '../TableTransactions.module.scss'

interface ItemProps {
  id: number
  date: string
  account: string
  description: string
  dr: string
  cr: string
  access: RolesAccess
  deleteTransaction: (id: number) => void
}

export const Item = ({
  id,
  date,
  account,
  description,
  dr,
  cr,
  access,
  deleteTransaction,
}: ItemProps) => {
  const [modalDelete, setModalDelete] = useState<boolean>(false)

  const navigate = useNavigate()

  const handleOpenConfirmationModal = () => {
    setModalDelete(state => !state)
  }

  const handleNavigateToEditTransaction = () => {
    navigate(
      `/${Routes.adminPages}/${Routes.accounting}/${Routes.edit}/${Routes.transaction}/${id}`,
    )
  }

  const handleDeleteTransaction = () => {
    deleteTransaction(id)
    handleOpenConfirmationModal()
  }

  return (
    <>
      <div className={styles.wrapper}>
        <span className={`${styleItem.idColumn} ${styles.idItem}`}>
          {id}
        </span>
        <span className={`${styleItem.dateColumn} ${styles.dateItem}`}>
          {date}
        </span>
        <span
          className={`${styleItem.accountColumn} ${styles.accountItem}`}
        >
          {account}
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
          {access.edit === 1 && (
            <CustomMiniButton
              style='amber'
              icon='/icons/edit.svg'
              alt='Edit'
              tooltipTitle='Edit'
              onClick={handleNavigateToEditTransaction}
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
          agree={handleDeleteTransaction}
        />
      )}
    </>
  )
}
