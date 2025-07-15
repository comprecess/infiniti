import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  PagesMetaData,
  RolesAccess,
  SettingsUsersData,
} from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import { RecentUsers } from '../../../../features/Admin/Settings/UsersPage/UsersPage/RecentUsers/RecentUsers'
import { PagesList } from '../../../../features/Client/CatalogPage/TalentsList/PagesList/PagesList'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { Search } from '../../../../shared/ui/Search/Search'
import { deleteSelectedUser } from '../../../../shared/utils/api/Admin/Settings/Users/DeleteUser'
import { getListUsers } from '../../../../shared/utils/api/Admin/Settings/Users/GetListUsers'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './UsersPage.module.scss'

export const AdminUsersPage = () => {
  const [data, setData] = useState<{
    data: SettingsUsersData[]
    meta: PagesMetaData
  } | null>(null)
  const [access, setAccess] = useState<RolesAccess | null>(null)

  const [page, setPage] = useState<number>(1)
  const [search, setSearch] = useState<string>('')
  const [sortName, setSortName] = useState<string>('id')
  const [sortType, setSortType] = useState<number>(1)
  const [options, setOptions] = useState<string>('')

  const navigate = useNavigate()
  const showToast = useCustomToast()

  const changeURL = (
    pageItem: number,
    searchItem: string,
    sortNameItem: string,
    sortTypeItem: number,
  ) => {
    // eslint-disable-next-line max-len
    const urlOptions = `?page=${pageItem}&filter[search]=${searchItem}&sort[name]=${sortNameItem}&sort[type]=${sortTypeItem}&document=json`

    setOptions(urlOptions)
  }

  const changeSort = useCallback(
    (sortNameItem: string, sortTypeItem: number) => {
      setSortName(sortNameItem)
      setSortType(sortTypeItem)
    },
    [],
  )

  const getData = async () => {
    if (!options) return

    const getResponse: {
      access: RolesAccess
      data: SettingsUsersData[]
      meta: PagesMetaData
    } = await getListUsers(options)

    if (page > getResponse.meta.last_page) {
      setPage(1)
    }

    setAccess(getResponse.access)
    setData({ data: getResponse.data, meta: getResponse.meta })
  }

  const handleNewUser = () => {
    navigate(
      `/${Routes.adminPages}/${Routes.settings}/${Routes.users}/${Routes.new}/${Routes.user}`,
    )
  }

  const handleDeleteSelectedUser = async (idUser: number) => {
    const deleteResponse = await deleteSelectedUser(idUser)

    if (deleteResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully deleted the user',
        status: 'success',
      })
      getData()
    } else {
      showToast({
        title: 'Error',
        description: deleteResponse.message,
        status: 'error',
      })
    }
  }

  const handleEditSelectedUser = (idUser: number) => {
    navigate(
      `/${Routes.adminPages}/${Routes.settings}/${Routes.users}/${Routes.edit}/${Routes.user}/${idUser}`,
    )
  }

  useEffect(() => {
    document.title = 'infiniti | Users'
  }, [])

  useEffect(() => {
    changeURL(page, search, sortName, sortType)
  }, [page, search, sortName, sortType])

  useEffect(() => {
    getData()
  }, [options])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {data && access ? (
          <RecentCard
            title='Users'
            style={styles.recentFullScreen}
            HeaderComponent={Search}
            PagesComponent={PagesList}
            Component={access.create ? ButtonBlue : undefined}
            pagesProps={{
              meta: data.meta,
              nextPage: setPage,
              size: 'sm',
            }}
            headerProps={{
              style: styles.search,
              onSearchChange: setSearch,
            }}
            componentProps={
              access.create
                ? {
                  title: 'New User',
                  titleNone: true,
                  icon: '/icons/plus.svg',
                  iconProps: styles.icon,
                  onClick: handleNewUser,
                  style: styles.blueButton,
                }
                : undefined
            }
          >
            <RecentUsers
              data={data.data}
              access={access}
              changeSortName={changeSort}
              onDeleteUser={handleDeleteSelectedUser}
              onEditUser={handleEditSelectedUser}
            />
          </RecentCard>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
    </div>
  )
}
