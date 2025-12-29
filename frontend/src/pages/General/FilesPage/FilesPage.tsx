import { useEffect, useMemo, useRef } from 'react'
import { useLocation } from 'react-router-dom'

import styles from './FilesPage.module.scss'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getAuthToken } from '../../../shared/utils/api/get-auth-token'
import { downloadOrViewFile } from '../../../shared/utils/usefulMethods'

const extractTokenFromUrl = (url: string): string | null => {
  const regex = /\/get-file\/([^/]+)$/
  const match = url.match(regex)

  return match ? match[1] : null
}

const useTokenFromUrl = () => {
  const location = useLocation()

  return useMemo(() => extractTokenFromUrl(location.pathname), [location.pathname])
}

export const PublicFilesPage = () => {
  const hasStartedRef = useRef(false)

  const authToken = getAuthToken()
  const hash = useTokenFromUrl()

  const handleDownloadFile = async () => {
    const headers: HeadersInit = authToken ? { Authorization: `Bearer ${authToken}` } : {}

    try {
      const response = await fetch(
        `${import.meta.env.VITE_MAIN_DOMAIN}${import.meta.env.VITE_GET_DOCUMENT}/${hash}`,
        { headers },
      )

      if (!response.ok) throw new Error('Ошибка загрузки файла')

      const blob = await response.blob()

      await downloadOrViewFile(blob, 'file', 'current', true)
    } catch (error) {
      console.error('Не удалось скачать/просмотреть файл', error)
    }
  }

  useEffect(() => {
    if (!hash || hasStartedRef.current) return

    hasStartedRef.current = true

    handleDownloadFile()
  }, [hash])

  return (
    <div className={styles.loading}>
      <LoadingSpinner size='xl' />
    </div>
  )
}
