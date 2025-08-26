import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { ClearStorageButton } from '../../../../../shared/ui/ClearStorageButton/ClearStorageButton'
import styles from './HeaderButtons.module.scss'

interface HeaderButtonsProps {
  storageKey: string
  isClearButton: boolean
  titleButton: string
  onClick: () => void
}

export const HeaderButtons = ({
  storageKey,
  isClearButton,
  titleButton,
  onClick,
}: HeaderButtonsProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.clear}>
        <ClearStorageButton
          storageKey={storageKey}
          isClearButton={isClearButton}
        />
      </div>
      <ButtonBlue
        titleNone
        title={titleButton}
        icon='/icons/fileWhite.svg'
        style={styles.button}
        onClick={onClick}
      />
    </div>
  )
}
