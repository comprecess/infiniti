import { FC, useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import {
  ViewPageContext,
  ViewTransactionsTypeData,
} from '../../../../../app/constants/constants'
import { RecentTransactions } from '../../../../../features/Admin/CustomersPage/ViewPage/Pages/TransactionsPage/RecentTransactions/RecentTransactions'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getSelectedTypeInfo } from '../../../../../shared/utils/api/Admin/ViewContact/GetSelectedTypeInfo'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'
import styles from './TransactionsPage.module.scss'

export const AdminContactTransactionsPage: FC = () => {
  const [data, setData] = useState<ViewTransactionsTypeData[] | null>(null)

  const context = useOutletContext<ViewPageContext>()

  const getInfo = async () => {
    const getResponse = await getSelectedTypeInfo(
      context.idClient,
      'transactions',
    )

    setData(getResponse.data)
  }

  useEffect(() => {
    document.title = 'infiniti | Contact | Transactions'
  }, [])

  useEffect(() => {
    getInfo()
  }, [context.idClient])

  return (
    <div className={styles.wrapper}>
      {data ? (
        <RecentCard>
          <RecentTransactions list={data} />
        </RecentCard>
      ) : (
        <LoadingSpinner size='xl' />
      )}
    </div>
  )
}
