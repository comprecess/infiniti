import { useEffect, useState } from 'react'

import {
  AccountingInputData,
  AccountingTransferForm,
} from '../../../../app/constants/constants'
import { NewTransferFields } from '../../../../features/Admin/AccountingPage/TransferPage/NewTransferFields/NewTransferFields'
import { RecentTransfers } from '../../../../features/Admin/AccountingPage/TransferPage/RecentTransfers/RecentTransfers'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getAccountingInputData } from '../../../../shared/utils/api/Admin/Accounting/get-accounting-input-data'
import { postCreateNewTransfer } from '../../../../shared/utils/api/Admin/Accounting/post-create-new-transfer'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './TransferPage.module.scss'

export const AdminTransferPage = () => {
  const [form, setForm] = useState<Partial<AccountingTransferForm>>({})
  const [inputData, setInputData] = useState<AccountingInputData | null>(
    null,
  )

  const showToast = useCustomToast()

  const getInputData = async () => {
    const response = await getAccountingInputData('Out')

    if (!response.status) return

    setInputData(response.data)
  }

  const addNewTransfer = async () => {
    const { status, message } = await postCreateNewTransfer(form)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully created a Transfer',
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
    document.title = 'infiniti | Transfer'
  }, [])

  useEffect(() => {
    getInputData()
  }, [])

  return (
    <div className={styles.wrapper}>
      {inputData ? (
        <section className={styles.section}>
          <RecentCard style={styles.cardFirst} title='New Transfer'>
            <NewTransferFields
              inputData={inputData}
              setForm={setForm}
              addNewTransfer={addNewTransfer}
            />
          </RecentCard>
          {inputData.access.view === 1 && inputData.transaction && (
            <RecentCard style={styles.cardSecond} title='Recent Transfers'>
              <RecentTransfers transactions={inputData.transaction} />
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
