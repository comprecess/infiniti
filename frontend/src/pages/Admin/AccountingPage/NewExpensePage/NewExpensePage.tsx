import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './NewExpensePage.module.scss'
import {
  AccountingDepositExpenseForm,
  AccountingInputData,
  CompaniesListProps,
  RolesAccess,
} from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import { AddExpenseFields } from '../../../../features/Admin/AccountingPage/NewExpensePage/AddExpenseFields/AddExpenseFields'
import { RecentExpense } from '../../../../features/Admin/AccountingPage/NewExpensePage/RecentExpense/RecentExpense'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getAccountingInputData } from '../../../../shared/utils/api/Admin/Accounting/get-accounting-input-data'
import { getTransactionsInputDataClient } from '../../../../shared/utils/api/Admin/Accounting/get-transactions-input-data-client'
import { postCreateNewTransaction } from '../../../../shared/utils/api/Admin/Accounting/post-create-new-transaction'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'

export const AdminNewExpensePage = () => {
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
  const navigate = useNavigate()

  const urlParams = new URLSearchParams(window.location.search)
  const isCreateForProject = urlParams.has('create-for-project')
  const projectId = urlParams.get('create-for-project')

  const getInputData = async () => {
    const response = await getAccountingInputData('Expense')

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
      isCreateForProject
        ? `${import.meta.env.VITE_RESIDENT_PROJECTS_API}/${projectId}/expenses`
        : import.meta.env.VITE_ACCOUNTING_ADD_NEW_TRANSACTION,
      form,
      'Expense',
    )

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully created a Expense',
        status: 'success',
      })

      if (isCreateForProject) {
        navigate(
          `/${Routes.adminPages}/${Routes.projects}/${Routes.view}/${Routes.project}/${projectId}/${Routes.expenses}`,
        )
      } else {
        await getInputData()
      }
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  useEffect(() => {
    document.title = 'infiniti | New Expense'
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
            <RecentCard style={styles.cardFirst} title='Add Expense'>
              <AddExpenseFields
                inputDataClients={inputDataClients}
                form={form}
                inputData={inputData}
                setForm={setForm}
                addNewTransaction={addNewTransaction}
              />
            </RecentCard>
          )}
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
