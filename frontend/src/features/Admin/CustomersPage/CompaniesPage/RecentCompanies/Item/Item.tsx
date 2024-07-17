import { FC } from 'react'

import styleItem from '../RecentCompanies.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  logo: string
  name: string
  email: string
  phone: string
}

export const Item: FC<ItemProps> = ({ logo, name, email, phone }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styleItem.logoColumn}>
        <img src={logo} alt='Logo' className={styles.logoItem} />
      </div>
      <span
        className={`${styleItem.companyNameColumn} ${styles.companyNameItem}`}
      >
        {name}
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
          <img src='/icons/edit.svg' alt='Star' className={styles.icon} />
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
