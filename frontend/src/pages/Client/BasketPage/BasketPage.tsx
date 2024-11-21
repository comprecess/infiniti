import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { CartProps } from '../../../app/constants/constants'
import { Routes } from '../../../app/router/routes'
import { TitlePage } from '../../../features/Main/TitlePage/TitlePage'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getOrdersInCart } from '../../../shared/utils/api/Client/Cart/GetOrdersInCart'
import { Basket } from '../../../widgets/BasketCart/Basket/Basket'
import { Cart } from '../../../widgets/BasketCart/Cart/Cart'
import { RecentCard } from '../../../widgets/RecentCard/RecentCard'
import styles from './BasketPage.module.scss'

export const ClientBasketPage: FC = () => {
  const [orders, setOrder] = useState<CartProps | null>(null)

  const navigate = useNavigate()

  const getOrders = async () => {
    const ordersResponse: CartProps = await getOrdersInCart()

    setOrder(ordersResponse)
  }

  const handleDeleteOrder = () => {
    getOrders()
  }

  const handleNavigateToInvoice = () => {
    navigate(`/${Routes.public}/${Routes.invoice}/${Routes.view}/id000`)
  }

  useEffect(() => {
    document.title = 'infiniti | Cart'
  }, [])

  useEffect(() => {
    getOrders()
  }, [])

  return (
    <div className={styles.wrapper}>
      {orders ? (
        <>
          <div className={styles.title}>
            <TitlePage
              title='My orders'
              secondTitle={String(orders.count)}
            />
          </div>
          <section className={styles.sectionFirst}>
            <RecentCard style={styles.cart}>
              <Cart cart={orders.items} onDelete={handleDeleteOrder} />
            </RecentCard>
            <Basket
              subtotalCost={orders.subTotal}
              taxesAmount={orders.subTax}
              totalPrice={orders.total}
              buttonOnClick={handleNavigateToInvoice}
            />
          </section>
        </>
      ) : (
        <LoadingSpinner size='xl' />
      )}
    </div>
  )
}
