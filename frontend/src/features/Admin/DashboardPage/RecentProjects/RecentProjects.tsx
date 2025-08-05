import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import {
  DashboardRecentProjectsData,
  RolesAccess,
} from '../../../../app/constants/constants'
import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentProjects.module.scss'

interface RecentProjectsProps {
  recentProjects: DashboardRecentProjectsData[]
  roles?: { [key: string]: RolesAccess }
}

export const RecentProjects = ({
  recentProjects,
  roles,
}: RecentProjectsProps) => {
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
        {recentProjects.map((project, index) => {
          return (
            <Fragment key={project.id}>
              <Item
                projectId={project.id}
                name={project.name}
                budget={project.budget}
                status={project.status}
                created={project.dueDate}
                roles={roles}
              />
              {index !== recentProjects.length - 1 && <CustomDivider />}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
