import { FC } from 'react'

import { BasketIcon } from '../../../shared/icons/BasketIcon'
import { ChevronsLeftIcon } from '../../../shared/icons/ChevronsLeftIcon'
import { LockIcon } from '../../../shared/icons/LockIcon'
import { MenuIcon } from '../../../shared/icons/MenuIcon'
import { Icon } from '../../../shared/ui/Icon/Icon'
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
        <Icon icon={<BasketIcon />} />
        <p>Avatar</p>
        <Icon
          fill={false}
          icon={<MenuIcon />}
          onIconClick={toggleSidebar}
        />
      </div>
    </div>
  )
}
