import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './Item.module.scss'
import { RolesAccess } from '../../../../../../app/constants/constants'
import { Routes } from '../../../../../../app/router/routes'
import { ConfirmationModal } from '../../../../../../shared/ui/ConfirmationModal/ConfirmationModal'
import { CustomMiniButton } from '../../../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import styleItem from '../RecentContactsList.module.scss'

interface ItemProps {
  id: number
  name: string
  company?: { id: number; name: string }
  email: string
  phone: string
  roles?: { [key: string]: RolesAccess }
  deleteContact: () => void
}

export const Item = ({
  id,
  name,
  company,
  email,
  phone,
  roles,
  deleteContact,
}: ItemProps) => {
  const [modalDelete, setModalDelete] = useState<boolean>(false)

  const navigate = useNavigate()

  const handleOpenConfirmationModal = () => {
    setModalDelete(state => !state)
  }

  const handleNavigateToCustomer = () => {
    navigate(
      `/${Routes.adminPages}/${Routes.customers}/${Routes.view}/${id}/${Routes.summary}`,
    )
  }

  return (
    <>
      <div className={styles.wrapper}>
        <span className={`${styleItem.hashtagColumn} ${styles.idItem}`}>
          {id}
        </span>
        <span
          className={`${styleItem.nameColumn} ${styles.nameItem}`}
          onClick={handleNavigateToCustomer}
        >
          {name}
        </span>
        <div
          className={`${styleItem.companyNameColumn} ${styles.companyNameItem}`}
        >
          {company?.name}
        </div>
        <span className={`${styleItem.emailColumn} ${styles.emailItem}`}>
          {email}
        </span>
        <span className={`${styleItem.phoneColumn} ${styles.phoneItem}`}>
          {phone}
        </span>
        <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
          {roles && roles.customers.view === 0 ? (
            <div style={{ display: 'none' }} />
          ) : (
            <CustomMiniButton
              style='mint'
              icon='/icons/view.svg'
              alt='View'
              tooltipTitle='View'
              onClick={handleNavigateToCustomer}
            />
          )}
          {roles && roles.customers.edit === 0 ? (
            <div style={{ display: 'none' }} />
          ) : (
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
          agree={deleteContact}
        />
      )}
    </>
  )
}
