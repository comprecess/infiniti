import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  AccountingAccountsForm,
  AccountingAccountsInputData,
} from '../../../../../app/constants/constants'
import { Routes } from '../../../../../app/router/routes'
import { NewAccountFields } from '../../../../../features/Admin/AccountingPage/NewAccount/NewAccountFields/NewAccountFields'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getAccountsInputData } from '../../../../../shared/utils/api/Admin/Accounting/GetAccountsInputData'
import { postCreateNewAccount } from '../../../../../shared/utils/api/Admin/Accounting/PostCreateNewAccount'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'
import styles from './NewAccountPage.module.scss'

export const AdminNewAccountPage = () => {
  const [form, setForm] = useState<Partial<AccountingAccountsForm>>({})
  const [inputData, setInputData] =
    useState<AccountingAccountsInputData | null>(null)

  const showToast = useCustomToast()
  const navigate = useNavigate()

  const getInputData = async () => {
    const response: AccountingAccountsInputData =
      await getAccountsInputData()

    setInputData(response)
  }

  const handleCreateNewAccount = async () => {
    const response = await postCreateNewAccount(form)

    if (response.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully created a new Account.',
        status: 'success',
      })
      navigate(
        `/${Routes.adminPages}/${Routes.accounting}/${Routes.accounts}`,
      )
    } else {
      showToast({
        title: 'Error',
        description: response.message,
        status: 'error',
      })
    }
  }

  useEffect(() => {
    document.title = 'infiniti | New Account'
  }, [])

  useEffect(() => {
    getInputData()
  }, [])

  return (
    <div className={styles.wrapper}>
      {inputData ? (
        <section className={styles.section}>
          <RecentCard
            title='Add New Account'
            style={styles.recentFullScreen}
            Component={ButtonBlue}
            componentProps={{
              titleNone: true,
              title: 'Save',
              icon: '/icons/fileWhite.svg',
              iconProps: styles.buttonSaveIcon,
              style: styles.buttonSave,
              onClick: handleCreateNewAccount,
            }}
          >
            <NewAccountFields inputData={inputData} setForm={setForm} />
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
