import { FC } from 'react'

import { RolesAccess } from '../../../../../app/constants/constants'
import { TypeFiles } from '../../../../../shared/ui/TypeFiles/TypeFiles'
import styleItem from '../RecentDocuments.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  idFile: number
  title: string
  type: string
  link: string
  access: RolesAccess
  deleteFile: (idFile: number) => void
}

export const Item: FC<ItemProps> = ({
  idFile,
  title,
  type,
  link,
  access,
  deleteFile,
}) => {
  const handleDownloadFile = async () => {
    const response = await fetch(link)

    if (response.ok) {
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)

      window.open(url, '_blank')

      URL.revokeObjectURL(url)
    }
  }

  const handleDeleteFile = () => {
    deleteFile(idFile)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styleItem.typeColumn}>
        <TypeFiles type={type} />
      </div>
      <span className={`${styleItem.titleColumn} ${styles.titleItem}`}>
        {title}
      </span>
      <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
        <button
          className={styles.downloadButton}
          onClick={handleDownloadFile}
        >
          <img
            src='/icons/fileDownload.svg'
            alt='Download'
            className={styles.icon}
          />
        </button>
        {access.edit === 1 && (
          <button className={styles.buttonEdit}>
            <img
              src='/icons/edit.svg'
              alt='Edit'
              className={styles.icon}
            />
          </button>
        )}
        {access.delete === 1 && (
          <button
            className={styles.buttonTrash}
            onClick={handleDeleteFile}
          >
            <img
              src='/icons/trash.svg'
              alt='Trash'
              className={styles.icon}
            />
          </button>
        )}
      </div>
    </div>
  )
}
