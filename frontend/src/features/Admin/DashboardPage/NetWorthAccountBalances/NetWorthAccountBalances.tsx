import React, { FC } from 'react'

import { NetWorthAccountBalancesData } from '../../../../app/data/admin/netWorthAccountBalances'
import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../Main/RecentCard/Title/Title'
import { Header } from './Header/Header'
import { Item } from './Item/Item'
import styles from './NetWorthAccountBalances.module.scss'

export const NetWorthAccountBalances: FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <Header
          amount={NetWorthAccountBalancesData.amount}
          total={NetWorthAccountBalancesData.total}
          name='Net Worth'
        />
        <div>
          <div className={styles.columns}>
            <Title title='Account' style={styles.accountColumn} />
            <Title title='Balance' style={styles.balanceColumn} />
          </div>
          <div className={styles.items}>
            {NetWorthAccountBalancesData.data.map((order, index) => {
              return (
                <React.Fragment key={order.id}>
                  <Item account={order.account} balance={order.balance} />
                  {index !==
                    NetWorthAccountBalancesData.data.length - 1 && (
                    // Causes an error related to indentation
                    // eslint-disable-next-line react/jsx-indent
                    <CustomDivider />
                  )}
                </React.Fragment>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
