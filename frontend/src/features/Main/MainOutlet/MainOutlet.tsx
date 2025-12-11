import clsx from 'clsx'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import styles from './MainOutlet.module.scss'
import { RolesAccess, UserInfo } from '../../../app/constants/constants'
import { adminSidebarPages } from '../../../app/data/adminSidebarPages'
import { clientSidebarPages } from '../../../app/data/clientSidebarPages'
import { Routes } from '../../../app/router/routes'
import { getProfileInfo } from '../../../shared/utils/api/get-profile-info'
import { Survey } from '../../General/Survey/Survey'
import { Block } from '../../General/Survey/types'
import { Header } from '../Header/Header'
import { Sidebar } from '../Sidebar/Sidebar'

interface MainOutletProps {
  roles?: Record<string, RolesAccess>
}

const MemoizedHeader = memo(Header)

export const MainOutlet = ({ roles }: MainOutletProps) => {
  const [user, setUser] = useState<UserInfo | null>(null)

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [isMiniSidebar, setIsMiniSidebar] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [isSidebarLocked, setIsSidebarLocked] = useState(false)
  const [surveyState, setSurveyState] = useState<{
    isOpen: boolean
    blocks: Block[]
    localStorageKey: string
    isBlur: boolean
    onSubmit: ((answers: Record<number, string | string[]>) => void) | null
  }>({
        isOpen: false,
        blocks: [],
        isBlur: false,
        onSubmit: null,
        localStorageKey: '',
      })

  const sidebarRef = useRef<HTMLDivElement | null>(null)
  const location = useLocation()

  const isAdmin = location.pathname.includes(Routes.adminPages)
  const sidebarPages = isAdmin ? adminSidebarPages : clientSidebarPages

  const toggleSidebar = useCallback(() => setIsSidebarOpen(prev => !prev), [])
  const toggleMiniSidebar = useCallback(() => setIsMiniSidebar(prev => !prev), [])

  const openSurvey = useCallback(
    (
      blocks: Block[],
      isBlur: boolean,
      localStorageKey: string,
      onSubmit?: (answers: Record<number, string | string[]>) => void,
    ) => {
      setSurveyState({
        isOpen: true,
        blocks,
        isBlur,
        localStorageKey,
        onSubmit: onSubmit || null,
      })
    },
    [],
  )

  const getUser = async () => {
    const response = await getProfileInfo()

    if (!response.status) return

    setUser(response.data as UserInfo)
  }

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1700

      setIsMobile(mobile)
      setIsMiniSidebar(false)
      setIsSidebarOpen(!mobile)
      setIsReady(true)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (surveyState.isOpen) {
      const scrollY = window.scrollY
      Object.assign(document.body.style, {
        position: 'fixed',
        top: `-${scrollY}px`,
        left: '0',
        right: '0',
      })
    } else {
      const scrollY = Math.abs(parseInt(document.body.style.top || '0', 10))
      Object.assign(document.body.style, {
        position: '',
        top: '',
        left: '',
        right: '',
      })
      window.scrollTo(0, scrollY)
    }
  }, [surveyState.isOpen])

  useEffect(() => {
    getUser()
  }, [])

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen && isMobile ? 'hidden' : 'auto'
  }, [isSidebarOpen, isMobile])

  return (
    <div className={clsx(!isReady ? styles.wrapperLoading : styles.wrapper)}>
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
            className={clsx({
              [styles.headerFull]: !isSidebarOpen,
              [styles.headerMini]: isSidebarOpen && isMiniSidebar,
              [styles.headerStandard]: isSidebarOpen && !isMiniSidebar,
            })}
          >
            <MemoizedHeader
              user={user}
              isSidebarLocked={isSidebarLocked}
              isMiniSidebar={isMiniSidebar}
              setIsSidebarLocked={setIsSidebarLocked}
              toggleMiniSidebar={toggleMiniSidebar}
              toggleSidebar={toggleSidebar}
            />
          </div>
          <main
            style={isSidebarLocked ? { minHeight: '1452px' } : undefined}
            className={clsx({
              [styles.mainFull]: !isSidebarOpen,
              [styles.mainMini]: isSidebarOpen && isMiniSidebar,
              [styles.mainStandard]: isSidebarOpen && !isMiniSidebar,
            })}
          >
            <Outlet context={{ roles, user, getUser, openSurvey }} />
          </main>
        </div>
      )}
      {surveyState.isOpen && (
        <Survey
          blocks={surveyState.blocks}
          isBlur={surveyState.isBlur}
          localStorageKey={surveyState.localStorageKey}
          onClose={() => setSurveyState(prev => ({ ...prev, isOpen: false }))}
          onSubmit={answers => {
            surveyState.onSubmit?.(answers)
            setSurveyState(prev => ({ ...prev, isOpen: false }))
          }}
        />
      )}
    </div>
  )
}
