import { FC } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { Routes } from '../../../app/router/routes'
import { ChevronsLeftIcon } from '../../../shared/icons/ChevronsLeftIcon'
import { LockIcon } from '../../../shared/icons/LockIcon'
import { MenuIcon } from '../../../shared/icons/MenuIcon'
import { NoteIcon } from '../../../shared/icons/NoteIcon'
import { NotificationIndicatorIcon } from '../../../shared/icons/NotificationIndicatorIcon'
import { Basket } from '../../../shared/ui/Basket/Basket'
import { Icon } from '../../../shared/ui/Icon/Icon'
import { Profile } from '../../../shared/ui/Profile/Profile'
import styles from './Header.module.scss'

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
  const navigate = useNavigate()

  const location = useLocation()

  const isBasket = location.pathname.includes(Routes.basket)
  const isAdmin = location.pathname.includes(Routes.adminPages)

  return (
    <div className={styles.wrapper}>
      <div className={styles.itemsLeft}>
        <Icon
          fill={false}
          style={isMiniSidebar ? styles.reverseIcon : ''}
          icon={<ChevronsLeftIcon />}
          onIconClick={toggleMiniSidebar}
        />
        <Icon icon={<LockIcon />} />
      </div>
      <div className={styles.itemsRight}>
        {isAdmin ? (
          <>
            <Icon icon={<NotificationIndicatorIcon />} />
            <Icon icon={<NoteIcon />} />
          </>
        ) : (
          <Basket
            isActive={isBasket}
            style={isBasket ? styles.basketPageActive : ''}
            onIconClick={() => {
              navigate(Routes.basket)
            }}
          />
        )}
        <Profile />
        <Icon
          fill={false}
          icon={<MenuIcon />}
          onIconClick={toggleSidebar}
        />
      </div>
    </div>
  )
}
