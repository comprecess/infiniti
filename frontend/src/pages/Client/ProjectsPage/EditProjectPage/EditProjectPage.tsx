/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './EditProjectPage.module.scss'
import { ProjectsInputData, ProjectsNewProjectForm } from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import { Fields } from '../../../../features/Admin/Projects/EditProject/Fields/Fields'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getProjectEditInfo } from '../../../../shared/utils/api/Client/Projects/get-project-edit-info'
import { getProjectsInputData } from '../../../../shared/utils/api/Client/Projects/get-project-input-data'
import { putEditProject } from '../../../../shared/utils/api/Client/Projects/put-edit-project'
import { useIdFromUrl } from '../../../../shared/utils/usefulMethods'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'

export const ClientEditProjectPage = () => {
  const [form, setForm] = useState<Partial<ProjectsNewProjectForm> | null>(null)
  const [inputData, setInputData] = useState<ProjectsInputData | null>(null)

  const id = useIdFromUrl('project')
  const navigate = useNavigate()
  const showToast = useCustomToast()

  const getInputData = async () => {
    const response = await getProjectsInputData()

    if (!response.status) return

    setInputData(response.data)
  }

  const getProjectInfo = async () => {
    if (!id) return

    const response = await getProjectEditInfo(id)

    if (!response.status) return

    const { id: _, users, currency, ...rest } = response.data.data

    const form: Record<string, any> = {
      ...rest,
    }

    if (currency?.id) form.currency = currency.id
    if (users.client) form.client = users.client.id
    if (users.manager) form.manager = users.manager.id
    if (users.admin) form.owner = users.admin.id

    if (Array.isArray(users.staff) && users.staff.length > 0) {
      form.members = users.staff.map((member: { id: any }) => member.id)
    }
    if (Array.isArray(users.suppliers) && users.suppliers.length > 0) {
      form.suppliers = users.suppliers.map((supplier: { id: any }) => supplier.id)
    }

    setForm(form)
  }

  const saveProjectUpdate = async () => {
    if (!id || !form) return

    const { status, message } = await putEditProject(id, form)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully modified the Project',
        status: 'success',
      })
      navigate(`/${Routes.clientPages}/${Routes.projects}`)
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  useEffect(() => {
    document.title = 'infiniti | Edit Project'
  }, [])

  useEffect(() => {
    getInputData()
    getProjectInfo()
  }, [id])

  return (
    <div className={styles.wrapper}>
      {form && inputData ? (
        <section className={styles.section}>
          <RecentCard
            title='Edit Project'
            Component={ButtonBlue}
            style={styles.recentFullScreen}
            componentProps={{
              titleNone: true,
              title: 'Save',
              icon: '/icons/fileWhite.svg',
              iconProps: styles.buttonSaveIcon,
              style: styles.buttonSave,
              onClick: saveProjectUpdate,
            }}
          >
            <Fields inputData={inputData} form={form} setForm={setForm} />
          </RecentCard>
        </section>
      ) : (
        <div className={styles.loading}>
          <LoadingSpinner size='xl' />
        </div>
      )}
    </div>
  )
}
