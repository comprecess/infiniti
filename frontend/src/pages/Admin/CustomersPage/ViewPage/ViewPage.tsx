import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Outlet, useOutletContext } from 'react-router-dom'

import { RolesAccess } from '../../../../app/constants/constants'
import { ContactInfoSideBarData } from '../../../../app/data/contactInfoSideBar'
import { SideBar } from '../../../../features/Admin/CustomersPage/ViewPage/SideBar/SideBar'
import { ArrowBackGroundIcon } from '../../../../shared/icons/ArrowBackGroundIcon'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getPagesListInfo } from '../../../../shared/utils/api/Admin/ViewContact/get-pages-list-info'
import { useIdFromUrl } from '../../../../shared/utils/usefulMethods'
import styles from './ViewPage.module.scss'

export const AdminViewPage = () => {
  const [isOpenSideBar, setIsOpenSideBar] = useState<boolean>(false)
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [isInitialized, setIsInitialized] = useState<boolean>(false)

  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchEndX, setTouchEndX] = useState<number | null>(null)

  const { roles } = useOutletContext<{
    roles?: { [key: string]: RolesAccess }
  }>()
  const id = useIdFromUrl('view')

  const handleOpenCloseSidebar = () => {
    setIsOpenSideBar(!isOpenSideBar)
  }

  const { data: pagesInfo } = useQuery({
    queryKey: ['pages', id],
    queryFn: async () => {
      if (id === null) return

      const response = await getPagesListInfo(id)

      if (!response.status) return

      return response.data
    },
    placeholderData: previousData => previousData,
  })

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
        {pagesInfo ? (
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
                  roles={roles}
                  data={pagesInfo}
                  pages={ContactInfoSideBarData}
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
                <h4 className={styles.accountName}>{pagesInfo.account}</h4>
              </div>
              <Outlet context={{ idClient: id, roles }} />
            </main>
          </div>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
    </div>
  )
}
