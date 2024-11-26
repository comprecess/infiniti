import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { RolesAccess } from '../../../../../../app/constants/constants'
import { Routes } from '../../../../../../app/router/routes'
import { ConfirmationModal } from '../../../../../../shared/ui/ConfirmationModal/ConfirmationModal'
import styleItem from '../RecentCustomers.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  id: number
  access: RolesAccess
  image: string
  name: string
  code: string
  companyName: string
  group: string
  email: string
  phone: string
  deleteClient: (idSupplier: number) => void
}

export const Item: FC<ItemProps> = ({
  id,
  access,
  image,
  name,
  code,
  companyName,
  group,
  email,
  phone,
  deleteClient,
}) => {
  const [modalDelete, setModalDelete] = useState<boolean>(false)

  const navigate = useNavigate()

  const handleOpenConfirmationModal = () => {
    setModalDelete(state => !state)
  }

  const handleNavigate = (name: string) => {
    navigate(
      `/${Routes.adminPages}/${Routes.customers}/${Routes.view}/${id}/${name}`,
    )
  }

  const handleDeleteSupplier = () => {
    deleteClient(id)
    handleOpenConfirmationModal()
  }

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styleItem.imageColumn}>
          <img
            src={image ? image : '/profileWithoutAvatar.svg'}
            alt='Avatar'
            className={styles.imageItem}
          />
        </div>
        <div
          className={`${styleItem.nameColumn} ${styles.nameCodeItem}`}
          onClick={() => handleNavigate(Routes.summary)}
        >
          <span className={styles.nameItem}>{name}</span>
          <span className={styles.codeItem}>{code}</span>
        </div>
        <span
          className={`${styleItem.companyNameColumn} ${styles.companyNameItem}`}
        >
          {companyName}
        </span>
        <span className={`${styleItem.groupColumn} ${styles.groupItem}`}>
          {group}
        </span>
        <span className={`${styleItem.emailColumn} ${styles.emailItem}`}>
          {email}
        </span>
        <span className={`${styleItem.phoneColumn} ${styles.phoneItem}`}>
          {phone}
        </span>
        <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
          <button
            className={styles.viewButton}
            onClick={() => handleNavigate(Routes.summary)}
          >
            <img
              src='/icons/view.svg'
              alt='View'
              className={styles.icon}
            />
          </button>
          {access.edit === 1 && (
            <button
              className={styles.buttonEdit}
              onClick={() => handleNavigate(Routes.edit)}
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
              onClick={handleOpenConfirmationModal}
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
      {modalDelete && (
        <ConfirmationModal
          isOpened={modalDelete}
          handleOpenCloseModal={handleOpenConfirmationModal}
          agree={handleDeleteSupplier}
        />
      )}
    </>
  )
}
