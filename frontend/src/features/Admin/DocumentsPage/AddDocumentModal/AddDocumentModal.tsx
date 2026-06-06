import { useState } from 'react'
import styles from './AddDocumentModal.module.scss'
import { CrossIcon } from '../../../../shared/icons/CrossIcon'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomCheckBox } from '../../../../shared/ui/CustomCheckBox/CustomCheckBox'
import { CustomDropZone } from '../../../../shared/ui/CustomDropZone/CustomDropZone'
import { CustomInput } from '../../../../shared/ui/CustomInput/CustomInput'
import { CustomModalWindow } from '../../../../shared/ui/CustomModalWindow/CustomModalWindow'

/**
 * Deal Room folder categories for Exit Deal projects.
 * Matches the backend DealRoomService::EXIT_DEAL_FOLDERS.
 */
const DEAL_ROOM_FOLDERS: Record<string, string> = {
  financial: 'Financial Documents',
  legal: 'Legal Documents',
  operational: 'Operational Documents',
  commercial: 'Commercial & Sales',
  technical: 'Technical & IP',
  hr: 'HR & Team',
  compliance: 'Compliance & Regulatory',
  marketing: 'Marketing Materials',
}

interface AddDocumentModalProps {
  modalAddDoc: boolean
  modalOpenClose: () => void
  handleButtonSave: (formData: {
    title?: string
    file?: File
    global?: number
    dealRoomFolder?: string
  }) => void
  showDealRoomCategory?: boolean
}

export const AddDocumentModal = ({
  modalAddDoc,
  modalOpenClose,
  handleButtonSave,
  showDealRoomCategory = false,
}: AddDocumentModalProps) => {
  const [formData, setFormData] = useState<{
    title?: string
    file?: File
    global?: number
    dealRoomFolder?: string
  }>({ global: 0 })

  const handleOpenCloseModal = () => {
    setFormData({ global: 0 })
    modalOpenClose()
  }

  const onChangeInput = (
    name: string,
    value: string | number | boolean,
  ) => {
    setFormData(prevFormData => {
      if (name === 'global') {
        value = value ? 1 : 0
      }
      return {
        ...prevFormData,
        [name]: value,
      }
    })
  }

  const handleDrop = (acceptedFile: File) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      file: acceptedFile,
    }))
  }

  const handleAddNewDocument = () => {
    handleButtonSave(formData)
  }

  return (
    <CustomModalWindow
      maxWidth={'500px'}
      isOpen={modalAddDoc}
      onClose={handleOpenCloseModal}
    >
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h4 className={styles.title}>Add Document</h4>
          <div className={styles.cross} onClick={handleOpenCloseModal}>
            <CrossIcon />
          </div>
        </div>
        <div className={styles.container}>
          {formData.file && (
            <CustomInput
              title='Title'
              name='title'
              id='title'
              type='text'
              value={formData.file.name}
              onChange={onChangeInput}
            />
          )}
          {!formData.file && (
            <CustomInput
              title='Title'
              name='title'
              id='title'
              type='text'
              onChange={onChangeInput}
            />
          )}
          <CustomDropZone onDrop={handleDrop} />
          {showDealRoomCategory && (
            <div className={styles.categorySelect}>
              <label className={styles.categoryLabel}>Deal Room Category</label>
              <select
                className={styles.categoryDropdown}
                value={formData.dealRoomFolder || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, dealRoomFolder: e.target.value || undefined }))}
              >
                <option value="">— No category (upload only) —</option>
                {Object.entries(DEAL_ROOM_FOLDERS).map(([code, name]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
              <span className={styles.categoryHint}>
                Assigned documents will appear in Deal Room automatically.
              </span>
            </div>
          )}
          <CustomCheckBox
            titleOnChange='global'
            title='Available for all Customers'
            defaultChecked={formData.global === 1 ? true : false}
            onInputChange={onChangeInput}
          />
        </div>
        <ButtonBlue title='Save' onClick={handleAddNewDocument} />
      </div>
    </CustomModalWindow>
  )
}
