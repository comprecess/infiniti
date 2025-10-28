import styles from './PreviewModal.module.scss'
import { RecentProducts } from './RecentProducts/RecentProducts'
import { ClientMyOrdersData } from '../../../../app/constants/constants'
import { CrossIcon } from '../../../../shared/icons/CrossIcon'
import { CustomModalWindow } from '../../../../shared/ui/CustomModalWindow/CustomModalWindow'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'

interface PreviewModalProps {
  order: ClientMyOrdersData
  isOpened: boolean
  handleOpenCloseModal: () => void
}

export const PreviewModal = ({ order, isOpened, handleOpenCloseModal }: PreviewModalProps) => {
  return (
    <CustomModalWindow maxWidth='800px' isOpen={isOpened} onClose={handleOpenCloseModal}>
      {order ? (
        <div className={styles.wrapper}>
          <div className={styles.cross} onClick={handleOpenCloseModal}>
            <CrossIcon />
          </div>
          <div className={styles.header}>
            <span className={styles.title}>{order.type}</span>
          </div>
          <div className={styles.info}>
            <span className={styles.amount}>{`Amount: ${order.amount}`}</span>
            <span className={styles.date}>{`Date: ${order.date}`}</span>
          </div>
          <div className={styles.items}>
            <RecentProducts items={order.items} />
          </div>
        </div>
      ) : (
        <div className={styles.loading}>
          <LoadingSpinner size='xl' />
        </div>
      )}
    </CustomModalWindow>
  )
}
