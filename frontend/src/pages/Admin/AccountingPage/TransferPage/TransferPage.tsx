import { useEffect, useState } from 'react'

import {
  AccountingInputData,
  AccountingTransferForm,
} from '../../../../app/constants/constants'
import { NewTransferFields } from '../../../../features/Admin/AccountingPage/TransferPage/NewTransferFields/NewTransferFields'
import { RecentTransfers } from '../../../../features/Admin/AccountingPage/TransferPage/RecentTransfers/RecentTransfers'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getAccountingInputData } from '../../../../shared/utils/api/Admin/Accounting/GetAccountingInputData'
import { postAddNewTransfer } from '../../../../shared/utils/api/Admin/Accounting/PostAddNewTransfer'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './TransferPage.module.scss'

export const AdminTransferPage = () => {
  const [form, setForm] = useState<Partial<AccountingTransferForm>>({})
  const [inputData, setInputData] = useState<AccountingInputData | null>(
    null,
  )

  const showToast = useCustomToast()

  const getInputData = async () => {
    const response: AccountingInputData = await getAccountingInputData(
      'Out',
    )

    setInputData(response)
  }

  const addNewTransfer = async () => {
    const response = await postAddNewTransfer(form)

    if (response.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully created a Transfer',
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
