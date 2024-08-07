import { FC, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { ViewListPagesAndInfo } from '../../../../../app/constants/constants'
import { ContactInfoSideBarData } from '../../../../../app/data/contactInfoSideBar'
import { PageItem } from './PageItem/PageItem'
import styles from './SideBar.module.scss'

interface SideBarProps {
  data: ViewListPagesAndInfo
}

export const SideBar: FC<SideBarProps> = ({ data }) => {
  const [activeItem, setActiveItem] = useState<number>(0)

  const location = useLocation()
  const navigate = useNavigate()

  const getCurrentPage = (url: string): string => {
    const pathSegments = url.split('/')

    return pathSegments[pathSegments.length - 1] || ''
  }

  const currentPage = getCurrentPage(location.pathname).toLocaleLowerCase()

  const getTypeValue = (key: string) => {
    const value = data.type[key]

    return value
  }

  const handleItemClick = (index: number, page: string) => {
    setActiveItem(index === activeItem ? 0 : index)
    navigate(page)
  }

  return (
    <div className={styles.wrapper}>
      <img
        src={data.img ? data.img : '/profileWithoutAvatar.svg'}
        alt='Avatar'
        className={styles.avatar}
      />
      <div className={styles.info}>
        <span className={styles.email}>{data.email}</span>
        {data.phone && <span className={styles.phone}>{data.phone}</span>}
      </div>
      <div className={styles.pagesList}>
        {ContactInfoSideBarData.map((item, index) => {
          const isActive = getCurrentPage(item.page) === currentPage

          return (
            <PageItem
              key={item.id}
              title={item.name}
              icon={item.icon}
              page={item.page}
              isActive={isActive}
              type={getTypeValue(item.type)}
              onClick={() => handleItemClick(index, item.page)}
            />
          )
        })}
      </div>
    </div>
  )
}
