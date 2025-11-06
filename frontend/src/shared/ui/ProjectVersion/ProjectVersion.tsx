import styles from './ProjectVersion.module.scss'

export const ProjectVersion = () => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.text}>{`version: ${__APP_VERSION__}`}</span>
    </div>
  )
}
