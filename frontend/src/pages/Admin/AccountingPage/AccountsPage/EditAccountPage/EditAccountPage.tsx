import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './EditAccountPage.module.scss'
import { AccountingAccountForm } from '../../../../../app/constants/constants'
import { Routes } from '../../../../../app/router/routes'
import { EditAccountFields } from '../../../../../features/Admin/AccountingPage/AccountsPage/EditAccount/EditAccountFields/EditAccountFields'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getSelectedAccountInfo } from '../../../../../shared/utils/api/Admin/Accounting/get-selected-account-info'
import { putUpdateAccountInfo } from '../../../../../shared/utils/api/Admin/Accounting/put-update-account-info'
import { useIdFromUrl } from '../../../../../shared/utils/usefulMethods'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'

export const AdminEditAccountPage = () => {
  const [form, setForm] = useState<AccountingAccountForm | null>(null)

  const id = useIdFromUrl('account')
  const showToast = useCustomToast()
  const navigate = useNavigate()

  const getInfo = async () => {
    if (!id) return

    const response = await getSelectedAccountInfo(id)

    if (!response.status) return

    setForm(response.data.data)
  }

  const handleEditAccount = async () => {
    if (!id || !form) return

    const { status, message } = await putUpdateAccountInfo(id, form)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully changed Account',
        status: 'success',
      })
      navigate(
        `/${Routes.adminPages}/${Routes.accounting}/${Routes.accounts}`,
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
    getInfo()
  }, [id])

  return (
    <div className={styles.wrapper}>
      {form ? (
        <section className={styles.section}>
          <RecentCard
            title='Edit Account'
            style={styles.recentFullScreen}
            Component={ButtonBlue}
            componentProps={{
              titleNone: true,
              title: 'Save',
              icon: '/icons/fileWhite.svg',
              iconProps: styles.buttonSaveIcon,
              style: styles.buttonSave,
              onClick: handleEditAccount,
            }}
          >
            <EditAccountFields form={form} setForm={setForm} />
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
