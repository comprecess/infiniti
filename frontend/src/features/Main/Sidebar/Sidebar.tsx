import React, { Fragment, useCallback, useEffect, useState } from 'react'
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
  shortName: string | undefined
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
      create: number
    }
  }
  onClose: () => void
}

export const Sidebar = ({
  pages,
  isMini,
  isOpen,
  isMobile,
  isAdmin,
  roles,
  onClose,
}: SidebarProps) => {
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchEndX, setTouchEndX] = useState<number | null>(null)

  const [newPages, setNewPages] = useState<SidebarPage[] | null>(null)

  const [isOpenedPages, setIsOpenedPages] = useState<{
    [key: string]: boolean
  }>({})

  const location = useLocation()
  const sidebarPages = isAdmin
    ? `/${Routes.adminPages}/`
    : `/${Routes.clientPages}/`

  const navigate = useNavigate()

  const handleToggleOpen = (path: string) => {
    setIsOpenedPages(prevState => {
      const newState = { ...prevState }

      Object.keys(newState).forEach(key => {
        newState[key] = false
      })

      newState[path] = !prevState[path]

      return newState
    })
  }

  const handleNavigate = useCallback(
    (path: string) => {
      setIsOpenedPages({})
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

  const handleFilterPages = () => {
    const newPages = roles
      ? (pages
        .map(item => {
          const newItem: SidebarPage = { ...item }

          if (newItem.shortName !== undefined) {
            if (
              newItem.shortName === 'accounting' &&
                newItem.openPaths
            ) {
              const roleTransactions = roles.transactions
              const roleBankNCash = roles.bank_n_cash
              const roleAssets = roles.assets

              if (
                roleTransactions.view ||
                  roleBankNCash.view ||
                  roleAssets.view
              ) {
                newItem.openPaths = newItem.openPaths.filter(page => {
                  const role =
                      page.shortName === 'transactions'
                        ? roleTransactions
                        : page.shortName === 'bank_n_cash'
                          ? roleBankNCash
                          : page.shortName === 'assets'
                            ? roleAssets
                            : null

                  if (role) {
                    return page.create ? role.create : role.view
                  }

                  return false
                })
              } else {
                return null
              }
            } else {
              const roleView = roles[newItem.shortName]

              if (newItem.openPaths && roleView && roleView.view === 1) {
                newItem.openPaths = newItem.openPaths.filter(page => {
                  if (page.create === false) {
                    return true
                  }

                  return page.create && roleView.create
                })
              }

              if (!(roleView && roleView.view === 1)) {
                return null
              }
            }
          }

          return newItem
        })
        .filter(item => item !== null) as SidebarPage[])
      : pages

    setNewPages(newPages)
  }

  useEffect(() => {
    if (isMini) {
      setIsOpenedPages({})
    }
  }, [isMini])

  useEffect(() => {
    handleFilterPages()
  }, [pages])

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
          {newPages &&
            newPages.map(item => {
              return (
                <Fragment key={item.id}>
                  {item.openPaths ? (
                    <OpenItem
                      title={item.name}
                      icon={item.icon}
                      openPath={item.openPaths}
                      path={item.path}
                      isMini={isMini}
                      isOpened={isOpenedPages[item.path] || false}
                      isActive={isActivePage(item.path)}
                      onItemClick={handleNavigate}
                      onToggleOpen={handleToggleOpen}
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
                </Fragment>
              )
            })}
        </div>
      </aside>
    </>
  )
}
