import { useState } from 'react'

import { RolesAccess } from '../../../../../../app/constants/constants'
import { ConfirmationModal } from '../../../../../../shared/ui/ConfirmationModal/ConfirmationModal'
import { CustomMiniButton } from '../../../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import { Status } from '../../../../../../shared/ui/Status/Status'
import styleItem from '../RecentOffers.module.scss'
import styles from './Item.module.scss'

export interface ItemProps {
  access: RolesAccess
  id: number
  idAccount: number | null
  code: string
  account: string | null
  subject: string
  amount: string
  dateCreated: string
  expiryDate: string
  stage: string
  navigateToViewOffer: (idOffer: number) => void
  navigateToEditOffer: (idOffer: number) => void
  navigateToSelectAccount: (idAccount: number) => void
  deleteOffer: (idOffer: number) => void
}

export const Item = ({
  access,
  id,
  idAccount,
  code,
  account,
  subject,
  amount,
  dateCreated,
  expiryDate,
  stage,
  navigateToViewOffer,
  navigateToEditOffer,
  navigateToSelectAccount,
  deleteOffer,
}: ItemProps) => {
  const [modalDelete, setModalDelete] = useState<boolean>(false)

  const handleOpenConfirmationModal = () => {
    setModalDelete(state => !state)
  }

  const handleNavigateToViewOffer = () => {
    navigateToViewOffer(id)
  }

  const handleNavigateToEditOffer = () => {
    navigateToEditOffer(id)
  }

  const handleNavigateToSelectAccount = () => {
    if (!idAccount) return

    navigateToSelectAccount(idAccount)
  }

  const handleDeleteOffer = () => {
    deleteOffer(id)
    handleOpenConfirmationModal()
  }

  return (
    <>
      <div className={styles.wrapper}>
        <span
          className={`${styleItem.codeColumn} ${styles.codeItem}`}
          onClick={handleNavigateToViewOffer}
        >
          {code}
        </span>
        <span
          className={`${styleItem.accountColumn} ${styles.accountItem}`}
          onClick={handleNavigateToSelectAccount}
        >
          {account ? account : `-`}
        </span>
        <span
          className={`${styleItem.subjectColumn} ${styles.subjectItem}`}
        >
          {subject}
        </span>
        <span className={`${styleItem.amountColumn} ${styles.amountItem}`}>
          {amount}
        </span>
        <span
          className={`${styleItem.dateCreatedColumn} ${styles.dateCreatedItem}`}
        >
          {dateCreated}
        </span>
        <span
          className={`${styleItem.expiryDateColumn} ${styles.expiryDateItem}`}
        >
          {expiryDate}
        </span>
        <div className={styleItem.stageColumn}>
          <Status title={stage} status={stage} />
        </div>
        <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
          {access.view === 1 && (
            <CustomMiniButton
              style='mint'
              icon='/icons/view.svg'
              alt='View'
              tooltipTitle='View'
              onClick={handleNavigateToViewOffer}
            />
          )}
          {access.edit === 1 && (
            <CustomMiniButton
              style='amber'
              icon='/icons/edit.svg'
              alt='Edit'
              tooltipTitle='Edit'
              onClick={handleNavigateToEditOffer}
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
          agree={handleDeleteOffer}
        />
      )}
    </>
  )
}
