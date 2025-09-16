import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import {
  BusinessPlanItemData,
  PagesMetaData,
  RolesAccess,
} from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import { SearchAndButtons } from '../../../../features/Admin/Sales/OffersPage/SearchAndButtons/SearchAndButtons'
import { RecentPlans } from '../../../../features/Client/BusinessPlan/RecentPlans/RecentPlans'
import { PagesList } from '../../../../features/Client/CatalogPage/TalentsList/PagesList/PagesList'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { deleteBusinessPlan } from '../../../../shared/utils/api/Admin/BusinessPlan/delete-business-plan'
import { getBusinessPlansList } from '../../../../shared/utils/api/Admin/BusinessPlan/get-business-plans-list'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './BusinessPlanPage.module.scss'

export const AdminBusinessPlanPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = searchParams.get('page') || '1'
  const search = searchParams.get('search') || ''
  const sortName = searchParams.get('sortName') || 'id'
  const sortType = parseInt(searchParams.get('sortType') || '1')

  const showToast = useCustomToast()
  const navigate = useNavigate()
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

  const handleNavigateToMakeBusinessPlan = () => {
    navigate(
      `/${Routes.adminPages}/${Routes.businessPlan}/${Routes.make}/${Routes.businessPlan}`,
    )
  }

  const { data: plansData } = useQuery({
    queryKey: ['admin-business-plans', page, search, sortName, sortType],
    queryFn: async () => {
      const response = await getBusinessPlansList(
        `?page=${page}&filter[search]=${search}&sort[name]=${sortName}&sort[type]=${sortType}&document=json`,
      )

      if (!response.status) return

      return response.data as {
        access: RolesAccess
        data: BusinessPlanItemData[]
        meta: PagesMetaData
      }
    },
    placeholderData: previousData => previousData,
  })

  const changeSort = useCallback(
    (sortNameItem: string, sortTypeItem: number) => {
      updateSort(sortNameItem, sortTypeItem)
    },
    [],
  )

  const deletePlan = async (id: number) => {
    const { status, message } = await deleteBusinessPlan(id)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully deleted your Business Plan',
        status: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['admin-business-plans'] })
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
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
    document.title = 'infiniti | Business Plans'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <RecentCard
          title='Business Plans'
          style={styles.recentFullScreen}
          HeaderComponent={SearchAndButtons}
          Component={
            plansData?.access.create === 1 ? ButtonBlue : undefined
          }
          PagesComponent={
            plansData && plansData.data.length > 0 ? PagesList : undefined
          }
          componentProps={
            plansData?.access.create === 1
              ? {
                titleNone: true,
                title: 'New Business Plan',
                icon: '/icons/plus.svg',
                style: styles.buttonPlus,
                iconProps: styles.iconPlus,
                onClick: handleNavigateToMakeBusinessPlan,
              }
              : undefined
          }
          headerProps={{
            searchValue: search,
            searchChange: updateSearch,
          }}
          pagesProps={
            plansData && plansData.data.length > 0
              ? {
                meta: plansData.meta,
                nextPage: updatePage,
                size: 'sm',
              }
              : undefined
          }
        >
          {plansData ? (
            <RecentPlans
              plansData={plansData.data}
              access={plansData.access}
              changeSortName={changeSort}
              deletePlan={deletePlan}
            />
          ) : (
            <div className={styles.loading}>
              <LoadingSpinner size='xl' />
            </div>
          )}
        </RecentCard>
      </section>
    </div>
  )
}
