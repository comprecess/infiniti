import { FC, useState } from 'react'

import { RolesAccess } from '../../../../../app/constants/constants'
import { ConfirmationModal } from '../../../../../shared/ui/ConfirmationModal/ConfirmationModal'
import { TypeFiles } from '../../../../../shared/ui/TypeFiles/TypeFiles'
import { EditDocumentModal } from '../../EditDocumentModal/EditDocumentModal'
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
  const [modalEdit, setModalEdit] = useState<boolean>(false)
  const [modalDelete, setModalDelete] = useState<boolean>(false)

  const handleSetModalDelete = () => {
    setModalDelete(state => !state)
  }

  const handleSetModalEdit = () => {
    setModalEdit(state => !state)
  }

  const handleDownloadFile = async (url: string) => {
    const fileUrl = url

    const link = document.createElement('a')
    link.href = fileUrl
    link.download = ''

    link.click()
  }

  return (
    <>
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
            onClick={() => handleDownloadFile(link)}
          >
            <img
              src='/icons/fileDownload.svg'
              alt='Download'
              className={styles.icon}
            />
          </button>
          {access.edit === 1 && (
            <button
              className={styles.buttonEdit}
              onClick={handleSetModalEdit}
            >
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
              onClick={handleSetModalDelete}
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
      {modalEdit && (
        <EditDocumentModal
          idDocument={idFile}
          modalEditDoc={modalEdit}
          modalOpenClose={handleSetModalEdit}
        />
      )}
      {modalDelete && (
        <ConfirmationModal
          isOpened={modalDelete}
          handleOpenCloseModal={handleSetModalDelete}
          agree={() => deleteFile(idFile)}
        />
      )}
    </>
  )
}
