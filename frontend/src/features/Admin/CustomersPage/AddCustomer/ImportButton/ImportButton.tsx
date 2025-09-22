import styles from './ImportButton.module.scss'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'

export const ImportButton = () => {
  return (
    <div className={styles.wrapper}>
      <ButtonBlue
        titleNone
        title='Import Contacts'
        style={styles.button}
        icon='/icons/import.svg'
        iconProps={styles.icon}
      />
    </div>
  )
}
