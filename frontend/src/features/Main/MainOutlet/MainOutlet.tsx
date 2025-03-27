import { memo, useCallback, useEffect, useRef, useState } from 'react'
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

export const MainOutlet = ({ roles }: MainOutletProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true)
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [isMiniSidebar, setIsMiniSidebar] = useState<boolean>(false)

  const [isReady, setIsReady] = useState<boolean>(false)

  const [isSidebarLocked, setIsSidebarLocked] = useState<boolean>(false)
  const [sidebarHeight, setSidebarHeight] = useState<number>(0)

  const location = useLocation()

  const isAdmin = location.pathname.includes(Routes.adminPages)
  const sidebarPages = isAdmin ? adminSidebarPages : clientSidebarPages

  const sidebarRef = useRef<HTMLDivElement | null>(null)

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

  useEffect(() => {
    if (sidebarRef.current && isSidebarOpen && isSidebarLocked) {
      console.log(sidebarRef.current.clientHeight)

      setSidebarHeight(sidebarRef.current.clientHeight)
    }
  }, [isSidebarLocked, isSidebarOpen, location.pathname])

  return (
    <div className={!isReady ? styles.wrapperLoading : styles.wrapper}>
      {!isReady ? (
        <div />
      ) : (
        <div className={styles.items}>
          <Sidebar
            ref={sidebarRef}
            pages={sidebarPages}
            isMini={isMiniSidebar}
            isMobile={isMobile}
            isOpen={isSidebarOpen}
            isAdmin={isAdmin}
            roles={roles}
            isLocked={isSidebarLocked}
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
              isSidebarLocked={isSidebarLocked}
              isMiniSidebar={isMiniSidebar}
              setIsSidebarLocked={setIsSidebarLocked}
              toggleMiniSidebar={toggleMiniSidebar}
              toggleSidebar={toggleSidebar}
            />
          </div>
          <main
            style={{
              minHeight: `${sidebarHeight}px`,
            }}
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
