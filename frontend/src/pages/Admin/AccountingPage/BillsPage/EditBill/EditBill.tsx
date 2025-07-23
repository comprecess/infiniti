import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  AccountingBillsForm,
  AccountingInputData,
} from '../../../../../app/constants/constants'
import { Routes } from '../../../../../app/router/routes'
import { Fields } from '../../../../../features/Admin/AccountingPage/Bills/Pages/EditBillPage/Fields/Fields'
import { useCustomToast } from '../../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getAccountingInputData } from '../../../../../shared/utils/api/Admin/Accounting/get-accounting-input-data'
import { getBill } from '../../../../../shared/utils/api/Admin/Accounting/get-bill'
import { putUpdateBill } from '../../../../../shared/utils/api/Admin/Accounting/put-update-bill'
import { useIdFromUrl } from '../../../../../shared/utils/usefulMethods'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'
import styles from './EditBill.module.scss'

export const AdminEditBillPage = () => {
  const [form, setForm] = useState<AccountingBillsForm | null>(null)
  const [inputData, setInputData] = useState<AccountingInputData | null>(
    null,
  )

  const id = useIdFromUrl('bill')
  const navigate = useNavigate()
  const showToast = useCustomToast()

  const getInputData = async () => {
    const response = await getAccountingInputData('Expense')

    if (!response.status) return

    setInputData(response.data)
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const getSelectedBill = async () => {
    if (!id) return

    const response = await getBill(id)

    if (!response.status) return

    const {
      id: _,
      amountFloat: amount,
      isPaid,
      client,
      currency,
      category,
      account,
      website,
      ...rest
    } = response.data.data

    setForm({
      ...rest,
      client: client?.id ?? null,
      amount,
      currency: currency?.id ?? null,
      category: category?.id ?? null,
      account: account?.id ?? null,
      website: website ?? '',
    })
  }

  const handleEditBillSubmit = async () => {
    if (!id || !form) return

    const { status, message } = await putUpdateBill(id, form)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully changed Bill',
        status: 'success',
      })
      navigate(
        `/${Routes.adminPages}/${Routes.accounting}/${Routes.bills}?filterStatus=Summary`,
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
    document.title = 'infiniti | Edit Bill'
  }, [])

  useEffect(() => {
    getInputData()
    getSelectedBill()
  }, [id])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {form && inputData ? (
          <RecentCard title='Edit Bill' style={styles.recentFullScreen}>
            <Fields
              inputData={inputData}
              form={form}
              setForm={setForm}
              editBill={handleEditBillSubmit}
            />
          </RecentCard>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
    </div>
  )
}
