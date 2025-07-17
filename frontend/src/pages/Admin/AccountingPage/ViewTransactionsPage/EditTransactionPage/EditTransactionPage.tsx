import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  AccountingInputData,
  AccountingTransactionsForm,
} from '../../../../../app/constants/constants'
import { Routes } from '../../../../../app/router/routes'
import { Fields } from '../../../../../features/Admin/AccountingPage/ViewTransactions/EditTransaction/Fields/Fields'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getAccountingInputData } from '../../../../../shared/utils/api/Admin/Accounting/get-accounting-input-data'
import { getSelectedTransactionInfo } from '../../../../../shared/utils/api/Admin/Accounting/get-selected-transaction-info'
import { putUpdateTransaction } from '../../../../../shared/utils/api/Admin/Accounting/put-update-transaction'
import { useIdFromUrl } from '../../../../../shared/utils/usefulMethods'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'
import styles from './EditTransactionPage.module.scss'

export const AdminEditTransactionPage = () => {
  const [form, setForm] = useState<AccountingTransactionsForm | null>(null)
  const [inputData, setInputData] = useState<AccountingInputData | null>(
    null,
  )

  const id = useIdFromUrl('transaction')
  const showToast = useCustomToast()
  const navigate = useNavigate()

  const getInputData = async () => {
    const response = await getAccountingInputData('Income')

    if (!response.status) return

    setInputData(response.data)
  }

  const getSelectedTransaction = async () => {
    if (!id) return

    const response = await getSelectedTransactionInfo(id)

    if (!response.status) return

    const {
      account,
      category,
      tags,
      company,
      payer,
      staff,
      payMethods,
      ref,
      ...rest
    } = response.data.data

    setForm({
      ...rest,
      tags: Array.isArray(tags) ? tags.map(tag => tag.name) : [],
      referralLink: ref ?? null,
      company: company?.id ?? null,
      category: category?.id ?? null,
      account: account?.id ?? null,
      client: payer?.id ?? null,
      staff: staff?.id ?? null,
      payMethods: payMethods?.id ?? null,
    })
  }

  const handleEditTransactionSubmit = async () => {
    if (!id || !form) return

    const { status, message } = await putUpdateTransaction(id, form)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully changed Transaction',
        status: 'success',
      })
      navigate(
        `/${Routes.adminPages}/${Routes.accounting}/${Routes.view}/${Routes.transactions}`,
      )
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  useEffect(() => {
    getInputData()
    getSelectedTransaction()
  }, [id])

  return (
    <div className={styles.wrapper}>
      {form && inputData ? (
        <section className={styles.section}>
          <RecentCard
            title='Edit Transaction'
            style={styles.recentFullScreen}
            Component={ButtonBlue}
            componentProps={{
              titleNone: true,
              title: 'Save',
              icon: '/icons/fileWhite.svg',
              iconProps: styles.buttonSaveIcon,
              style: styles.buttonSave,
              onClick: handleEditTransactionSubmit,
            }}
          >
            <Fields form={form} inputData={inputData} setForm={setForm} />
          </RecentCard>
        </section>
      ) : (
        <div className={styles.loading}>
          <LoadingSpinner size='xl' />
        </div>
      )}
    </div>
  )
}
