import saveAs from 'file-saver'
import { FC, useCallback, useEffect, useState } from 'react'

import { PagesMetaData } from '../../../../app/constants/constants'
import { RecentOffers } from '../../../../features/Admin/Sales/OffersPage/RecentOffers/RecentOffers'
import { SearchAndButtons } from '../../../../features/Admin/Sales/OffersPage/SearchAndButtons/SearchAndButtons'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getDocumentsOffers } from '../../../../shared/utils/api/Admin/Sales/Offers/GetDocumentsOffers'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './OffersPage.module.scss'

export const AdminOffersPage: FC = () => {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [page, setPage] = useState<number>(1)
  const [search, setSearch] = useState<string>('')
  const [sortName, _setSortName] = useState<string>('id')
  const [sortType, _setSortType] = useState<number>(1)
  const [_options, _setOptions] = useState<string>('')

  const [offers, _setOffers] = useState<{
    data: []
    meta: PagesMetaData
  } | null>(null)

  const showToast = useCustomToast()

  /* const changeURL = (
    pageItem: number,
    searchItem: string,
    sortNameItem: string,
    sortTypeItem: number,
    filterStatusItem: string,
  ) => {
    // eslint-disable-next-line max-len
    const urlOptions = `?page=${pageItem}&filter[search]=${searchItem}&filter[status]=${filterStatusItem}&sort[name]=${sortNameItem}&sort[type]=${sortTypeItem}&document=json`

    setOptions(urlOptions)
  } */

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

  useEffect(() => {
    document.title = 'infiniti | Offers'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {!offers ? (
          <RecentCard
            title={`---Total:---`}
            style={styles.recentFullScreen}
            HeaderComponent={SearchAndButtons}
            // PagesComponent={PagesList}
            headerProps={{
              searchChange: searchOnChange,
              rightButtons: documentOnChange,
            }}
            pagesProps={{
              // meta: offers.meta,
              nextPage: pageOnChange,
              size: 'sm',
            }}
          >
            <RecentOffers
              offersList={[]}
              changeSortName={function (
                _sortNameItem: string,
                _sortTypeItem: number,
              ): void {
                throw new Error('Function not implemented.')
              }}
            />
          </RecentCard>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
    </div>
  )
}
