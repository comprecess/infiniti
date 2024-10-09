import { FC } from 'react'

import { RolesAccess } from '../../../../../../app/constants/constants'
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
  const handleEditRole = () => {
    editRole(id)
  }

  const handleDeleteRole = () => {
    deleteSelectedRole(id)
  }

  return (
    <div className={styles.wrapper}>
      <span className={`${styleItem.nameColumn} ${styles.nameItem}`}>
        {name}
      </span>
      <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
        {access.edit && (
          <button className={styles.buttonEdit} onClick={handleEditRole}>
            <img
              src='/icons/edit.svg'
              alt='Edit'
              className={styles.icon}
            />
          </button>
        )}
        {access.delete && (
          <button
            className={styles.buttonTrash}
            onClick={handleDeleteRole}
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
