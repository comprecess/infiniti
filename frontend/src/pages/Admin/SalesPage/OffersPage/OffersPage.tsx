import saveAs from 'file-saver'
import { FC, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './OffersPage.module.scss'

export const AdminOffersPage: FC = () => {
  const [offers, setOffers] = useState<{
    data: SalesOffersListData[]
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

  const getListOffer = async () => {
    if (!options) return

    const getResponse: {
      access: RolesAccess
      data: SalesOffersListData[]
      meta: PagesMetaData
    } = await getListOffers(options)

    if (page > getResponse.meta.last_page) {
      setPage(1)
    }

    setAccess(getResponse.access)
    setOffers(getResponse)
  }

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

  const searchOnChange = useCallback((searchItem: string) => {
    setSearch(searchItem)
  }, [])

  const pageOnChange = useCallback((pageItem: number) => {
    setPage(pageItem)
  }, [])

  const documentOnChange = useCallback(
    async (documentItem: string) => {
      // eslint-disable-next-line max-len
      const urlOptions = `?page=${page}&filter[search]=${search}&sort[name]=${sortName}&sort[type]=${sortType}&document=${documentItem}`

      const downloadInitiated = await getDocumentsOffers(urlOptions)

      if (downloadInitiated instanceof Blob) {
        const contentType = downloadInitiated.type

        if (contentType === 'application/pdf') {
          saveAs(downloadInitiated, 'Offers-Infiniti.pdf')
        } else if (
          contentType ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ) {
          saveAs(downloadInitiated, 'Offers-Infiniti.xlsx')
        } else if (contentType === 'text/plain') {
          saveAs(downloadInitiated, 'Offers-Infiniti.csv')
        } else if (contentType === 'text/html') {
          const htmlText = await downloadInitiated.text()
          await navigator.clipboard.writeText(htmlText)
          showToast({
            title: 'Successfully',
            description:
              'You have successfully copied information to the clipboard',
            status: 'success',
          })
        }
      }
    },
    [page, search, sortName, sortType],
  )

  const deleteSelectedOffer = async (idOffer: number) => {
    const deleteResponse = await deleteOffer(idOffer)

    if (deleteResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully deleted Invoice',
        status: 'success',
      })
      getListOffer()
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

  useEffect(() => {
    document.title = 'infiniti | Offers'
  }, [])

  useEffect(() => {
    changeURL(page, search, sortName, sortType)
  }, [page, search, sortName, sortType])

  useEffect(() => {
    getListOffer()
  }, [options])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {offers && access ? (
          <RecentCard
            title={`Total: ${offers.meta.total}`}
            style={styles.recentFullScreen}
            Component={access.create ? ButtonBlue : undefined}
            HeaderComponent={SearchAndButtons}
            PagesComponent={PagesList}
            componentProps={
              access.create
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
              searchChange: searchOnChange,
              rightButtons: documentOnChange,
            }}
            pagesProps={{
              meta: offers.meta,
              nextPage: pageOnChange,
              size: 'sm',
            }}
          >
            <RecentOffers
              offersList={offers.data}
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
