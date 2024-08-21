import DOMPurify from 'dompurify'
import { FC, useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import {
  ViewActivityTypeData,
  ViewPageContext,
} from '../../../../../app/constants/constants'
import { RecentActivity } from '../../../../../features/Admin/CustomersPage/ViewPage/Pages/ActivityPage/RecentActivity/RecentActivity'
import { TextEditorWrapper } from '../../../../../features/Admin/CustomersPage/ViewPage/Pages/ActivityPage/TextEditorWrapper/TextEditorWrapper'
import { ConfirmationModal } from '../../../../../shared/ui/ConfirmationModal/ConfirmationModal'
import { useCustomToast } from '../../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { addActivity } from '../../../../../shared/utils/api/Admin/ViewContact/Activity/AddNewActivity'
import { deleteObject } from '../../../../../shared/utils/api/Admin/ViewContact/DeleteObject'
import { getSelectedTypeInfo } from '../../../../../shared/utils/api/Admin/ViewContact/GetSelectedTypeInfo'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'
import styles from './ActivityPage.module.scss'

export const AdminContactActivityPage: FC = () => {
  const [data, setData] = useState<ViewActivityTypeData[] | null>(null)
  const [selectedIcon, setSelectedIcon] = useState<string>('check')
  const [message, setMessage] = useState<string>('')

  const [selectedIdType, setSelectedIdType] = useState<number>(0)

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
    useState<boolean>(false)

  const context = useOutletContext<ViewPageContext>()
  const showToast = useCustomToast()

  const openConfirmationModal = () => {
    setIsConfirmationModalOpen(!isConfirmationModalOpen)
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

  const confirmDeleteGroup = (idType: number) => {
    setSelectedIdType(idType)
    setIsConfirmationModalOpen(true)
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

  useEffect(() => {
    document.title = 'infiniti | Contact | Activity'
  }, [])

  useEffect(() => {
    getInfo()
  }, [context.idClient])

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
            deleteSelectedActivity={confirmDeleteGroup}
            list={data}
          />
        </RecentCard>
      ) : (
        <LoadingSpinner size='xl' />
      )}
      <ConfirmationModal
        isOpened={isConfirmationModalOpen}
        handleOpenCloseModal={openConfirmationModal}
        agree={deleteSelectedActivity}
      />
    </div>
  )
}
