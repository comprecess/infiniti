import { useState } from 'react'

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
}

export const Item = ({
  id,
  name,
  companyName,
  email,
  phone,
}: ItemProps) => {
  const [modalDelete, setModalDelete] = useState<boolean>(false)

  const handleOpenConfirmationModal = () => {
    setModalDelete(state => !state)
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
          />
          <CustomMiniButton
            style='cherry'
            icon='/icons/trash.svg'
            alt='Delete'
            tooltipTitle='Delete'
          />
        </div>
      </div>
      {modalDelete && (
        <ConfirmationModal
          isOpened={modalDelete}
          handleOpenCloseModal={handleOpenConfirmationModal}
          agree={() => {}}
        />
      )}
    </>
  )
}
