import { useState } from 'react'

import { ConfirmationModal } from '../../../../../../shared/ui/ConfirmationModal/ConfirmationModal'
import { CustomMiniButton } from '../../../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import styleItem from '../TableAccounts.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  id: number
  name: string
  balance: {
    Equity: string
    Expense: string
    Income: string
    Total: string
  }
  deleteAccount: (id: number) => void
}

export const Item = ({ id, name, balance, deleteAccount }: ItemProps) => {
  const [modalDelete, setModalDelete] = useState<boolean>(false)

  const handleOpenConfirmationModal = () => {
    setModalDelete(state => !state)
  }

  const handleDeleteAccount = () => {
    deleteAccount(id)
    handleOpenConfirmationModal()
  }

  return (
    <>
      <div className={styles.wrapper}>
        <span className={`${styleItem.accountColumn} ${styles.nameItem}`}>
          {name}
        </span>
        <div
          className={`${styleItem.balanceColumn} ${styles.balanceContainer}`}
        >
          <span>{`Equity (Initial balance): ${balance.Equity}`}</span>
          <span>{`Total in: ${balance.Income}`}</span>
          <span>{`Total out: ${balance.Expense}`}</span>
          <span style={{ marginTop: '16px' }}>
            {`Balance (in home currency) : ${balance.Total}`}
          </span>
        </div>
        <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
          <CustomMiniButton
            style='mint'
            icon='/icons/plus.svg'
            alt='Record initial balance'
            tooltipTitle='Record initial balance'
            onClick={() => {}}
          />
          <CustomMiniButton
            style='amber'
            icon='/icons/edit.svg'
            alt='Edit'
            tooltipTitle='Edit'
            onClick={() => {}}
          />
          <CustomMiniButton
            style='cherry'
            icon='/icons/trash.svg'
            alt='Delete'
            tooltipTitle='Delete'
            onClick={handleOpenConfirmationModal}
          />
        </div>
      </div>
      {modalDelete && (
        <ConfirmationModal
          isOpened={modalDelete}
          handleOpenCloseModal={handleOpenConfirmationModal}
          agree={handleDeleteAccount}
        />
      )}
    </>
  )
}
