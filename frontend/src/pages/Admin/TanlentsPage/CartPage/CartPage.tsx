import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  RolesAccess,
  TalentsListCartsData,
} from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import { Cart } from '../../../../features/Admin/TalentsPage/Cart/Cart'
import { TitlePage } from '../../../../features/Main/TitlePage/TitlePage'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getDatesTeamBusy } from '../../../../shared/utils/api/Admin/Meeting/GetDatesTeamBusy'
import { getOrdersSelectedCart } from '../../../../shared/utils/api/Admin/Talents/Cart/GetOrdersSelectedCart'
import { useIdFromUrl } from '../../../../shared/utils/usefulMethods'
import { Basket } from '../../../../widgets/BasketCart/Basket/Basket'
import { TimeSlotsById } from '../../../../widgets/CreatingCallModal/CreatingCallModal'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './CartPage.module.scss'

export const AdminCartPage = () => {
  const [data, setData] = useState<{
    access: RolesAccess
    data: TalentsListCartsData
  } | null>(null)

  const id = useIdFromUrl('cart')
  const navigate = useNavigate()

  const getOrders = async () => {
    if (id === null) return

    const getResponse: {
      access: RolesAccess
      data: TalentsListCartsData
    } = await getOrdersSelectedCart(id)

    setData(getResponse)
  }

  const { data: teamDatesBusy } = useQuery({
    queryKey: ['datesBusy'],
    queryFn: async () => {
      if (data?.data.cartItems === undefined) return

      const teamIdsQuery = data.data.cartItems
        .map(item => `ids[]=${item.talent.id}`)
        .join('&')

      const response: { data: TimeSlotsById } = await getDatesTeamBusy(
        teamIdsQuery,
        Intl.DateTimeFormat().resolvedOptions().timeZone,
      )

      return response.data
    },
    enabled: (data?.data.cartItems.length ?? 0) > 0,
  })

  const handleNavigateToOffer = () => {
    navigate(
      // eslint-disable-next-line max-len
      `/${Routes.adminPages}/${Routes.talents}/${Routes.list}/${Routes.carts}/${Routes.cart}/${data?.data.id}/${Routes.to}/${Routes.offer}/${data?.data.secret}`,
    )
  }

  useEffect(() => {
    document.title = 'infiniti | Cart'
  }, [])

  useEffect(() => {
    getOrders()
  }, [id])

  return (
    <div className={styles.wrapper}>
      {data ? (
        <>
          <div className={styles.title}>
            <TitlePage
              title='Orders'
              secondTitle={data.data.cartItems.length.toString()}
            />
          </div>
          <section className={styles.sectionFirst}>
            <RecentCard style={styles.cart}>
              <Cart
                cart={data.data.cartItems}
                idCart={data.data.id}
                datesEmployment={teamDatesBusy}
                onDelete={getOrders}
              />
            </RecentCard>
            <Basket
              isAdmin
              subtotalCost={data.data.subTotal}
              taxesAmount={data.data.subTax}
              totalPrice={data.data.total}
              buttonOnClick={handleNavigateToOffer}
            />
          </section>
        </>
      ) : (
        <LoadingSpinner size='xl' />
      )}
    </div>
  )
}
