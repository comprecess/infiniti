import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AccountingAccountsInputData } from '../../../../../../app/constants/constants'
import { Routes } from '../../../../../../app/router/routes'
import { ConfirmationModal } from '../../../../../../shared/ui/ConfirmationModal/ConfirmationModal'
import { CustomMiniButton } from '../../../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import styleItem from '../TableAccounts.module.scss'
import styles from './Item.module.scss'
import { RecordInitialModal } from './RecordInitialModal/RecordInitialModal'

interface ItemProps {
  id: number
  name: string
  balance: {
    Equity: string
    Expense: string
    Income: string
    Total: string
  }
  inputData: AccountingAccountsInputData
  addRecordInitialBalanceAccount: (
    id: number,
    form: {
      balance: { amount: string; currency: number }[]
    },
  ) => void
  deleteAccount: (id: number) => void
}

export const Item = ({
  id,
  name,
  balance,
  inputData,
  addRecordInitialBalanceAccount,
  deleteAccount,
}: ItemProps) => {
  const [modalDelete, setModalDelete] = useState<boolean>(false)
  const [modalRecordInitial, setModalRecordInitial] =
    useState<boolean>(false)

  const navigate = useNavigate()

  const handleOpenConfirmationModal = () => {
    setModalDelete(state => !state)
  }

  const handleOpenRecordInitialModal = () => {
    setModalRecordInitial(state => !state)
  }

  const handleNavigateEditAccount = () => {
    navigate(
      `/${Routes.adminPages}/${Routes.accounting}/${Routes.edit}/${Routes.account}/${id}`,
    )
  }

  const handleDeleteAccount = () => {
    deleteAccount(id)
    handleOpenConfirmationModal()
  }

  const handleRecordInitialBalanceAccount = (form: {
    balance: { amount: string; currency: number }[]
  }) => {
    addRecordInitialBalanceAccount(id, form)
    handleOpenRecordInitialModal()
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
          {balance && balance.Equity && (
            <span>{`Equity (Initial balance): ${balance.Equity}`}</span>
          )}
          {balance && balance.Income && (
            <span>{`Total in: ${balance.Income}`}</span>
          )}
          {balance && balance.Expense && (
            <span>{`Total out: ${balance.Expense}`}</span>
          )}
          {balance && balance.Total && (
            <span style={{ marginTop: '16px' }}>
              {`Balance (in home currency) : ${balance.Total}`}
            </span>
          )}
        </div>
        <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
          <CustomMiniButton
            style='mint'
            icon='/icons/plus.svg'
            alt='Record initial balance'
            tooltipTitle='Record initial balance'
            onClick={handleOpenRecordInitialModal}
          />
          <CustomMiniButton
            style='amber'
            icon='/icons/edit.svg'
            alt='Edit'
            tooltipTitle='Edit'
            onClick={handleNavigateEditAccount}
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
      {modalRecordInitial && (
        <RecordInitialModal
          inputData={inputData}
          isOpened={modalRecordInitial}
          handleOpenCloseModal={handleOpenRecordInitialModal}
          agree={handleRecordInitialBalanceAccount}
        />
      )}
    </>
  )
}
