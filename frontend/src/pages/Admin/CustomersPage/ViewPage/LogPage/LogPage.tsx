import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'

import styles from './LogPage.module.scss'
import { ViewPageContext } from '../../../../../app/constants/constants'
import { RecentLog } from '../../../../../features/Admin/CustomersPage/ViewPage/Pages/LogPage/RecentLog/RecentLog'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getSelectedTypeInfo } from '../../../../../shared/utils/api/Admin/ViewContact/get-selected-type-info'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'

export const AdminContactLogPage = () => {
  const context = useOutletContext<ViewPageContext>()

  const { data: logs } = useQuery({
    queryKey: ['logs', context.idClient],
    queryFn: async () => {
      const response = await getSelectedTypeInfo(context.idClient, 'log')

      if (!response.status) return

      return response.data
    },
    placeholderData: previousData => previousData,
  })

  useEffect(() => {
    document.title = 'infiniti | Contact | Log'
  }, [])

  return (
    <div className={styles.wrapper}>
      {logs ? (
        <RecentCard>
          <RecentLog list={logs.data} />
        </RecentCard>
      ) : (
        <LoadingSpinner size='xl' />
      )}
    </div>
  )
}
