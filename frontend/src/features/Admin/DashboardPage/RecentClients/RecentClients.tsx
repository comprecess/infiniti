import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import { DashboardRecentClientData } from '../../../../app/constants/constants'
import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentClients.module.scss'

interface RecentClientsProps {
  recentClients: DashboardRecentClientData[]
}

export const RecentClients = ({ recentClients }: RecentClientsProps) => {
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
        {recentClients.map((client, index) => {
          return (
            <Fragment key={client.id}>
              <Item
                clientId={client.id}
                name={client.account}
                email={client.email}
                created={client.created}
                avatar={
                  client.img
                    ? `${client.img}?width=176&height=176`
                    : '/profileWithoutAvatar.svg'
                }
              />
              {index !== recentClients.length - 1 && <CustomDivider />}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
