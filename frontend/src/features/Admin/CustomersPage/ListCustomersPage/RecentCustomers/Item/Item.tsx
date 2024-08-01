import { FC } from 'react'

import styleItem from '../RecentCustomers.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  image: string
  name: string
  code: string
  companyName: string
  group: string
  email: string
  phone: string
}

export const Item: FC<ItemProps> = ({
  image,
  name,
  code,
  companyName,
  group,
  email,
  phone,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styleItem.imageColumn}>
        <img
          src={image ? image : '/profileWithoutAvatar.svg'}
          alt='Avatar'
          className={styles.imageItem}
        />
      </div>
      <div className={`${styleItem.nameColumn} ${styles.nameCodeItem}`}>
        <span className={styles.nameItem}>{name}</span>
        <span className={styles.codeItem}>{code}</span>
      </div>
      <span
        className={`${styleItem.companyNameColumn} ${styles.companyNameItem}`}
      >
        {companyName}
      </span>
      <span className={`${styleItem.groupColumn} ${styles.groupItem}`}>
        {group}
      </span>
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
        <button className={styles.buttonEdit}>
          <img src='/icons/edit.svg' alt='Edit' className={styles.icon} />
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
