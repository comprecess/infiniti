import { FC } from 'react'

import { CustomSwitch } from '../../../../../shared/ui/CustomSwitch/CustomSwitch'
import styleItem from '../RecentCurrencies.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  currencyCode: string
  baseConversionRate: string
  baseCurrency: boolean
}

export const Item: FC<ItemProps> = ({
  currencyCode,
  baseConversionRate,
  baseCurrency,
}) => {
  return (
    <div className={styles.wrapper}>
      <span
        className={`${styleItem.currencyCodeColumn} ${styles.currencyCodeItem}`}
      >
        {currencyCode}
        {baseCurrency ? ' (Base Currency)' : null}
      </span>
      <span
        className={`${styleItem.baseConversionRateColumn} ${styles.baseConversionRateItem}`}
      >
        {baseConversionRate}
      </span>
      <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
        <CustomSwitch />
        {!baseCurrency ? (
          <button className={styles.buttonStar}>
            <img
              src='/icons/star.svg'
              alt='Star'
              className={styles.starIcon}
            />
          </button>
        ) : null}
      </div>
    </div>
  )
}
