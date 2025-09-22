import { Fragment } from 'react'

import { Item } from './Item/Item'
import styles from './RecentLog.module.scss'
import { ViewLogTypeData } from '../../../../../../../app/constants/constants'
import { CustomDivider } from '../../../../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../../../../Main/RecentCard/Title/Title'

interface RecentLogProps {
  list: ViewLogTypeData[]
}

export const RecentLog = ({ list }: RecentLogProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title title='Time' style={styles.timeColumn} />
        <Title title='IP' style={styles.ipColumn} />
        <Title title='Description' style={styles.descriptionColumn} />
      </div>
      <div className={styles.items}>
        {list.map((item, index) => {
          return (
            <Fragment key={item.id}>
              <Item
                time={item.time}
                ip={item.ip}
                description={item.description}
              />
              {index !== list.length - 1 && <CustomDivider />}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
