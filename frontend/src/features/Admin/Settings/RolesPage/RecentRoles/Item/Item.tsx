import { FC, useState } from 'react'

import { RolesAccess } from '../../../../../../app/constants/constants'
import { ConfirmationModal } from '../../../../../../shared/ui/ConfirmationModal/ConfirmationModal'
import styleItem from '../RecentRoles.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  id: number
  name: string
  access: RolesAccess
  editRole: (idRole: number) => void
  deleteSelectedRole: (idRole: number) => void
}

export const Item: FC<ItemProps> = ({
  id,
  name,
  access,
  editRole,
  deleteSelectedRole,
}) => {
  const [modalDelete, setModalDelete] = useState<boolean>(false)

  const handleOpenConfirmationModal = () => {
    setModalDelete(state => !state)
  }

  const handleEditRole = () => {
    editRole(id)
  }

  const handleDeleteRole = () => {
    deleteSelectedRole(id)
    handleOpenConfirmationModal()
  }

  return (
    <>
      <div className={styles.wrapper}>
        <span className={`${styleItem.nameColumn} ${styles.nameItem}`}>
          {name}
        </span>
        <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
          {access.edit === 1 && (
            <button className={styles.buttonEdit} onClick={handleEditRole}>
              <img
                src='/icons/edit.svg'
                alt='Edit'
                className={styles.icon}
              />
            </button>
          )}
          {access.delete === 1 && (
            <button
              className={styles.buttonTrash}
              onClick={handleOpenConfirmationModal}
            >
              <img
                src='/icons/trash.svg'
                alt='Trash'
                className={styles.icon}
              />
            </button>
          )}
        </div>
      </div>
      {modalDelete && (
        <ConfirmationModal
          isOpened={modalDelete}
          handleOpenCloseModal={handleOpenConfirmationModal}
          agree={handleDeleteRole}
        />
      )}
    </>
  )
}
