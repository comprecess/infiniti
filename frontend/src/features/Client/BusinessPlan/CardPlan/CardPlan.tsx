import { useNavigate } from 'react-router-dom'

import { Routes } from '../../../../app/router/routes'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { sanitizeMessage } from '../../../../shared/utils/TextEditor/sanitizeMessage'
import styles from './CardPlan.module.scss'

interface CardPlanProps {
  id: number
  title: string
  description: string
  picture: string
  token: string
}

export const CardPlan = ({
  id,
  title,
  description,
  picture,
  token,
}: CardPlanProps) => {
  const navigate = useNavigate()

  const safeHTML = sanitizeMessage(description)

  const handleNavigateToPreview = () => {
    const url = `/${Routes.public}/${Routes.view}/${Routes.businessPlan}/${token}`

    window.open(url, '_blank')
  }

  const handleNavigateToDetails = () => {
    navigate(
      `/${Routes.clientPages}/${Routes.businessPlans}/${Routes.businessPlan}/${Routes.view}/${id}`,
    )
  }

  return (
    <div className={styles.wrapper}>
      <img
        src={picture ?? '/businessPlan.jpeg'}
        alt='Logo'
        className={styles.logo}
      />
      <div className={styles.content}>
        <div className={styles.texts}>
          <span className={styles.title}>{title}</span>
          <span
            dangerouslySetInnerHTML={{ __html: safeHTML }}
            className='dangerouslySetInnerHTML'
          />
        </div>
        <div className={styles.buttons}>
          <ButtonBlue
            title='Preview'
            style={styles.button}
            onClick={handleNavigateToPreview}
          />
          <ButtonBlue
            title='Details'
            style={styles.button}
            onClick={handleNavigateToDetails}
          />
        </div>
      </div>
    </div>
  )
}
