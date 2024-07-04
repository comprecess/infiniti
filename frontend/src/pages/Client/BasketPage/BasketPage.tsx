import { FC, useEffect, useState } from 'react'

import { CartProps } from '../../../app/constants/constants'
import { TitlePage } from '../../../features/Main/TitlePage/TitlePage'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getOrdersInCart } from '../../../shared/utils/api/Cart/GetOrdersInCart'
import { Basket } from '../../../widgets/BasketCart/Basket/Basket'
import { Cart } from '../../../widgets/BasketCart/Cart/Cart'
import { RecentCard } from '../../../widgets/RecentCard/RecentCard'
import styles from './BasketPage.module.scss'

export const BasketPage: FC = () => {
  const [orders, setOrder] = useState<CartProps | null>(null)

  const getOrders = async () => {
    const ordersResponse: CartProps = await getOrdersInCart()

    setOrder(ordersResponse)
  }

  const handleDeleteOrder = () => {
    getOrders()
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
            <TitlePage title='Cart' secondTitle={String(orders.count)} />
          </div>
          <section className={styles.sectionFirst}>
            <RecentCard style={styles.cart}>
              <Cart cart={orders.items} onDelete={handleDeleteOrder} />
            </RecentCard>
            <Basket
              subtotalCost={orders.subTotal}
              taxesAmount={orders.subTax}
              totalPrice={orders.total}
            />
          </section>
        </>
      ) : (
        <LoadingSpinner size='xl' />
      )}
    </div>
  )
}
