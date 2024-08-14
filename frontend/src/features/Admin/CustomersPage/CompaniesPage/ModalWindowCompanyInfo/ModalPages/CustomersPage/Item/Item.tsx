import { FC } from 'react'

import styleItem from '../CustomersPage.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  code: number
  name: string
  email: string
  phone: string
  onClick: (id: number) => void
}

export const Item: FC<ItemProps> = ({ code, name, email, phone, onClick }) => {
  const onItemClick = () => {
    onClick(code)
  }

  return (
    <div className={styles.wrapper}>
      <span className={`${styleItem.hashTagColumn} ${styles.hashTagItem}`}>
        {code}
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
