import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../Main/RecentCard/Title/Title'
import { Header } from './Header/Header'
import { Item } from './Item/Item'
import styles from './NetWorthAccountBalances.module.scss'

const demoData = [
  { id: 0, account: 'SBER', balance: '1,020 $' },
  { id: 1, account: 'Qiwi', balance: '4,560 $' },
  { id: 2, account: 'Payeer', balance: '870 $' },
  { id: 3, account: 'Юmoney', balance: '2,130 $' },
  { id: 4, account: 'UT', balance: '1,240 $' },
  { id: 5, account: 'Infiniti', balance: '1,020 $' },
  { id: 6, account: 'Binance', balance: '4,560 $' },
  { id: 7, account: 'WebMoney', balance: '870 $' },
  { id: 8, account: 'Wise', balance: '2,130 $' },
]

export const NetWorthAccountBalances: FC = () => {
  const { t } = useTranslation()

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <Header
          amount={'4,284 $'}
          total={'10,000 $'}
          name={t('admin-dashboard-page-card-8-mini-title')}
        />
        <div>
          <div className={styles.columns}>
            <Title
              title={t('admin-dashboard-page-card-8-table-1')}
              style={styles.accountColumn}
            />
            <Title
              title={t('admin-dashboard-page-card-8-table-2')}
              style={styles.balanceColumn}
            />
          </div>
          <div className={styles.items}>
            {demoData.map((order, index) => {
              return (
                <React.Fragment key={order.id}>
                  <Item account={order.account} balance={order.balance} />
                  {index !== demoData.length - 1 && <CustomDivider />}
                </React.Fragment>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
