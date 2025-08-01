import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Routes } from '../../../app/router/routes'
import { ButtonBrand } from '../../../shared/ui/ButtonBrand/ButtonBrand'
import styles from './ServerErrorPage.module.scss'

export const ServerErrorPage = () => {
  const navigate = useNavigate()

  const navigateToRoot = () => {
    navigate(Routes.root)
  }

  useEffect(() => {
    document.title = 'Infiniti | 500 Server Error'
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}>5</h1>
        <h1 className={styles.title}>0</h1>
        <h1 className={styles.title}>0</h1>
      </div>
      <div className={styles.footer}>
        <span className={styles.description}>Server Error</span>
      </div>
      <div className={styles.buttonBack}>
        <ButtonBrand title='Go back' onClick={navigateToRoot} />
      </div>
    </div>
  )
}
