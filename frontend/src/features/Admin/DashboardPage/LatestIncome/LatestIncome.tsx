import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './LatestIncome.module.scss'

export const LatestIncome: FC = () => {
  const { t } = useTranslation()

  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title
          title={t('admin-dashboard-page-card-6-table-1')}
          style={styles.dateColumn}
        />
        <Title
          title={t('admin-dashboard-page-card-6-table-2')}
          style={styles.descriptionColumn}
        />
        <Title
          title={t('admin-dashboard-page-card-6-table-3')}
          style={styles.amountColumn}
        />
      </div>
      <div className={styles.items}>
        {[].map((_order, index) => {
          return (
            <React.Fragment key={'order.id'}>
              <Item
                date={'order.date'}
                amount={'order.amount'}
                description={'order.description'}
              />
              {index !== [].length - 1 && <CustomDivider />}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
