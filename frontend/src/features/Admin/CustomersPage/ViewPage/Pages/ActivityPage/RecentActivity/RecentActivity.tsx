import { Item } from './Item/Item'
import styles from './RecentActivity.module.scss'
import {
  RolesAccess,
  ViewActivityTypeData,
} from '../../../../../../../app/constants/constants'

interface RecentActivityProps {
  list: ViewActivityTypeData[]
  access: RolesAccess
  deleteSelectedActivity: (idType: number) => void
  editActivity: (idType: number, icon: string, message: string) => void
}

export const RecentActivity = ({
  list,
  access,
  deleteSelectedActivity,
  editActivity,
}: RecentActivityProps) => {
  return (
    <div className={styles.wrapper}>
      {list.map(item => {
        return (
          <Item
            key={item.id}
            id={item.id}
            account={item.admin.account}
            date={item.date}
            dateTime={item.dateTime}
            noDelete={item.noDelete}
            icon={item.icon}
            message={item.message}
            time={item.time}
            access={access}
            deleteSelectedActivity={deleteSelectedActivity}
            editActivity={editActivity}
          />
        )
      })}
    </div>
  )
}
