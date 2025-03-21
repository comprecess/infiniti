import { Fragment } from 'react'

import { ViewPasswordManagerTypeData } from '../../../../../../../app/constants/constants'
import { CustomDivider } from '../../../../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentPasswordManager.module.scss'

interface RecentPasswordManagerProps {
  list: ViewPasswordManagerTypeData[]
}

export const RecentPasswordManager = ({
  list,
}: RecentPasswordManagerProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title title='Name' style={styles.nameColumn} />
        <Title title='URL' style={styles.urlColumn} />
        <Title title='Username' style={styles.usernameColumn} />
        <Title title='Manage' style={styles.manageColumn} />
      </div>
      <div className={styles.items}>
        {list.map((item, index) => {
          return (
            <Fragment key={item.id}>
              <Item
                name={item.name}
                url={item.url}
                username={item.username}
              />
              {index !== list.length - 1 && <CustomDivider />}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
