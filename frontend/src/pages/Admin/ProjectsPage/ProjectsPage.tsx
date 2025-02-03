import { FC, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Routes } from '../../../app/router/routes'
import { TitlePage } from '../../../features/Main/TitlePage/TitlePage'
import { ButtonBlue } from '../../../shared/ui/ButtonBlue/ButtonBlue'
import { ProjectCard } from '../../../widgets/ProjectCard/ProjectCard'
import styles from './ProjectsPage.module.scss'

export const AdminProjectsPage: FC = () => {
  const navigate = useNavigate()

  const navigateToCreateProject = () => {
    navigate(
      `/${Routes.adminPages}/${Routes.projects}/${Routes.new}/${Routes.project}`,
    )
  }

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
      <section className={styles.sectionFirst}>
        <div className={styles.projectsList}>
          <ProjectCard />
        </div>
      </section>
    </div>
  )
}
