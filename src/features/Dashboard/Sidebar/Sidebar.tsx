import { FC } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { Routes } from '../../../app/router/Routes'
import { LogoIcon } from '../../../shared/icons/LogoIcon'
import { LogoTextIcon } from '../../../shared/icons/LogoTextIcon'
import { Logo } from '../../../shared/ui/Logo/Logo'
import { Item } from './Item/Item'
import styles from './Sidebar.module.scss'

interface SidebarPage {
  id: number
  name: string
  icon: JSX.Element
  path: string
}

interface SidebarProps {
  pages: SidebarPage[]
  isMini: boolean
  isMobile: boolean
  isOpen: boolean
  onClose: () => void
}

export const Sidebar: FC<SidebarProps> = ({
  pages,
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
    return location.pathname === '/' + Routes.admin + '/' + pagePath
  }

  return (
    <>
      {isMobile && isOpen && (
        <div className={styles.sidebarOverlay} onClick={onClose} />
      )}
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
          {pages.map(item => {
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
    </>
  )
}
