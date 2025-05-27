import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'

import {
  AccountingAssetsData,
  AccountingAssetsInputData,
} from '../../../../app/constants/constants'
import { Assets } from '../../../../features/Admin/AccountingPage/AssetsPage/Assets/Assets'
import { AssetsTable } from '../../../../features/Admin/AccountingPage/AssetsPage/AssetsTable/AssetsTable'
import { SearchAndButtons } from '../../../../features/Admin/Sales/OffersPage/SearchAndButtons/SearchAndButtons'
import { PagesList } from '../../../../features/Client/CatalogPage/TalentsList/PagesList/PagesList'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { deleteAsset } from '../../../../shared/utils/api/Admin/Accounting/DeleteAsset'
import { deleteCategory } from '../../../../shared/utils/api/Admin/Accounting/DeleteCategory'
import { getAssetsDocuments } from '../../../../shared/utils/api/Admin/Accounting/GetAssetsDocuments'
import { getAssetsInputData } from '../../../../shared/utils/api/Admin/Accounting/GetAssetsInputData'
import { getAssetsList } from '../../../../shared/utils/api/Admin/Accounting/GetAssetsList'
import { postAddNewAssetsCategory } from '../../../../shared/utils/api/Admin/Accounting/PostAddNewAssetsCategory'
import { downloadDocument } from '../../../../shared/utils/usefulMethods'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './AssetsPage.module.scss'

export const AdminAssetsPage = () => {
  const [inputData, setInputData] =
    useState<AccountingAssetsInputData | null>()

  const [page, setPage] = useState<number>(1)
  const [search, setSearch] = useState<string>('')
  const [sortName, setSortName] = useState<string>('name')
  const [sortType, setSortType] = useState<number>(0)
  const [filterCategory, setFilterCategory] = useState<string>('')

  const queryClient = useQueryClient()
  const showToast = useCustomToast()

  const handleChangeFilterCategory = (filter: string | number) => {
    if (filter === 'all') {
      setFilterCategory('')
    } else {
      setFilterCategory(`&filter[category]=${filter}`)
      setPage(1)
      setSearch('')
    }
  }

  const getInputData = async () => {
    const response: AccountingAssetsInputData = await getAssetsInputData()

    setInputData(response)
  }

  const { data: assets } = useQuery({
    queryKey: [
      'assetsList',
      search,
      page,
      filterCategory,
      sortName,
      sortType,
    ],
    queryFn: async () => {
      let query = `?page=${page}&sort[name]=${sortName}&sort[type]=${sortType}`

      if (filterCategory !== '') {
        query += `&${filterCategory}`
      }

      if (search !== '') {
        query += `&filter[search]=${search}`
      }

      const response: AccountingAssetsData = await getAssetsList(query)

      return response
    },
    placeholderData: previousData => previousData,
  })

  const handleAddNewCategory = async (name: string) => {
    const { status, message } = await postAddNewAssetsCategory(name)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully added a Category',
        status: 'success',
      })
      getInputData()
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  const handleDeleteCategory = async (id: number) => {
    const { status, message } = await deleteCategory(id)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully deleted the Asset',
        status: 'success',
      })
      getInputData()
      handleChangeFilterCategory('all')
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  const handleDeleteSelectedAsset = async (id: number) => {
    const { status, message } = await deleteAsset(id)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully deleted the Asset',
        status: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['assetsList'] })
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  const downloadFile = useCallback(
    async (documentItem: string) => {
      let query = `?page=${page}&sort[name]=${sortName}&sort[type]=${sortType}&document=${documentItem}`

      if (filterCategory !== '') {
        query += `&${filterCategory}`
      }

      if (search !== '') {
        query += `&filter[search]=${search}`
      }

      const downloadInitiated = await getAssetsDocuments(query)

      const { status } = await downloadDocument(
        downloadInitiated,
        'Assets',
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

  const changeSort = useCallback(
    (sortNameItem: string, sortTypeItem: number) => {
      setSortName(sortNameItem)
      setSortType(sortTypeItem)
    },
    [],
  )

  useEffect(() => {
    document.title = 'infiniti | Assets'

    getInputData()
  }, [])

  return (
    <div className={styles.wrapper}>
      {inputData && assets ? (
        <section className={styles.section}>
          <RecentCard style={styles.cardFirst} title='Assets'>
            <Assets
              categories={inputData.category}
              filterCategory={filterCategory}
              handleChangeFilterCategory={handleChangeFilterCategory}
              handleAddNewCategory={handleAddNewCategory}
              handleDeleteCategory={handleDeleteCategory}
            />
          </RecentCard>
          <RecentCard
            style={styles.cardSecond}
            title={`Total: ${assets.total}`}
            HeaderComponent={SearchAndButtons}
            PagesComponent={assets ? PagesList : undefined}
            headerProps={{
              searchChange: setSearch,
              searchValue: search,
              rightButtons: downloadFile,
            }}
            pagesProps={
              assets
                ? {
                  meta: assets?.meta,
                  nextPage: setPage,
                  size: 'sm',
                }
                : undefined
            }
          >
            <AssetsTable
              assets={assets.data}
              deleteAsset={handleDeleteSelectedAsset}
              changeSort={changeSort}
            />
          </RecentCard>
        </section>
      ) : (
        <div className={styles.loading}>
          <LoadingSpinner size='xl' />
        </div>
      )}
    </div>
  )
}
