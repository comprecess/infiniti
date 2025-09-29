import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './NewRolePage.module.scss'
import {
  RolesAccessObjectPermission,
  SettingsRoleFormData,
} from '../../../../../app/constants/constants'
import { Routes } from '../../../../../app/router/routes'
import { Header } from '../../../../../features/Admin/Settings/NewRolePage/Header/Header'
import { RecentNewRole } from '../../../../../features/Admin/Settings/NewRolePage/RecentNewRole/RecentNewRole'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getInputDataRoles } from '../../../../../shared/utils/api/Admin/Settings/NewRole/get-input-data-roles'
import { postCreateNewRole } from '../../../../../shared/utils/api/Admin/Settings/NewRole/post-create-new-role'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'

export const AdminNewRolePage = () => {
  const [formData, setFormData] = useState<{
    name: string
    access: SettingsRoleFormData[]
  } | null>(null)

  const [permission, setPermission] = useState<RolesAccessObjectPermission[] | null>(null)

  const showToast = useCustomToast()
  const navigate = useNavigate()

  const getInputData = async () => {
    const response = await getInputDataRoles()

    if (!response.status) return

    setPermission(response.data.permission)
  }

  const createRole = async () => {
    if (!formData) return

    const { status, message } = await postCreateNewRole(formData)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully created a role',
        status: 'success',
      })
      navigate(`/${Routes.adminPages}/${Routes.settings}/${Routes.roles}`)
    } else {
      showToast({
        title: 'Error',
        description: message,
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
            <RecentNewRole permission={permission} formData={formData} setFormData={setFormData} />
          </RecentCard>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
    </div>
  )
}
