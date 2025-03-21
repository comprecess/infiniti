import { useTranslation } from 'react-i18next'

import { ChartLegend } from '../../../../../../shared/ui/ChartLegend/ChartLegend'
import styles from './NetWorth.module.scss'

interface NetWorthProps {
  amount: string
}

export const NetWorth = ({ amount }: NetWorthProps) => {
  const { t } = useTranslation()

  return (
    <div className={styles.wrapper}>
      <div>
        <h3 className={styles.title}>{amount}</h3>
        <span className={styles.name}>
          {t('admin-dashboard-page-chart-title')}
        </span>
      </div>
      <div className={styles.legends}>
        <ChartLegend
          title={t('admin-dashboard-page-chart-legend-1')}
          color={styles.expensesColor}
        />
        <ChartLegend
          title={t('admin-dashboard-page-chart-legend-2')}
          color={styles.incomeColor}
        />
      </div>
    </div>
  )
}
