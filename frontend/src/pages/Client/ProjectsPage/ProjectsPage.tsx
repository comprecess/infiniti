import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import styles from './ProjectsPage.module.scss'
import { ProjectsData, UserInfo } from '../../../app/constants/constants'
import { ProjectCard } from '../../../features/Client/ProjectsPage/ProjectCard/ProjectCard'
import { TitlePage } from '../../../features/Main/TitlePage/TitlePage'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getMyProjectsList } from '../../../shared/utils/api/Client/Projects/get-my-projects-list'
import { getMyWorkProjectsList } from '../../../shared/utils/api/Client/Projects/get-my-work-projects-list'

export const ClientProjectsPage = () => {
  const [myProjects, setMyProjects] = useState<ProjectsData[] | null>(null)
  const [myWorkProjects, setMyWorkProjects] = useState<ProjectsData[] | null>(null)

  const { user } = useOutletContext<{ user: UserInfo }>()

  const getMyProjects = async () => {
    const response = await getMyProjectsList()

    if (!response.status) return

    setMyProjects(response.data)
  }

  const getMyWorkProjects = async () => {
    const response = await getMyWorkProjectsList()

    if (!response.status) return

    setMyWorkProjects(response.data)
  }

  useEffect(() => {
    if (user && user.status.isCustomer) {
      getMyProjects()
    }

    if (user && user.status.isSupplier) {
      getMyWorkProjects()
    }
  }, [user])

  useEffect(() => {
    document.title = 'infiniti | Projects'
  }, [])

  return (
    <div className={styles.wrapper}>
      {user && user.status.isCustomer ? (
        myProjects ? (
          <>
            <div className={styles.title}>
              <div className={styles.titleContainer}>
                <TitlePage title='My Projects' />
              </div>
            </div>
            <section className={styles.sectionFirst}>
              {myProjects.length > 0 ? (
                <div className={styles.projectsList}>
                  {myProjects.map(project => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <div className={styles.nothingFound}>
                  <span className={styles.nothingFoundText}>Nothing Found</span>
                </div>
              )}
            </section>
          </>
        ) : (
          <div className={styles.loading}>
            <LoadingSpinner size='xl' />
          </div>
        )
      ) : null}
      {user && user.status.isSupplier ? (
        myWorkProjects ? (
          <>
            <div className={styles.title}>
              <div className={styles.titleContainer}>
                <TitlePage title='My Work Projects' />
              </div>
            </div>
            <section className={styles.sectionFirst}>
              {myWorkProjects.length > 0 ? (
                <div className={styles.projectsList}>
                  {myWorkProjects.map(project => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <div className={styles.nothingFound}>
                  <span className={styles.nothingFoundText}>Nothing Found</span>
                </div>
              )}
            </section>
          </>
        ) : (
          <div className={styles.loading}>
            <LoadingSpinner size='xl' />
          </div>
        )
      ) : null}
    </div>
  )
}
