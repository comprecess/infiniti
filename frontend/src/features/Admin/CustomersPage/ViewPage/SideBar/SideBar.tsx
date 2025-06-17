import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { ViewListPagesAndInfo } from '../../../../../app/constants/constants'
import { PageItem } from './PageItem/PageItem'
import styles from './SideBar.module.scss'

interface SideBarProps {
  data?: ViewListPagesAndInfo
  pages: {
    id: number
    name: string
    page: string
    type: string
    icon: React.ReactNode
  }[]
  isActive: boolean
  openCloseSidebar: () => void
}

export const SideBar = ({
  data,
  pages,
  isActive,
  openCloseSidebar,
}: SideBarProps) => {
  const [activeItem, setActiveItem] = useState<number>(0)

  const location = useLocation()
  const navigate = useNavigate()

  const getCurrentPage = (url: string): string => {
    const pathSegments = url.split('/')

    return pathSegments[pathSegments.length - 1] || ''
  }

  const currentPage = getCurrentPage(location.pathname).toLocaleLowerCase()

  const getTypeValue = (key: string) => {
    const value = data?.type[key]

    return value
  }

  const handleItemClick = (index: number, page: string) => {
    setActiveItem(index === activeItem ? 0 : index)
    navigate(page)
    openCloseSidebar()
  }

  return (
    <div
      className={isActive ? styles.wrapperActive : styles.wrapperDisable}
    >
      {data && (
        <>
          <div className={styles.avatar}>
            <img
              alt='Avatar'
              src={
                data.img
                  ? `${data.img}?width=176&height=176`
                  : '/profileWithoutAvatar.svg'
              }
            />
          </div>
          <div className={styles.info}>
            {data.email && (
              <span className={styles.email} contentEditable={false}>
                {data.email}
              </span>
            )}
            {data.phone && (
              <span className={styles.phone}>{data.phone}</span>
            )}
          </div>
        </>
      )}
      <div className={styles.pagesList}>
        {pages.map((item, index) => {
          const isActive = getCurrentPage(item.page) === currentPage

          return (
            <PageItem
              key={item.id}
              title={item.name}
              icon={item.icon}
              page={item.page}
              isActive={isActive}
              type={getTypeValue(item.type) ?? null}
              onClick={() => handleItemClick(index, item.page)}
            />
          )
        })}
      </div>
    </div>
  )
}
