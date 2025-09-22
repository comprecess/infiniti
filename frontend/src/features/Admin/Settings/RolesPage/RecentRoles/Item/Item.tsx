import { useState } from 'react'

import styles from './Item.module.scss'
import { RolesAccess } from '../../../../../../app/constants/constants'
import { ConfirmationModal } from '../../../../../../shared/ui/ConfirmationModal/ConfirmationModal'
import { CustomMiniButton } from '../../../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import styleItem from '../RecentRoles.module.scss'

interface ItemProps {
  id: number
  name: string
  access: RolesAccess
  editRole: (idRole: number) => void
  deleteSelectedRole: (idRole: number) => void
}

export const Item = ({
  id,
  name,
  access,
  editRole,
  deleteSelectedRole,
}: ItemProps) => {
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
            <CustomMiniButton
              style='amber'
              icon='/icons/edit.svg'
              alt='Edit'
              tooltipTitle='Edit'
              onClick={handleEditRole}
            />
          )}
          {access.delete === 1 && (
            <CustomMiniButton
              style='cherry'
              icon='/icons/trash.svg'
              alt='Delete'
              tooltipTitle='Delete'
              onClick={handleOpenConfirmationModal}
            />
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
