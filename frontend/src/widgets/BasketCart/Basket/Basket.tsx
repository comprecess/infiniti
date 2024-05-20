import { FC } from 'react'

import { Item } from '../../../features/Client/BasketPage/BasketCart/Item/Item'
import { ButtonBlue } from '../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomDivider } from '../../../shared/ui/CustomDivider/CustomDivider'
import styles from './Basket.module.scss'

interface BasketProps {
  subtotalCost: string
  taxesAmount: string
  totalPrice: string
}

export const Basket: FC<BasketProps> = ({
  subtotalCost,
  taxesAmount,
  totalPrice,
}) => {
  return (
    <div className={styles.wrapper}>
      <h4 className={styles.title}>Your order</h4>
      <div className={styles.items}>
        <Item title='Subtotal cost' amount={subtotalCost} />
        <Item title='Taxes' amount={taxesAmount} icon='/icons/info.svg' />
      </div>
      <CustomDivider />
      <div className={styles.totalOrder}>
        <h5 className={styles.totalPrice}>Total</h5>
        <h5 className={styles.totalPrice}>{totalPrice}</h5>
      </div>
      <ButtonBlue title='Proceed to checkout' />
    </div>
  )
}
