import React, { FC } from 'react'

import {
  RolesAccess,
  SettingsRolesData,
} from '../../../../../app/constants/constants'
import { CustomDivider } from '../../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentRoles.module.scss'

interface RecentRolesProps {
  roles: SettingsRolesData[]
  access: RolesAccess
  editRole: (idRole: number) => void
  deleteSelectedRole: (idRole: number) => void
}

export const RecentRoles: FC<RecentRolesProps> = ({
  roles,
  access,
  editRole,
  deleteSelectedRole,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title title='Name' style={styles.nameColumn} />
        <Title title='Manage' style={styles.manageColumn} />
      </div>
      <div className={styles.items}>
        {roles.map((item, index) => {
          return (
            <React.Fragment key={item.id}>
              <Item
                id={item.id}
                name={item.name}
                access={access}
                editRole={editRole}
                deleteSelectedRole={deleteSelectedRole}
              />
              {index !== roles.length - 1 && <CustomDivider />}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
