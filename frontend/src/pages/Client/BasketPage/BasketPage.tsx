import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './BasketPage.module.scss'
import { CartProps } from '../../../app/constants/constants'
import { Routes } from '../../../app/router/routes'
import { TitlePage } from '../../../features/Main/TitlePage/TitlePage'
import { BackButton } from '../../../shared/ui/BackButton/BackButton'
import { useCustomToast } from '../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getTeamDatesBusy } from '../../../shared/utils/api/Admin/Meeting/get-team-dates-busy'
import { getConvertToInvoice } from '../../../shared/utils/api/Client/Basket/get-convert-to-invoice'
import { getOrderCart } from '../../../shared/utils/api/Client/Cart/get-order-cart'
import { Basket } from '../../../widgets/BasketCart/Basket/Basket'
import { Cart } from '../../../widgets/BasketCart/Cart/Cart'
import { RecentCard } from '../../../widgets/RecentCard/RecentCard'

const groupItems = (items: any[]) => {
  const businessPlans: Record<number, any[]> = {}
  const individual: any[] = []

  items.forEach(item => {
    if (item.idBusinessPlan) {
      if (!businessPlans[item.idBusinessPlan]) {
        businessPlans[item.idBusinessPlan] = []
      }
      businessPlans[item.idBusinessPlan].push(item)
    } else {
      individual.push(item)
    }
  })

  return { businessPlans, individual }
}

export const ClientBasketPage = () => {
  const [orders, setOrder] = useState<CartProps | null>(null)

  const navigate = useNavigate()
  const showToast = useCustomToast()

  const { data: teamDatesBusy } = useQuery({
    queryKey: ['datesBusy'],
    queryFn: async () => {
      if (orders?.items === undefined) return

      const teamIdsQuery = orders.items.map(item => `ids[]=${item.userCatalog.id}`).join('&')

      const response = await getTeamDatesBusy(
        teamIdsQuery,
        Intl.DateTimeFormat().resolvedOptions().timeZone,
      )

      if (!response.status) return

      return response.data.data
    },
    enabled: (orders?.items.length ?? 0) > 0,
  })

  const getOrders = async () => {
    const response = await getOrderCart()

    if (!response.status) return

    setOrder(response.data)
  }

  const handleNavigateToInvoice = (token: string) => {
    navigate(`/${Routes.public}/${Routes.invoice}/${Routes.view}/${token}`)
  }

  const convertBasketToInvoice = async () => {
    const response = await getConvertToInvoice()

    if (response.status) {
      handleNavigateToInvoice(response.token)
    } else {
      showToast({
        title: 'Error',
        description: response.message,
        status: 'error',
      })
    }
  }

  useEffect(() => {
    document.title = 'infiniti | Cart'
  }, [])

  useEffect(() => {
    getOrders()
  }, [])

  const grouped = orders ? groupItems(orders.items) : null

  return (
    <div className={styles.wrapper}>
      {orders ? (
        <>
          <div className={styles.backButton}>
            <BackButton />
          </div>
          <div className={styles.title}>
            <TitlePage title='My orders' secondTitle={String(orders.count)} />
          </div>
          <section className={styles.sectionFirst}>
            <RecentCard style={styles.cart}>
              {grouped &&
                Object.entries(grouped.businessPlans).map(([planId, items]) => (
                  <div key={planId} style={{ marginBottom: '32px' }}>
                    <p className={styles.titleCart}>{orders.type ?? `Business plan #${planId}`}</p>
                    <Cart
                      cart={items}
                      isCreateCall={grouped.individual.length === 0}
                      datesEmployment={teamDatesBusy}
                      getOrders={getOrders}
                    />
                  </div>
                ))}
              {grouped && grouped.individual.length > 0 && (
                <div>
                  <p className={styles.titleCart}>Type: Individual</p>
                  <Cart
                    isCreateCall={grouped.individual.length > 0}
                    cart={grouped.individual}
                    datesEmployment={teamDatesBusy}
                    getOrders={getOrders}
                  />
                </div>
              )}
            </RecentCard>
            <Basket
              subtotalCost={orders.subTotal}
              taxesAmount={orders.subTax}
              totalPrice={orders.total}
              buttonOnClick={convertBasketToInvoice}
            />
          </section>
        </>
      ) : (
        <LoadingSpinner size='xl' />
      )}
    </div>
  )
}
