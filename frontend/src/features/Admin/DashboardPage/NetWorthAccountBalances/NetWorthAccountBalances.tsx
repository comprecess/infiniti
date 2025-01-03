import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../Main/RecentCard/Title/Title'
import { Header } from './Header/Header'
import { Item } from './Item/Item'
import styles from './NetWorthAccountBalances.module.scss'

export const NetWorthAccountBalances: FC = () => {
  const { t } = useTranslation()

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <Header
          amount={'-0-'}
          total={'-0-'}
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
