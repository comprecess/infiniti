import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import styles from './HeaderButtons.module.scss'

interface HeaderButtonsProps {
  firstButtonClick: (save: 'save' | 'save & invoice') => void
  secondButtonClick: (save: 'save' | 'save & invoice') => void
}

export const HeaderButtons = ({
  firstButtonClick,
  secondButtonClick,
}: HeaderButtonsProps) => {
  return (
    <div className={styles.wrapper}>
      <ButtonBlue
        titleNone
        title='Save'
        icon='/icons/fileWhite.svg'
        iconProps={styles.iconSave}
        style={styles.buttonSave}
        onClick={() => firstButtonClick('save')}
      />
      <ButtonBlue
        titleNone
        title='Save & Offer'
        icon='/icons/saveAndClose.svg'
        iconProps={styles.iconSaveAndClose}
        style={styles.buttonSaveAndClose}
        onClick={() => secondButtonClick('save & invoice')}
      />
    </div>
  )
}
