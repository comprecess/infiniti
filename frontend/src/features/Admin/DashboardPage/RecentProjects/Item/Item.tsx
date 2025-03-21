import { Status } from '../../../../../shared/ui/Status/Status'
import styleItem from '../RecentProjects.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  name: string
  budget: string
  status: string
  created: string
}

export const Item = ({ name, budget, status, created }: ItemProps) => {
  return (
    <div className={styles.wrapper}>
      <span className={`${styleItem.nameColumn} ${styles.nameItem}`}>
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
