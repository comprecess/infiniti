import { Dispatch, memo, SetStateAction, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import styles from './Header.module.scss'
import { CartProps, UserInfo } from '../../../app/constants/constants'
import { Routes } from '../../../app/router/routes'
import { ChevronsLeftIcon } from '../../../shared/icons/ChevronsLeftIcon'
import { LockIcon } from '../../../shared/icons/LockIcon'
import { MenuIcon } from '../../../shared/icons/MenuIcon'
import { Basket } from '../../../shared/ui/Basket/Basket'
import { Icon } from '../../../shared/ui/Icon/Icon'
import { Profile } from '../../../shared/ui/Profile/Profile'
import { getOrderCart } from '../../../shared/utils/api/Client/Cart/get-order-cart'
import { ChatGPT } from '../../../widgets/ChatGPT/ChatGPT'
import { DashboardIcon } from '../../../shared/icons/sidebarList/DashboardIcon'
import { NotificationProfile } from '../../../widgets/NotificationProfile/NotificationProfile'

const BasketMemo = memo(Basket)
const ProfileMemo = memo(Profile)

interface HeaderProps {
  user: UserInfo | null
  isMiniSidebar: boolean
  isSidebarLocked: boolean
  setIsSidebarLocked: Dispatch<SetStateAction<boolean>>
  toggleSidebar: () => void
  toggleMiniSidebar: () => void
}

export const Header = ({
  user,
  isMiniSidebar,
  isSidebarLocked,
  setIsSidebarLocked,
  toggleSidebar,
  toggleMiniSidebar,
}: HeaderProps) => {
  const [orders, setOrder] = useState<CartProps>()

  const navigate = useNavigate()

  const location = useLocation()

  const isBasket = useMemo(() => location.pathname.includes(Routes.basket), [location.pathname])
  const isAdmin = useMemo(() => location.pathname.includes(Routes.adminPages), [location.pathname])

  const getOrders = async () => {
    const response = await getOrderCart()

    if (!response.status) return

    setOrder(response.data)
  }

  useEffect(() => {
    if (!isAdmin) {
      getOrders()
    }
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.itemsLeft}>
        <div className={styles.iconIsDesktop}>
          <Icon
            fill={false}
            style={isMiniSidebar ? styles.reverseIcon : ''}
            icon={<ChevronsLeftIcon />}
            onIconClick={toggleMiniSidebar}
          />
        </div>
        <div className={styles.iconIsTablet}>
          <Icon fill={false} icon={<MenuIcon />} onIconClick={toggleSidebar} />
        </div>
        <div className={styles.iconIsDesktop}>
          <Icon
            icon={<LockIcon />}
            style={isSidebarLocked ? styles.iconActive : ''}
            onIconClick={() => setIsSidebarLocked(prev => !prev)}
          />
        </div>
      </div>
      <div className={styles.itemsRight}>
        {isAdmin ? (
          <>
            <Icon
              fill={false}
              icon={<DashboardIcon />}
              onIconClick={() => navigate(`/${Routes.adminPages}/${Routes.dashboard}`)}
            />
            <ChatGPT />
            {/* <Icon icon={<NoteIcon />} onIconClick={() => {}} /> */}
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
        <NotificationProfile />
        <ProfileMemo user={user} />
        <div className={styles.iconIsMobile}>
          <Icon fill={false} icon={<MenuIcon />} onIconClick={toggleSidebar} />
        </div>
      </div>
    </div>
  )
}
