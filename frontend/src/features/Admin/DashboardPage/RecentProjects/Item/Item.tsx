import { useNavigate } from 'react-router-dom'

import styles from './Item.module.scss'
import { RolesAccess } from '../../../../../app/constants/constants'
import { Routes } from '../../../../../app/router/routes'
import { ResponsiveRow } from '../../../../../shared/ui/ExpandableRow/ResponsiveRow'
import { Status } from '../../../../../shared/ui/Status/Status'
import styleItem from '../RecentProjects.module.scss'

interface ItemProps {
  projectId: number
  name: string
  budget: string
  status: string
  created: string
  roles?: { [key: string]: RolesAccess }
}

export const Item = ({ projectId, name, budget, status, created, roles }: ItemProps) => {
  const navigate = useNavigate()

  const handleNavigateToProjectView = () => {
    if (roles && roles.projects.view === 0) {
      navigate(`/403`)
    } else {
      navigate(
        `/${Routes.adminPages}/${Routes.projects}/${Routes.view}/${Routes.project}/${projectId}/${Routes.summary}`,
      )
    }
  }

  return (
    <ResponsiveRow
      hiddenFields={[
        {
          label: 'Budget:',
          value: <span className={styles.budgetItemMobile}>{budget}</span>,
        },
        {
          label: 'Created:',
          value: <span className={styles.createdItemMobile}>{created}</span>,
        },
      ]}
      visibleFields={[
        {
          label: 'Name',
          value: (
            <span className={styles.nameItem} onClick={handleNavigateToProjectView}>
              {name}
            </span>
          ),
          className: styleItem.nameColumn,
        },
        {
          label: 'Budget:',
          value: <span className={styles.budgetItem}>{budget}</span>,
          className: styleItem.budgetColumn,
        },
        {
          label: 'Status',
          value: <Status title={status} status={status} />,
          className: styleItem.statusColumn,
        },
        {
          label: 'Created:',
          value: <span className={styles.createdItem}>{created}</span>,
          className: styleItem.createdColumn,
        },
      ]}
    />
  )
}
