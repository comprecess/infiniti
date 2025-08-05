import { useState } from 'react'

import { RolesAccess } from '../../../../../app/constants/constants'
import { ConfirmationModal } from '../../../../../shared/ui/ConfirmationModal/ConfirmationModal'
import { CustomMiniButton } from '../../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import styleItem from '../RecentCurrencies.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  id: number
  access: RolesAccess
  currencyCode: string
  baseConversionRate: string
  baseCurrency: number
  deleteCurrency: (id: number) => void
  changeBaseCurrency: (id: number) => void
  editCurrency: (
    id: number,
    inputValueName: string,
    inputValueRate: string,
  ) => void
}

export const Item = ({
  id,
  access,
  currencyCode,
  baseConversionRate,
  baseCurrency,
  deleteCurrency,
  changeBaseCurrency,
  editCurrency,
}: ItemProps) => {
  const [modalDelete, setModalDelete] = useState<boolean>(false)

  const handleOpenConfirmationModal = () => {
    setModalDelete(state => !state)
  }

  const handleDeleteClick = () => {
    deleteCurrency(id)
    handleOpenConfirmationModal()
  }

  const handleChangeBaseCurrency = () => {
    changeBaseCurrency(id)
  }

  const handleEditCurrency = () => {
    editCurrency(id, currencyCode, baseConversionRate)
  }

  return (
    <>
      <div className={styles.wrapper}>
        <span
          className={`${styleItem.currencyCodeColumn} ${styles.currencyCodeItem}`}
        >
          {currencyCode}
          {baseCurrency === 1 ? ' (Base Currency)' : null}
        </span>
        <span
          className={`${styleItem.baseConversionRateColumn} ${styles.baseConversionRateItem}`}
        >
          {baseConversionRate}
        </span>
        <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
          {access.edit === 1 && (
            <CustomMiniButton
              style='mint'
              icon='/icons/edit.svg'
              alt='Edit'
              tooltipTitle='Edit'
              onClick={handleEditCurrency}
            />
          )}
          {access.edit === 1 && baseCurrency === 0 ? (
            <CustomMiniButton
              style='amber'
              icon='/icons/star.svg'
              alt='Base'
              tooltipTitle='Base'
              onClick={handleChangeBaseCurrency}
            />
          ) : null}
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
          agree={handleDeleteClick}
        />
      )}
    </>
  )
}
