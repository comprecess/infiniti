import { useEffect, useState } from 'react'

import { HeaderPages } from './HeaderPages/HeaderPages'
import styles from './ModalWindowCompanyInfo.module.scss'
import { SideBarItem } from './SideBarItem/SideBarItem'
import {
  RolesAccess,
  ViewCompanyProps,
} from '../../../../../app/constants/constants'
import {
  CompanyInfoPagesData,
  CompanyInfoSideBarData,
} from '../../../../../app/data/companyInfoSideBar'
import { CrossIcon } from '../../../../../shared/icons/CrossIcon'
import { CustomModalWindow } from '../../../../../shared/ui/CustomModalWindow/CustomModalWindow'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getCompanyHeaderView } from '../../../../../shared/utils/api/Admin/Companies/View/get-company-header-view'

const types = [
  'summary',
  'memo',
  'customers',
  'invoices',
  'quotes',
  'orders',
  'transactions',
]

interface ModalWindowCompanyInfoProps {
  roles?: { [key: string]: RolesAccess }
  id: number | null
  modalOpen: boolean
  handleOpenCloseModal: () => void
  openEditModal: (id: number, type: 'view' | 'edit') => void
}

export const ModalWindowCompanyInfo = ({
  roles,
  id,
  modalOpen,
  handleOpenCloseModal,
  openEditModal,
}: ModalWindowCompanyInfoProps) => {
  const [companyInfo, setCompanyInfo] = useState<ViewCompanyProps | null>(
    null,
  )

  const [activeItem, setActiveItem] = useState<number>(0)

  const handleItemClick = (index: number) => {
    setActiveItem(index === activeItem ? 0 : index)
  }

  const handleOpenClose = () => {
    setActiveItem(0)
    setCompanyInfo(null)
    handleOpenCloseModal()
  }

  const handleOpenEditPanel = (id: number) => {
    openEditModal(id, 'edit')
    handleOpenClose()
  }

  useEffect(() => {
    const getCompany = async () => {
      if (id === null) return

      const response = await getCompanyHeaderView(id)

      if (!response.status) return

      setCompanyInfo(response.data)
    }

    getCompany()
  }, [id])

  const ActivePageComponent = CompanyInfoPagesData[activeItem]

  return (
    <CustomModalWindow
      maxWidth='800px'
      isOpen={modalOpen}
      onClose={handleOpenClose}
    >
      <div className={styles.wrapper}>
        {companyInfo ? (
          <div className={styles.containerWrapper}>
            <div className={styles.header}>
              <h4 className={styles.title}>{companyInfo.name}</h4>
              <div className={styles.cross} onClick={handleOpenClose}>
                <CrossIcon />
              </div>
            </div>
            <div className={styles.container}>
              <div className={styles.leftContainer}>
                <div className={styles.logoWrapper}>
                  {companyInfo.logo ? (
                    <img
                      src={companyInfo.logo}
                      alt='Logo'
                      className={styles.logoCompany}
                    />
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
                        isActive={index === activeItem}
                        type={types[index]}
                        allTypes={companyInfo.type}
                        isLast={
                          index === CompanyInfoSideBarData.length - 1
                        }
                        onClick={() => handleItemClick(index)}
                      />
                    )
                  })}
                </div>
              </div>
              <div className={styles.rightContainer}>
                <HeaderPages title={companyInfo.name}>
                  <ActivePageComponent
                    id={id || 0}
                    roles={roles}
                    onClick={handleOpenEditPanel}
                  />
                </HeaderPages>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.loading}>
            <LoadingSpinner size='xl' />
          </div>
        )}
      </div>
    </CustomModalWindow>
  )
}
