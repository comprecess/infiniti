import { FC } from 'react'

import styleItem from '../RecentClients.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  avatar: string
  name: string
  email: string
  created: string
}

export const Item: FC<ItemProps> = ({ avatar, name, email, created }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styleItem.avatarColumn}>
        <img src={avatar} alt='Avatar' className={styles.avatarItem} />
      </div>
      <div className={`${styleItem.nameEmailColumn} ${styles.items}`}>
        <span className={styles.nameItem}>{name}</span>
        <span className={styles.emailItem} contentEditable={false}>
          {email}
        </span>
      </div>
      <span className={`${styleItem.createdColumn} ${styles.createdItem}`}>
        {created}
      </span>
    </div>
  )
}
