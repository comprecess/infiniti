import React, { FC } from 'react'

import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../Main/RecentCard/Title/Title'
import { Header } from './Header/Header'
import { Item } from './Item/Item'
import styles from './NetWorthAccountBalances.module.scss'

export const NetWorthAccountBalances: FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <Header amount={'-0-'} total={'-0-'} name='Net Worth' />
        <div>
          <div className={styles.columns}>
            <Title title='Account' style={styles.accountColumn} />
            <Title title='Balance' style={styles.balanceColumn} />
          </div>
          <div className={styles.items}>
            {[].map((_order, index) => {
              return (
                <React.Fragment key={'order.id'}>
                  <Item
                    account={'order.account'}
                    balance={'order.balance'}
                  />
                  {index !== [].length - 1 && <CustomDivider />}
                </React.Fragment>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
