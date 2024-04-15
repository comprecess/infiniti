import { FC } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { dashboardsList } from '../../../app/data/dashboardsList'
import { LogoIcon } from '../../../shared/icons/LogoIcon'
import { LogoTextIcon } from '../../../shared/icons/LogoTextIcon'
import { Logo } from '../../../shared/ui/Logo/Logo'
import { Item } from './Item/Item'
import styles from './Sidebar.module.scss'

interface SidebarProps {
  isMini: boolean
  isMobile: boolean
  isOpen: boolean
  onClose: () => void
}

export const Sidebar: FC<SidebarProps> = ({
  isMini,
  isOpen,
  isMobile,
  onClose,
}) => {
  const location = useLocation()

  const navigate = useNavigate()

  const handleNavigate = (path: string) => {
    navigate(path)
    if (isMobile) onClose()
  }

  const isActivePage = (pagePath: string) => {
    return location.pathname === '/' + pagePath
  }

  console.log(isMini)

  return (
    <aside
      className={
        isOpen
          ? isMini
            ? styles.miniSidebar
            : styles.wrapperActive
          : styles.wrapperDisable
      }
    >
      <Logo
        logo={
          isMini ? (
            <LogoIcon fill={styles.miniLogoColor} />
          ) : (
            <LogoTextIcon />
          )
        }
      />
      <div className={styles.items}>
        {dashboardsList.map(item => {
          return (
            <Item
              key={item.id}
              title={isMini ? '' : item.name}
              icon={item.icon}
              path={item.path}
              style={isMini ? styles.iconItemCenter : ''}
              isActive={isActivePage(item.path)}
              onItemClick={handleNavigate}
            />
          )
        })}
      </div>
    </aside>
  )
}
