import { FC } from 'react'

import styleItem from '../CustomersPage.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  id: number
  name: string
  email: string
  phone: string
  onClick: (id: number) => void
}

export const Item: FC<ItemProps> = ({ id, name, email, phone, onClick }) => {
  const onItemClick = () => {
    onClick(id)
  }

  return (
    <div className={styles.wrapper}>
      <span className={`${styleItem.hashTagColumn} ${styles.hashTagItem}`}>
        {id}
      </span>
      <span
        className={`${styleItem.nameColumn} ${styles.nameItem}`}
        onClick={onItemClick}
      >
        {name}
      </span>
      <span className={`${styleItem.emailColumn} ${styles.emailItem}`}>
        {email}
      </span>
      <span className={`${styleItem.phoneColumn} ${styles.phoneItem}`}>
        {phone}
      </span>
    </div>
  )
}
