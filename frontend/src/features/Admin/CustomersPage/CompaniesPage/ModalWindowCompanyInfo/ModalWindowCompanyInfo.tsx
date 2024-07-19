import { FC } from 'react'

import { CompanyInfoSideBarData } from '../../../../../app/data/companyInfoSideBar'
import { CrossIcon } from '../../../../../shared/icons/CrossIcon'
import { CustomModalWindow } from '../../../../../shared/ui/CustomModalWindow/CustomModalWindow'
import styles from './ModalWindowCompanyInfo.module.scss'
import { SideBarItem } from './SideBarItem/SideBarItem'

interface ModalWindowCompanyInfoProps {
  companyName: string
  modalOpen: boolean
  handleOpenCloseModal: () => void
}

export const ModalWindowCompanyInfo: FC<ModalWindowCompanyInfoProps> = ({
  companyName,
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
        <div className={styles.header}>
          <h4 className={styles.title}>{companyName}</h4>
          <div className={styles.cross} onClick={handleOpenCloseModal}>
            <CrossIcon />
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.leftContainer}>
            <div className={styles.logoWrapper}>
              <img src='' alt='Logo' className={styles.logoCompany} />
            </div>
            <div className={styles.sideBarInfo}>
              {CompanyInfoSideBarData.map((item, index) => {
                return (
                  <SideBarItem
                    key={item.id}
                    name={item.name}
                    icon={item.icon}
                    isFirst={index === 0}
                    isLast={index === CompanyInfoSideBarData.length - 1}
                  />
                )
              })}
            </div>
          </div>
          <div className={styles.rightContainer}>Right</div>
        </div>
      </div>
    </CustomModalWindow>
  )
}
