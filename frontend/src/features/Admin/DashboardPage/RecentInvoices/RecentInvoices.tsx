import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../Main/RecentCard/Title/Title'
import { Chart } from './Chart/Chart'
import { Item } from './Item/Item'
import styles from './RecentInvoices.module.scss'

export const RecentInvoices: FC = () => {
  const { t } = useTranslation()

  const data: string[] = []

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div>
          <div className={styles.columns}>
            <Title title='#' style={styles.hashtagColumn} />
            <Title
              title={t('admin-dashboard-page-card-4-table-1')}
              style={styles.accountColumn}
            />
            <Title
              title={t('admin-dashboard-page-card-4-table-2')}
              style={styles.amountColumn}
            />
            <Title
              title={t('admin-dashboard-page-card-4-table-3')}
              style={styles.createdColumn}
            />
            <Title
              title={t('admin-dashboard-page-card-4-table-4')}
              style={styles.dueColumn}
            />
            <Title
              title={t('admin-dashboard-page-card-4-table-5')}
              style={styles.statusColumn}
            />
          </div>
          <div className={styles.items}>
            {[].map((_order, index) => {
              return (
                <React.Fragment key={'order.id'}>
                  <Item
                    hashtag={'order.hashtag'}
                    account={'order.account'}
                    amount={'order.amount'}
                    created={'order.created'}
                    due={'order.due'}
                    status={'order.status'}
                  />
                  {index !== [].length - 1 && <CustomDivider />}
                </React.Fragment>
              )
            })}
          </div>
        </div>
        <Chart data={data} />
      </div>
    </div>
  )
}
