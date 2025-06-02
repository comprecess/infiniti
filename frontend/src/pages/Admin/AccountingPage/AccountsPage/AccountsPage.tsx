import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  AccountingAccountsData,
  AccountingAccountsInputData,
} from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import { TableAccounts } from '../../../../features/Admin/AccountingPage/AccountsPage/TableAccounts/TableAccounts'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { Search } from '../../../../shared/ui/Search/Search'
import { deleteAccount } from '../../../../shared/utils/api/Admin/Accounting/DeleteAccount'
import { getAccountsInputData } from '../../../../shared/utils/api/Admin/Accounting/GetAccountsInputData'
import { getAllAccounts } from '../../../../shared/utils/api/Admin/Accounting/GetAllAccounts'
import { postRecordInitialBalance } from '../../../../shared/utils/api/Admin/Accounting/PostRecordInitialBalance'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './AccountsPage.module.scss'

export const AdminAccountsPage = () => {
  const [inputData, setInputData] =
    useState<AccountingAccountsInputData | null>(null)

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

  const getInputData = async () => {
    const response: AccountingAccountsInputData =
      await getAccountsInputData()

    setInputData(response)
  }

  const handleDeleteAccount = async (id: number) => {
    const { status, message } = await deleteAccount(id)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully deleted Account',
        status: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['accountsList'] })
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  const addRecordInitialBalanceAccount = async (
    id: number,
    form: {
      balance: { amount: string; currency: number }[]
    },
  ) => {
    const { status, message } = await postRecordInitialBalance(id, form)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully made an opening balance entry',
        status: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['accountsList'] })
    } else {
      showToast({
        title: 'Error',
        description: message,
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
      `/${Routes.adminPages}/${Routes.accounting}/${Routes.new}/${Routes.account}`,
    )
  }

  useEffect(() => {
    document.title = 'infiniti | Accounts'

    getInputData()
  }, [])

  return (
    <div className={styles.wrapper}>
      {accounts && inputData ? (
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
              inputData={inputData}
              accounts={accounts}
              changeSort={changeSort}
              deleteAccount={handleDeleteAccount}
              addRecordInitialBalanceAccount={
                addRecordInitialBalanceAccount
              }
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
