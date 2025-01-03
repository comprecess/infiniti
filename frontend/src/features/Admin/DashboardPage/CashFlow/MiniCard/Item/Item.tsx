import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import styles from './Item.module.scss'

interface ItemProps {
  plus?: boolean
  amount: string
}

export const Item: FC<ItemProps> = ({ amount, plus = false }) => {
  const { t } = useTranslation()

  return (
    <div className={styles.wrapper}>
      {plus ? (
        <img
          className={styles.icon}
          src='/icons/creditCardPlus.svg'
          alt='CreditCardPlus'
        />
      ) : (
        <img
          className={styles.icon}
          src='/icons/creditCardOutcome.svg'
          alt='CreditCardOutcome'
        />
      )}
      <div className={styles.items}>
        <h5 className={styles.amount}>{amount}</h5>
        {plus ? (
          <span className={styles.nameItem}>
            {t('admin-dashboard-page-mini-info-legend-1')}
          </span>
        ) : (
          <span className={styles.nameItem}>
            {t('admin-dashboard-page-mini-info-legend-2')}
          </span>
        )}
      </div>
    </div>
  )
}
