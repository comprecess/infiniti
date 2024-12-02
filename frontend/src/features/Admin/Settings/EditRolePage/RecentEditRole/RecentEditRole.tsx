import React, { Dispatch, FC, SetStateAction } from 'react'

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
  setFormData: Dispatch<
  SetStateAction<{
    name: string
    access: SettingsRoleFormData[]
  } | null>
  >
}

export const RecentEditRole: FC<RecentEditRoleProps> = ({
  permission,
  formData,
  setFormData,
}) => {
  const handleChange = (
    index: number,
    field: keyof SettingsRoleFormData,
    value: number,
  ) => {
    if (!formData) return

    const updatedAccess = [...formData.access]
    updatedAccess[index][field] = value

    setFormData({ ...formData, access: updatedAccess })
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title title='Permission' style={styles.permissionColumn} />
        <Title title='View' style={styles.viewColumn} />
        <Title title='Edit' style={styles.editColumn} />
        <Title title='Create' style={styles.createColumn} />
        <Title title='Delete' style={styles.deleteColumn} />
        <Title title='All Data' style={styles.allInformationColumn} />
      </div>
      <div className={styles.items}>
        {permission.map((item, index) => {
          return (
            <React.Fragment key={item.id}>
              <Item
                index={index}
                name={item.name}
                viewValue={formData?.access[index].view || 0}
                editValue={formData?.access[index].edit || 0}
                createValue={formData?.access[index].create || 0}
                deleteValue={formData?.access[index].delete || 0}
                allValue={formData?.access[index].all || 0}
                handleChange={handleChange}
              />
              {index !== permission.length - 1 && <CustomDivider />}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
