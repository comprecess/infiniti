import { Fragment } from 'react'

import {
  GroupContactsListProps,
  RolesAccess,
} from '../../../../../app/constants/constants'
import { CustomDivider } from '../../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentContactsList.module.scss'

interface RecentContactsListProps {
  roles?: { [key: string]: RolesAccess }
  list: GroupContactsListProps[]
  deleteContact: (id: number) => void
}

export const RecentContactsList = ({
  roles,
  list,
  deleteContact,
}: RecentContactsListProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title title='#' style={styles.hashtagColumn} />
        <Title title='Name' style={styles.nameColumn} />
        <Title title='Company Name' style={styles.companyNameColumn} />
        <Title title='Email' style={styles.emailColumn} />
        <Title title='Phone' style={styles.phoneColumn} />
        <Title title='Manage' style={styles.manageColumn} />
      </div>
      <div className={styles.items}>
        {list.map((item, index) => {
          return (
            <Fragment key={item.id}>
              <Item
                id={item.id}
                roles={roles}
                name={item.account}
                company={item.company}
                email={item.email}
                phone={item.phone}
                deleteContact={() => deleteContact(item.id)}
              />
              {index !== list.length - 1 && <CustomDivider />}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
