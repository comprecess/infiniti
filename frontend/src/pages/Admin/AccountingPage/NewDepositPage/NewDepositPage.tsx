import { useEffect, useState } from 'react'

import {
  AccountingDepositExpenseForm,
  AccountingInputData,
  RolesAccess,
} from '../../../../app/constants/constants'
import { AddDepositFields } from '../../../../features/Admin/AccountingPage/NewDepositPage/AddDepositFields/AddDepositFields'
import { RecentDeposits } from '../../../../features/Admin/AccountingPage/NewDepositPage/RecentDeposits/RecentDeposits'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getAccountingInputData } from '../../../../shared/utils/api/Admin/Accounting/get-accounting-input-data'
import { postCreateNewTransaction } from '../../../../shared/utils/api/Admin/Accounting/post-create-new-transaction'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './NewDepositPage.module.scss'

export const AdminNewDepositPage = () => {
  const [form, setForm] = useState<Partial<AccountingDepositExpenseForm>>(
    {},
  )
  const [inputData, setInputData] = useState<AccountingInputData | null>(
    null,
  )
  const [access, setAccess] = useState<RolesAccess | null>(null)

  const showToast = useCustomToast()

  const getInputData = async () => {
    const response = await getAccountingInputData()

    if (!response.status) return

    setInputData(response.data)
    setAccess(response.data.access)
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
  }, [])

  return (
    <div className={styles.wrapper}>
      {access && inputData ? (
        <section className={styles.section}>
          {access.create === 1 && (
            <RecentCard style={styles.cardFirst} title='Add Deposit'>
              <AddDepositFields
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
