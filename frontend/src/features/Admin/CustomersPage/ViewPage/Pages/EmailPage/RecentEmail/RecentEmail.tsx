import { Fragment } from 'react'

import { Item } from './Item/Item'
import styles from './RecentEmail.module.scss'
import { ViewEmailProps } from '../../../../../../../app/constants/constants'
import { CustomDivider } from '../../../../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../../../../Main/RecentCard/Title/Title'

interface RecentEmailProps {
  list: ViewEmailProps[]
}

export const RecentEmail = ({ list }: RecentEmailProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title title='Subject' style={styles.subjectColumn} />
        <Title title='Date' style={styles.dateColumn} />
      </div>
      <div className={styles.items}>
        {list.map((item, index) => {
          return (
            <Fragment key={item.id}>
              <Item subject={item.subject} date={item.date} />
              {index !== list.length - 1 && <CustomDivider />}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
