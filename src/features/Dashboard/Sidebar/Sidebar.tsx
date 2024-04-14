import { FC } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { dashboardsList } from '../../../app/data/dashboardsList'
import { Logo } from '../../../shared/ui/Logo/Logo'
import { Item } from './Item/Item'
import styles from './Sidebar.module.scss'

export const Sidebar: FC = () => {
  const location = useLocation()

  const navigate = useNavigate()

  const handleNavigate = (path: string) => {
    navigate(path)
  }

  const isActivePage = (pagePath: string) => {
    return location.pathname === '/' + pagePath
  }

  return (
    <div className={styles.wrapper}>
      <Logo logo='/icons/logo.svg' />
      <div className={styles.items}>
        {dashboardsList.map(item => {
          return (
            <Item
              key={item.id}
              title={item.name}
              icon={item.icon}
              path={item.path}
              isActive={isActivePage(item.path)}
              onItemClick={handleNavigate}
            />
          )
        })}
      </div>
    </div>
  )
}
