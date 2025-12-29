import { useEffect, useState } from 'react'

import styles from './NewDepositPage.module.scss'
import {
  AccountingDepositExpenseForm,
  AccountingInputData,
  CompaniesListProps,
  RolesAccess,
} from '../../../../app/constants/constants'
import { AddDepositFields } from '../../../../features/Admin/AccountingPage/NewDepositPage/AddDepositFields/AddDepositFields'
import { RecentDeposits } from '../../../../features/Admin/AccountingPage/NewDepositPage/RecentDeposits/RecentDeposits'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getAccountingInputData } from '../../../../shared/utils/api/Admin/Accounting/get-accounting-input-data'
import { getTransactionsInputDataClient } from '../../../../shared/utils/api/Admin/Accounting/get-transactions-input-data-client'
import { postCreateNewTransaction } from '../../../../shared/utils/api/Admin/Accounting/post-create-new-transaction'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'

export const AdminNewDepositPage = () => {
  const [form, setForm] = useState<Partial<AccountingDepositExpenseForm>>({})
  const [inputData, setInputData] = useState<AccountingInputData | null>(null)
  const [inputDataClients, setInputDataClients] = useState<
  | {
    id: number
    account: string
    company: CompaniesListProps | null
  }[]
  | null
  >(null)
  const [access, setAccess] = useState<RolesAccess | null>(null)

  const showToast = useCustomToast()

  const getInputData = async () => {
    const response = await getAccountingInputData()

    if (!response.status) return

    setInputData(response.data)
    setAccess(response.data.access)
  }

  const getInputDataClients = async () => {
    const response = await getTransactionsInputDataClient()

    if (!response.status) return

    setInputDataClients(response.data.data)
  }

  const addNewTransaction = async () => {
    const { status, message } = await postCreateNewTransaction(
      import.meta.env.VITE_ACCOUNTING_ADD_NEW_TRANSACTION,
      form,
      'Income',
    )

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully created a Deposit',
        status: 'success',
      })
      await getInputData()
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  useEffect(() => {
    document.title = 'infiniti | New Deposit'
  }, [])

  useEffect(() => {
    getInputData()
    getInputDataClients()
  }, [])

  return (
    <div className={styles.wrapper}>
      {inputDataClients && access && inputData ? (
        <section className={styles.section}>
          {access.create === 1 && (
            <RecentCard style={styles.cardFirst} title='Add Deposit'>
              <AddDepositFields
                inputDataClients={inputDataClients}
                form={form}
                inputData={inputData}
                setForm={setForm}
                addNewTransaction={addNewTransaction}
              />
            </RecentCard>
          )}
          {inputData.access.view === 1 && inputData.transaction && (
            <RecentCard style={styles.cardSecond} title='Recent Deposits'>
              <RecentDeposits transactions={inputData.transaction} />
            </RecentCard>
          )}
        </section>
      ) : (
        <div className={styles.loading}>
          <LoadingSpinner size='xl' />
        </div>
      )}
    </div>
  )
}
