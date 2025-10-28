import styles from './ProjectVersion.module.scss'

export const ProjectVersion = () => {
  return <span className={styles.text}>{`version: ${__APP_VERSION__}`}</span>
}
