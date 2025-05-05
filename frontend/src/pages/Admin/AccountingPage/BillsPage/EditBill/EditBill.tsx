import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

import {
  AccountingBillsForm,
  AccountingInputData,
} from '../../../../../app/constants/constants'
import { Fields } from '../../../../../features/Admin/AccountingPage/Bills/Pages/EditBillPage/Fields/Fields'
import { useCustomToast } from '../../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getAccountingInputData } from '../../../../../shared/utils/api/Admin/Accounting/GetAccountingInputData'
import { getBill } from '../../../../../shared/utils/api/Admin/Accounting/GetBill'
import { putEditBill } from '../../../../../shared/utils/api/Admin/Accounting/PutEditBill'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'
import styles from './EditBill.module.scss'

const extractIdFromUrl = (url: string): number | null => {
  const regex = /\/bill\/(\d+)$/
  const match = url.match(regex)

  return match ? parseInt(match[1], 10) : null
}

const useIdFromUrl = () => {
  const location = useLocation()

  return useMemo(
    () => extractIdFromUrl(location.pathname),
    [location.pathname],
  )
}

export const AdminEditBillPage = () => {
  const [form, setForm] = useState<AccountingBillsForm | null>(null)
  const [inputData, setInputData] = useState<AccountingInputData | null>(
    null,
  )

  const id = useIdFromUrl()
  const showToast = useCustomToast()

  const getInputData = async () => {
    const response: AccountingInputData = await getAccountingInputData(
      'Expense',
    )

    setInputData(response)
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const getSelectedBill = async () => {
    if (!id) return

    const response = await getBill(id)
    const {
      id: _,
      isPaid,
      client,
      currency,
      category,
      account,
      ...rest
    } = response.data

    setForm({
      ...rest,
      client: client?.id ?? null,
      currency: currency?.id ?? null,
      category: category?.id ?? null,
      account: account?.id ?? null,
    })
  }

  const handleEditBillSubmit = async () => {
    if (!id || !form) return

    const response = await putEditBill(id, form)

    if (response.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully changed Bill',
        status: 'success',
      })
    } else {
      showToast({
        title: 'Error',
        description: response.message,
        status: 'error',
      })
    }
  }

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
