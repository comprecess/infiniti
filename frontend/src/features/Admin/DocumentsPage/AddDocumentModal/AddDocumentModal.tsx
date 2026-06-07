import { useEffect, useState } from 'react'
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

const INITIAL_FORM_STATE = {
  title: '',
  file: undefined as File | undefined,
  global: 0,
  dealRoomFolder: undefined as string | undefined,
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
    title: string
    file?: File
    global: number
    dealRoomFolder?: string
  }>({ ...INITIAL_FORM_STATE })

  // Track whether the user has manually edited the title via actual keyboard input.
  // This is ONLY set to true after a file has been selected AND the user types in the field.
  // The CustomInput component fires onChange on mount (via its internal useEffect),
  // which would falsely set this flag — so we gate it with fileSelected.
  const [titleManuallyEdited, setTitleManuallyEdited] = useState(false)

  // Track whether a file has been selected at least once in this modal session.
  // This prevents the CustomInput mount useEffect (which calls onChange with '')
  // from falsely marking the title as manually edited.
  const [fileSelected, setFileSelected] = useState(false)

  // Reset all state when modal opens
  useEffect(() => {
    if (modalAddDoc) {
      setFormData({ ...INITIAL_FORM_STATE })
      setTitleManuallyEdited(false)
      setFileSelected(false)
    }
  }, [modalAddDoc])

  // Reset state when modal closes (via X button or overlay click)
  const handleOpenCloseModal = () => {
    setFormData({ ...INITIAL_FORM_STATE })
    setTitleManuallyEdited(false)
    setFileSelected(false)
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

    // Only mark title as manually edited when:
    // 1. The field is 'title'
    // 2. A file has already been selected (so auto-population has occurred)
    // This prevents CustomInput's mount useEffect from falsely setting the flag.
    if (name === 'title' && fileSelected) {
      setTitleManuallyEdited(true)
    }
  }

  const handleDrop = (acceptedFile: File) => {
    setFileSelected(true)
    setFormData(prevFormData => ({
      ...prevFormData,
      file: acceptedFile,
      // Always auto-populate title from filename unless user has manually edited it
      title: titleManuallyEdited ? prevFormData.title : acceptedFile.name,
    }))
  }

  const handleAddNewDocument = () => {
    handleButtonSave(formData)
    // Reset state after successful save
    setFormData({ ...INITIAL_FORM_STATE })
    setTitleManuallyEdited(false)
    setFileSelected(false)
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
          <CustomInput
            title='Title'
            name='title'
            id='title'
            type='text'
            value={formData.title}
            onChange={onChangeInput}
          />
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
