import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import styles from './Item.module.scss'

interface ItemProps {
  plus?: boolean
  amount: string
}

export const Item = ({ amount, plus = false }: ItemProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleClick = () => {
    if (plus) {
      navigate('/admin/accounting/new/deposit')
    } else {
      navigate('/admin/accounting/new/expense')
    }
  }

  return (
    <div className={styles.wrapper} onClick={handleClick} style={{ cursor: 'pointer' }}>
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
