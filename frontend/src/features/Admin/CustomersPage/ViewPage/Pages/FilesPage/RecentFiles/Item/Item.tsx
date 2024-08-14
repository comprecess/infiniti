import { FC } from 'react'

import { TypeFiles } from '../../../../../../../../shared/ui/TypeFiles/TypeFiles'
import styleItem from '../RecentFiles.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  type: string
  title: string
}

export const Item: FC<ItemProps> = ({ type, title }) => {
  return (
    <div className={styles.wrapper}>
      <div className={`${styleItem.typeColumn} ${styles.typeItem}`}>
        <TypeFiles type={type} />
      </div>
      <span className={`${styleItem.titleColumn} ${styles.titleItem}`}>
        {title}
      </span>
      <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
        <button className={styles.buttonTrash}>
          <img src='/icons/trash.svg' alt='Trash' className={styles.icon} />
        </button>
      </div>
    </div>
  )
}
