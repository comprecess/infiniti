import React, { FC } from 'react'

import { GroupsListProps } from '../../../../../app/constants/constants'
import { CustomDivider } from '../../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentGroups.module.scss'

interface RecentTableProps {
  groupsList: GroupsListProps[]
  deleteGroup: (id: number) => void
}

export const RecentGroups: FC<RecentTableProps> = ({
  groupsList,
  deleteGroup,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title title='Group' style={styles.groupNameColumn} />
        <Title title='Manage' style={styles.manageColumn} />
      </div>
      <div className={styles.items}>
        {groupsList.map((item, index) => {
          return (
            <React.Fragment key={item.id}>
              <Item
                id={item.id}
                groupName={item.name}
                deleteGroup={deleteGroup}
              />
              {index !== groupsList.length - 1 && <CustomDivider />}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
