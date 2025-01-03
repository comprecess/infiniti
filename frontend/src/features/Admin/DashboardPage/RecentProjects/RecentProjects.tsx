import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentProjects.module.scss'

export const RecentProjects: FC = () => {
  const { t } = useTranslation()

  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title
          title={t('admin-dashboard-page-card-3-table-1')}
          style={styles.nameColumn}
        />
        <Title
          title={t('admin-dashboard-page-card-3-table-2')}
          style={styles.budgetColumn}
        />
        <Title
          title={t('admin-dashboard-page-card-3-table-3')}
          style={styles.statusColumn}
        />
        <Title
          title={t('admin-dashboard-page-card-3-table-4')}
          style={styles.createdColumn}
        />
      </div>
      <div className={styles.items}>
        {[].map((_order, index) => {
          return (
            <React.Fragment key={'order.id'}>
              <Item
                name={'order.name'}
                budget={'order.budget'}
                status={'order.status'}
                created={'order.created'}
              />
              {index !== [].length - 1 && <CustomDivider />}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
