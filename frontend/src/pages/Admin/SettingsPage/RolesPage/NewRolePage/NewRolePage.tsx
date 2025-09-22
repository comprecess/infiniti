import { useEffect, useState } from 'react'

import styles from './NewRolePage.module.scss'
import {
  RolesAccess,
  RolesAccessObjectPermission,
  SettingsRoleFormData,
} from '../../../../../app/constants/constants'
import { Header } from '../../../../../features/Admin/Settings/NewRolePage/Header/Header'
import { RecentNewRole } from '../../../../../features/Admin/Settings/NewRolePage/RecentNewRole/RecentNewRole'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { createNewRole } from '../../../../../shared/utils/api/Admin/Settings/NewRole/CreateNewRole'
import { getInputDataRoles } from '../../../../../shared/utils/api/Admin/Settings/NewRole/GetInputDataRoles'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'

export const AdminNewRolePage = () => {
  const [formData, setFormData] = useState<{
    name: string
    access: SettingsRoleFormData[]
  } | null>(null)

  const [permission, setPermission] = useState<
  RolesAccessObjectPermission[] | null
  >(null)

  const showToast = useCustomToast()

  const getInputData = async () => {
    const getResponse: {
      access: RolesAccess
      permission: RolesAccessObjectPermission[]
      status: boolean
    } = await getInputDataRoles()

    setPermission(getResponse.permission)
  }

  const createRole = async () => {
    if (!formData) return

    const createResponse = await createNewRole(formData)

    if (createResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully created a role',
        status: 'success',
      })
    } else {
      showToast({
        title: 'Error',
        description: createResponse.message,
        status: 'error',
      })
    }
  }

  useEffect(() => {
    document.title = 'infiniti | New Role'

    getInputData()
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {permission ? (
          <RecentCard
            title='New Role'
            style={styles.recentFullScreen}
            HeaderComponent={Header}
            headerProps={{ formData, setFormData }}
            Component={ButtonBlue}
            componentProps={{
              titleNone: true,
              title: 'Save',
              icon: '/icons/fileWhite.svg',
              onClick: createRole,
              style: styles.buttonSave,
            }}
          >
            <RecentNewRole
              permission={permission}
              formData={formData}
              setFormData={setFormData}
            />
          </RecentCard>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
    </div>
  )
}
