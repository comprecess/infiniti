import { useEffect, useState } from 'react'

import {
  RolesAccess,
  SettingsCustomFieldsProps,
} from '../../../../app/constants/constants'
import { FieldModal } from '../../../../features/Admin/CustomContactFields/FieldModal/FieldModal'
import { Item } from '../../../../features/Admin/CustomContactFields/Item/Item'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { deleteField } from '../../../../shared/utils/api/Admin/CustomFields/delete-field'
import { getFieldsList } from '../../../../shared/utils/api/Admin/CustomFields/get-fields-list'
import { getSelectedField } from '../../../../shared/utils/api/Admin/CustomFields/get-selected-field'
import { postAddNewField } from '../../../../shared/utils/api/Admin/CustomFields/post-add-new-field'
import { putUpdateField } from '../../../../shared/utils/api/Admin/CustomFields/put-update-field'
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

export const AdminCustomContactFields = () => {
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

  const showToast = useCustomToast()

  const handleAddNewFieldModal = () => {
    setModalNewFiled(!modalNewFiled)
  }

  const handleEditSelectedField = () => {
    setModalEditFiled(!modalEditFiled)
  }

  const getFieldsData = async () => {
    const response = await getFieldsList()

    if (!response.status) return

    setAccess(response.data.access)
    setFields(response.data.data)
  }

  const getInfoSelectedField = async (id: number) => {
    const response = await getSelectedField(id)

    if (!response.status) return

    setSelectedId(id)
    setFieldData(response.data)

    handleEditSelectedField()
  }

  const editInfoSelectedField = async () => {
    const { status, message } = await putUpdateField(selectedId, fieldData)

    if (status) {
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
        description: message,
        status: 'error',
      })
    }
  }

  const addNewField = async () => {
    const { status, message } = await postAddNewField(fieldData)

    if (status) {
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
        description: message,
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

  const deleteSelectedField = async (id: number) => {
    const { status, message } = await deleteField(id)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully deleted the field',
        status: 'success',
      })
      getFieldsData()
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
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
                    deleteField={deleteSelectedField}
                  />
                )
              })}
            </div>
          </RecentCard>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
      {modalNewFiled && (
        <FieldModal
          title='Add Custom Field'
          modalField={modalNewFiled}
          handleOpenCloseModal={handleAddNewFieldModal}
          functionModal={addNewField}
          handleInputChange={handleInputChange}
        />
      )}
      {modalEditFiled && (
        <FieldModal
          title='Edit Custom Field'
          modalField={modalEditFiled}
          filedValues={fieldData}
          handleOpenCloseModal={handleEditSelectedField}
          functionModal={editInfoSelectedField}
          handleInputChange={handleInputChange}
        />
      )}
    </div>
  )
}
