import { useState } from 'react'

import { RolesAccess } from '../../../../../../../../app/constants/constants'
import { ConfirmationModal } from '../../../../../../../../shared/ui/ConfirmationModal/ConfirmationModal'
import { CustomMiniButton } from '../../../../../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import { TypeFiles } from '../../../../../../../../shared/ui/TypeFiles/TypeFiles'
import styleItem from '../RecentFiles.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  access: RolesAccess
  idType: number
  type: string
  title: string
  deleteFile: (idType: number) => void
}

export const Item = ({
  access,
  idType,
  type,
  title,
  deleteFile,
}: ItemProps) => {
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
          {access.delete === 1 && (
            <CustomMiniButton
              style='cherry'
              icon='/icons/trash.svg'
              alt='Delete'
              tooltipTitle='Delete'
              onClick={handleOpenConfirmationModal}
            />
          )}
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
