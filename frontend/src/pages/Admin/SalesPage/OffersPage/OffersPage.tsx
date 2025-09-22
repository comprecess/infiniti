import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import styles from './OffersPage.module.scss'
import {
  PagesMetaData,
  RolesAccess,
  SalesOffersListData,
} from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import { RecentOffers } from '../../../../features/Admin/Sales/OffersPage/RecentOffers/RecentOffers'
import { SearchAndButtons } from '../../../../features/Admin/Sales/OffersPage/SearchAndButtons/SearchAndButtons'
import { PagesList } from '../../../../features/Client/CatalogPage/TalentsList/PagesList/PagesList'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { deleteOffer } from '../../../../shared/utils/api/Admin/Sales/Offers/DeleteOffer'
import { getDocumentsOffers } from '../../../../shared/utils/api/Admin/Sales/Offers/GetDocumentsOffers'
import { getListOffers } from '../../../../shared/utils/api/Admin/Sales/Offers/GetListOffers'
import { downloadDocument } from '../../../../shared/utils/usefulMethods'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'

export const AdminOffersPage = () => {
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

  const { data: offersData } = useQuery({
    queryKey: ['offersData', page, search, sortName, sortType],
    queryFn: async () => {
      const response: {
        access: RolesAccess
        data: SalesOffersListData[]
        meta: PagesMetaData
      } = await getListOffers(
        `?page=${page}&filter[search]=${search}&sort[name]=${sortName}&sort[type]=${sortType}&document=json`,
      )

      if (page && parseInt(page) > response.meta.last_page) {
        updatePage('1')
      }

      return response
    },
    placeholderData: previousData => previousData,
  })

  const downloadFile = useCallback(
    async (documentItem: string) => {
      // eslint-disable-next-line max-len
      const urlOptions = `?page=${page}&filter[search]=${search}&sort[name]=${sortName}&sort[type]=${sortType}&document=${documentItem}`

      const downloadInitiated = await getDocumentsOffers(urlOptions)

      const { status } = await downloadDocument(
        downloadInitiated,
        'Offers',
      )

      if (status && documentItem === 'copy') {
        showToast({
          title: 'Successfully',
          description:
            'You have successfully copied information to the clipboard',
          status: 'success',
        })
      }
    },
    [page, search, sortName, sortType],
  )

  const deleteSelectedOffer = async (idOffer: number) => {
    const deleteResponse = await deleteOffer(idOffer)

    if (deleteResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully deleted Offer',
        status: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['offersData'] })
    } else {
      showToast({
        title: 'Error',
        description: deleteResponse.message,
        status: 'error',
      })
    }
  }

  const navigateToViewOffer = (idOffer: number) => {
    navigate(
      `/${Routes.adminPages}/${Routes.sales}/${Routes.offer}/${Routes.view}/${idOffer}`,
    )
  }

  const navigateToSelectAccount = (idAccount: number) => {
    navigate(
      `/${Routes.adminPages}/${Routes.customers}/${Routes.view}/${idAccount}/${Routes.summary}`,
    )
  }

  const navigateToEditOffer = (idOffer: number) => {
    navigate(
      `/${Routes.adminPages}/${Routes.sales}/${Routes.edit}/${Routes.offer}/${idOffer}`,
    )
  }

  const navigateToAddOffer = () => {
    navigate(
      `/${Routes.adminPages}/${Routes.sales}/${Routes.new}/${Routes.offer}`,
    )
  }

  const changeSort = useCallback(
    (sortNameItem: string, sortTypeItem: number) => {
      updateSort(sortNameItem, sortTypeItem)
    },
    [],
  )

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
    document.title = 'infiniti | Offers'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {offersData ? (
          <RecentCard
            title={`Total: ${offersData.meta.total}`}
            style={styles.recentFullScreen}
            HeaderComponent={SearchAndButtons}
            PagesComponent={
              offersData.data.length > 0 ? PagesList : undefined
            }
            Component={
              offersData.access.create === 1 ? ButtonBlue : undefined
            }
            componentProps={
              offersData.access.create === 1
                ? {
                  titleNone: true,
                  title: 'Add Offer',
                  icon: '/icons/plus.svg',
                  onClick: navigateToAddOffer,
                  style: styles.buttonAddNewOffer,
                }
                : undefined
            }
            headerProps={{
              searchValue: search,
              searchChange: updateSearch,
              rightButtons: downloadFile,
            }}
            pagesProps={
              offersData.data.length > 0
                ? {
                  meta: offersData.meta,
                  nextPage: updatePage,
                  size: 'sm',
                }
                : undefined
            }
          >
            <RecentOffers
              access={offersData.access}
              offersList={offersData.data}
              changeSortName={changeSort}
              navigateToViewOffer={navigateToViewOffer}
              navigateToSelectAccount={navigateToSelectAccount}
              navigateToEditOffer={navigateToEditOffer}
              deleteOffer={deleteSelectedOffer}
            />
          </RecentCard>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
    </div>
  )
}
