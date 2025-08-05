import { useNavigate } from 'react-router-dom'

import { RolesAccess } from '../../../../../app/constants/constants'
import { Routes } from '../../../../../app/router/routes'
import { Status } from '../../../../../shared/ui/Status/Status'
import styleItem from '../RecentProjects.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  projectId: number
  name: string
  budget: string
  status: string
  created: string
  roles?: { [key: string]: RolesAccess }
}

export const Item = ({
  projectId,
  name,
  budget,
  status,
  created,
  roles,
}: ItemProps) => {
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
    <div className={styles.wrapper}>
      <span
        className={`${styleItem.nameColumn} ${styles.nameItem}`}
        onClick={handleNavigateToProjectView}
      >
        {name}
      </span>
      <span className={`${styleItem.budgetColumn} ${styles.budgetItem}`}>
        {budget}
      </span>
      <div className={styleItem.statusColumn}>
        <Status title={status} status={status} />
      </div>
      <span className={`${styleItem.createdColumn} ${styles.createdItem}`}>
        {created}
      </span>
    </div>
  )
}
