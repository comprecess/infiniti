import { FC } from 'react'

import { ProfileInfo } from '../../../app/data/general/profile'
import { TitlePage } from '../../../features/Main/TitlePage/TitlePage'
import { sumAmountsAndFormat } from '../../../shared/utils/Basket/AmountInCart'
import { Basket } from '../../../widgets/BasketCart/Basket/Basket'
import { Cart } from '../../../widgets/BasketCart/Cart/Cart'
import { RecentCard } from '../../../widgets/RecentCard/RecentCard'
import styles from './BasketPage.module.scss'

export const BasketPage: FC = () => {
  const subtotalCost = sumAmountsAndFormat(
    ProfileInfo.carts.map(item => parseInt(item.amount.replace(/\D/g, ''), 10)),
  )

  const taxesAmount = sumAmountsAndFormat(
    ProfileInfo.carts.map(item =>
      parseInt(item.taxesAmount.replace(/\D/g, ''), 10),
    ),
  )

  const totalAmount = sumAmountsAndFormat([
    parseInt(subtotalCost.replace(/\D/g, ''), 10),
    parseInt(taxesAmount.replace(/\D/g, ''), 10),
  ])

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <TitlePage
          title='Cart'
          secondTitle={String(ProfileInfo.carts.length)}
        />
      </div>
      <div className={styles.sectionFirst}>
        <RecentCard style={styles.cart}>
          <Cart />
        </RecentCard>
        <Basket
          subtotalCost={subtotalCost}
          taxesAmount={taxesAmount}
          totalPrice={totalAmount}
        />
      </div>
    </div>
  )
}
