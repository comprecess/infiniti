import { sanitizeMessage } from '../../../../shared/utils/TextEditor/sanitizeMessage'
import styles from './CardPlan.module.scss'

interface CardPlanProps {
  title: string
  description: string
  picture: string
}

export const CardPlan = ({
  title,
  description,
  picture,
}: CardPlanProps) => {
  const safeHTML = sanitizeMessage(description)

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
        <div className={styles.miniButtons}>Buttons</div>
      </div>
    </div>
  )
}
