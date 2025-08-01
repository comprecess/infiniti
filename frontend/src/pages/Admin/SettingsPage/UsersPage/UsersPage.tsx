import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

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
  const [searchParams, setSearchParams] = useSearchParams()

  const page = searchParams.get('page') || '1'
  const search = searchParams.get('search') || ''
  const sortName = searchParams.get('sortName') || 'id'
  const sortType = parseInt(searchParams.get('sortType') || '1')

  const navigate = useNavigate()
  const showToast = useCustomToast()
  const queryClient = useQueryClient()

  const updateQueryParam = (key: string, value: string | number) => {
    const newParams = new URLSearchParams(location.search)
    newParams.set(key, String(value))

    if (key !== 'page') {
      newParams.set('page', '1')
    }

    setSearchParams(newParams, { replace: true })
  }

  const updatePage = (newPage: string) => updateQueryParam('page', newPage)
  const updateSearch = (newSearch: string) =>
    updateQueryParam('search', newSearch)
  const updateSort = (name: string, type: number) => {
    updateQueryParam('sortName', name)
    updateQueryParam('sortType', type)
  }

  const changeSort = useCallback(
    (sortNameItem: string, sortTypeItem: number) => {
      updateSort(sortNameItem, sortTypeItem)
    },
    [],
  )

  const { data: usersData } = useQuery({
    queryKey: ['usersData', page, search, sortName, sortType],
    queryFn: async () => {
      const response: {
        access: RolesAccess
        data: SettingsUsersData[]
        meta: PagesMetaData
      } = await getListUsers(

        `?page=${page}&filter[search]=${search}&sort[name]=${sortName}&sort[type]=${sortType}&document=json`,
      )

      if (page && parseInt(page) > response.meta.last_page) {
        updatePage('1')
      }

      return response
    },
    placeholderData: previousData => previousData,
  })

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
      queryClient.invalidateQueries({ queryKey: ['usersData'] })
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
    const params = new URLSearchParams(location.search)
    let changed = false

    if (!params.has('page')) {
      params.set('page', '1')
      changed = true
    }

    if (!params.has('sortName')) {
      params.set('sortName', 'id')
      changed = true
    }

    if (!params.has('sortType')) {
      params.set('sortType', '1')
      changed = true
    }

    if (changed) {
      setSearchParams(params, { replace: true })
    }
  }, [])

  useEffect(() => {
    document.title = 'infiniti | Users'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {usersData ? (
          <RecentCard
            title='Users'
            style={styles.recentFullScreen}
            HeaderComponent={Search}
            PagesComponent={PagesList}
            Component={usersData.access.create ? ButtonBlue : undefined}
            pagesProps={{
              meta: usersData.meta,
              nextPage: updatePage,
              size: 'sm',
            }}
            headerProps={{
              style: styles.search,
              onSearchChange: updateSearch,
            }}
            componentProps={
              usersData.access.create
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
              data={usersData.data}
              access={usersData.access}
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
