import { Fragment } from 'react'

import {
  GroupsListProps,
  RolesAccess,
} from '../../../../../app/constants/constants'
import { CustomDivider } from '../../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentGroups.module.scss'

interface RecentTableProps {
  access: RolesAccess
  groupsList: GroupsListProps[]
  deleteGroup: (id: number) => void
  editGroup: (id: number, name: string) => void
}

export const RecentGroups = ({
  access,
  groupsList,
  deleteGroup,
  editGroup,
}: RecentTableProps) => {
  return (
    <div className={styles.wrapper}>
      {groupsList.length > 0 ? (
        <>
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
        </>
      ) : (
        <div className={styles.nothingFound}>
          <span className={styles.nothingFoundText}>Nothing Found</span>
        </div>
      )}
    </div>
  )
}
