import { useEffect, useState } from 'react'

import { SalesProductOrServiceData } from '../../../../app/constants/constants'
import { CrossIcon } from '../../../../shared/icons/CrossIcon'
import { CustomModalWindow } from '../../../../shared/ui/CustomModalWindow/CustomModalWindow'
import { getServiceInvoice } from '../../../../shared/utils/api/Admin/Sales/AddProductOrService/GetService'
import styles from './AddProductOrService.module.scss'
import { RecentProductService } from './RecentProductService/RecentProductService'

interface AddProductOrServiceProps {
  serviceList: string[]
  modalOpen: boolean
  addEditServiceBlank?: (idService: string) => void
  addNewServiceBlank?: (
    idService: string,
    price: number,
    description: string,
  ) => void
  handleOpenCloseModal: () => void
}

export const AddProductOrService = ({
  serviceList,
  modalOpen,
  addEditServiceBlank,
  addNewServiceBlank,
  handleOpenCloseModal,
}: AddProductOrServiceProps) => {
  const [services, setService] = useState<
    SalesProductOrServiceData[] | null
  >(null)

  const getServiceOnList = async () => {
    const getResponse = await getServiceInvoice(serviceList[0])

    setService(getResponse)
  }

  useEffect(() => {
    getServiceOnList()
  }, [])

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
              {services && (
                <RecentProductService
                  servicesList={services}
                  addEditServiceBlank={addEditServiceBlank}
                  addNewServiceBlank={addNewServiceBlank}
                  onCloseModalWindow={handleOpenCloseModal}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </CustomModalWindow>
  )
}
