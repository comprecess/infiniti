import saveAs from 'file-saver'
import { FC, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  PagesMetaData,
  RolesAccess,
  TalentsData,
} from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import { SearchAndButtons } from '../../../../features/Admin/CustomersPage/CompaniesPage/RecentCompanies/SearchAndButtons/SearchAndButtons'
import { RecentTalents } from '../../../../features/Admin/TalentsPage/ListTalentsPage/RecentTalents/RecentTalents'
import { PagesList } from '../../../../features/Client/CatalogPage/TalentsList/PagesList/PagesList'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getDocumentFileTalents } from '../../../../shared/utils/api/Admin/Talents/GetDocumentFileTalents'
import { getTalentsList } from '../../../../shared/utils/api/Admin/Talents/GetTalentsList'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './ListTalentsPage.module.scss'

export const AdminListTalentsPage: FC = () => {
  const [page, setPage] = useState<number>(1)
  const [search, setSearch] = useState<string>('')
  const [sortName, setSortName] = useState<string>('id')
  const [sortType, setSortType] = useState<number>(1)
  const [options, setOptions] = useState<string>('')

  const [talents, setTalents] = useState<{
    data: TalentsData[]
    meta: PagesMetaData
  } | null>(null)

  const [access, setAccess] = useState<RolesAccess | null>(null)

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

  const documentOnChange = useCallback(
    async (documentItem: string) => {
      // eslint-disable-next-line max-len
      const urlOptions = `?page=${page}&filter[search]=${search}&sort[name]=${sortName}&sort[type]=${sortType}&document=${documentItem}`

      const downloadInitiated = await getDocumentFileTalents(urlOptions)

      if (downloadInitiated instanceof Blob) {
        const contentType = downloadInitiated.type

        if (contentType === 'application/pdf') {
          saveAs(downloadInitiated, 'Talents-Infiniti.pdf')
        } else if (
          contentType ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ) {
          saveAs(downloadInitiated, 'Talents-Infiniti.xlsx')
        } else if (contentType === 'text/plain') {
          saveAs(downloadInitiated, 'Talents-Infiniti.csv')
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

  const searchOnChange = useCallback((searchItem: string) => {
    setSearch(searchItem)
  }, [])

  const pageOnChange = useCallback((pageItem: number) => {
    setPage(pageItem)
  }, [])

  const getTalents = async () => {
    if (!options) return

    const getResponse: {
      access: RolesAccess
      data: TalentsData[]
      meta: PagesMetaData
    } = await getTalentsList(options)

    if (page > getResponse.meta.last_page) {
      setPage(1)
    }

    setAccess(getResponse.access)
    setTalents({ data: getResponse.data, meta: getResponse.meta })
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const deleteTalent = async (_idTalent: number) => {}

  const navigateToCustomer = (name: string, idTalent: number) => {
    navigate(
      `/${Routes.adminPages}/${Routes.customers}/${Routes.view}/${idTalent}/${name}`,
    )
  }

  const navigateEditTalent = (idTalent: number) => {
    navigate(
      `/${Routes.adminPages}/${Routes.talents}/${Routes.edit}/${Routes.talent}/${idTalent}`,
    )
  }

  const navigateToAddTalent = () => {
    navigate(
      `/${Routes.adminPages}/${Routes.talents}/${Routes.add}/${Routes.talent}`,
    )
  }

  useEffect(() => {
    document.title = 'infiniti | List Talents'
  }, [])

  useEffect(() => {
    changeURL(page, search, sortName, sortType)
  }, [page, search, sortName, sortType])

  useEffect(() => {
    getTalents()
  }, [options])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {talents && access ? (
          <RecentCard
            title='List Talents'
            style={styles.recentFullScreen}
            HeaderComponent={SearchAndButtons}
            Component={access.create ? ButtonBlue : undefined}
            PagesComponent={PagesList}
            componentProps={
              access.create
                ? {
                  title: 'Add Talent',
                  icon: '/icons/plus.svg',
                  titleNone: true,
                  style: styles.buttonPlus,
                  iconProps: styles.iconPlus,
                  onClick: navigateToAddTalent,
                }
                : undefined
            }
            headerProps={{
              searchChange: searchOnChange,
              rightButtons: documentOnChange,
            }}
            pagesProps={{
              meta: talents.meta,
              nextPage: pageOnChange,
              size: 'sm',
            }}
          >
            <RecentTalents
              access={access}
              talentsList={talents.data}
              changeSortName={changeSort}
              navigateToCustomer={navigateToCustomer}
              navigateEditTalent={navigateEditTalent}
              deleteClient={deleteTalent}
            />
          </RecentCard>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
    </div>
  )
}
