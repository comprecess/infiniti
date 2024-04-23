import { FC, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { adminSidebarPages } from '../../../app/data/adminSidebarPages'
import { clientSidebarPages } from '../../../app/data/clientSidebarPages'
import { Routes } from '../../../app/router/routes'
import { Header } from '../../../features/Main/Header/Header'
import { Sidebar } from '../../../features/Main/Sidebar/Sidebar'
import styles from './DashboardOutlet.module.scss'

export const DashboardOutlet: FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [isMiniSidebar, setIsMiniSidebar] = useState(false)

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
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className={styles.wrapper}>
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
    </div>
  )
}
