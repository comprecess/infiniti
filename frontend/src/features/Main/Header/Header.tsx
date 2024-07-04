import { FC, memo, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { CartProps } from '../../../app/constants/constants'
import { Routes } from '../../../app/router/routes'
import { ChevronsLeftIcon } from '../../../shared/icons/ChevronsLeftIcon'
import { LockIcon } from '../../../shared/icons/LockIcon'
import { MenuIcon } from '../../../shared/icons/MenuIcon'
import { NoteIcon } from '../../../shared/icons/NoteIcon'
import { NotificationIndicatorIcon } from '../../../shared/icons/NotificationIndicatorIcon'
import { Basket } from '../../../shared/ui/Basket/Basket'
import { Icon } from '../../../shared/ui/Icon/Icon'
import { Profile } from '../../../shared/ui/Profile/Profile'
import { getOrdersInCart } from '../../../shared/utils/api/Cart/GetOrdersInCart'
import styles from './Header.module.scss'

const IconMemo = memo(Icon)
const BasketMemo = memo(Basket)
const ProfileMemo = memo(Profile)

interface HeaderProps {
  isMiniSidebar: boolean
  toggleSidebar: () => void
  toggleMiniSidebar: () => void
}

export const Header: FC<HeaderProps> = ({
  isMiniSidebar,
  toggleSidebar,
  toggleMiniSidebar,
}) => {
  const [orders, setOrder] = useState<CartProps>()

  const navigate = useNavigate()

  const location = useLocation()

  const isBasket = useMemo(
    () => location.pathname.includes(Routes.basket),
    [location.pathname],
  )
  const isAdmin = useMemo(
    () => location.pathname.includes(Routes.adminPages),
    [location.pathname],
  )

  const getOrders = async () => {
    const ordersResponse: CartProps = await getOrdersInCart()

    setOrder(ordersResponse)
  }

  useEffect(() => {
    getOrders()
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.itemsLeft}>
        <IconMemo
          fill={false}
          style={isMiniSidebar ? styles.reverseIcon : ''}
          icon={<ChevronsLeftIcon />}
          onIconClick={toggleMiniSidebar}
        />
        <IconMemo icon={<LockIcon />} />
      </div>
      <div className={styles.itemsRight}>
        {isAdmin ? (
          <>
            <IconMemo icon={<NotificationIndicatorIcon />} />
            <IconMemo icon={<NoteIcon />} />
          </>
        ) : (
          <BasketMemo
            isActive={isBasket}
            quantityGoods={orders?.count}
            style={isBasket ? styles.basketPageActive : ''}
            onIconClick={() => {
              navigate(Routes.basket)
            }}
          />
        )}
        <ProfileMemo />
        <IconMemo
          fill={false}
          icon={<MenuIcon />}
          onIconClick={toggleSidebar}
        />
      </div>
    </div>
  )
}
