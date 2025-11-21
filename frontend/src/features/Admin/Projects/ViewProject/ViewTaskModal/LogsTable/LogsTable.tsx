import { Fragment, useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { Item } from './Item/Item'
import styles from './LogsTable.module.scss'
import { PagesMetaData, ProjectsViewLogsData } from '../../../../../../app/constants/constants'
import { CustomDivider } from '../../../../../../shared/ui/CustomDivider/CustomDivider'
import { LoadingSpinner } from '../../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getProjectTaskLogs } from '../../../../../../shared/utils/api/Admin/Projects/get-project-task-logs'
import { useIdFromUrl } from '../../../../../../shared/utils/usefulMethods'
import { PagesList } from '../../../../../Client/CatalogPage/TalentsList/PagesList/PagesList'
import { Title } from '../../../../../Main/RecentCard/Title/Title'

interface LogsTableProps {
  idTask: number
}

export const LogsTable = ({ idTask }: LogsTableProps) => {
  const [logsData, setLogsData] = useState<{
    data: ProjectsViewLogsData[]
    meta: PagesMetaData
  } | null>(null)

  const [searchParams, setSearchParams] = useSearchParams()

  const page = searchParams.get('page') || '1'

  const idProject = useIdFromUrl('project')

  const updateQueryParam = (key: string, value: string | number) => {
    const newParams = new URLSearchParams(location.search)

    newParams.set(key, String(value))

    setSearchParams(newParams, { replace: true })
  }

  const updatePage = (newPage: number) => updateQueryParam('page', newPage)

  const getLogsTask = useCallback(async () => {
    if (!idProject) return

    const response = await getProjectTaskLogs(idProject, idTask, `?page=${page}`)

    if (!response.status) return

    setLogsData(response.data)
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
    getLogsTask()
  }, [searchParams, idProject])

  if (!logsData) {
    return (
      <div className={styles.loading}>
        <LoadingSpinner />
      </div>
    )
  }

  if (logsData.data.length === 0) {
    return (
      <div className={styles.nothingFound}>
        <span className={styles.nothingFoundText}>Nothing Found</span>
      </div>
    )
  }

  return (
    <>
      <div className={styles.scrollTable}>
        <div className={styles.wrapper}>
          <div className={styles.columns}>
            <Title title='Avatar' style={styles.avatarColumn} />
            <Title title='Account' style={styles.accountColumn} />
            <Title title='Date / Time' style={styles.timeColumn} />
            <Title title='Description' style={styles.descriptionColumn} />
          </div>
          <div className={styles.items}>
            {logsData.data.map((data, index) => {
              return (
                <Fragment key={data.id}>
                  <Item data={data} />
                  {index !== logsData.data.length - 1 && <CustomDivider />}
                </Fragment>
              )
            })}
          </div>
        </div>
      </div>
      <div className={styles.pages}>
        <PagesList meta={logsData.meta} nextPage={updatePage} />
      </div>
    </>
  )
}
