import { FC, useCallback, useEffect, useState } from 'react'

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

export const AdminFilesPage: FC = () => {
  const [page, setPage] = useState<number>(1)
  const [search, setSearch] = useState<string>('')
  const [options, setOptions] = useState<string>('')

  const [data, setData] = useState<{
    files: CustomersFilesData[]
    meta: PagesMetaData
  } | null>(null)

  const [access, setAccess] = useState<RolesAccess | null>(null)

  const changeURL = (pageItem: number, searchItem: string) => {

    const urlOptions = `?page=${pageItem}&filter[type]=client&filter[search]=${searchItem}&document=json`

    setOptions(urlOptions)
  }

  const getFiles = async () => {
    if (!options) return

    const getResponse: {
      access: RolesAccess
      data: CustomersFilesData[]
      meta: PagesMetaData
    } = await getCustomersFiles(options)

    setAccess(getResponse.access)
    setData({ files: getResponse.data, meta: getResponse.meta })
  }

  const searchOnChange = useCallback((searchItem: string) => {
    setSearch(searchItem)
  }, [])

  const pageOnChange = useCallback((pageItem: number) => {
    setPage(pageItem)
  }, [])

  useEffect(() => {
    document.title = 'infiniti | Files'
  }, [])

  useEffect(() => {
    changeURL(page, search)
  }, [page, search])

  useEffect(() => {
    getFiles()
  }, [options])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {data && access ? (
          <RecentCard
            title='Files uploaded by Customers'
            style={styles.recentFullScreen}
            HeaderComponent={Search}
            PagesComponent={PagesList}
            pagesProps={{
              meta: data.meta,
              nextPage: pageOnChange,
              size: 'sm',
            }}
            headerProps={{
              onSearchChange: searchOnChange,
            }}
          >
            <RecentFiles access={access} files={data.files} />
          </RecentCard>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
    </div>
  )
}
