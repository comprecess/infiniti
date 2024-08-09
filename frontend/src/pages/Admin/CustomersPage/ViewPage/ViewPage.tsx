import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { ViewListPagesAndInfo } from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import { SideBar } from '../../../../features/Admin/CustomersPage/ViewPage/SideBar/SideBar'
import { ArrowBackGroundIcon } from '../../../../shared/icons/ArrowBackGroundIcon'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getListPagesAndInfo } from '../../../../shared/utils/api/Admin/ViewContact/GetListPagesAndInfo'
import styles from './ViewPage.module.scss'

const extractIdFromUrl = (url: string): number | null => {
  const regex = /\/view\/(\d+)/
  const match = url.match(regex)

  return match ? parseInt(match[1], 10) : null
}

const useIdFromUrl = () => {
  const location = useLocation()

  const id = useMemo(
    () => extractIdFromUrl(location.pathname),
    [location.pathname],
  )

  return id
}

export const AdminViewPage: FC = () => {
  const [isOpenSideBar, setIsOpenSideBar] = useState<boolean>(true)
  const [isMobile, setIsMobile] = useState<boolean>(false)

  const [pagesAndInfo, setPagesAndInfo] =
    useState<ViewListPagesAndInfo | null>(null)

  const navigate = useNavigate()

  const id = useIdFromUrl()

  const handleOpenCloseSidebar = () => {
    setIsOpenSideBar(!isOpenSideBar)
  }

  const getListPagesInfo = useCallback(async () => {
    if (id !== null) {
      const getResponse = await getListPagesAndInfo(id)

      setPagesAndInfo(getResponse)

      if (!getResponse.status) {
        navigate('/' + Routes.notFound)
      }
    }
  }, [id])

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

  useEffect(() => {
    getListPagesInfo()
  }, [id])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {pagesAndInfo ? (
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
                    ? styles.sideBarActive
                    : styles.sideBarClosed
                  : styles.sidebar
              }
            >
              <SideBar
                data={pagesAndInfo}
                isActive={isMobile && isOpenSideBar}
              />
            </div>
            <main className={styles.content}>
              <div className={styles.openSidebarWrapper}>
                <div
                  className={styles.openSideBarButton}
                  onClick={handleOpenCloseSidebar}
                >
                  <ArrowBackGroundIcon />
                </div>
                <h4 className={styles.accountName}>
                  {pagesAndInfo.account}
                </h4>
              </div>
              <Outlet context={id} />
            </main>
          </div>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
    </div>
  )
}
