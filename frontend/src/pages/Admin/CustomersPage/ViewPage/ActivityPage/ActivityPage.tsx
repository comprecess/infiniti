import DOMPurify from 'dompurify'
import { FC, useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import {
  ViewActivityTypeData,
  ViewPageContext,
} from '../../../../../app/constants/constants'
import { EditActivityModal } from '../../../../../features/Admin/CustomersPage/ViewPage/Pages/ActivityPage/EditActivityModal/EditActivityModal'
import { RecentActivity } from '../../../../../features/Admin/CustomersPage/ViewPage/Pages/ActivityPage/RecentActivity/RecentActivity'
import { TextEditorWrapper } from '../../../../../features/Admin/CustomersPage/ViewPage/Pages/ActivityPage/TextEditorWrapper/TextEditorWrapper'
import { ConfirmationModal } from '../../../../../shared/ui/ConfirmationModal/ConfirmationModal'
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

export const AdminContactActivityPage: FC = () => {
  const [data, setData] = useState<ViewActivityTypeData[] | null>(null)
  const [selectedIcon, setSelectedIcon] = useState<string>('check')
  const [message, setMessage] = useState<string>('')

  const [selectedIdType, setSelectedIdType] = useState<number>(0)

  const [editActiveData, setEditActiveData] = useState<
  EditActiveModalData | undefined
  >()

  const [isEditActivityModal, setIsEditActivityModal] =
    useState<boolean>(false)
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
    useState<boolean>(false)

  const context = useOutletContext<ViewPageContext>()
  const showToast = useCustomToast()

  const openEditActivityModal = () => {
    setIsEditActivityModal(prev => !prev)
  }

  const openConfirmationModal = () => {
    setIsConfirmationModalOpen(prev => !prev)
  }

  const getInfo = async () => {
    const getResponse = await getSelectedTypeInfo(
      context.idClient,
      'activity',
    )

    setData(getResponse.data)
  }

  const addNewActivity = async () => {
    const safeMessage = DOMPurify.sanitize(message)

    const addResponse = await addActivity(
      context.idClient,
      'activity',
      selectedIcon,
      safeMessage,
    )

    if (addResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully added activity',
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

  const confirmDelete = (idType: number) => {
    setSelectedIdType(idType)
    setIsConfirmationModalOpen(true)
  }

  const openEditModal = (
    idType: number,
    icon: string,
    message: string,
  ) => {
    setSelectedIdType(idType)
    setEditActiveData({ icon, message })
  }

  const deleteSelectedActivity = async () => {
    const deleteResponse = await deleteObject(
      context.idClient,
      'activity',
      selectedIdType,
    )

    if (deleteResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully deleted the activity',
        status: 'success',
      })
      getInfo()
      openConfirmationModal()
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
      getInfo()
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
    getInfo()
  }, [context.idClient])

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
      {data ? (
        <RecentCard
          HeaderComponent={TextEditorWrapper}
          headerProps={{
            selectedIcon,
            setSelectedIcon,
            setMessage,
            addNewActivity,
          }}
        >
          <RecentActivity
            deleteSelectedActivity={confirmDelete}
            editActivity={openEditModal}
            list={data}
          />
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
      <ConfirmationModal
        isOpened={isConfirmationModalOpen}
        handleOpenCloseModal={openConfirmationModal}
        agree={deleteSelectedActivity}
      />
    </div>
  )
}
