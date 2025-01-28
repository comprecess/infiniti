import { FC, useState } from 'react'

import { RolesAccess } from '../../../../../../../app/constants/constants'
import { ConfirmationModal } from '../../../../../../../shared/ui/ConfirmationModal/ConfirmationModal'
import { CustomMiniButton } from '../../../../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import styleItem from '../RecentUsers.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  id: number
  avatar: string
  name: string
  email: string
  phone: string
  city: string
  departments: { id: number; name: string }[]
  state: string
  zip: string
  country: string
  type: string
  access: RolesAccess
  onDeleteUser: (idUser: number) => void
  onEditUser: (idUser: number) => void
}

export const Item: FC<ItemProps> = ({
  id,
  avatar,
  name,
  email,
  phone,
  departments,
  city,
  state,
  zip,
  country,
  type,
  access,
  onDeleteUser,
  onEditUser,
}) => {
  const [modal, setModal] = useState<boolean>(false)

  const handleOpenConfirmationModal = () => {
    setModal(state => !state)
  }

  const handleDeleteUser = () => {
    onDeleteUser(id)
  }

  const handleEditUser = () => {
    onEditUser(id)
  }

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styleItem.avatarColumn}>
          <div className={styles.avatar}>
            <img
              alt='Avatar'
              src={
                avatar
                  ? `${avatar}?width=128&height=128`
                  : '/profileWithoutAvatar.svg'
              }
            />
          </div>
        </div>
        <div className={styleItem.detailsColumn}>
          <div className={styles.detailsContainer}>
            {name && <span className={styles.detailsItem}>{name}</span>}
            {email && <span className={styles.detailsItem}>{email}</span>}
            {phone && <span className={styles.detailsItem}>{phone}</span>}
            {city && <span className={styles.detailsItem}>{city}</span>}
            {state && zip && (
              <span className={styles.detailsItem}>
                {`${state} - ${zip}`}
              </span>
            )}
            {country && (
              <span className={styles.detailsItem}>{country}</span>
            )}
          </div>
        </div>
        <div
          className={`${styleItem.typeColumn} ${styles.typesContainer}`}
        >
          <span className={styles.typeItem}>{type}</span>
          {departments.map(item => {
            return (
              <span key={item.id} className={styles.extTypeItem}>
                {item.name}
              </span>
            )
          })}
        </div>
        <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
          {access.edit && (
            <CustomMiniButton
              style='amber'
              icon='/icons/edit.svg'
              alt='Edit'
              tooltipTitle='Edit'
              onClick={handleEditUser}
            />
          )}
          {access.delete && (
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
      {modal && (
        <ConfirmationModal
          isOpened={modal}
          handleOpenCloseModal={handleOpenConfirmationModal}
          agree={handleDeleteUser}
        />
      )}
    </>
  )
}
