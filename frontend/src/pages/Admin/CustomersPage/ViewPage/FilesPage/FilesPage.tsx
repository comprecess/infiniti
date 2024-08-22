import { FC, useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import {
  ViewFilesTypeData,
  ViewPageContext,
} from '../../../../../app/constants/constants'
import { Header } from '../../../../../features/Admin/CustomersPage/ViewPage/Pages/FilesPage/Header/Header'
import { RecentFiles } from '../../../../../features/Admin/CustomersPage/ViewPage/Pages/FilesPage/RecentFiles/RecentFiles'
import { useCustomToast } from '../../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { deleteObject } from '../../../../../shared/utils/api/Admin/ViewContact/DeleteObject'
import { addViewFile } from '../../../../../shared/utils/api/Admin/ViewContact/Files/AddFile'
import { getSelectedTypeInfo } from '../../../../../shared/utils/api/Admin/ViewContact/GetSelectedTypeInfo'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'
import styles from './FilesPage.module.scss'

export const AdminContactFilesPage: FC = () => {
  const [data, setData] = useState<ViewFilesTypeData | null>(null)

  const context = useOutletContext<ViewPageContext>()
  const showToast = useCustomToast()

  const getInfo = async () => {
    const getResponse = await getSelectedTypeInfo(
      context.idClient,
      'files',
    )

    setData(getResponse)
  }

  const onChangeInput = async (value: number) => {
    const addResponse = await addViewFile(context.idClient, 'files', {
      id: value,
    })

    if (addResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully added the file',
        status: 'success',
      })
      getInfo()
    } else {
      showToast({
        title: 'Error',
        description: addResponse.message,
        status: 'error',
      })
    }
  }

  const deleteFile = async (idType: number) => {
    const deleteResponse = await deleteObject(
      context.idClient,
      'files',
      idType,
    )

    if (deleteResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully deleted the file',
        status: 'success',
      })
      getInfo()
    } else {
      showToast({
        title: 'Error',
        description: deleteResponse.message,
        status: 'error',
      })
    }
  }

  useEffect(() => {
    document.title = 'infiniti | Contact | Files'
  }, [])

  useEffect(() => {
    getInfo()
  }, [context.idClient])

  return (
    <div className={styles.wrapper}>
      {data ? (
        <RecentCard
          HeaderComponent={Header}
          headerProps={{
            onChange: onChangeInput,
            groupsList: data.listFiles,
          }}
        >
          <RecentFiles list={data.clientFiles} deleteFile={deleteFile} />
        </RecentCard>
      ) : (
        <LoadingSpinner size='xl' />
      )}
    </div>
  )
}
