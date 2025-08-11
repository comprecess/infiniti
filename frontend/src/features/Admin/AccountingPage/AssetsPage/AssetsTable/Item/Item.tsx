import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { RolesAccess } from '../../../../../../app/constants/constants'
import { Routes } from '../../../../../../app/router/routes'
import { ConfirmationModal } from '../../../../../../shared/ui/ConfirmationModal/ConfirmationModal'
import { CustomMiniButton } from '../../../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import styleItem from '../AssetsTable.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  id: number
  name: string
  datePurchased: string
  supportedUntil: string
  price: string
  access: RolesAccess
  deleteAsset: (id: number) => void
}

export const Item = ({
  id,
  name,
  datePurchased,
  supportedUntil,
  price,
  access,
  deleteAsset,
}: ItemProps) => {
  const [modalDelete, setModalDelete] = useState<boolean>(false)

  const navigate = useNavigate()

  const handleOpenConfirmationModal = () => {
    setModalDelete(state => !state)
  }

  const handleDeleteAsset = () => {
    deleteAsset(id)
    handleOpenConfirmationModal()
  }

  const navigateToEditAsset = () => {
    navigate(
      `/${Routes.adminPages}/${Routes.accounting}/${Routes.assets}/${Routes.edit}/${Routes.asset}/${id}`,
    )
  }

  return (
    <>
      <div className={styles.wrapper}>
        <span className={`${styleItem.nameColumn} ${styles.nameItem}`}>
          {name}
        </span>
        <span className={`${styleItem.dateColumn} ${styles.dateItem}`}>
          {datePurchased}
        </span>
        <span className={`${styleItem.untilColumn} ${styles.untilItem}`}>
          {supportedUntil}
        </span>
        <span className={`${styleItem.priceColumn} ${styles.priceItem}`}>
          {price}
        </span>
        <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
          {access.edit === 1 && (
            <CustomMiniButton
              style='amber'
              icon='/icons/edit.svg'
              alt='Edit'
              tooltipTitle='Edit'
              onClick={navigateToEditAsset}
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
          agree={handleDeleteAsset}
        />
      )}
    </>
  )
}
