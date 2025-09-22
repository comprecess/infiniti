import styles from './HeaderButtons.module.scss'
import { ImportButton } from '../../../../../features/Admin/CustomersPage/AddCustomer/ImportButton/ImportButton'
import { ClearStorageButton } from '../../../../../shared/ui/ClearStorageButton/ClearStorageButton'

interface HeaderButtonsProps {
  storageKey: string
  isClearButton: boolean
}

export const HeaderButtons = ({
  storageKey,
  isClearButton = false,
}: HeaderButtonsProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.clear}>
        <ClearStorageButton
          storageKey={storageKey}
          isClearButton={isClearButton}
        />
      </div>
      <ImportButton />
    </div>
  )
}
