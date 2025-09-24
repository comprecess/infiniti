import styles from './HeaderButtons.module.scss'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { ClearStorageButton } from '../../../../../shared/ui/ClearStorageButton/ClearStorageButton'

interface HeaderButtonsProps {
  storageKey: string
  isClearButton: boolean
  firstButtonClick: (save: 'save' | 'save & invoice') => void
  secondButtonClick: (save: 'save' | 'save & invoice') => void
}

export const HeaderButtons = ({
  storageKey,
  isClearButton,
  firstButtonClick,
  secondButtonClick,
}: HeaderButtonsProps) => {
  return (
    <div className={styles.wrapper}>
      <ClearStorageButton storageKey={storageKey} isClearButton={isClearButton} />
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
        title='Save & Invoice'
        icon='/icons/saveAndClose.svg'
        iconProps={styles.iconSaveAndClose}
        style={styles.buttonSaveAndClose}
        onClick={() => secondButtonClick('save & invoice')}
      />
    </div>
  )
}
