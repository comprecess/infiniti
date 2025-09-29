import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './RolesPage.module.scss'
import { RolesAccess, SettingsRolesData } from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import { RecentRoles } from '../../../../features/Admin/Settings/RolesPage/RecentRoles/RecentRoles'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { deleteRole } from '../../../../shared/utils/api/Admin/Settings/Roles/delete-role'
import { getListRoles } from '../../../../shared/utils/api/Admin/Settings/Roles/get-list-roles'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'

export const AdminRolesPage = () => {
  const [roles, setRoles] = useState<SettingsRolesData[] | null>(null)

  const [access, setAccess] = useState<RolesAccess | null>(null)

  const navigate = useNavigate()
  const showToast = useCustomToast()

  const getRoles = async () => {
    const response = await getListRoles()

    if (!response.status) return

    setAccess({
      all: response.data.access.all,
      create: response.data.access.create,
      delete: response.data.access.delete,
      edit: response.data.access.edit,
      view: response.data.access.view,
    })
    setRoles(response.data.data)
  }

  const deleteSelectedRole = async (idRole: number) => {
    const { status, message } = await deleteRole(idRole)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully deleted the role',
        status: 'success',
      })
      getRoles()
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  const navigateToCreateNewRole = () => {
    navigate(
      `/${Routes.adminPages}/${Routes.settings}/${Routes.roles}/${Routes.new}/${Routes.role}`,
    )
  }

  const navigateToEditRole = (idRole: number) => {
    navigate(
      `/${Routes.adminPages}/${Routes.settings}/${Routes.roles}/${Routes.edit}/${Routes.role}/${idRole}`,
    )
  }

  useEffect(() => {
    document.title = 'infiniti | Roles'

    getRoles()
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {roles && access ? (
          <RecentCard
            title='Roles'
            style={styles.recentFullScreen}
            Component={access.create ? ButtonBlue : undefined}
            componentProps={
              access.create
                ? {
                  titleNone: true,
                  title: 'New Role',
                  icon: '/icons/plus.svg',
                  onClick: navigateToCreateNewRole,
                  style: styles.buttonAddNewRole,
                }
                : undefined
            }
          >
            <RecentRoles
              roles={roles}
              access={access}
              editRole={navigateToEditRole}
              deleteSelectedRole={deleteSelectedRole}
            />
          </RecentCard>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
    </div>
  )
}
