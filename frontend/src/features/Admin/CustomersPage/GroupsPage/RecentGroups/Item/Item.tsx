import { FC } from 'react'

import styleItem from '../RecentGroups.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  id: number
  groupName: string
  deleteGroup: (id: number) => void
}

export const Item: FC<ItemProps> = ({ id, groupName, deleteGroup }) => {
  const handleDeleteGroup = () => {
    deleteGroup(id)
  }

  return (
    <div className={styles.wrapper}>
      <span
        className={`${styleItem.groupNameColumn} ${styles.groupNameItem}`}
      >
        {groupName}
      </span>
      <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
        <button className={styles.buttonEdit}>
          <img src='/icons/edit.svg' alt='Star' className={styles.icon} />
        </button>
        <button className={styles.buttonList}>
          <img src='/icons/users.svg' alt='Star' className={styles.icon} />
        </button>
        <button className={styles.buttonTrash} onClick={handleDeleteGroup}>
          <img src='/icons/trash.svg' alt='Star' className={styles.icon} />
        </button>
      </div>
    </div>
  )
}
