import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { ProjectsData } from '../../../app/constants/constants'
import { Routes } from '../../../app/router/routes'
import { TitlePage } from '../../../features/Main/TitlePage/TitlePage'
import { ButtonBlue } from '../../../shared/ui/ButtonBlue/ButtonBlue'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getProjectsList } from '../../../shared/utils/api/Admin/Projects/GetProjectsList'
import { ProjectCard } from '../../../widgets/ProjectCard/ProjectCard'
import styles from './ProjectsPage.module.scss'

export const AdminProjectsPage = () => {
  const navigate = useNavigate()

  const navigateToCreateProject = () => {
    navigate(
      `/${Routes.adminPages}/${Routes.projects}/${Routes.new}/${Routes.project}`,
    )
  }

  const { data: projects } = useQuery({
    queryKey: ['projectsList'],
    queryFn: async () => {
      const response: { data: ProjectsData[] } = await getProjectsList()

      return response
    },
    placeholderData: previousData => previousData,
  })

  useEffect(() => {
    document.title = 'infiniti | Projects'
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <div className={styles.titleContainer}>
          <TitlePage title='Projects' />
          <ButtonBlue
            titleNone
            title='Create New Project'
            icon='/icons/plus.svg'
            style={styles.buttonCreateProject}
            onClick={navigateToCreateProject}
          />
        </div>
      </div>
      {projects ? (
        <section className={styles.sectionFirst}>
          <div className={styles.projectsList}>
            {projects.data.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      ) : (
        <div className={styles.loading}>
          <LoadingSpinner size='xl' />
        </div>
      )}
    </div>
  )
}
