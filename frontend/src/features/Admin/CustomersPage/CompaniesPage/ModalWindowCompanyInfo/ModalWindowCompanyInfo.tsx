import { FC, useState } from 'react'

import {
  CompanyInfoPagesData,
  CompanyInfoSideBarData,
} from '../../../../../app/data/companyInfoSideBar'
import { CrossIcon } from '../../../../../shared/icons/CrossIcon'
import { CustomModalWindow } from '../../../../../shared/ui/CustomModalWindow/CustomModalWindow'
import { HeaderPages } from './HeaderPages/HeaderPages'
import styles from './ModalWindowCompanyInfo.module.scss'
import { SideBarItem } from './SideBarItem/SideBarItem'

interface ModalWindowCompanyInfoProps {
  modalOpen: boolean
  handleOpenCloseModal: () => void
}

export const ModalWindowCompanyInfo: FC<ModalWindowCompanyInfoProps> = ({
  modalOpen,
  handleOpenCloseModal,
}) => {
  const [activeItem, setActiveItem] = useState<number>(0)

  const handleItemClick = (index: number) => {
    setActiveItem(index === activeItem ? 0 : index)
  }

  const handleOpenClose = () => {
    setActiveItem(0)
    handleOpenCloseModal()
  }

  const ActivePageComponent = CompanyInfoPagesData[activeItem]

  return (
    <CustomModalWindow
      maxWidth={'800px'}
      isOpen={modalOpen}
      onClose={handleOpenClose}
    >
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h4 className={styles.title}>Company Name</h4>
          <div className={styles.cross} onClick={handleOpenClose}>
            <CrossIcon />
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.leftContainer}>
            <div className={styles.logoWrapper}>
              {!modalOpen ? (
                <img src={''} alt='Logo' className={styles.logoCompany} />
              ) : (
                <span className={styles.notFound}>Logo Not Found</span>
              )}
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
                    isActive={index === activeItem}
                    onClick={() => handleItemClick(index)}
                  />
                )
              })}
            </div>
          </div>
          <div className={styles.rightContainer}>
            <HeaderPages title='Company Name'>
              <ActivePageComponent />
            </HeaderPages>
          </div>
        </div>
      </div>
    </CustomModalWindow>
  )
}
