import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AccountingAccountsData } from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import { TableAccounts } from '../../../../features/Admin/AccountingPage/AccountsPage/TableAccounts/TableAccounts'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { Search } from '../../../../shared/ui/Search/Search'
import { deleteAccount } from '../../../../shared/utils/api/Admin/Accounting/DeleteAccount'
import { getAllAccounts } from '../../../../shared/utils/api/Admin/Accounting/GetAllAccounts'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './AccountsPage.module.scss'

export const AdminAccountsPage = () => {
  const [search, setSearch] = useState<string>('')
  const [sortName, setSortName] = useState<string>('name')
  const [sortType, setSortType] = useState<number>(0)

  const navigate = useNavigate()
  const showToast = useCustomToast()
  const queryClient = useQueryClient()

  const { data: accounts } = useQuery({
    queryKey: ['accountsList', search, sortName, sortType],
    queryFn: async () => {
      const response: {
        list: AccountingAccountsData[]
      } = await getAllAccounts(
        search === ''
          ? `?sort[name]=${sortName}&sort[type]=${sortType}`
          : `?filter[search]=${search}&sort[name]=${sortName}&sort[type]=${sortType}`,
      )

      return response.list
    },
    placeholderData: previousData => previousData,
  })

  const handleDeleteAccount = async (id: number) => {
    const response = await deleteAccount(id)

    if (response.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully deleted Account',
        status: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['accountsList'] })
    } else {
      showToast({
        title: 'Error',
        description: response.message,
        status: 'error',
      })
    }
  }

  const changeSort = useCallback(
    (sortNameItem: string, sortTypeItem: number) => {
      setSortName(sortNameItem)
      setSortType(sortTypeItem)
    },
    [],
  )

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
      {accounts ? (
        <section className={styles.section}>
          <RecentCard
            style={styles.recentFullScreen}
            title='Manage Accounts'
            HeaderComponent={Search}
            Component={ButtonBlue}
            headerProps={{
              style: styles.search,
              onSearchChange: setSearch,
            }}
            componentProps={{
              titleNone: true,
              title: 'New Account',
              icon: '/icons/plus.svg',
              style: styles.buttonPlus,
              onClick: handleNavigateNewAccount,
            }}
          >
            <TableAccounts
              accounts={accounts}
              changeSort={changeSort}
              deleteAccount={handleDeleteAccount}
            />
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
