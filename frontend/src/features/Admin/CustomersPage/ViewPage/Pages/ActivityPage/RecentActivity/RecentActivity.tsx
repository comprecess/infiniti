import { FC } from 'react'

import { ViewActivityTypeData } from '../../../../../../../app/constants/constants'
import { Item } from './Item/Item'
import styles from './RecentActivity.module.scss'

interface RecentActivityProps {
  list: ViewActivityTypeData[]
}

export const RecentActivity: FC<RecentActivityProps> = ({ list }) => {
  return (
    <div className={styles.wrapper}>
      {list.map(item => {
        return (
          <Item
            key={item.id}
            account={item.admin.account}
            date={item.date}
            icon={item.icon}
            message={item.message}
            time={item.time}
          />
        )
      })}
    </div>
  )
}
