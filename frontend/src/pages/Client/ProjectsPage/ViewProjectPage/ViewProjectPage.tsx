import { useEffect, useState } from 'react'
import { Outlet, useNavigate, useOutletContext } from 'react-router-dom'

import styles from './ViewProjectPage.module.scss'
import { ProjectsData, UserInfo } from '../../../../app/constants/constants'
import {
  ClientCustomerProjectInfoSidebar,
  ClientSupplierProjectInfoSidebar,
} from '../../../../app/data/clientProjectInfoSidebar'
import { Routes } from '../../../../app/router/routes'
import { SideBar } from '../../../../features/Admin/CustomersPage/ViewPage/SideBar/SideBar'
import { ArrowBackGroundIcon } from '../../../../shared/icons/ArrowBackGroundIcon'
import { BackButton } from '../../../../shared/ui/BackButton/BackButton'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { Status } from '../../../../shared/ui/Status/Status'
import { getProjectView } from '../../../../shared/utils/api/Client/Projects/get-project-view'
import { useIdFromUrl } from '../../../../shared/utils/usefulMethods'

export const ClientViewProjectPage = () => {
  const [projectInfo, setProjectInfo] = useState<ProjectsData | null>(null)

  const [isOpenSideBar, setIsOpenSideBar] = useState<boolean>(false)
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [isInitialized, setIsInitialized] = useState<boolean>(false)

  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchEndX, setTouchEndX] = useState<number | null>(null)

  const { user } = useOutletContext<{ user: UserInfo }>()

  const id = useIdFromUrl('project')
  const navigate = useNavigate()

  const getProjectViewInfo = async () => {
    if (!id) return

    const response = await getProjectView(id)

    if (!response.status) return

    setProjectInfo(response.data.data)
  }

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

  useEffect(() => {
    getProjectViewInfo()
  }, [id])

  useEffect(() => {
    document.title = 'infiniti | View Project'
  }, [])

  const data =
    user && user.status.isSupplier
      ? ClientSupplierProjectInfoSidebar
      : ClientCustomerProjectInfoSidebar

  if (!isInitialized) {
    return null
  }

  return (
    <div className={styles.wrapper}>
      {projectInfo ? (
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.backButton}>
              <BackButton onClick={() => navigate(`/${Routes.clientPages}/${Routes.projects}`)} />
            </div>
            {!isMobile && (
              <div className={styles.titleStatus}>
                <h4 className={styles.accountName}>{projectInfo.name}</h4>
                <Status title={projectInfo.status} status={projectInfo.status} />
              </div>
            )}
            <div className={styles.contentContainer}>
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
                    pages={data}
                    isActive={isMobile && isOpenSideBar}
                    openCloseSidebar={handleOpenCloseSidebar}
                  />
                </div>
              </div>
              <main className={styles.content}>
                <div className={styles.openSidebarWrapper}>
                  <div className={styles.openSideBarButton} onClick={handleOpenCloseSidebar}>
                    <ArrowBackGroundIcon />
                  </div>
                  {isMobile && (
                    <div className={styles.titleStatus}>
                      <h4 className={styles.accountName}>{projectInfo.name}</h4>
                      <Status title={projectInfo.status} status={projectInfo.status} />
                    </div>
                  )}
                </div>
                <Outlet context={{ idProject: id, projectInfo }} />
              </main>
            </div>
          </div>
        </section>
      ) : (
        <div className={styles.loading}>
          <LoadingSpinner size='xl' />
        </div>
      )}
    </div>
  )
}
