import { Dispatch, Fragment, SetStateAction, useEffect } from 'react'

import { Item } from './Item/Item'
import styles from './RecentNewRole.module.scss'
import {
  RolesAccessObjectPermission,
  SettingsRoleFormData,
} from '../../../../../app/constants/constants'
import { CustomDivider } from '../../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../../Main/RecentCard/Title/Title'

interface RecentNewRoleProps {
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

export const RecentNewRole = ({
  permission,
  formData,
  setFormData,
}: RecentNewRoleProps) => {
  const createFormData = () => {
    return {
      name: '',
      access: permission.map(item => ({
        permissionId: item.id,
        view: 0,
        edit: 0,
        create: 0,
        delete: 0,
        all: 0,
      })),
    }
  }

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

  useEffect(() => {
    const formData = createFormData()

    setFormData(formData)
  }, [permission, setFormData])

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
            <Fragment key={item.id}>
              <Item
                index={index}
                name={item.name}
                handleChange={handleChange}
              />
              {index !== permission.length - 1 && <CustomDivider />}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
