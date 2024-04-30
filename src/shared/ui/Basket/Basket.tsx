import { FC } from 'react'

import { ProfileInfo } from '../../../app/data/general/profile'
import { BasketIcon } from '../../icons/BasketIcon'
import styles from './Basket.module.scss'
import { Notification } from './Notification/Notification'

interface BasketProps {
  isActive: boolean
  style: string
  onIconClick: () => void
}

export const Basket: FC<BasketProps> = ({ isActive, style, onIconClick }) => {
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
      <Notification count={ProfileInfo.carts.length} />
    </div>
  )
}
