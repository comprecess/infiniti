import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import styles from './MainOutlet.module.scss'
import { RolesAccess } from '../../../app/constants/constants'
import { adminSidebarPages } from '../../../app/data/adminSidebarPages'
import { clientSidebarPages } from '../../../app/data/clientSidebarPages'
import { Routes } from '../../../app/router/routes'
import { Survey } from '../../General/Survey/Survey'
import { Block } from '../../General/Survey/types'
import { Header } from '../Header/Header'
import { Sidebar } from '../Sidebar/Sidebar'

interface MainOutletProps {
  roles?: {
    [key: string]: RolesAccess
  }
}

const MemoizedHeader = memo(Header)

export const MainOutlet = ({ roles }: MainOutletProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true)
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [isMiniSidebar, setIsMiniSidebar] = useState<boolean>(false)

  const [isReady, setIsReady] = useState<boolean>(false)
  const [isSidebarLocked, setIsSidebarLocked] = useState<boolean>(false)

  const [customSurveySubmit, setCustomSurveySubmit] = useState<
  ((answers: Record<number, string | string[]>) => void) | null
  >(null)
  const [isSurveyOpen, setIsSurveyOpen] = useState<boolean>(false)
  const [surveyBlocks, setSurveyBlocks] = useState<Block[]>([])

  const sidebarHeight = 1452

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

  const openSurvey = (
    questions: Block[],
    onSubmit?: (answers: Record<number, string | string[]>) => void,
  ) => {
    setSurveyBlocks(questions)
    setCustomSurveySubmit(() => onSubmit || null)
    setIsSurveyOpen(true)
  }

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
    if (isSurveyOpen) {
      const scrollY = window.scrollY

      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.left = '0'
      document.body.style.right = '0'
    } else {
      const scrollY = Math.abs(parseInt(document.body.style.top || '0', 10))

      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      window.scrollTo(0, scrollY)
    }
  }, [isSurveyOpen])

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
            style={
              isSidebarLocked
                ? {
                  minHeight: `${sidebarHeight}px`,
                }
                : {}
            }
            className={
              isSidebarOpen
                ? isMiniSidebar
                  ? styles.mainMini
                  : styles.mainStandard
                : styles.mainFull
            }
          >
            <Outlet context={{ roles, openSurvey }} />
          </main>
        </div>
      )}
      {isSurveyOpen && (
        <Survey
          isBlur
          blocks={surveyBlocks}
          onClose={() => setIsSurveyOpen(false)}
          onSubmit={answers => {
            if (customSurveySubmit) {
              customSurveySubmit(answers)
            }
            setIsSurveyOpen(false)
          }}
        />
      )}
    </div>
  )
}
