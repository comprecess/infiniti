import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import {
  CustomersFilesData,
  PagesMetaData,
  RolesAccess,
} from '../../../../app/constants/constants'
import { RecentFiles } from '../../../../features/Admin/CustomersPage/Files/RecentFiles/RecentFiles'
import { PagesList } from '../../../../features/Client/CatalogPage/TalentsList/PagesList/PagesList'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { Search } from '../../../../shared/ui/Search/Search'
import { getCustomersFiles } from '../../../../shared/utils/api/Admin/Files/GetCustomersFiles'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './FilesPage.module.scss'

export const AdminFilesPage = () => {
  const [page, setPage] = useState<number>(1)
  const [search, setSearch] = useState<string>('')

  const { data: groupsData } = useQuery({
    queryKey: ['groups', page, search],
    queryFn: async () => {
      const response: {
        access: RolesAccess
        data: CustomersFilesData[]
        meta: PagesMetaData
      } = await getCustomersFiles(
        `?page=${page}&filter[type]=client&filter[search]=${search}&document=json`,
      )

      return response
    },
    placeholderData: previousData => previousData,
  })

  useEffect(() => {
    document.title = 'infiniti | Files'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {groupsData ? (
          <RecentCard
            title='Files uploaded by Customers'
            style={styles.recentFullScreen}
            HeaderComponent={Search}
            PagesComponent={PagesList}
            pagesProps={{
              meta: groupsData.meta,
              nextPage: setPage,
              size: 'sm',
            }}
            headerProps={{
              onSearchChange: setSearch,
            }}
          >
            <RecentFiles
              access={groupsData.access}
              files={groupsData.data}
            />
          </RecentCard>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
    </div>
  )
}
