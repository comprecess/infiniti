import { FC, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { Routes } from '../../../app/router/routes'
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
  isAdmin: boolean
  onClose: () => void
}

export const Sidebar: FC<SidebarProps> = ({
  pages,
  isMini,
  isOpen,
  isMobile,
  isAdmin,
  onClose,
}) => {
  const location = useLocation()
  const sidebarPages = isAdmin
    ? '/' + Routes.adminPages + '/'
    : '/' + Routes.clientPages + '/'

  const navigate = useNavigate()

  const handleNavigate = (path: string) => {
    navigate(path)
    if (isMobile) onClose()
  }

  const isActivePage = (pagePath: string) => {
    return location.pathname === sidebarPages + pagePath
  }

  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchEndX, setTouchEndX] = useState<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStartX !== null && touchEndX !== null) {
      const deltaX = touchEndX - touchStartX
      if (deltaX < -50) {
        onClose()
      }
    }
    setTouchStartX(null)
    setTouchEndX(null)
  }

  return (
    <>
      {isMobile && isOpen && (
        <div
          className={styles.sidebarOverlay}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={onClose}
        />
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
