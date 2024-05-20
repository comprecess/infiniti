import React, { FC } from 'react'

import { RecentProjectsData } from '../../../../app/data/admin/recentProjects'
import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentProjects.module.scss'

export const RecentProjects: FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title title='Name' style={styles.nameColumn} />
        <Title title='Budget' style={styles.budgetColumn} />
        <Title title='Status' style={styles.statusColumn} />
        <Title title='Created' style={styles.createdColumn} />
      </div>
      <div className={styles.items}>
        {RecentProjectsData.map((order, index) => {
          return (
            <React.Fragment key={order.id}>
              <Item
                name={order.name}
                budget={order.budget}
                status={order.status}
                created={order.created}
              />
              {index !== RecentProjectsData.length - 1 && (
                <CustomDivider />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
