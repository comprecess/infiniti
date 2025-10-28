import { Fragment } from 'react'

import { Item } from './Item/Item'
import styles from './RecentGroups.module.scss'
import { GroupsListProps, RolesAccess } from '../../../../../app/constants/constants'
import { CustomDivider } from '../../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../../Main/RecentCard/Title/Title'

interface RecentTableProps {
  access: RolesAccess
  groupsList: GroupsListProps[]
  deleteGroup: (id: number) => void
  editGroup: (id: number, name: string) => void
}

export const RecentGroups = ({ access, groupsList, deleteGroup, editGroup }: RecentTableProps) => {
  if (groupsList.length === 0) {
    return (
      <div className={styles.nothingFound}>
        <span className={styles.nothingFoundText}>Nothing Found</span>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title title='Group' style={styles.groupNameColumn} />
        <Title title='Manage' style={styles.manageColumn} />
      </div>
      <div className={styles.items}>
        {groupsList.map((item, index) => {
          return (
            <Fragment key={item.id}>
              <Item
                id={item.id}
                access={access}
                groupName={item.name}
                deleteGroup={deleteGroup}
                editGroup={editGroup}
              />
              {index !== groupsList.length - 1 && <CustomDivider />}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
