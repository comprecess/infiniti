import { FC, useEffect, useState } from 'react'

import { CustomersFilesData } from '../../../../app/constants/constants'
import { CrossIcon } from '../../../../shared/icons/CrossIcon'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomCheckBox } from '../../../../shared/ui/CustomCheckBox/CustomCheckBox'
import { CustomInput } from '../../../../shared/ui/CustomInput/CustomInput'
import { CustomModalWindow } from '../../../../shared/ui/CustomModalWindow/CustomModalWindow'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { getSelectedFileInfo } from '../../../../shared/utils/api/Admin/Documents/GetSelectedFileInfo'
import { putUpdateDocInfo } from '../../../../shared/utils/api/Admin/Documents/PutUpdateDocInfo'
import styles from './EditDocumentModal.module.scss'

interface EditDocumentModalProps {
  idDocument: number
  modalEditDoc: boolean
  modalOpenClose: () => void
}

export const EditDocumentModal: FC<EditDocumentModalProps> = ({
  idDocument,
  modalEditDoc,
  modalOpenClose,
}) => {
  const [formData, setFormData] = useState<CustomersFilesData | null>(null)

  const showToast = useCustomToast()

  const getFile = async () => {
    const getResponse = await getSelectedFileInfo(idDocument)

    setFormData(getResponse.data)
  }

  const updateDocumentInfo = async () => {
    if (formData === null) return

    const updateResponse = await putUpdateDocInfo(
      idDocument,
      formData.global,
    )

    if (updateResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully modified the Document',
        status: 'success',
      })
      modalOpenClose()
    } else {
      showToast({
        title: 'Error',
        description: updateResponse.message,
        status: 'error',
      })
    }
  }

  const onChangeCheckBox = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
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
      {formData && (
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
      )}
    </CustomModalWindow>
  )
}
