import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

import { ProjectInfoSidebar } from '../../../../app/data/projectInfoSidebar'
import { SideBar } from '../../../../features/Admin/CustomersPage/ViewPage/SideBar/SideBar'
import { ArrowBackGroundIcon } from '../../../../shared/icons/ArrowBackGroundIcon'
import { useIdFromUrl } from '../../../../shared/utils/usefulMethods'
import styles from './ViewProjectPage.module.scss'

export const AdminViewProjectPage = () => {
  const [isOpenSideBar, setIsOpenSideBar] = useState<boolean>(false)
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [isInitialized, setIsInitialized] = useState<boolean>(false)

  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchEndX, setTouchEndX] = useState<number | null>(null)

  const id = useIdFromUrl('view')

  const handleOpenCloseSidebar = () => {
    setIsOpenSideBar(!isOpenSideBar)
  }

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
        setIsOpenSideBar(false)
      }
    }
    setTouchStartX(null)
    setTouchEndX(null)
  }

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth <= 1080

      setIsMobile(isMobileView)
      setIsOpenSideBar(!isMobileView)
      setIsInitialized(true)
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (isOpenSideBar && isMobile) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [isOpenSideBar, isMobile])

  if (!isInitialized) {
    return null
  }

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <div className={styles.container}>
          {isMobile && isOpenSideBar && (
            <div
              className={styles.sidebarOverlay}
              onClick={handleOpenCloseSidebar}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />
          )}
          <div
            className={
              isMobile
                ? isOpenSideBar
                  ? styles.sidebarWrapperActive
                  : styles.sidebarWrapperDisable
                : ''
            }
          >
            <div className={styles.sideBarOverFlow}>
              <SideBar
                pages={ProjectInfoSidebar}
                isActive={isMobile && isOpenSideBar}
                openCloseSidebar={handleOpenCloseSidebar}
              />
            </div>
          </div>
          <main className={styles.content}>
            <div className={styles.openSidebarWrapper}>
              <div
                className={styles.openSideBarButton}
                onClick={handleOpenCloseSidebar}
              >
                <ArrowBackGroundIcon />
              </div>
              <h4 className={styles.accountName}>---Title---</h4>
            </div>
            <Outlet context={{ idProject: id }} />
          </main>
        </div>
      </section>
    </div>
  )
}
