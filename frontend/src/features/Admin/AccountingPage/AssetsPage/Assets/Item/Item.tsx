import { useState } from 'react'

import { FolderIcon } from '../../../../../../shared/icons/FolderIcon'
import { ConfirmationModal } from '../../../../../../shared/ui/ConfirmationModal/ConfirmationModal'
import styles from './Item.module.scss'

interface ItemProps {
  id: number
  name: string
  isActive: boolean
  isDeleted?: boolean
  onClick: () => void
  deleteCategory: (id: number) => void
}

export const Item = ({
  id,
  name,
  isActive,
  isDeleted = false,
  onClick,
  deleteCategory,
}: ItemProps) => {
  const [modalDelete, setModalDelete] = useState<boolean>(false)

  const handleOpenConfirmationModal = () => {
    setModalDelete(state => !state)
  }

  const handleDeleteCategory = () => {
    deleteCategory(id)
    handleOpenConfirmationModal()
  }

  return (
    <>
      <div
        className={isActive ? styles.wrapperActive : styles.wrapperDisable}
        onClick={!isActive ? onClick : () => {}}
      >
        <div className={styles.container}>
          <div
            className={isActive ? styles.iconActive : styles.iconDisable}
          >
            <FolderIcon />
          </div>
          <span
            className={isActive ? styles.titleActive : styles.titleDisable}
          >
            {name}
          </span>
        </div>
        {isActive && isDeleted && (
          <button
            className={styles.trashCherryWrapper}
            onClick={handleOpenConfirmationModal}
          >
            <img
              src='/icons/trash.svg'
              alt='Delete Asset'
              className={styles.trashIcon}
            />
          </button>
        )}
      </div>
      {modalDelete && (
        <ConfirmationModal
          isOpened={modalDelete}
          handleOpenCloseModal={handleOpenConfirmationModal}
          agree={handleDeleteCategory}
        />
      )}
    </>
  )
}
