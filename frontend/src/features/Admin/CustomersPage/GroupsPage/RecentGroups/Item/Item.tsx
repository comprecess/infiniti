import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import { RolesAccess } from '../../../../../../app/constants/constants'
import { Routes } from '../../../../../../app/router/routes'
import styleItem from '../RecentGroups.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  id: number
  access: RolesAccess
  groupName: string
  deleteGroup: (id: number) => void
  editGroup: (id: number, name: string) => void
}

export const Item: FC<ItemProps> = ({
  id,
  access,
  groupName,
  deleteGroup,
  editGroup,
}) => {
  const navigate = useNavigate()

  const handleNavigateToListContacts = () => {
    navigate(`${Routes.contacts}/${Routes.list}/${id}`)
  }

  const handleDeleteGroup = () => {
    deleteGroup(id)
  }

  const handleEditGroup = () => {
    editGroup(id, groupName)
  }

  return (
    <div className={styles.wrapper}>
      <span
        className={`${styleItem.groupNameColumn} ${styles.groupNameItem}`}
      >
        {groupName}
      </span>
      <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
        {access.edit && (
          <button className={styles.buttonEdit} onClick={handleEditGroup}>
            <img
              src='/icons/edit.svg'
              alt='Edit'
              className={styles.icon}
            />
          </button>
        )}
        <button
          className={styles.buttonList}
          onClick={handleNavigateToListContacts}
        >
          <img
            src='/icons/users.svg'
            alt='Users'
            className={styles.icon}
          />
        </button>
        {access.delete && (
          <button
            className={styles.buttonTrash}
            onClick={handleDeleteGroup}
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
  )
}
