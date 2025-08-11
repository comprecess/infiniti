import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  AccountingBillsData,
  RolesAccess,
} from '../../../../../../../app/constants/constants'
import { Routes } from '../../../../../../../app/router/routes'
import { ConfirmationModal } from '../../../../../../../shared/ui/ConfirmationModal/ConfirmationModal'
import { CustomMiniButton } from '../../../../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import styles from './Item.module.scss'

interface ItemProps {
  data: AccountingBillsData
  access: RolesAccess
  deleteBill: (idBill: number) => void
  isPaidBill: (idBill: number) => void
}

export const Item = ({
  data,
  access,
  deleteBill,
  isPaidBill,
}: ItemProps) => {
  const [modalDelete, setModalDelete] = useState<boolean>(false)

  const navigate = useNavigate()

  const handleOpenConfirmationModal = () => {
    setModalDelete(state => !state)
  }

  const handleDeleteBill = () => {
    deleteBill(data.id)
    handleOpenConfirmationModal()
  }

  const navigateToWebsite = () => {
    let url = data.website

    if (url && !/^https?:\/\//i.test(url)) {
      url = `https://${url}`
    }

    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const navigateToAddNewBill = () => {
    navigate(
      `/${Routes.adminPages}/${Routes.accounting}/${Routes.bills}/${Routes.edit}/${Routes.bill}/${data.id}`,
    )
  }

  return (
    <>
      <div className={styles.wrapper}>
        <p className={styles.date}>{data.nextDate}</p>
        <p className={styles.title}>{data.title}</p>
        <p className={styles.amount}>{data.amount}</p>
        <div className={styles.container}>
          <div>
            <p className={styles.inConnection}>In connection</p>
            <p className={styles.recurringType}>{data.recurringType}</p>
          </div>
          <div className={styles.buttons}>
            {access.edit === 1 && data.isPaid === 0 && (
              <CustomMiniButton
                style='mint'
                icon='/icons/check.svg'
                alt='Is Paid'
                tooltipTitle='Is Paid'
                onClick={() => isPaidBill(data.id)}
              />
            )}
            {access.edit === 1 && (
              <CustomMiniButton
                style='amber'
                icon='/icons/edit.svg'
                alt='Edit'
                tooltipTitle='Edit'
                onClick={navigateToAddNewBill}
              />
            )}
            <CustomMiniButton
              style='gray'
              icon='/icons/website.svg'
              alt='Website'
              tooltipTitle='Website'
              onClick={navigateToWebsite}
            />
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
      </div>
      {modalDelete && (
        <ConfirmationModal
          isOpened={modalDelete}
          handleOpenCloseModal={handleOpenConfirmationModal}
          agree={handleDeleteBill}
        />
      )}
    </>
  )
}
