import { FC, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { adminSidebarPages } from '../../../app/data/adminSidebarPages'
import { clientSidebarPages } from '../../../app/data/clientSidebarPages'
import { Routes } from '../../../app/router/routes'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { Header } from '../Header/Header'
import { Sidebar } from '../Sidebar/Sidebar'
import styles from './MainOutlet.module.scss'

export const MainOutlet: FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [isMiniSidebar, setIsMiniSidebar] = useState(false)

  const [isReady, setIsReady] = useState(false)

  const location = useLocation()

  const isAdmin = location.pathname.includes(Routes.adminPages)
  const sidebarPages = isAdmin ? adminSidebarPages : clientSidebarPages

  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState)
  }

  const toggleMiniSidebar = () => {
    setIsMiniSidebar(prevState => !prevState)
  }

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth <= 1080

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
        <LoadingSpinner spinnerStyle={styles.loadingSpinner} />
      ) : (
        <div className={styles.items}>
          <Sidebar
            pages={sidebarPages}
            isMini={isMiniSidebar}
            isMobile={isMobile}
            isOpen={isSidebarOpen}
            isAdmin={isAdmin}
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
            <Header
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
