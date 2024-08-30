import { FC } from 'react'

import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import styles from './ImportButton.module.scss'

export const ImportButton: FC = () => {
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
