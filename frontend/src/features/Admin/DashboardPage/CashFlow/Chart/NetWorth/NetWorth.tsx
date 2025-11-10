import { useTranslation } from 'react-i18next'

import styles from './NetWorth.module.scss'
import { ChartLegend } from '../../../../../../shared/ui/ChartLegend/ChartLegend'

interface NetWorthProps {
  amount: string
  firstTitle: string
  secondTitle: string
}

export const NetWorth = ({ amount, firstTitle, secondTitle }: NetWorthProps) => {
  const { t } = useTranslation()

  return (
    <div className={styles.wrapper}>
      <div>
        <h3 className={styles.title}>{amount}</h3>
        <span className={styles.name}>{t('admin-dashboard-page-chart-title')}</span>
      </div>
      <div className={styles.legends}>
        <ChartLegend title={t(secondTitle)} color={styles.incomeColor} />
        <ChartLegend title={t(firstTitle)} color={styles.expensesColor} />
      </div>
    </div>
  )
}
