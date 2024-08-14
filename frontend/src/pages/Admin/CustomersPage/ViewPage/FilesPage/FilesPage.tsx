import { FC, useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import { ViewFilesTypeData } from '../../../../../app/constants/constants'
import { Header } from '../../../../../features/Admin/CustomersPage/ViewPage/Pages/FilesPage/Header/Header'
import { RecentFiles } from '../../../../../features/Admin/CustomersPage/ViewPage/Pages/FilesPage/RecentFiles/RecentFiles'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getSelectedTypeInfo } from '../../../../../shared/utils/api/Admin/ViewContact/GetSelectedTypeInfo'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'
import styles from './FilesPage.module.scss'

export const AdminContactFilesPage: FC = () => {
  const [data, setData] = useState<ViewFilesTypeData | null>(null)

  const id = useOutletContext<number>()

  const getInfo = async () => {
    const getResponse = await getSelectedTypeInfo(id, 'files')

    setData(getResponse)
  }

  const onChangeInput = (name: string, value: string) => {
    console.log(name, value)
  }

  useEffect(() => {
    document.title = 'infiniti | Contact | Files'
  }, [])

  useEffect(() => {
    getInfo()
  }, [id])

  return (
    <div className={styles.wrapper}>
      {data ? (
        <RecentCard
          HeaderComponent={Header}
          headerProps={{ onChange: onChangeInput, groupsList: data.listFiles }}
        >
          <RecentFiles list={data.clientFiles} />
        </RecentCard>
      ) : (
        <LoadingSpinner size='xl' />
      )}
    </div>
  )
}
