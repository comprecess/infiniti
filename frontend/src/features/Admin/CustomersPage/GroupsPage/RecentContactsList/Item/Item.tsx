import { FC } from 'react'

import styleItem from '../RecentContactsList.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  id: number
  name: string
  companyName: string
  email: string
  phone: string
}

export const Item: FC<ItemProps> = ({
  id,
  name,
  companyName,
  email,
  phone,
}) => {
  return (
    <div className={styles.wrapper}>
      <span className={`${styleItem.hashtagColumn} ${styles.idItem}`}>
        {id}
      </span>
      <span className={`${styleItem.nameColumn} ${styles.nameItem}`}>
        {name}
      </span>
      <div
        className={`${styleItem.companyNameColumn} ${styles.companyNameItem}`}
      >
        {companyName}
      </div>
      <span className={`${styleItem.emailColumn} ${styles.emailItem}`}>
        {email}
      </span>
      <span className={`${styleItem.phoneColumn} ${styles.phoneItem}`}>
        {phone}
      </span>
      <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
        <button className={styles.viewButton}>
          <img src='/icons/view.svg' alt='View' className={styles.icon} />
        </button>
        <button className={styles.buttonTrash}>
          <img
            src='/icons/trash.svg'
            alt='Trash'
            className={styles.icon}
          />
        </button>
      </div>
    </div>
  )
}
