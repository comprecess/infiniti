import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './ProjectsPage.module.scss'
import {
  ProjectsData,
  RolesAccess,
} from '../../../app/constants/constants'
import { Routes } from '../../../app/router/routes'
import { TitlePage } from '../../../features/Main/TitlePage/TitlePage'
import { ButtonBlue } from '../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { deleteProject } from '../../../shared/utils/api/Admin/Projects/delete-project'
import { getProjectsList } from '../../../shared/utils/api/Admin/Projects/get-projects-list'
import { ProjectCard } from '../../../widgets/ProjectCard/ProjectCard'

export const AdminProjectsPage = () => {
  const navigate = useNavigate()
  const showToast = useCustomToast()
  const queryClient = useQueryClient()

  const navigateToCreateProject = () => {
    navigate(
      `/${Routes.adminPages}/${Routes.projects}/${Routes.new}/${Routes.project}`,
    )
  }

  const { data: projects } = useQuery({
    queryKey: ['projectsList'],
    queryFn: async () => {
      const response = await getProjectsList()

      if (!response.status) return

      return response.data as { access: RolesAccess; data: ProjectsData[] }
    },
    placeholderData: previousData => previousData,
  })

  const handleDeleteProject = async (id: number) => {
    const { status, message } = await deleteProject(id)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully deleted the Project',
        status: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['projectsList'] })
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  useEffect(() => {
    document.title = 'infiniti | Projects'
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <div className={styles.titleContainer}>
          <TitlePage title='Projects' />
          {projects?.access.create === 1 && (
            <ButtonBlue
              titleNone
              title='Create New Project'
              icon='/icons/plus.svg'
              style={styles.buttonCreateProject}
              onClick={navigateToCreateProject}
            />
          )}
        </div>
      </div>
      {projects ? (
        <section className={styles.sectionFirst}>
          {projects.data.length > 0 ? (
            <div className={styles.projectsList}>
              {projects.data.map(project => (
                <ProjectCard
                  key={project.id}
                  access={projects.access}
                  project={project}
                  deleteProject={handleDeleteProject}
                />
              ))}
            </div>
          ) : (
            <div className={styles.nothingFound}>
              <span className={styles.nothingFoundText}>
                Nothing Found
              </span>
            </div>
          )}
        </section>
      ) : (
        <div className={styles.loading}>
          <LoadingSpinner size='xl' />
        </div>
      )}
    </div>
  )
}
