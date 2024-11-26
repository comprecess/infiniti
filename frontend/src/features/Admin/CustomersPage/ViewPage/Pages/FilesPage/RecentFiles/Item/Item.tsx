import { FC, useState } from 'react'

import { ConfirmationModal } from '../../../../../../../../shared/ui/ConfirmationModal/ConfirmationModal'
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
  const [modalDelete, setModalDelete] = useState<boolean>(false)

  const handleOpenConfirmationModal = () => {
    setModalDelete(state => !state)
  }

  const handleDeleteFile = () => {
    deleteFile(idType)
    handleOpenConfirmationModal()
  }

  return (
    <>
      <div className={styles.wrapper}>
        <div className={`${styleItem.typeColumn} ${styles.typeItem}`}>
          <TypeFiles type={type} />
        </div>
        <span className={`${styleItem.titleColumn} ${styles.titleItem}`}>
          {title}
        </span>
        <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
          <button
            className={styles.buttonTrash}
            onClick={handleOpenConfirmationModal}
          >
            <img
              src='/icons/trash.svg'
              alt='Trash'
              className={styles.icon}
            />
          </button>
        </div>
      </div>
      {modalDelete && (
        <ConfirmationModal
          isOpened={modalDelete}
          handleOpenCloseModal={handleOpenConfirmationModal}
          agree={handleDeleteFile}
        />
      )}
    </>
  )
}
