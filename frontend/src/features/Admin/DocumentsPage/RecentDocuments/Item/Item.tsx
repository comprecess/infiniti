import { useState } from 'react'

import styles from './Item.module.scss'
import { RolesAccess } from '../../../../../app/constants/constants'
import { ConfirmationModal } from '../../../../../shared/ui/ConfirmationModal/ConfirmationModal'
import { CustomMiniButton } from '../../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import { TypeFiles } from '../../../../../shared/ui/TypeFiles/TypeFiles'
import { EditDocumentModal } from '../../EditDocumentModal/EditDocumentModal'
import styleItem from '../RecentDocuments.module.scss'

interface ItemProps {
  idFile: number
  global: number
  title: string
  type: string
  authToken: string | undefined
  link: string
  access: RolesAccess | undefined
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
    const headers: HeadersInit = global === 0 ? { Authorization: `Bearer ${authToken}` } : {}

    try {
      const response = await fetch(link, { headers })

      if (!response.ok) throw new Error('Ошибка загрузки файла')

      const blob = await response.blob()

      // Определяем можно ли просмотреть в браузере
      const canView =
        blob.type.startsWith('image/') ||
        blob.type === 'application/pdf' ||
        blob.type.startsWith('text/')

      const url = URL.createObjectURL(blob)

      if (canView) {
        // Пытаемся открыть в новой вкладке
        const newWindow = window.open(url, '_blank')
        if (!newWindow) {
          // Если окно заблокировано, предлагаем скачать
          const a = document.createElement('a')
          a.href = url
          a.download = title
          document.body.appendChild(a)
          a.click()
          a.remove()
        }
      } else {
        // Если нельзя просмотреть — скачиваем
        const a = document.createElement('a')
        a.href = url
        a.download = title
        document.body.appendChild(a)
        a.click()
        a.remove()
      }

      // Удаляем URL через небольшой таймаут
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (error) {
      console.error('Не удалось скачать/просмотреть файл', error)
    }
  }

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styleItem.typeColumn}>
          <TypeFiles type={type} />
        </div>
        <span className={`${styleItem.titleColumn} ${styles.titleItem}`}>{title}</span>
        <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
          <CustomMiniButton
            style='mint'
            icon='/icons/fileDownload.svg'
            alt='View or Download file'
            tooltipTitle='View or Download file'
            onClick={() => handleDownloadFile(link)}
          />
          {access && access.edit === 0 ? (
            <div style={{ display: 'none' }} />
          ) : (
            <CustomMiniButton
              style='amber'
              icon='/icons/edit.svg'
              alt='Edit'
              tooltipTitle='Edit'
              onClick={handleSetModalEdit}
            />
          )}
          {access && access.delete === 0 ? (
            <div style={{ display: 'none' }} />
          ) : (
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
