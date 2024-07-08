import React, { FC } from 'react'

import { RecentCurrenciesData } from '../../../../app/data/admin/recentCurrencies'
import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentCurrencies.module.scss'

export const RecentCurrencies: FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title title='Currency Code' style={styles.currencyCodeColumn} />
        <Title
          title='Base Conversion Rate'
          style={styles.baseConversionRateColumn}
        />
        <Title title='Manage' style={styles.manageColumn} />
      </div>
      <div className={styles.items}>
        {RecentCurrenciesData.map((order, index) => {
          return (
            <React.Fragment key={order.id}>
              <Item
                currencyCode={order.currencyCode}
                baseConversionRate={order.baseConversionRate}
                baseCurrency={order.baseCurrency}
              />
              {index !== RecentCurrenciesData.length - 1 && (
                <CustomDivider />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
