import { FC } from 'react'

import { RolesAccess } from '../../../../../app/constants/constants'
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

export const Item: FC<ItemProps> = ({
  id,
  access,
  currencyCode,
  baseConversionRate,
  baseCurrency,
  deleteCurrency,
  changeBaseCurrency,
  editCurrency,
}) => {
  const handleDeleteClick = () => {
    deleteCurrency(id)
  }

  const handleChangeBaseCurrency = () => {
    changeBaseCurrency(id)
  }

  const handleEditCurrency = () => {
    editCurrency(id, currencyCode, baseConversionRate)
  }

  return (
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
          <button
            className={styles.buttonEdit}
            onClick={handleEditCurrency}
          >
            <img
              src='/icons/edit.svg'
              alt='Star'
              className={styles.icon}
            />
          </button>
        )}
        {baseCurrency === 0 ? (
          <button
            className={styles.buttonStar}
            onClick={handleChangeBaseCurrency}
          >
            <img
              src='/icons/star.svg'
              alt='Star'
              className={styles.icon}
            />
          </button>
        ) : null}
        {access.delete === 1 && (
          <button
            className={styles.buttonTrash}
            onClick={handleDeleteClick}
          >
            <img
              src='/icons/trash.svg'
              alt='Star'
              className={styles.icon}
            />
          </button>
        )}
      </div>
    </div>
  )
}
