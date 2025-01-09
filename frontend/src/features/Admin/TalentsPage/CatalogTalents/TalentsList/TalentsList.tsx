import { FC, memo, useCallback, useEffect, useState } from 'react'

import {
  FiltersState,
  page,
  PagesMetaData,
  TalentData,
  userTalentsPageString,
} from '../../../../../app/constants/constants'
import { ButtonBrand } from '../../../../../shared/ui/ButtonBrand/ButtonBrand'
import { useCustomToast } from '../../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { deleteSelectedTalent } from '../../../../../shared/utils/api/Admin/Talents/DeleteTalent'
import { getUsersListInfo } from '../../../../../shared/utils/api/Client/Catalog/User/GetUsersListInfo'
import { getSession } from '../../../../../shared/utils/Saving/Session/GetSession'
import { saveSession } from '../../../../../shared/utils/Saving/Session/SaveSession'
import { TalentsCard } from '../../../../../widgets/TalentsCard/TalentsCard'
import { PagesList } from '../../../../Client/CatalogPage/TalentsList/PagesList/PagesList'
import { SortList } from '../../../../Client/CatalogPage/TalentsList/SortList/SortList'
import styles from './TalentsList.module.scss'

const SortListMemoized = memo(SortList)
const ButtonBrandMemoized = memo(ButtonBrand)

interface TalentsListProps {
  sort: {
    sort: { name: string; type: string }
  }
  setSort: React.Dispatch<
  React.SetStateAction<{ sort: { name: string; type: string } }>
  >
  selectedFilters: FiltersState
}

export const TalentsList: FC<TalentsListProps> = ({
  sort,
  setSort,
  selectedFilters,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(
    getSession(userTalentsPageString),
  )
  const [talentsList, setTalentsList] = useState<{
    data: TalentData[]
    meta: PagesMetaData
  } | null>(null)

  const showToast = useCustomToast()

  const nextPage = useCallback((id: number) => {
    saveSession(userTalentsPageString, id)

    setCurrentPage(id)
  }, [])

  const scrollToTop = useCallback(() => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 0)
  }, [])

  const getInfo = useCallback(async () => {
    const talentsData = await getUsersListInfo(
      page + String(currentPage),
      selectedFilters,
      sort,
    )

    if (currentPage > talentsData.meta.last_page) {
      setCurrentPage(1)
    }

    setTalentsList(talentsData)
  }, [currentPage, selectedFilters, sort])

  const deleteTalent = async (idTalent: number) => {
    const deleteResponse = await deleteSelectedTalent(idTalent)

    if (deleteResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully removed the Talent',
        status: 'success',
      })
      getInfo()
    } else {
      showToast({
        title: 'Error',
        description: deleteResponse.message,
        status: 'error',
      })
    }
  }

  useEffect(() => {
    getInfo()
  }, [currentPage, selectedFilters, sort, getInfo])

  if (!talentsList) {
    return (
      <div className={styles.wrapper}>
        <LoadingSpinner size='xl' />
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.items}>
        <div className={styles.header}>
          <div className={styles.title}>
            <h3 className={styles.name}>Talents</h3>
            <h3 className={styles.number}>{talentsList.meta.total}</h3>
          </div>
          <SortListMemoized setSort={setSort} sort={sort} />
        </div>
        <div className={styles.list}>
          {talentsList.data.length > 0 ? (
            <>
              <div className={styles.talentsList}>
                {talentsList.data.map(talent => {
                  return (
                    <TalentsCard
                      key={talent.id}
                      isAdmin
                      talent={talent}
                      addTalentInCart={getInfo}
                      deleteTalent={deleteTalent}
                    />
                  )
                })}
              </div>
              <PagesList meta={talentsList.meta} nextPage={nextPage} />
            </>
          ) : (
            <div className={styles.nothingFound}>
              <span className={styles.nothingFoundText}>
                Nothing Found
              </span>
            </div>
          )}
          <div
            className={
              talentsList.data.length > 0
                ? styles.buttonBackToTopActive
                : styles.buttonBackToTopInactive
            }
          >
            <ButtonBrandMemoized
              title='Back to top'
              onClick={scrollToTop}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
