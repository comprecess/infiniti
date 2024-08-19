import { FC, useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import { ViewActivityTypeData } from '../../../../../app/constants/constants'
import { RecentActivity } from '../../../../../features/Admin/CustomersPage/ViewPage/Pages/ActivityPage/RecentActivity/RecentActivity'
import { TextEditorWrapper } from '../../../../../features/Admin/CustomersPage/ViewPage/Pages/ActivityPage/TextEditorWrapper/TextEditorWrapper'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getSelectedTypeInfo } from '../../../../../shared/utils/api/Admin/ViewContact/GetSelectedTypeInfo'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'
import styles from './ActivityPage.module.scss'

export const AdminContactActivityPage: FC = () => {
  const [data, setData] = useState<ViewActivityTypeData[] | null>(null)

  const id = useOutletContext<number>()

  const getInfo = async () => {
    const getResponse = await getSelectedTypeInfo(id, 'activity')

    setData(getResponse.data)
  }

  useEffect(() => {
    document.title = 'infiniti | Contact | Activity'
  }, [])

  useEffect(() => {
    getInfo()
  }, [id])

  return (
    <div className={styles.wrapper}>
      {data ? (
        <RecentCard HeaderComponent={TextEditorWrapper}>
          <RecentActivity list={data} />
        </RecentCard>
      ) : (
        <LoadingSpinner size='xl' />
      )}
    </div>
  )
}
