import { useCallback, useEffect, useState } from 'react'
import { useOutletContext, useSearchParams } from 'react-router-dom'

import styles from './LogsPage.module.scss'
import {
  PagesMetaData,
  ProjectsViewLogsData,
  ProjectViewPageContext,
} from '../../../../../app/constants/constants'
import { RecentLogs } from '../../../../../features/Admin/Projects/LogsProject/RecentLogs/RecentLogs'
import { PagesList } from '../../../../../features/Client/CatalogPage/TalentsList/PagesList/PagesList'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getProjectsLogs } from '../../../../../shared/utils/api/Admin/Projects/get-projects-logs'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'

export const AdminProjectsLogsPage = () => {
  const [logs, setLogs] = useState<{
    data: ProjectsViewLogsData[]
    meta: PagesMetaData
  } | null>(null)

  const [searchParams, setSearchParams] = useSearchParams()

  const page = searchParams.get('page') || '1'

  const context = useOutletContext<ProjectViewPageContext>()

  const updateQueryParam = (key: string, value: string | number) => {
    const newParams = new URLSearchParams(location.search)

    newParams.set(key, String(value))

    setSearchParams(newParams, { replace: true })
  }

  const updatePage = (newPage: number) => updateQueryParam('page', newPage)

  const getLogs = useCallback(async () => {
    const response = await getProjectsLogs(context.idProject, `?page=${page}`)

    if (!response.status) return

    setLogs(response.data)
  }, [searchParams])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    let changed = false

    if (!params.has('page')) {
      params.set('page', '1')
      changed = true
    }

    if (changed) {
      setSearchParams(params, { replace: true })
    }
  }, [])

  useEffect(() => {
    getLogs()
  }, [searchParams, context.idProject])

  useEffect(() => {
    document.title = 'infiniti | Project Logs'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {logs ? (
          <RecentCard
            title='Project Logs'
            style={styles.recentFullScreen}
            PagesComponent={logs.data.length > 0 ? PagesList : undefined}
            pagesProps={
              logs.data.length > 0
                ? {
                  meta: logs.meta,
                  nextPage: updatePage,
                  size: 'sm',
                }
                : undefined
            }
          >
            <RecentLogs data={logs.data} />
          </RecentCard>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
    </div>
  )
}
