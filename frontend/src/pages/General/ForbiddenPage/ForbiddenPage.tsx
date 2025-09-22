import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './ForbiddenPage.module.scss'
import { Routes } from '../../../app/router/routes'
import { ButtonBrand } from '../../../shared/ui/ButtonBrand/ButtonBrand'

export const ForbiddenPage = () => {
  const navigate = useNavigate()

  const navigateToRoot = () => {
    navigate(Routes.root)
  }

  useEffect(() => {
    document.title = 'Infiniti | 403 Forbidden'
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}>4</h1>
        <h1 className={styles.title}>0</h1>
        <h1 className={styles.title}>3</h1>
      </div>
      <div className={styles.footer}>
        <span className={styles.description}>
          You don&apos;t have access
        </span>
      </div>
      <div className={styles.buttonBack}>
        <ButtonBrand title='Go back' onClick={navigateToRoot} />
      </div>
    </div>
  )
}
