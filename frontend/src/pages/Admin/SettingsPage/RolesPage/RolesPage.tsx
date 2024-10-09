import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  RolesAccess,
  SettingsRolesData,
} from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import { RecentRoles } from '../../../../features/Admin/Settings/RolesPage/RecentRoles/RecentRoles'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { deleteRole } from '../../../../shared/utils/api/Admin/Settings/Roles/DeleteRole'
import { getListRoles } from '../../../../shared/utils/api/Admin/Settings/Roles/GetListRoles'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './RolesPage.module.scss'

export const AdminRolesPage: FC = () => {
  const [roles, setRoles] = useState<SettingsRolesData[] | null>(null)

  const [access, setAccess] = useState<RolesAccess | null>(null)

  const navigate = useNavigate()
  const showToast = useCustomToast()

  const getRoles = async () => {
    const getResponse: {
      access: RolesAccess
      data: SettingsRolesData[]
      status: boolean
    } = await getListRoles()

    setAccess({
      all: getResponse.access.all,
      create: getResponse.access.create,
      delete: getResponse.access.delete,
      edit: getResponse.access.edit,
      view: getResponse.access.view,
    })
    setRoles(getResponse.data)
  }

  const deleteSelectedRole = async (idRole: number) => {
    const deleteResponse = await deleteRole(idRole)

    if (deleteResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully deleted the role',
        status: 'success',
      })
      getRoles()
    } else {
      showToast({
        title: 'Error',
        description: deleteResponse.message,
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
