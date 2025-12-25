import styles from './ConfirmationModal.module.scss'
import { CrossIcon } from '../../icons/CrossIcon'
import { ButtonBlue } from '../ButtonBlue/ButtonBlue'
import { ButtonBrand } from '../ButtonBrand/ButtonBrand'
import { CustomModalWindow } from '../CustomModalWindow/CustomModalWindow'

interface ConfirmationModalProps {
  title?: string
  isOpened: boolean
  handleOpenCloseModal: () => void
  agree: () => void
}

export const ConfirmationModal = ({
  title,
  isOpened,
  handleOpenCloseModal,
  agree,
}: ConfirmationModalProps) => {
  return (
    <CustomModalWindow maxWidth='400px' isOpen={isOpened} onClose={handleOpenCloseModal}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h4 className={styles.title}>{title ? title : `Are You Sure?`}</h4>
          <div className={styles.cross} onClick={handleOpenCloseModal}>
            <CrossIcon />
          </div>
        </div>
        <div className={styles.buttons}>
          <ButtonBlue title='Yes' style={styles.button} onClick={agree} />
          <ButtonBrand title='Cancel' style={styles.button} onClick={handleOpenCloseModal} />
        </div>
      </div>
    </CustomModalWindow>
  )
}
