import { FC } from 'react'

import { ProfileInfo } from '../../../app/data/profile'
import { TitlePage } from '../../../features/Main/TitlePage/TitlePage'
import { Basket } from '../../../widgets/BasketCart/Basket/Basket'
import { Cart } from '../../../widgets/BasketCart/Cart/Cart'
import { RecentCard } from '../../../widgets/RecentCard/RecentCard'
import styles from './BasketPage.module.scss'

export const BasketPage: FC = () => {
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
        <Basket />
      </div>
    </div>
  )
}
