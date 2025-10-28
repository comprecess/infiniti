import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import styles from './MyOrdersPage.module.scss'
import { ClientMyOrdersData, PagesMetaData } from '../../../app/constants/constants'
import { PagesList } from '../../../features/Client/CatalogPage/TalentsList/PagesList/PagesList'
import { RecentMyOrders } from '../../../features/Client/MyOrdersPage/RecentMyOrders/RecentMyOrders'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getMyOrderList } from '../../../shared/utils/api/Client/MyOrders/get-my-order-list'
import { RecentCard } from '../../../widgets/RecentCard/RecentCard'

export const ClientMyOrdersPage = () => {
  const [orders, setOrders] = useState<{
    data: ClientMyOrdersData[]
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

  const getOrdersList = async () => {
    const response = await getMyOrderList(`?page=${page}`)

    if (!response.status) return

    setOrders(response.data)
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
    getOrdersList()
  }, [page])

  useEffect(() => {
    document.title = 'infiniti | My Orders'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {orders ? (
          <RecentCard
            title='My orders'
            style={styles.recentFullScreen}
            PagesComponent={orders && orders.data.length > 0 ? PagesList : undefined}
            pagesProps={
              orders
                ? {
                    meta: orders?.meta,
                    nextPage: updatePage,
                    size: 'sm',
                  }
                : undefined
            }
          >
            <RecentMyOrders orders={orders.data} />
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
