import { FC, useEffect, useState } from 'react'

import {
  RolesAccess,
  SettingsCustomFieldsProps,
} from '../../../../app/constants/constants'
import { FieldModal } from '../../../../features/Admin/CustomContactFields/FieldModal/FieldModal'
import { Item } from '../../../../features/Admin/CustomContactFields/Item/Item'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { ConfirmationModal } from '../../../../shared/ui/ConfirmationModal/ConfirmationModal'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { addField } from '../../../../shared/utils/api/Admin/CustomFields/AddField'
import { editField } from '../../../../shared/utils/api/Admin/CustomFields/EditField'
import { getFields } from '../../../../shared/utils/api/Admin/CustomFields/GetFields'
import { getSelectedField } from '../../../../shared/utils/api/Admin/CustomFields/GetSelectedField'
import { deleteField } from '../../../../shared/utils/api/Admin/CustomFields/RemoveField'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './CustomContactFieldsPage.module.scss'

export interface FieldProps {
  name: string
  type: string
  description: string
  fieldOptions: string[]
  regexpr: string
  showInvoice: number
}

export const AdminCustomContactFields: FC = () => {
  const [fields, setFields] = useState<SettingsCustomFieldsProps[] | null>(
    null,
  )

  const [access, setAccess] = useState<RolesAccess | null>(null)

  const [selectedId, setSelectedId] = useState<number>(0)

  const [fieldData, setFieldData] = useState<FieldProps>({
    name: '',
    type: '',
    description: '',
    fieldOptions: [],
    regexpr: '',
    showInvoice: 0,
  })

  const [modalNewFiled, setModalNewFiled] = useState<boolean>(false)
  const [modalEditFiled, setModalEditFiled] = useState<boolean>(false)
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
    useState<boolean>(false)

  const showToast = useCustomToast()

  const handleAddNewFieldModal = () => {
    setModalNewFiled(!modalNewFiled)
  }

  const handleEditSelectedField = () => {
    setModalEditFiled(!modalEditFiled)
  }

  const handleOpenConfirmationModal = () => {
    setIsConfirmationModalOpen(!isConfirmationModalOpen)
  }

  const confirmDeleteField = (id: number) => {
    setSelectedId(id)
    setIsConfirmationModalOpen(true)
  }

  const getFieldsData = async () => {
    const fieldsResponse: {
      access: RolesAccess
      data: SettingsCustomFieldsProps[]
    } = await getFields()

    setAccess(fieldsResponse.access)
    setFields(fieldsResponse.data)
  }

  const getInfoSelectedField = async (id: number) => {
    const getResponse = await getSelectedField(id)

    setSelectedId(id)
    setFieldData(getResponse)

    handleEditSelectedField()
  }

  const editInfoSelectedField = async () => {
    const editResponse = await editField(selectedId, fieldData)

    if (editResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully changed the field',
        status: 'success',
      })
      handleEditSelectedField()
      getFieldsData()
    } else {
      showToast({
        title: 'Error',
        description: editResponse.message,
        status: 'error',
      })
    }
  }

  const addNewField = async () => {
    const addResponse = await addField(fieldData)

    if (addResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully added a field',
        status: 'success',
      })
      handleAddNewFieldModal()
      getFieldsData()
    } else {
      showToast({
        title: 'Error',
        description: addResponse.message,
        status: 'error',
      })
    }
  }

  const handleInputChange = (
    name: string,
    value: string | number | string[],
  ) => {
    setFieldData(prevState => ({
      ...prevState,
      [name]: value,
    }))
  }

  const deleteSelectedField = async () => {
    const deleteResponse = await deleteField(selectedId)

    if (deleteResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully deleted the field',
        status: 'success',
      })
      getFieldsData()
    } else {
      showToast({
        title: 'Error',
        description: deleteResponse.message,
        status: 'error',
      })
    }

    handleOpenConfirmationModal()
  }

  useEffect(() => {
    document.title = 'infiniti | Custom Fields'
  }, [])

  useEffect(() => {
    getFieldsData()
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {fields && access ? (
          <RecentCard
            title='Custom Fields'
            style={styles.recentFullScreen}
            Component={access.create ? ButtonBlue : undefined}
            componentProps={
              access.create
                ? {
                    title: 'Add Custom Field',
                    icon: '/icons/plus.svg',
                    titleNone: true,
                    onClick: handleAddNewFieldModal,
                    style: styles.blueButton,
                  }
                : undefined
            }
          >
            <div className={styles.list}>
              {fields.map(item => {
                return (
                  <Item
                    key={item.id}
                    id={item.id}
                    access={access}
                    title={item.name}
                    description={item.description}
                    editField={getInfoSelectedField}
                    deleteField={confirmDeleteField}
                  />
                )
              })}
            </div>
          </RecentCard>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
      <FieldModal
        title='Add Custom Field'
        modalField={modalNewFiled}
        handleOpenCloseModal={handleAddNewFieldModal}
        functionModal={addNewField}
        handleInputChange={handleInputChange}
      />
      <FieldModal
        title='Edit Custom Field'
        modalField={modalEditFiled}
        filedValues={fieldData}
        handleOpenCloseModal={handleEditSelectedField}
        functionModal={editInfoSelectedField}
        handleInputChange={handleInputChange}
      />
      <ConfirmationModal
        isOpened={isConfirmationModalOpen}
        handleOpenCloseModal={handleOpenConfirmationModal}
        agree={deleteSelectedField}
      />
    </div>
  )
}
