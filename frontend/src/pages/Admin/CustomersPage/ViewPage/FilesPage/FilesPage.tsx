import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'

import { ViewPageContext } from '../../../../../app/constants/constants'
import { Header } from '../../../../../features/Admin/CustomersPage/ViewPage/Pages/FilesPage/Header/Header'
import { RecentFiles } from '../../../../../features/Admin/CustomersPage/ViewPage/Pages/FilesPage/RecentFiles/RecentFiles'
import { useCustomToast } from '../../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { deleteCustomerObject } from '../../../../../shared/utils/api/Admin/ViewContact/delete-customer-object'
import { putAddViewFile } from '../../../../../shared/utils/api/Admin/ViewContact/Files/put-add-view-file'
import { getSelectedTypeInfo } from '../../../../../shared/utils/api/Admin/ViewContact/get-selected-type-info'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'
import styles from './FilesPage.module.scss'

export const AdminContactFilesPage = () => {
  const queryClient = useQueryClient()
  const context = useOutletContext<ViewPageContext>()
  const showToast = useCustomToast()

  const { data: files } = useQuery({
    queryKey: ['files', context.idClient],
    queryFn: async () => {
      const response = await getSelectedTypeInfo(context.idClient, 'files')

      if (!response.status) return

      return response.data
    },
    placeholderData: previousData => previousData,
  })

  const onChangeInput = async (value: number) => {
    const addResponse = await putAddViewFile(context.idClient, 'files', {
      id: value,
    })

    if (addResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully added the file',
        status: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['files'] })
    } else {
      showToast({
        title: 'Error',
        description: addResponse.message,
        status: 'error',
      })
    }
  }

  const deleteFile = async (idType: number) => {
    const deleteResponse = await deleteCustomerObject(
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
      queryClient.invalidateQueries({ queryKey: ['files'] })
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

  return (
    <div className={styles.wrapper}>
      {files ? (
        <RecentCard
          HeaderComponent={Header}
          headerProps={{
            onChange: onChangeInput,
            groupsList: files.listFiles,
          }}
        >
          <RecentFiles list={files.clientFiles} deleteFile={deleteFile} />
        </RecentCard>
      ) : (
        <LoadingSpinner size='xl' />
      )}
    </div>
  )
}
