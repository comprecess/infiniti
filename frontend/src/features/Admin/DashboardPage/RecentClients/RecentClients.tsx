import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentClients.module.scss'

export const RecentClients: FC = () => {
  const { t } = useTranslation()

  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title
          title={t('admin-dashboard-page-card-2-table-1')}
          style={styles.avatarColumn}
        />
        <Title
          title={t('admin-dashboard-page-card-2-table-2')}
          style={styles.nameEmailColumn}
        />
        <Title
          title={t('admin-dashboard-page-card-2-table-3')}
          style={styles.createdColumn}
        />
      </div>
      <div className={styles.items}>
        {[].map((_order, index) => {
          return (
            <React.Fragment key={'order.id'}>
              <Item
                avatar={'order.avatar'}
                name={'order.name'}
                email={'order.email'}
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
