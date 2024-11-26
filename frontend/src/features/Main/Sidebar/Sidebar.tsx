import React, { FC, useCallback, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { Routes } from '../../../app/router/routes'
import { LogoIcon } from '../../../shared/icons/LogoIcon'
import { LogoTextIcon } from '../../../shared/icons/LogoTextIcon'
import { Logo } from '../../../shared/ui/Logo/Logo'
import { Item } from './Item/Item'
import { OpenItem, openPathsProps } from './OpenItem/OpenItem'
import styles from './Sidebar.module.scss'

interface SidebarPage {
  id: number
  name: string
  icon: JSX.Element
  shortName: string
  openPaths?: openPathsProps[]
  path: string
}

interface SidebarProps {
  pages: SidebarPage[]
  isMini: boolean
  isMobile: boolean
  isOpen: boolean
  isAdmin: boolean
  roles?: {
    [key: string]: {
      view: number
    }
  }
  onClose: () => void
}

export const Sidebar: FC<SidebarProps> = ({
  pages,
  isMini,
  isOpen,
  isMobile,
  isAdmin,
  roles,
  onClose,
}) => {
  const location = useLocation()
  const sidebarPages = isAdmin
    ? `/${Routes.adminPages}/`
    : `/${Routes.clientPages}/`

  const navigate = useNavigate()

  const handleNavigate = useCallback(
    (path: string) => {
      navigate(path)
      if (isMobile) onClose()
    },
    [navigate, isMobile, onClose],
  )

  const isActivePage = useCallback(
    (pagePath: string) => {
      return location.pathname.includes(sidebarPages + pagePath)
    },
    [location.pathname, sidebarPages],
  )

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

  const newPages = roles
    ? pages.filter(item => {
      const role = roles[item.shortName]

      return role && role.view === 1
    })
    : pages

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
              <LogoTextIcon style={styles.logoTextColor} />
            )
          }
        />
        <div
          className={
            isOpen
              ? isMini
                ? styles.itemsMini
                : styles.items
              : styles.items
          }
        >
          {newPages.map(item => {
            return (
              <React.Fragment key={item.id}>
                {item.openPaths ? (
                  <OpenItem
                    title={item.name}
                    icon={item.icon}
                    openPath={item.openPaths}
                    path={item.path}
                    isMini={isMini}
                    isActive={isActivePage(item.path)}
                    onItemClick={handleNavigate}
                  />
                ) : (
                  <Item
                    title={item.name}
                    icon={item.icon}
                    path={item.path}
                    isMini={isMini}
                    isActive={isActivePage(item.path)}
                    onItemClick={handleNavigate}
                  />
                )}
              </React.Fragment>
            )
          })}
        </div>
      </aside>
    </>
  )
}
