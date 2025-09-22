import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './ConvertModal.module.scss'
import { Routes } from '../../../app/router/routes'
import { CrossIcon } from '../../../shared/icons/CrossIcon'
import { ButtonBlue } from '../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomModalWindow } from '../../../shared/ui/CustomModalWindow/CustomModalWindow'
import { useCustomToast } from '../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getConvertBusinessModel } from '../../../shared/utils/api/Admin/BusinessPlan/BusinessModel/get-convert-business-model'

interface ConvertModalProps {
  id: number
  isOpened: boolean
  handleOpenCloseModal: () => void
}

export const ConvertModal = ({
  id,
  isOpened,
  handleOpenCloseModal,
}: ConvertModalProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const showToast = useCustomToast()
  const navigate = useNavigate()

  const handleConvertBusinessModel = async (id: number) => {
    setIsLoading(true)

    const response = await getConvertBusinessModel(id)

    setIsLoading(false)

    if (response.status) {
      navigate(
        `/${Routes.adminPages}/${Routes.businessPlan}/${Routes.view}/${Routes.businessPlan}/${response.data.data.id}`,
      )
      showToast({
        title: 'Successfully',
        description: 'You have successfully converted the Business Model',
        status: 'success',
      })
    } else {
      showToast({
        title: 'Error',
        description: response.message,
        status: 'error',
      })
    }
  }

  return (
    <CustomModalWindow
      maxWidth={'400px'}
      isOpen={isOpened}
      onClose={handleOpenCloseModal}
    >
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h4 className={styles.title}>
            {isLoading
              ? 'Model conversion is in progress. Please wait a moment and do not close this window.'
              : 'Are you sure you want to convert your Business Model?'}
          </h4>
          {!isLoading && (
            <div className={styles.cross} onClick={handleOpenCloseModal}>
              <CrossIcon />
            </div>
          )}
        </div>
        {isLoading ? (
          <div className={styles.loading}>
            <LoadingSpinner />
          </div>
        ) : (
          <ButtonBlue
            title='Start Conversion'
            onClick={() => handleConvertBusinessModel(id)}
          />
        )}
      </div>
    </CustomModalWindow>
  )
}
