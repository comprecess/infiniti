import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import styles from './FilesPage.module.scss'
import { RecentFiles } from '../../../../features/Admin/CustomersPage/Files/RecentFiles/RecentFiles'
import { PagesList } from '../../../../features/Client/CatalogPage/TalentsList/PagesList/PagesList'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { Search } from '../../../../shared/ui/Search/Search'
import { getCustomerFiles } from '../../../../shared/utils/api/Admin/Files/get-customer-files'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'

export const AdminFilesPage = () => {
  const [page, setPage] = useState<number>(1)
  const [search, setSearch] = useState<string>('')

  const { data: groupsData } = useQuery({
    queryKey: ['groups', page, search],
    queryFn: async () => {
      const response = await getCustomerFiles(
        `?page=${page}&filter[type]=client&filter[search]=${search}&document=json`,
      )

      if (!response.status) return

      return response.data
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
            PagesComponent={
              groupsData.data.length > 0 ? PagesList : undefined
            }
            pagesProps={
              groupsData.data.length > 0
                ? {
                  meta: groupsData.meta,
                  nextPage: setPage,
                  size: 'sm',
                }
                : undefined
            }
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
