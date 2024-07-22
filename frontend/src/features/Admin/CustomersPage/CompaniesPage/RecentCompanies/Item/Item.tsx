import { FC } from 'react'

import styleItem from '../RecentCompanies.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  id: number
  logo: string
  code: string
  name: string
  email: string
  phone: string
  deleteCompany: (id: number) => void
  editCompany: (id: number) => void
  infoCompany: (id: number) => void
}

export const Item: FC<ItemProps> = ({
  id,
  logo,
  code,
  name,
  email,
  phone,
  deleteCompany,
  editCompany,
  infoCompany,
}) => {
  const handleInfoCompany = () => {
    infoCompany(id)
  }

  const handleEditCompany = () => {
    editCompany(id)
  }

  const handleDeleteCompany = () => {
    deleteCompany(id)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styleItem.logoColumn}>
        <div className={styles.logoWrapper}>
          {logo ? (
            <img src={logo} alt='Logo' className={styles.logoItem} />
          ) : null}
        </div>
      </div>
      <div className={styleItem.companyNameColumn}>
        <div className={styles.container} onClick={handleInfoCompany}>
          <span className={styles.companyNameItem}>{name}</span>
          <span className={styles.companyCodeItem}>{code}</span>
        </div>
      </div>
      <span className={`${styleItem.emailColumn} ${styles.emailItem}`}>
        {email}
      </span>
      <span className={`${styleItem.phoneColumn} ${styles.phoneItem}`}>
        {phone}
      </span>
      <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
        <button className={styles.viewButton} onClick={handleInfoCompany}>
          <img src='/icons/view.svg' alt='View' className={styles.icon} />
        </button>
        <button className={styles.buttonEdit} onClick={handleEditCompany}>
          <img src='/icons/edit.svg' alt='Star' className={styles.icon} />
        </button>
        <button
          className={styles.buttonTrash}
          onClick={handleDeleteCompany}
        >
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
