import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './Item.module.scss'
import { RolesAccess } from '../../../../../../app/constants/constants'
import { Routes } from '../../../../../../app/router/routes'
import { ConfirmationModal } from '../../../../../../shared/ui/ConfirmationModal/ConfirmationModal'
import { CustomMiniButton } from '../../../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import styleItem from '../RecentGroups.module.scss'

interface ItemProps {
  id: number
  access: RolesAccess
  groupName: string
  deleteGroup: (id: number) => void
  editGroup: (id: number, name: string) => void
}

export const Item = ({
  id,
  access,
  groupName,
  deleteGroup,
  editGroup,
}: ItemProps) => {
  const [modalDelete, setModalDelete] = useState<boolean>(false)

  const navigate = useNavigate()

  const handleOpenConfirmationModal = () => {
    setModalDelete(state => !state)
  }

  const handleNavigateToListContacts = () => {
    navigate(`${Routes.contacts}/${Routes.list}/${id}`)
  }

  const handleDeleteGroup = () => {
    deleteGroup(id)
    handleOpenConfirmationModal()
  }

  const handleEditGroup = () => {
    editGroup(id, groupName)
  }

  return (
    <>
      <div className={styles.wrapper}>
        <span
          className={`${styleItem.groupNameColumn} ${styles.groupNameItem}`}
        >
          {groupName}
        </span>
        <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
          {access.edit === 1 && (
            <CustomMiniButton
              style='mint'
              icon='/icons/edit.svg'
              alt='Edit'
              tooltipTitle='Edit'
              onClick={handleEditGroup}
            />
          )}
          <CustomMiniButton
            style='amber'
            icon='/icons/users.svg'
            alt='List Contacts'
            tooltipTitle='List Contacts'
            onClick={handleNavigateToListContacts}
          />
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
          agree={handleDeleteGroup}
        />
      )}
    </>
  )
}
