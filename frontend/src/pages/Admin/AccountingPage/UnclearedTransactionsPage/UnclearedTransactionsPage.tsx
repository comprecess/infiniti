import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'

import { AccountingTransactionsData } from '../../../../app/constants/constants'
import { TableUnclearedTransactions } from '../../../../features/Admin/AccountingPage/UnclearedTransactions/TableUnclearedTransactions/TableUnclearedTransactions'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { Search } from '../../../../shared/ui/Search/Search'
import { getListTransactions } from '../../../../shared/utils/api/Admin/Accounting/GetListTransactions'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './UnclearedTransactionsPage.module.scss'

export const AdminUnclearedTransactionsPage = () => {
  const [search, setSearch] = useState<string>('')
  const [sortName, setSortName] = useState<string>('id')
  const [sortType, setSortType] = useState<number>(0)

  const { data: transactions } = useQuery({
    queryKey: ['transactions', search, sortName, sortType],
    queryFn: async () => {
      const response: { data: AccountingTransactionsData[] } =
        await getListTransactions(
          search === ''
            ? `?filter[status]=Uncleared&sort[name]=${sortName}&sort[type]=${sortType}`
            : `?filter[search]=${search}&filter[status]=Uncleared&sort[name]=${sortName}&sort[type]=${sortType}`,
        )

      return response.data
    },
    placeholderData: previousData => previousData,
  })

  const changeSort = useCallback(
    (sortNameItem: string, sortTypeItem: number) => {
      setSortName(sortNameItem)
      setSortType(sortTypeItem)
    },
    [],
  )

  useEffect(() => {
    document.title = 'infiniti | Uncleared Transactions'
  }, [])

  return (
    <div className={styles.wrapper}>
      {transactions ? (
        <section className={styles.section}>
          <RecentCard
            style={styles.recentFullScreen}
            title='Uncleared Transactions'
            HeaderComponent={Search}
            headerProps={{
              style: styles.search,
              onSearchChange: setSearch,
            }}
          >
            <TableUnclearedTransactions
              transactions={transactions}
              changeSort={changeSort}
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
