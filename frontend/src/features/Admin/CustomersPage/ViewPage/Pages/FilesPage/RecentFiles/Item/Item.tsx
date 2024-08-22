import { FC } from 'react'

import { TypeFiles } from '../../../../../../../../shared/ui/TypeFiles/TypeFiles'
import styleItem from '../RecentFiles.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  idType: number
  type: string
  title: string
  deleteFile: (idType: number) => void
}

export const Item: FC<ItemProps> = ({
  idType,
  type,
  title,
  deleteFile,
}) => {
  const handleDeleteFile = () => {
    deleteFile(idType)
  }

  return (
    <div className={styles.wrapper}>
      <div className={`${styleItem.typeColumn} ${styles.typeItem}`}>
        <TypeFiles type={type} />
      </div>
      <span className={`${styleItem.titleColumn} ${styles.titleItem}`}>
        {title}
      </span>
      <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
        <button className={styles.buttonTrash} onClick={handleDeleteFile}>
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
