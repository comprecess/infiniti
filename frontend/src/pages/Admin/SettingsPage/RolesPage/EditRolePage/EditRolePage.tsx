import { useEffect, useState } from 'react'

import styles from './EditRolePage.module.scss'
import {
  RolesAccessObjectPermission,
  SettingsRoleFormData,
} from '../../../../../app/constants/constants'
import { Header } from '../../../../../features/Admin/Settings/EditRolePage/Header/Header'
import { RecentEditRole } from '../../../../../features/Admin/Settings/EditRolePage/RecentEditRole/RecentEditRole'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getInfoRole } from '../../../../../shared/utils/api/Admin/Settings/EditRole/get-info-role'
import { postChangedRole } from '../../../../../shared/utils/api/Admin/Settings/EditRole/post-changed-role'
import { useIdFromUrl } from '../../../../../shared/utils/usefulMethods'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'

export const AdminEditRolePage = () => {
  const [formData, setFormData] = useState<{
    name: string
    access: SettingsRoleFormData[]
  } | null>(null)

  const [permission, setPermission] = useState<RolesAccessObjectPermission[] | null>(null)

  const id = useIdFromUrl('role')
  const showToast = useCustomToast()

  const getInfo = async () => {
    if (id === null) return

    const response = await getInfoRole(id)

    if (!response.status) return

    const accessData: SettingsRoleFormData[] = response.data.data.access.map(
      (accessObj: {
        permission: { id: any }
        view: any
        edit: any
        create: any
        delete: any
        all: any
      }) => ({
        permissionId: accessObj.permission.id,
        view: accessObj.view,
        edit: accessObj.edit,
        create: accessObj.create,
        delete: accessObj.delete,
        all: accessObj.all,
      }),
    )

    setFormData({
      name: response.data.data.name,
      access: accessData,
    })

    setPermission(
      response.data.data.access.map((permission: { permission: any }) => permission.permission),
    )
  }

  const handleChangeAllPermissions = () => {
    if (!formData) return

    const allItemsOn = formData.access.every(item =>
      [item.view, item.edit, item.create, item.delete, item.all].every(v => v === 1),
    )

    const newValue = allItemsOn ? 0 : 1

    const updatedAccess = formData.access.map(item => ({
      ...item,
      view: newValue,
      edit: newValue,
      create: newValue,
      delete: newValue,
      all: newValue,
    }))

    setFormData({ ...formData, access: updatedAccess })
  }

  const handleChangeFullItemPermission = (index: number) => {
    if (!formData) return

    const currentItem = formData.access[index]

    const allOn = [
      currentItem.view,
      currentItem.edit,
      currentItem.create,
      currentItem.delete,
      currentItem.all,
    ].every(v => v === 1)
    const newValue = allOn ? 0 : 1

    const updatedAccess = formData.access.map((item, i) =>
      i === index
        ? {
          ...item,
          view: newValue,
          edit: newValue,
          create: newValue,
          delete: newValue,
          all: newValue,
        }
        : item,
    )

    setFormData({ ...formData, access: updatedAccess })
  }

  const handleChangeItemPermission = (
    index: number,
    field: keyof SettingsRoleFormData,
    value: number,
  ) => {
    if (!formData) return

    const updatedAccess = formData.access.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    )

    setFormData({ ...formData, access: updatedAccess })
  }

  const postUpdateRole = async () => {
    if (id === null || formData == null) return

    const { status, message } = await postChangedRole(id, formData)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully changed role',
        status: 'success',
      })
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  useEffect(() => {
    if (id !== null) {
      getInfo()
    }
  }, [id])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {formData && permission ? (
          <RecentCard
            title='Edit Role'
            style={styles.recentFullScreen}
            HeaderComponent={Header}
            headerProps={{ formData, setFormData }}
            Component={ButtonBlue}
            componentProps={{
              titleNone: true,
              title: 'Save',
              icon: '/icons/fileWhite.svg',
              onClick: postUpdateRole,
            }}
          >
            <RecentEditRole
              permission={permission}
              formData={formData}
              handleChangeAllPermissions={handleChangeAllPermissions}
              handleChangeItemPermission={handleChangeItemPermission}
              handleChangeFullItemPermission={handleChangeFullItemPermission}
            />
          </RecentCard>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
    </div>
  )
}
