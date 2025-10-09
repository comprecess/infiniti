import { useState } from 'react'

import styles from './Item.module.scss'
import { ClientMyOrdersData } from '../../../../../app/constants/constants'
import { Status } from '../../../../../shared/ui/Status/Status'
import { PreviewModal } from '../../PreviewModal/PreviewModal'
import styleItem from '../RecentMyOrders.module.scss'

interface ItemProps {
  data: ClientMyOrdersData
}

export const Item = ({ data }: ItemProps) => {
  const [preview, setPreview] = useState<boolean>(false)

  const handleOnChangePreview = () => {
    setPreview(prev => !prev)
  }

  return (
    <>
      <div className={styles.wrapper}>
        <span className={`${styleItem.dateColumn} ${styles.dateItem}`}>{data.date}</span>
        <span
          className={`${styleItem.orderColumn} ${styles.orderItem}`}
          onClick={handleOnChangePreview}
        >
          {data.orderNum}
        </span>
        <span className={`${styleItem.amountColumn} ${styles.amountItem}`}>{data.amount}</span>
        <div className={styleItem.statusColumn}>
          <Status title={data.status} status={data.status} />
        </div>
      </div>
      {preview && (
        <PreviewModal
          idOrder={data.id}
          isOpened={preview}
          handleOpenCloseModal={handleOnChangePreview}
        />
      )}
    </>
  )
}
