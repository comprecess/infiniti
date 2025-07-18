import { ChangeEvent, useEffect, useState } from 'react'

import { CustomersFilesData } from '../../../../app/constants/constants'
import { CrossIcon } from '../../../../shared/icons/CrossIcon'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomCheckBox } from '../../../../shared/ui/CustomCheckBox/CustomCheckBox'
import { CustomInput } from '../../../../shared/ui/CustomInput/CustomInput'
import { CustomModalWindow } from '../../../../shared/ui/CustomModalWindow/CustomModalWindow'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getSelectedFileInfo } from '../../../../shared/utils/api/Admin/Documents/get-selected-file-info'
import { putUpdateDocumentInfo } from '../../../../shared/utils/api/Admin/Documents/put-update-document-info'
import styles from './EditDocumentModal.module.scss'

interface EditDocumentModalProps {
  idDocument: number
  modalEditDoc: boolean
  modalOpenClose: () => void
}

export const EditDocumentModal = ({
  idDocument,
  modalEditDoc,
  modalOpenClose,
}: EditDocumentModalProps) => {
  const [formData, setFormData] = useState<CustomersFilesData | null>(null)

  const showToast = useCustomToast()

  const getFile = async () => {
    const response = await getSelectedFileInfo(idDocument)

    if (!response.status) return

    setFormData(response.data.data)
  }

  const updateDocumentInfo = async () => {
    if (formData === null) return

    const { status, message } = await putUpdateDocumentInfo(
      idDocument,
      formData.global,
    )

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully modified the Document',
        status: 'success',
      })
      modalOpenClose()
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  const onChangeCheckBox = (event: ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      const updatedFormData = {
        ...formData,
        global: event.target.checked ? 1 : 0,
      }
      setFormData(updatedFormData)
    }
  }

  useEffect(() => {
    getFile()
  }, [idDocument])

  return (
    <CustomModalWindow
      maxWidth={'500px'}
      isOpen={modalEditDoc}
      onClose={modalOpenClose}
    >
      {formData ? (
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <h4 className={styles.title}>Edit Document</h4>
            <div className={styles.cross} onClick={modalOpenClose}>
              <CrossIcon />
            </div>
          </div>
          <div className={styles.container}>
            <h5 className={styles.titleDoc}>{formData.title}</h5>
            <CustomInput
              readOnly
              name='link'
              id='link'
              type='text'
              value={formData.link}
              onChange={() => {}}
            />
            <CustomCheckBox
              titleOnChange='global'
              title='Available for all Customers'
              defaultChecked={formData.global === 1 ? true : false}
              onChange={onChangeCheckBox}
            />
          </div>
          <ButtonBlue title='Save' onClick={updateDocumentInfo} />
        </div>
      ) : (
        <div className={styles.loading}>
          <LoadingSpinner size='xl' />
        </div>
      )}
    </CustomModalWindow>
  )
}
