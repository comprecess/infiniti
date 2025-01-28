import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import {
  ViewActivityTypeData,
  ViewPageContext,
} from '../../../../../app/constants/constants'
import { EditActivityModal } from '../../../../../features/Admin/CustomersPage/ViewPage/Pages/ActivityPage/EditActivityModal/EditActivityModal'
import { RecentActivity } from '../../../../../features/Admin/CustomersPage/ViewPage/Pages/ActivityPage/RecentActivity/RecentActivity'
import { TextEditorWrapper } from '../../../../../features/Admin/CustomersPage/ViewPage/Pages/ActivityPage/TextEditorWrapper/TextEditorWrapper'
import { useCustomToast } from '../../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { addActivity } from '../../../../../shared/utils/api/Admin/ViewContact/Activity/AddNewActivity'
import { editSelectedActivity } from '../../../../../shared/utils/api/Admin/ViewContact/Activity/EditSelectedActivity'
import { deleteObject } from '../../../../../shared/utils/api/Admin/ViewContact/DeleteObject'
import { getSelectedTypeInfo } from '../../../../../shared/utils/api/Admin/ViewContact/GetSelectedTypeInfo'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'
import styles from './ActivityPage.module.scss'

interface EditActiveModalData {
  icon: string
  message: string
}

export const AdminContactActivityPage = () => {
  const [selectedIcon, setSelectedIcon] = useState<string>('check')
  const [message, setMessage] = useState<string>('')

  const [selectedIdType, setSelectedIdType] = useState<number>(0)

  const [editActiveData, setEditActiveData] = useState<
  EditActiveModalData | undefined
  >()

  const [isEditActivityModal, setIsEditActivityModal] =
    useState<boolean>(false)

  const queryClient = useQueryClient()
  const context = useOutletContext<ViewPageContext>()
  const showToast = useCustomToast()

  const openEditActivityModal = () => {
    setIsEditActivityModal(prev => !prev)
  }

  const { data: activity } = useQuery({
    queryKey: ['activity', context.idClient],
    queryFn: async () => {
      const response: { data: ViewActivityTypeData[] } =
        await getSelectedTypeInfo(context.idClient, 'activity')

      return response
    },
    placeholderData: previousData => previousData,
  })

  const addNewActivity = async () => {
    const addResponse = await addActivity(
      context.idClient,
      'activity',
      selectedIcon,
      message,
    )

    if (addResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully added activity',
        status: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['activity'] })
    } else {
      showToast({
        title: 'Error',
        description: addResponse.message,
        status: 'error',
      })
    }
  }

  const openEditModal = (
    idType: number,
    icon: string,
    message: string,
  ) => {
    setSelectedIdType(idType)
    setEditActiveData({ icon, message })
  }

  const deleteSelectedActivity = async (id: number) => {
    const deleteResponse = await deleteObject(
      context.idClient,
      'activity',
      id,
    )

    if (deleteResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully deleted the Activity',
        status: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['activity'] })
    } else {
      showToast({
        title: 'Error',
        description: deleteResponse.message,
        status: 'error',
      })
    }
  }

  const updateSelectedActivityInfo = async (
    icon: string,
    message: string,
  ) => {
    const updateResponse = await editSelectedActivity(
      context.idClient,
      selectedIdType,
      'activity',
      icon,
      message,
    )

    if (updateResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully changed the activity',
        status: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['activity'] })
    } else {
      showToast({
        title: 'Error',
        description: updateResponse.message,
        status: 'error',
      })
    }
  }

  useEffect(() => {
    document.title = 'infiniti | Contact | Activity'
  }, [])

  useEffect(() => {
    if (
      editActiveData?.icon != undefined &&
      editActiveData?.message != undefined
    ) {
      setIsEditActivityModal(true)
    }
  }, [editActiveData])

  return (
    <div className={styles.wrapper}>
      {activity ? (
        <RecentCard
          HeaderComponent={TextEditorWrapper}
          headerProps={{
            selectedIcon,
            message,
            setSelectedIcon,
            setMessage,
            addNewActivity,
          }}
        >
          {activity.data.length > 0 && (
            <RecentActivity
              deleteSelectedActivity={deleteSelectedActivity}
              editActivity={openEditModal}
              list={activity.data}
            />
          )}
        </RecentCard>
      ) : (
        <LoadingSpinner size='xl' />
      )}
      <EditActivityModal
        icon={editActiveData?.icon}
        message={editActiveData?.message}
        modalEditActivity={isEditActivityModal}
        handleOpenCloseModal={openEditActivityModal}
        saveInfo={updateSelectedActivityInfo}
      />
    </div>
  )
}
