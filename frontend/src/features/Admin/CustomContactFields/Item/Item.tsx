import { FC, useState } from 'react'

import { RolesAccess } from '../../../../app/constants/constants'
import { ConfirmationModal } from '../../../../shared/ui/ConfirmationModal/ConfirmationModal'
import { CustomMiniButton } from '../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import styles from './Item.module.scss'

interface ItemProps {
  id: number
  access: RolesAccess
  title: string
  description: string
  editField: (id: number) => void
  deleteField: (id: number) => void
}

export const Item: FC<ItemProps> = ({
  id,
  access,
  title,
  description,
  editField,
  deleteField,
}) => {
  const [modalDelete, setModalDelete] = useState<boolean>(false)

  const handleOpenConfirmationModal = () => {
    setModalDelete(state => !state)
  }

  const handleEditField = () => {
    editField(id)
  }

  const handleDeleteField = () => {
    deleteField(id)
    handleOpenConfirmationModal()
  }

  return (
    <>
      <div className={styles.wrapper}>
        <h3 className={styles.title}>{title}</h3>
        {description && (
          <span className={styles.description}>{description}</span>
        )}
        <div className={styles.buttonsList}>
          {access.edit === 1 && (
            <CustomMiniButton
              title='Edit'
              style='mint'
              icon='/icons/edit.svg'
              alt='Edit'
              onClick={handleEditField}
            />
          )}
          {access.delete === 1 && (
            <CustomMiniButton
              title='Delete'
              style='cherry'
              icon='/icons/trash.svg'
              alt='Delete'
              onClick={handleOpenConfirmationModal}
            />
          )}
        </div>
      </div>
      {modalDelete && (
        <ConfirmationModal
          isOpened={modalDelete}
          handleOpenCloseModal={handleOpenConfirmationModal}
          agree={handleDeleteField}
        />
      )}
    </>
  )
}
