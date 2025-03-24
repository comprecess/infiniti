import { BasketIcon } from '../../icons/BasketIcon'
import styles from './Basket.module.scss'
import { Notification } from './Notification/Notification'

interface BasketProps {
  isActive: boolean
  style: string
  quantityGoods: number | undefined
  onIconClick: () => void
}

export const Basket = ({
  isActive,
  style,
  quantityGoods,
  onIconClick,
}: BasketProps) => {
  return (
    <div
      className={
        isActive
          ? `${styles.wrapperActive} ${style}`
          : `${styles.wrapperDisable} ${style}`
      }
      onClick={onIconClick}
    >
      <BasketIcon />
      <div className={styles.notification}>
        <Notification count={quantityGoods} />
      </div>
    </div>
  )
}
