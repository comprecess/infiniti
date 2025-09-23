import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import { Header } from './Header/Header'
import { Item } from './Item/Item'
import styles from './NetWorthAccountBalances.module.scss'
import { DashboardNetWorthData } from '../../../../app/constants/constants'
import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../Main/RecentCard/Title/Title'

interface NetWorthAccountBalancesProps {
  account: DashboardNetWorthData
}

export const NetWorthAccountBalances = ({ account }: NetWorthAccountBalancesProps) => {
  const { t } = useTranslation()

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <Header
          amount={String(account.netWorth)}
          total={account.limit}
          name={t('admin-dashboard-page-card-8-mini-title')}
        />
        <div>
          <div className={styles.columns}>
            <Title title={t('admin-dashboard-page-card-8-table-1')} style={styles.accountColumn} />
            <Title title={t('admin-dashboard-page-card-8-table-2')} style={styles.balanceColumn} />
          </div>
          <div className={styles.items}>
            {account.list.map((item, index) => {
              return (
                <Fragment key={item.id}>
                  <Item account={item.name} balance={item.balanceCurrency} />
                  {index !== account.list.length - 1 && <CustomDivider />}
                </Fragment>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
