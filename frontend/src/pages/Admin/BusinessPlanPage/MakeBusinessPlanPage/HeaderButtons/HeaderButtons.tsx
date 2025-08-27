import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { ClearStorageButton } from '../../../../../shared/ui/ClearStorageButton/ClearStorageButton'
import styles from './HeaderButtons.module.scss'

interface HeaderButtonsProps {
  isClearButton: boolean
  storageKey: string
  style: string
  iconProps: string
  onClick: () => void
}

export const HeaderButtons = ({
  isClearButton,
  storageKey,
  style,
  iconProps,
  onClick,
}: HeaderButtonsProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.clear}>
        <ClearStorageButton
          isClearButton={isClearButton}
          storageKey={storageKey}
        />
      </div>
      <ButtonBlue
        titleNone
        title='Save'
        style={style}
        iconProps={iconProps}
        icon='/icons/fileWhite.svg'
        onClick={onClick}
      />
    </div>
  )
}
