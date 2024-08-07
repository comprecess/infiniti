import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { ViewListPagesAndInfo } from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import { SideBar } from '../../../../features/Admin/CustomersPage/ViewPage/SideBar/SideBar'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getListPagesAndInfo } from '../../../../shared/utils/api/Admin/ViewContact/GetListPagesAndInfo'
import styles from './ViewPage.module.scss'

const extractIdFromUrl = (url: string): number | null => {
  const regex = /\/view\/(\d+)/
  const match = url.match(regex)

  return match ? parseInt(match[1], 10) : null
}

const useIdFromUrl = () => {
  const location = useLocation()

  const id = useMemo(
    () => extractIdFromUrl(location.pathname),
    [location.pathname],
  )

  return id
}

export const AdminViewPage: FC = () => {
  const [pagesAndInfo, setPagesAndInfo] =
    useState<ViewListPagesAndInfo | null>(null)

  const navigate = useNavigate()
  const id = useIdFromUrl()

  const getListPagesInfo = useCallback(async () => {
    if (id !== null) {
      const getResponse = await getListPagesAndInfo(id)

      setPagesAndInfo(getResponse)

      if (getResponse.status) {
        console.log(getResponse)
      } else {
        navigate('/' + Routes.notFound)
      }
    }
  }, [id])

  useEffect(() => {
    getListPagesInfo()
  }, [id])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {pagesAndInfo ? (
          <div className={styles.container}>
            <div className={styles.sideBar}>
              <SideBar data={pagesAndInfo} />
            </div>
            <main className={styles.content}>
              <h4 className={styles.accountName}>
                {pagesAndInfo.account}
              </h4>
              <Outlet />
            </main>
          </div>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
    </div>
  )
}
