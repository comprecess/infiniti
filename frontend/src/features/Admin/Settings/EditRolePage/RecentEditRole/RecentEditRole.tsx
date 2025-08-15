import { Fragment } from 'react'

import {
  RolesAccessObjectPermission,
  SettingsRoleFormData,
} from '../../../../../app/constants/constants'
import { CustomDivider } from '../../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentEditRole.module.scss'

interface RecentEditRoleProps {
  permission: RolesAccessObjectPermission[]
  formData: {
    name: string
    access: SettingsRoleFormData[]
  } | null
  handleChangeAllPermissions: () => void
  handleChangeFullItemPermission: (index: number) => void
  handleChangeItemPermission: (
    index: number,
    field: keyof SettingsRoleFormData,
    value: number,
  ) => void
}

export const RecentEditRole = ({
  permission,
  formData,
  handleChangeAllPermissions,
  handleChangeItemPermission,
  handleChangeFullItemPermission,
}: RecentEditRoleProps) => {
  return (
    <div className={styles.wrapper}>
      {permission.length > 0 && formData ? (
        <>
          <div className={styles.columns}>
            <Title
              title='Permission'
              style={styles.permissionColumn}
              onTitleClick={handleChangeAllPermissions}
            />
            <Title title='View' style={styles.viewColumn} />
            <Title title='Edit' style={styles.editColumn} />
            <Title title='Create' style={styles.createColumn} />
            <Title title='Delete' style={styles.deleteColumn} />
            <Title title='All Data' style={styles.allInformationColumn} />
          </div>
          <div className={styles.items}>
            {permission.map((item, index) => {
              const accessItem = formData.access[index]

              return (
                <Fragment key={item.id}>
                  <Item
                    index={index}
                    name={item.name}
                    handleChangeItemPermission={handleChangeItemPermission}
                    accessItem={{ ...accessItem }}
                    handleChangeFullItemPermission={
                      handleChangeFullItemPermission
                    }
                  />
                  {index !== permission.length - 1 && <CustomDivider />}
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
