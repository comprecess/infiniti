import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Routes } from '../../../../../../app/router/routes'
import { ConfirmationModal } from '../../../../../../shared/ui/ConfirmationModal/ConfirmationModal'
import { CustomMiniButton } from '../../../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import styleItem from '../RecentContactsList.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  id: number
  name: string
  companyName: string
  email: string
  phone: string
  deleteContact: () => void
}

export const Item = ({
  id,
  name,
  companyName,
  email,
  phone,
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
        <span className={`${styleItem.nameColumn} ${styles.nameItem}`}>
          {name}
        </span>
        <div
          className={`${styleItem.companyNameColumn} ${styles.companyNameItem}`}
        >
          {companyName}
        </div>
        <span className={`${styleItem.emailColumn} ${styles.emailItem}`}>
          {email}
        </span>
        <span className={`${styleItem.phoneColumn} ${styles.phoneItem}`}>
          {phone}
        </span>
        <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
          <CustomMiniButton
            style='mint'
            icon='/icons/view.svg'
            alt='View'
            tooltipTitle='View'
            onClick={handleNavigateToCustomer}
          />
          <CustomMiniButton
            style='cherry'
            icon='/icons/trash.svg'
            alt='Delete'
            tooltipTitle='Delete'
            onClick={handleOpenConfirmationModal}
          />
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
