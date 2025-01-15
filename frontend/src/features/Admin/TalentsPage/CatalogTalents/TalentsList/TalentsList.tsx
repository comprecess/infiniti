import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'

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

interface TalentsListProps {
  sort: { name: string; type: string }
  setSort: Dispatch<SetStateAction<{ name: string; type: string }>>
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

  const { t } = useTranslation()

  const showToast = useCustomToast()

  const handlePageChange = useCallback((page: number) => {
    saveSession(userTalentsPageString, page)
    setCurrentPage(page)
  }, [])

  const fetchTalents = useCallback(async () => {
    try {
      const response = await getUsersListInfo(
        page + String(currentPage),
        selectedFilters,
        sort,
      )

      setTalentsList(response)

      if (currentPage > response.meta.last_page) {
        setCurrentPage(1)
      }
    } catch (error) {
      /* empty */
    }
  }, [currentPage, selectedFilters, sort])

  const deleteTalent = useCallback(
    async (idTalent: number) => {
      const deleteResponse = await deleteSelectedTalent(idTalent)

      if (deleteResponse.status) {
        showToast({
          title: 'Successfully',
          description: 'You have successfully removed the Talent',
          status: 'success',
        })
        fetchTalents()
      } else {
        showToast({
          title: 'Error',
          description: deleteResponse.message,
          status: 'error',
        })
      }
    },
    [fetchTalents, showToast],
  )

  useEffect(() => {
    fetchTalents()
  }, [fetchTalents])

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
            <h3 className={styles.name}>
              {t('admin-catalog-talents-page-text-4')}
            </h3>
            <h3 className={styles.number}>{talentsList.meta.total}</h3>
          </div>
          <SortList setSort={setSort} sort={sort} />
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
                      addTalentInCart={fetchTalents}
                      deleteTalent={deleteTalent}
                    />
                  )
                })}
              </div>
              <PagesList
                meta={talentsList.meta}
                nextPage={handlePageChange}
              />
            </>
          ) : (
            <div className={styles.nothingFound}>
              <span className={styles.nothingFoundText}>
                {t('admin-catalog-talents-page-text-6')}
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
            <ButtonBrand
              title={t('admin-catalog-talents-page-button-1')}
              onClick={() =>
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}
