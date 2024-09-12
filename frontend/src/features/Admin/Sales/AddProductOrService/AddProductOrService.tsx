import { FC } from 'react'

import { SalesProductOrServiceData } from '../../../../app/constants/constants'
import { CrossIcon } from '../../../../shared/icons/CrossIcon'
import { CustomModalWindow } from '../../../../shared/ui/CustomModalWindow/CustomModalWindow'
import styles from './AddProductOrService.module.scss'
import { RecentProductService } from './RecentProductService/RecentProductService'

interface AddProductOrServiceProps {
  serviceList: SalesProductOrServiceData[]
  modalOpen: boolean
  handleOpenCloseModal: () => void
}

export const AddProductOrService: FC<AddProductOrServiceProps> = ({
  serviceList,
  modalOpen,
  handleOpenCloseModal,
}) => {
  return (
    <CustomModalWindow
      maxWidth={'800px'}
      isOpen={modalOpen}
      onClose={handleOpenCloseModal}
    >
      <div className={styles.wrapper}>
        <div className={styles.containerHeader}>
          <div className={styles.header}>
            <h4 className={styles.title}>Products & Services</h4>
            <div className={styles.cross} onClick={handleOpenCloseModal}>
              <CrossIcon />
            </div>
          </div>
          <div className={styles.table}>
            <div className={styles.content}>
              <RecentProductService servicesList={serviceList} />
            </div>
          </div>
        </div>
      </div>
    </CustomModalWindow>
  )
}
