import { FC, memo, useCallback, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { adminSidebarPages } from '../../../app/data/adminSidebarPages'
import { clientSidebarPages } from '../../../app/data/clientSidebarPages'
import { Routes } from '../../../app/router/routes'
import { Header } from '../Header/Header'
import { Sidebar } from '../Sidebar/Sidebar'
import styles from './MainOutlet.module.scss'

interface MainOutletProps {
  roles?: {
    [key: string]: {
      view: number
      create: number
    }
  }
}

const MemoizedHeader = memo(Header)

export const MainOutlet: FC<MainOutletProps> = ({ roles }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [isMiniSidebar, setIsMiniSidebar] = useState(false)

  const [isReady, setIsReady] = useState(false)

  const location = useLocation()

  const isAdmin = location.pathname.includes(Routes.adminPages)
  const sidebarPages = isAdmin ? adminSidebarPages : clientSidebarPages

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prevState => !prevState)
  }, [])

  const toggleMiniSidebar = useCallback(() => {
    setIsMiniSidebar(prevState => !prevState)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth <= 1700

      setIsMobile(isMobileView)
      setIsMiniSidebar(false)
      setIsSidebarOpen(!isMobileView)

      setIsReady(true)
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (isSidebarOpen && isMobile) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [isSidebarOpen, isMobile])

  return (
    <div className={!isReady ? styles.wrapperLoading : styles.wrapper}>
      {!isReady ? (
        <div />
      ) : (
        <div className={styles.items}>
          <Sidebar
            pages={sidebarPages}
            isMini={isMiniSidebar}
            isMobile={isMobile}
            isOpen={isSidebarOpen}
            isAdmin={isAdmin}
            roles={roles}
            onClose={toggleSidebar}
          />
          <div
            className={
              isSidebarOpen
                ? isMiniSidebar
                  ? styles.headerMini
                  : styles.headerStandard
                : styles.headerFull
            }
          >
            <MemoizedHeader
              isMiniSidebar={isMiniSidebar}
              toggleMiniSidebar={toggleMiniSidebar}
              toggleSidebar={toggleSidebar}
            />
          </div>
          <main
            className={
              isSidebarOpen
                ? isMiniSidebar
                  ? styles.mainMini
                  : styles.mainStandard
                : styles.mainFull
            }
          >
            <Outlet />
          </main>
        </div>
      )}
    </div>
  )
}
