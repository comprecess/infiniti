import { FC, useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

import { Header } from '../../../features/Dashboard/Header/Header'
import { Sidebar } from '../../../features/Dashboard/Sidebar/Sidebar'
import styles from './DashboardOutlet.module.scss'

export const DashboardOutlet: FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [isMiniSidebar, setIsMiniSidebar] = useState(false)

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
      <Sidebar
        isMini={isMiniSidebar}
        isMobile={isMobile}
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
      />
      <main
        className={
          isSidebarOpen
            ? isMiniSidebar
              ? styles.mainMini
              : isMobile
              ? styles.mainMobile
              : styles.mainCut
            : styles.mainFull
        }
      >
        <Header
          isMiniSidebar={isMiniSidebar}
          toggleMiniSidebar={toggleMiniSidebar}
          toggleSidebar={toggleSidebar}
        />
        <Outlet />
      </main>
    </div>
  )
}
