import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'

import { ViewPageContext } from '../../../../../app/constants/constants'
import { RecentTransactions } from '../../../../../features/Admin/CustomersPage/ViewPage/Pages/TransactionsPage/RecentTransactions/RecentTransactions'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getSelectedTypeInfo } from '../../../../../shared/utils/api/Admin/ViewContact/get-selected-type-info'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'
import styles from './TransactionsPage.module.scss'

export const AdminContactTransactionsPage = () => {
  const context = useOutletContext<ViewPageContext>()

  const { data: transactions } = useQuery({
    queryKey: ['transactions', context.idClient],
    queryFn: async () => {
      const response = await getSelectedTypeInfo(
        context.idClient,
        'transactions',
      )

      if (!response.status) return

      return response.data
    },
    placeholderData: previousData => previousData,
  })

  useEffect(() => {
    document.title = 'infiniti | Contact | Transactions'
  }, [])

  return (
    <div className={styles.wrapper}>
      {transactions ? (
        <RecentCard>
          <RecentTransactions list={transactions.data} />
        </RecentCard>
      ) : (
        <LoadingSpinner size='xl' />
      )}
    </div>
  )
}
