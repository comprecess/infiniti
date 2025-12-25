import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './CreateNewProject.module.scss'
import { ProjectsInputData, ProjectsNewProjectForm } from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import { Fields } from '../../../../features/Admin/Projects/CreateNewProject/Fields/Fields'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getProjectsInputData } from '../../../../shared/utils/api/Admin/Projects/get-project-input-data'
import { postCreateNewProject } from '../../../../shared/utils/api/Admin/Projects/post-create-new-project'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'

export const AdminCreateNewProject = () => {
  const [form, setForm] = useState<Partial<ProjectsNewProjectForm>>({})
  const [inputData, setInputData] = useState<ProjectsInputData | null>(null)

  const navigate = useNavigate()
  const showToast = useCustomToast()

  const getInputData = async () => {
    const response = await getProjectsInputData()

    if (!response.status) return

    setInputData(response.data)
  }

  const handleCreateNewProject = async () => {
    const { status, message } = await postCreateNewProject(form)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully created a new Project',
        status: 'success',
      })
      navigate(`/${Routes.adminPages}/${Routes.projects}`)
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  useEffect(() => {
    document.title = 'infiniti | Create Project'

    getInputData()
  }, [])

  return (
    <div className={styles.wrapper}>
      {inputData ? (
        <section className={styles.section}>
          <RecentCard
            title='New Project'
            Component={ButtonBlue}
            style={styles.recentFullScreen}
            componentProps={{
              titleNone: true,
              title: 'Save',
              icon: '/icons/fileWhite.svg',
              onClick: handleCreateNewProject,
            }}
          >
            <Fields inputData={inputData} setForm={setForm} />
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
