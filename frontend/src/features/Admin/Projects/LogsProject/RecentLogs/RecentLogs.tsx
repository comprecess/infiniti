import { Fragment } from 'react/jsx-runtime'

import { Item } from './Item/Item'
import styles from './RecentLogs.module.scss'
import { ProjectsViewLogsData } from '../../../../../app/constants/constants'
import { CustomDivider } from '../../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../../Main/RecentCard/Title/Title'

interface RecentLogsProps {
  data: ProjectsViewLogsData[]
}

export const RecentLogs = ({ data }: RecentLogsProps) => {
  if (data.length === 0) {
    return (
      <div className={styles.nothingFound}>
        <span className={styles.nothingFoundText}>Nothing Found</span>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title title='Avatar' style={styles.avatarColumn} />
        <Title title='Account' style={styles.accountColumn} />
        <Title title='Date / Time' style={styles.timeColumn} />
        <Title title='Description' style={styles.descriptionColumn} />
      </div>
      <div className={styles.items}>
        {data.map((item, index) => {
          return (
            <Fragment key={item.id}>
              <Item data={item} />
              {index !== data.length - 1 && <CustomDivider />}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
