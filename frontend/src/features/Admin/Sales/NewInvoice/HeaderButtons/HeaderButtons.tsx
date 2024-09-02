import { FC } from 'react'

import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import styles from './HeaderButtons.module.scss'

interface HeaderButtonsProps {
  firstButtonClick: () => void
  secondButtonClick: () => void
}

export const HeaderButtons: FC<HeaderButtonsProps> = ({
  firstButtonClick,
  secondButtonClick,
}) => {
  return (
    <div className={styles.wrapper}>
      <ButtonBlue
        titleNone
        title='Save'
        icon='/icons/fileWhite.svg'
        iconProps={styles.iconSave}
        style={styles.buttonSave}
        onClick={firstButtonClick}
      />
      <ButtonBlue
        titleNone
        title='Save & Close'
        icon='/icons/saveAndClose.svg'
        iconProps={styles.iconSaveAndClose}
        style={styles.buttonSaveAndClose}
        onClick={secondButtonClick}
      />
    </div>
  )
}
