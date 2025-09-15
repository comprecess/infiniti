import { Tooltip } from '@chakra-ui/react'

import { removeStorage } from '../../utils/Saving/Storage/RemoveStorage'
import styles from './ClearStorageButton.module.scss'

interface ClearStorageButtonProps {
  storageKey: string
  isClearButton?: boolean
}

export const ClearStorageButton = ({
  storageKey,
  isClearButton = false,
}: ClearStorageButtonProps) => {
  const handleRemoveStorage = () => {
    removeStorage(storageKey)
    window.location.reload()
  }

  if (!isClearButton) return null

  return (
    <Tooltip
      label='Delete form cache'
      openDelay={100}
      closeDelay={100}
      color='white'
      bg='#010102'
      borderRadius='8px'
      autoFocus={false}
    >
      <button className={styles.wrapper} onClick={handleRemoveStorage}>
        <img src='/icons/eraser.svg' className={styles.icon} />
      </button>
    </Tooltip>
  )
}
