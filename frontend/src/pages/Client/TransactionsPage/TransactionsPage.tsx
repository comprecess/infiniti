import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import styles from './TransactionsPage.module.scss'
import { ClientTransactionsData, PagesMetaData } from '../../../app/constants/constants'
import { PagesList } from '../../../features/Client/CatalogPage/TalentsList/PagesList/PagesList'
import { RecentTransactions } from '../../../features/Client/TransactionsPage/RecentTransactions/RecentTransactions'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getTransactionsList } from '../../../shared/utils/api/Client/Transactions/get-transactions-list'
import { RecentCard } from '../../../widgets/RecentCard/RecentCard'

export const ClientTransactionsPage = () => {
  const [transactions, setTransactions] = useState<{
    data: ClientTransactionsData[]
    meta: PagesMetaData
  } | null>(null)

  const [searchParams, setSearchParams] = useSearchParams()

  const page = searchParams.get('page') || '1'

  const updateQueryParam = (key: string, value: string | number) => {
    const newParams = new URLSearchParams(location.search)
    newParams.set(key, String(value))

    if (key !== 'page') {
      newParams.set('page', '1')
    }

    setSearchParams(newParams, { replace: true })
  }

  const updatePage = (newPage: string) => updateQueryParam('page', newPage)

  const getTransactionList = async () => {
    const response = await getTransactionsList(`?page=${page}`)

    if (!response.status) return

    setTransactions(response.data)
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search)

    let changed = false

    if (!params.has('page')) {
      params.set('page', '1')
      changed = true
    }

    if (changed) {
      setSearchParams(params, { replace: true })
    }
  }, [])

  useEffect(() => {
    document.title = 'infiniti | Transactions'

    getTransactionList()
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {transactions ? (
          <RecentCard
            title={`Total: ${transactions.meta.total}`}
            style={styles.recentFullScreen}
            PagesComponent={transactions && transactions.data.length > 0 ? PagesList : undefined}
            pagesProps={
              transactions
                ? {
                  meta: transactions?.meta,
                  nextPage: updatePage,
                  size: 'sm',
                }
                : undefined
            }
          >
            <RecentTransactions transactions={transactions.data} />
          </RecentCard>
        ) : (
          <div className={styles.loading}>
            <LoadingSpinner size='xl' />
          </div>
        )}
      </section>
    </div>
  )
}
