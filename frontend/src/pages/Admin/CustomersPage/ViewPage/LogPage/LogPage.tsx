import { FC, useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import {
  ViewLogTypeData,
  ViewPageContext,
} from '../../../../../app/constants/constants'
import { RecentLog } from '../../../../../features/Admin/CustomersPage/ViewPage/Pages/LogPage/RecentLog/RecentLog'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getSelectedTypeInfo } from '../../../../../shared/utils/api/Admin/ViewContact/GetSelectedTypeInfo'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'
import styles from './LogPage.module.scss'

export const AdminContactLogPage: FC = () => {
  const [data, setData] = useState<ViewLogTypeData[] | null>(null)

  const context = useOutletContext<ViewPageContext>()

  const getInfo = async () => {
    const getResponse = await getSelectedTypeInfo(context.idClient, 'log')

    setData(getResponse.data)
  }

  useEffect(() => {
    document.title = 'infiniti | Contact | Log'
  }, [])

  useEffect(() => {
    getInfo()
  }, [context.idClient])

  return (
    <div className={styles.wrapper}>
      {data ? (
        <RecentCard>
          <RecentLog list={data} />
        </RecentCard>
      ) : (
        <LoadingSpinner size='xl' />
      )}
    </div>
  )
}
