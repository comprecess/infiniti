import { useState } from 'react'

import { RolesAccess } from '../../../../../app/constants/constants'
import { ConfirmationModal } from '../../../../../shared/ui/ConfirmationModal/ConfirmationModal'
import { CustomMiniButton } from '../../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import { TypeFiles } from '../../../../../shared/ui/TypeFiles/TypeFiles'
import { EditDocumentModal } from '../../EditDocumentModal/EditDocumentModal'
import styleItem from '../RecentDocuments.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  idFile: number
  global: number
  title: string
  type: string
  authToken: string | undefined
  link: string
  access: RolesAccess
  deleteFile: (idFile: number) => void
}

export const Item = ({
  idFile,
  global,
  title,
  type,
  authToken,
  link,
  access,
  deleteFile,
}: ItemProps) => {
  const [modalEdit, setModalEdit] = useState<boolean>(false)
  const [modalDelete, setModalDelete] = useState<boolean>(false)

  const handleSetModalDelete = () => {
    setModalDelete(state => !state)
  }

  const handleSetModalEdit = () => {
    setModalEdit(state => !state)
  }

  const handleDownloadFile = async (link: string) => {
    const headers: HeadersInit =
      global === 0
        ? {
            Authorization: `Bearer ${authToken}`,
          }
        : {}

    const response = await fetch(link, { headers })

    if (response.ok) {
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)

      window.open(url, '_blank')

      URL.revokeObjectURL(url)
    }
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
          <CustomMiniButton
            style='mint'
            icon='/icons/fileDownload.svg'
            alt='View or Download file'
            tooltipTitle='View or Download file'
            onClick={() => handleDownloadFile(link)}
          />
          {access.edit === 1 && (
            <CustomMiniButton
              style='amber'
              icon='/icons/edit.svg'
              alt='Edit'
              tooltipTitle='Edit'
              onClick={handleSetModalEdit}
            />
          )}
          {access.delete === 1 && (
            <CustomMiniButton
              style='cherry'
              icon='/icons/trash.svg'
              alt='Delete'
              tooltipTitle='Delete'
              onClick={handleSetModalDelete}
            />
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
