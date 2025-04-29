import { useEffect, useState } from 'react'

import {
  AccountingDepositExpenseForm,
  AccountingInputData,
} from '../../../../app/constants/constants'
import { AddExpenseFields } from '../../../../features/Admin/AccountingPage/NewExpensePage/AddExpenseFields/AddExpenseFields'
import { RecentExpense } from '../../../../features/Admin/AccountingPage/NewExpensePage/RecentExpense/RecentExpense'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getAccountingInputData } from '../../../../shared/utils/api/Admin/Accounting/GetAccountingInputData'
import { postAddNewTransaction } from '../../../../shared/utils/api/Admin/Accounting/PostAddNewTransaction'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './NewExpensePage.module.scss'

export const AdminNewExpensePage = () => {
  const [form, setForm] = useState<Partial<AccountingDepositExpenseForm>>(
    {},
  )
  const [inputData, setInputData] = useState<AccountingInputData | null>(
    null,
  )

  const showToast = useCustomToast()

  const getInputData = async () => {
    const response: AccountingInputData = await getAccountingInputData(
      'Expense',
    )

    setInputData(response)
  }

  const addNewTransaction = async () => {
    const response = await postAddNewTransaction(form, 'Expense')

    if (response.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully created a Expense',
        status: 'success',
      })
      await getInputData()
    } else {
      showToast({
        title: 'Error',
        description: response.message,
        status: 'error',
      })
    }
  }

  useEffect(() => {
    document.title = 'infiniti | New Expense'
  }, [])

  useEffect(() => {
    getInputData()
  }, [])

  return (
    <div className={styles.wrapper}>
      {inputData ? (
        <section className={styles.section}>
          <RecentCard style={styles.cardFirst} title='Add Expense'>
            <AddExpenseFields
              inputData={inputData}
              setForm={setForm}
              addNewTransaction={addNewTransaction}
            />
          </RecentCard>
          {inputData.access.view === 1 && inputData.transaction && (
            <RecentCard style={styles.cardSecond} title='Recent Expense'>
              <RecentExpense transactions={inputData.transaction} />
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
