import { useState } from 'react'

import { RolesAccess } from '../../../../../../app/constants/constants'
import { ConfirmationModal } from '../../../../../../shared/ui/ConfirmationModal/ConfirmationModal'
import { CustomMiniButton } from '../../../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import styleItem from '../RecentCompanies.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  id: number
  access: RolesAccess
  logo: string
  code: string
  name: string
  email: string
  phone: string
  deleteCompany: (id: number) => void
  editCompany: (id: number) => void
  infoCompany: (id: number) => void
}

export const Item = ({
  id,
  access,
  logo,
  code,
  name,
  email,
  phone,
  deleteCompany,
  editCompany,
  infoCompany,
}: ItemProps) => {
  const [modalDelete, setModalDelete] = useState<boolean>(false)

  const handleOpenConfirmationModal = () => {
    setModalDelete(state => !state)
  }

  const handleInfoCompany = () => {
    infoCompany(id)
  }

  const handleEditCompany = () => {
    editCompany(id)
  }

  const handleDeleteCompany = () => {
    deleteCompany(id)
    handleOpenConfirmationModal()
  }

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styleItem.logoColumn}>
          <div className={styles.logoWrapper}>
            {logo ? (
              <img src={logo} alt='Logo' className={styles.logoItem} />
            ) : null}
          </div>
        </div>
        <div className={styleItem.companyNameColumn}>
          <div className={styles.container} onClick={handleInfoCompany}>
            <span className={styles.companyNameItem}>{name}</span>
            <span className={styles.companyCodeItem}>{code}</span>
          </div>
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
            onClick={handleInfoCompany}
          />
          {access.edit === 1 && (
            <CustomMiniButton
              style='amber'
              icon='/icons/edit.svg'
              alt='Edit'
              tooltipTitle='Edit'
              onClick={handleEditCompany}
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
          agree={handleDeleteCompany}
        />
      )}
    </>
  )
}
