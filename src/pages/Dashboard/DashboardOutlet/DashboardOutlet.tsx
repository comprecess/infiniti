import { FC } from 'react'
import { Outlet } from 'react-router-dom'

import { Sidebar } from '../../../features/Dashboard/Sidebar/Sidebar'
import styles from './DashboardOutlet.module.scss'

export const DashboardOutlet: FC = () => {
  return (
    <div className={styles.wrapper}>
      <Sidebar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
