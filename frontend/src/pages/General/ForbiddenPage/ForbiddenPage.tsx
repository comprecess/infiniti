import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Routes } from '../../../app/router/routes'
import { ButtonBrand } from '../../../shared/ui/ButtonBrand/ButtonBrand'
import styles from './ForbiddenPage.module.scss'

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
        <div className={styles.card}>
          <img
            src='/icons/sadSmile.svg'
            alt='Sad Smiley'
            className={styles.sadSmile}
          />
        </div>
        <h1 className={styles.title}>3</h1>
      </div>
      <div className={styles.footer}>
        <span className={styles.description}>
          The server understood the request but is refusing to fulfill it
          due to access restrictions
        </span>
      </div>
      <div className={styles.buttonBack}>
        <ButtonBrand title='Go back' onClick={navigateToRoot} />
      </div>
    </div>
  )
}
