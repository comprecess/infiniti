import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Routes } from '../../../../app/router/routes'
import { TableAccounts } from '../../../../features/Admin/AccountingPage/AccountsPage/TableAccounts/TableAccounts'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { Search } from '../../../../shared/ui/Search/Search'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './AccountsPage.module.scss'

export const AdminAccountsPage = () => {
  const navigate = useNavigate()

  const handleNavigateNewAccount = () => {
    navigate(
      `/${Routes.adminPages}/${Routes.accounting}/${Routes.newAccount}`,
    )
  }

  useEffect(() => {
    document.title = 'infiniti | Accounts'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <RecentCard
          style={styles.recentFullScreen}
          title='Manage Accounts'
          HeaderComponent={Search}
          headerProps={{ style: styles.search, onSearchChange: () => {} }}
          Component={ButtonBlue}
          componentProps={{
            titleNone: true,
            title: 'New Account',
            icon: '/icons/plus.svg',
            style: styles.buttonPlus,
            onClick: handleNavigateNewAccount,
          }}
        >
          <TableAccounts />
        </RecentCard>
      </section>
    </div>
  )
}
