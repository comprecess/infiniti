import { CustomMiniButton } from '../../shared/ui/CustomMiniButton/CustomMiniButton'
import styles from './ProjectCard.module.scss'

export const ProjectCard = () => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>-Title-</span>
      <div className={styles.profile}>
        <img
          src='/profileWithoutAvatar.svg'
          alt='Avatar'
          className={styles.avatar}
        />
        <span className={styles.name}>-name-</span>
      </div>
      <div>-Status-</div>
      <div className={styles.container}>
        <div className={styles.budget}>Budget: $0</div>
        <div className={styles.description}>-Description-</div>
      </div>
      <div className={styles.date}>-Date-</div>
      <div className={styles.profiles}>-Profiles-</div>
      <div className={styles.tasksCompleted}>-Tasks-</div>
      <div className={styles.buttons}>
        <CustomMiniButton
          style='mint'
          icon='/icons/view.svg'
          alt='View'
          tooltipTitle='View'
        />
        <CustomMiniButton
          style='amber'
          icon='/icons/edit.svg'
          alt='Edit'
          tooltipTitle='Edit'
          onClick={() => {}}
        />
        <CustomMiniButton
          style='cherry'
          icon='/icons/trash.svg'
          alt='Delete'
          tooltipTitle='Delete'
          onClick={() => {}}
        />
      </div>
    </div>
  )
}
