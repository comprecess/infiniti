import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { RolesAccess } from '../../../../../../app/constants/constants'
import { Routes } from '../../../../../../app/router/routes'
import { ConfirmationModal } from '../../../../../../shared/ui/ConfirmationModal/ConfirmationModal'
import { CustomMiniButton } from '../../../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import styleItem from '../RecentExpenses.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  id: number
  code: string
  date: string
  account: string
  type: string
  amount: string
  description: string
  access: RolesAccess
  deleteExpense: (id: number) => void
}

export const Item = ({
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
    navigate(
      `/${Routes.adminPages}/${Routes.accounting}/${Routes.edit}/${Routes.transaction}/${id}`,
    )
  }

  return (
    <>
      {' '}
      <div className={styles.wrapper}>
        <span className={`${styleItem.idColumn} ${styles.idItem}`}>
          {code}
        </span>
        <span className={`${styleItem.dateColumn} ${styles.dateItem}`}>
          {date}
        </span>
        <span
          className={`${styleItem.accountColumn} ${styles.accountItem}`}
        >
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
        <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
          {access.edit === 1 && (
            <CustomMiniButton
              style='amber'
              icon='/icons/edit.svg'
              alt='Edit'
              tooltipTitle='Edit'
              onClick={handleNavigateToEdit}
            />
          )}
          {access.delete === 1 && (
            <CustomMiniButton
              style='cherry'
              icon='/icons/trash.svg'
              alt='Delete'
              tooltipTitle='Delete'
              onClick={handleSetModalDelete}
            />
          )}
        </div>
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
