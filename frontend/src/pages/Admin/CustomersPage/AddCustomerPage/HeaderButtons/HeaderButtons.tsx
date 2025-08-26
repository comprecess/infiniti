import { ImportButton } from '../../../../../features/Admin/CustomersPage/AddCustomer/ImportButton/ImportButton'
import { ClearStorageButton } from '../../../../../shared/ui/ClearStorageButton/ClearStorageButton'
import styles from './HeaderButtons.module.scss'

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
      <ClearStorageButton
        storageKey={storageKey}
        isClearButton={isClearButton}
      />
      <ImportButton />
    </div>
  )
}
