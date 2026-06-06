import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate, useOutletContext } from 'react-router-dom'

import styles from './ViewProjectPage.module.scss'
import { ProjectsData, RolesAccess } from '../../../../app/constants/constants'
import { ProjectInfoSidebar } from '../../../../app/data/projectInfoSidebar'
import { Routes } from '../../../../app/router/routes'
import { SideBar } from '../../../../features/Admin/CustomersPage/ViewPage/SideBar/SideBar'
import { useProjectTemplateSidebar } from '../../../../shared/hooks/useProjectTemplateSidebar'
import { ArrowBackGroundIcon } from '../../../../shared/icons/ArrowBackGroundIcon'
import { BackButton } from '../../../../shared/ui/BackButton/BackButton'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { Status } from '../../../../shared/ui/Status/Status'
import { getProjectView } from '../../../../shared/utils/api/Admin/Projects/get-project-view'
import { useIdFromUrl } from '../../../../shared/utils/usefulMethods'
import { getProjectMetadataGroup } from '../../../../shared/utils/api/Admin/Projects/project-metadata'

export const AdminViewProjectPage = () => {
  const [projectInfo, setProjectInfo] = useState<ProjectsData | null>(null)

  const [isOpenSideBar, setIsOpenSideBar] = useState<boolean>(false)
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [isInitialized, setIsInitialized] = useState<boolean>(false)

  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchEndX, setTouchEndX] = useState<number | null>(null)
  const [onboardingChecked, setOnboardingChecked] = useState<boolean>(false)
  const [onboardingProgress, setOnboardingProgress] = useState<number>(0)
  const location = useLocation()

  const { roles } = useOutletContext<{
    roles?: { [key: string]: RolesAccess }
  }>()

  const id = useIdFromUrl('project')
  const navigate = useNavigate()

  const getProjectViewInfo = async () => {
    if (!id) return

    const response = await getProjectView(id)

    if (!response.status) return

    setProjectInfo(response.data.data)
  }

  // Dynamic sidebar: uses template_code from projectInfo if available
  const templateCode = (projectInfo as any)?.template_code ?? null
  const { pages: sidebarPages, loading: sidebarLoading } =
    useProjectTemplateSidebar(templateCode, ProjectInfoSidebar)

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
  // Auto-redirect to onboarding if not completed (exit_deal template only)
  useEffect(() => {
    const checkOnboarding = async () => {
      if (!id || !templateCode || templateCode !== 'exit_deal') {
        setOnboardingChecked(true)
        return
      }
      if (location.pathname.endsWith('/onboarding')) {
        setOnboardingChecked(true)
        return
      }
      const response = await getProjectMetadataGroup(id, 'onboarding')
      if (response.status && response.data) {
        const data = response.data as Record<string, string>
        if (data.status === 'completed') {
          setOnboardingProgress(100)
          setOnboardingChecked(true)
          return
        }
      }
      setOnboardingProgress(0)
      navigate('onboarding', { replace: true })
      setOnboardingChecked(true)
    }
    if (projectInfo) {
      checkOnboarding()
    }
  }, [id, templateCode, projectInfo, location.pathname])

  useEffect(() => {
    document.title = 'infiniti | View Project'
  }, [])

  if (!isInitialized) {
    return null
  }

  return (
    <div className={styles.wrapper}>
      {projectInfo ? (
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.backButton}>
              <BackButton onClick={() => navigate(`/${Routes.adminPages}/${Routes.projects}`)} />
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
                  {sidebarLoading ? (
                    <LoadingSpinner size='sm' />
                  ) : (
                    <SideBar
                      pages={sidebarPages}
                      isActive={isMobile && isOpenSideBar}
                      openCloseSidebar={handleOpenCloseSidebar}
                    />
                  )}
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
                <Outlet context={{ idProject: id, projectInfo, templateCode, roles, onboardingProgress }} />
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
