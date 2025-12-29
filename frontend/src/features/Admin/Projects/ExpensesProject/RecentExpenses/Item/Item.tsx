import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './Item.module.scss'
import { RolesAccess } from '../../../../../../app/constants/constants'
import { Routes } from '../../../../../../app/router/routes'
import { ConfirmationModal } from '../../../../../../shared/ui/ConfirmationModal/ConfirmationModal'
import { CustomMiniButton } from '../../../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import styleItem from '../RecentExpenses.module.scss'

interface ItemProps {
  isClientView: boolean
  id: number
  code: string
  date: string
  account: string
  type: string
  amount: string
  description: string
  access: RolesAccess | undefined
  deleteExpense: (id: number) => void
}

export const Item = ({
  isClientView,
  id,
  code,
  date,
  account,
  type,
  amount,
  description,
  access,
  deleteExpense,
}: ItemProps) => {
  const [modalDelete, setModalDelete] = useState<boolean>(false)

  const handleSetModalDelete = () => {
    setModalDelete(state => !state)
  }

  const navigate = useNavigate()

  const handleNavigateToEdit = () => {
    if (isClientView) return

    navigate(
      `/${Routes.adminPages}/${Routes.accounting}/${Routes.edit}/${Routes.transaction}/${id}`,
    )
  }

  return (
    <>
      <div className={styles.wrapper}>
        <span className={`${styleItem.idColumn} ${styles.idItem}`}>{code}</span>
        <span className={`${styleItem.dateColumn} ${styles.dateItem}`}>{date}</span>
        <span className={`${styleItem.accountColumn} ${styles.accountItem}`}>{account}</span>
        <span className={`${styleItem.typeColumn} ${styles.typeItem}`}>{type}</span>
        <span className={`${styleItem.amountColumn} ${styles.amountItem}`}>{amount}</span>
        <span className={`${styleItem.descriptionColumn} ${styles.descriptionItem}`}>
          {description}
        </span>
        {!isClientView && (
          <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
            {access && access.edit === 0 ? (
              <div style={{ display: 'none' }} />
            ) : (
              <CustomMiniButton
                style='amber'
                icon='/icons/edit.svg'
                alt='Edit'
                tooltipTitle='Edit'
                onClick={handleNavigateToEdit}
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
                onClick={handleSetModalDelete}
              />
            )}
          </div>
        )}
      </div>
      {modalDelete && (
        <ConfirmationModal
          isOpened={modalDelete}
          handleOpenCloseModal={handleSetModalDelete}
          agree={() => deleteExpense(id)}
        />
      )}
    </>
  )
}
