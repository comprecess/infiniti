import { useEffect, useState } from 'react'

import styles from './PreviewModal.module.scss'
import { RecentProducts } from './RecentProducts/RecentProducts'
import { ClientMyOrdersPreviewData } from '../../../../app/constants/constants'
import { CrossIcon } from '../../../../shared/icons/CrossIcon'
import { CustomModalWindow } from '../../../../shared/ui/CustomModalWindow/CustomModalWindow'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { Status } from '../../../../shared/ui/Status/Status'
import { getFullInfoOrder } from '../../../../shared/utils/api/Client/MyOrders/get-full-info-order'

interface PreviewModalProps {
  idOrder: number
  isOpened: boolean
  handleOpenCloseModal: () => void
}

export const PreviewModal = ({ idOrder, isOpened, handleOpenCloseModal }: PreviewModalProps) => {
  const [order, setOrder] = useState<ClientMyOrdersPreviewData | null>(null)

  const getOrder = async () => {
    const response = await getFullInfoOrder(idOrder)

    if (!response.status) return

    setOrder(response.data.data)
  }

  useEffect(() => {
    getOrder()
  }, [])

  return (
    <CustomModalWindow maxWidth='800px' isOpen={isOpened} onClose={handleOpenCloseModal}>
      {order ? (
        <div className={styles.wrapper}>
          <div className={styles.cross} onClick={handleOpenCloseModal}>
            <CrossIcon />
          </div>
          <div className={styles.header}>
            <span className={styles.title}>{`Order number - ${order.orderNum}`}</span>
            <Status title={order.status} status={order.status} />
          </div>
          <div className={styles.info}>
            <span className={styles.customer}>{`Customer: ${order.cName}`}</span>
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
