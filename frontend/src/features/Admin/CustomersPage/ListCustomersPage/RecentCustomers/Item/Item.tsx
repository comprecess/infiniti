import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { RolesAccess } from '../../../../../../app/constants/constants'
import { Routes } from '../../../../../../app/router/routes'
import { ConfirmationModal } from '../../../../../../shared/ui/ConfirmationModal/ConfirmationModal'
import { CustomMiniButton } from '../../../../../../shared/ui/CustomMiniButton/CustomMiniButton'
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

export const Item = ({
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
}: ItemProps) => {
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
          <div className={styles.avatar}>
            <img
              alt='Avatar'
              src={
                image
                  ? `${image}?width=128&height=128`
                  : '/profileWithoutAvatar.svg'
              }
            />
          </div>
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
          {access.view === 1 && (
            <CustomMiniButton
              style='mint'
              icon='/icons/view.svg'
              alt='View'
              tooltipTitle='View'
              onClick={() => handleNavigate(Routes.summary)}
            />
          )}
          {access.edit === 1 && (
            <CustomMiniButton
              style='amber'
              icon='/icons/edit.svg'
              alt='Edit'
              tooltipTitle='Edit'
              onClick={() => handleNavigate(Routes.edit)}
            />
          )}
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
          agree={handleDeleteSupplier}
        />
      )}
    </>
  )
}
