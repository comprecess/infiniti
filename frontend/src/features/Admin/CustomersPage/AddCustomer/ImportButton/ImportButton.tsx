import styles from './ImportButton.module.scss'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'

export const ImportButton = () => {
  return (
    <ButtonBlue
      titleNone
      title='Import Contacts'
      icon='/icons/import.svg'
      iconProps={styles.icon}
    />
  )
}
