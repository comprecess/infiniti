import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { AccountingAccountForm } from '../../../../../app/constants/constants'
import { Routes } from '../../../../../app/router/routes'
import { EditAccountFields } from '../../../../../features/Admin/AccountingPage/AccountsPage/EditAccount/EditAccountFields/EditAccountFields'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getInfoSelectedAccount } from '../../../../../shared/utils/api/Admin/Accounting/GetInfoSelectedAccount'
import { putAccountSelectedInfo } from '../../../../../shared/utils/api/Admin/Accounting/PutAccountSelectedInfo'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'
import styles from './EditAccountPage.module.scss'

const extractIdFromUrl = (url: string): number | null => {
  const regex = /\/account\/(\d+)$/
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

export const AdminEditAccountPage = () => {
  const [form, setForm] = useState<AccountingAccountForm | null>(null)

  const id = useIdFromUrl()
  const showToast = useCustomToast()
  const navigate = useNavigate()

  const getInfo = async () => {
    if (!id) return

    const response: { data: AccountingAccountForm } =
      await getInfoSelectedAccount(id)

    setForm(response.data)
  }

  const handleEditAccount = async () => {
    if (!id || !form) return

    const { status, message } = await putAccountSelectedInfo(id, form)

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
