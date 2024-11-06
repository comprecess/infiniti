import { FC, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import {
  RolesAccess,
  TalentsListCartsData,
} from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import { Cart } from '../../../../features/Admin/TalentsPage/Cart/Cart'
import { TitlePage } from '../../../../features/Main/TitlePage/TitlePage'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getOrdersSelectedCart } from '../../../../shared/utils/api/Admin/Talents/Cart/GetOrdersSelectedCart'
import { Basket } from '../../../../widgets/BasketCart/Basket/Basket'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './CartPage.module.scss'

const extractIdFromUrl = (url: string): number | null => {
  const regex = /\/cart\/(\d+)$/
  const match = url.match(regex)

  return match ? parseInt(match[1], 10) : null
}

const useIdFromUrl = () => {
  const location = useLocation()

  return useMemo(
    () => extractIdFromUrl(location.pathname),
    [location.pathname],
  )
}

export const AdminCartPage: FC = () => {
  const [data, setData] = useState<{
    access: RolesAccess
    data: TalentsListCartsData
  } | null>(null)

  const id = useIdFromUrl()
  const navigate = useNavigate()

  const getOrders = async () => {
    if (id === null) return

    const getResponse: {
      access: RolesAccess
      data: TalentsListCartsData
    } = await getOrdersSelectedCart(id)

    setData(getResponse)
  }

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
              title='My orders'
              secondTitle={data.data.cartItems.length.toString()}
            />
          </div>
          <section className={styles.sectionFirst}>
            <RecentCard style={styles.cart}>
              <Cart
                cart={data.data.cartItems}
                idCart={data.data.id}
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
