import { Dispatch, SetStateAction, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import {
  PagesMetaData,
  TalentData,
  userTalentsPageString,
} from '../../../../../app/constants/constants'
import { ButtonBrand } from '../../../../../shared/ui/ButtonBrand/ButtonBrand'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { saveSession } from '../../../../../shared/utils/Saving/Session/SaveSession'
import { TalentsCard } from '../../../../../widgets/TalentsCard/TalentsCard'
import { PagesList } from '../../../../Client/CatalogPage/TalentsList/PagesList/PagesList'
import { SortList } from '../../../../Client/CatalogPage/TalentsList/SortList/SortList'
import styles from './TalentsList.module.scss'

interface TalentsListProps {
  talentsList:
  | {
    data: TalentData[]
    meta: PagesMetaData
  }
  | undefined
  sort: { name: string; type: string }
  setSort: Dispatch<SetStateAction<{ name: string; type: string }>>
  setCurrentPage: Dispatch<SetStateAction<number>>
  deleteTalent: (id: number) => void
  fetchTalents: () => void
}

export const TalentsList = ({
  talentsList,
  sort,
  setSort,
  setCurrentPage,
  deleteTalent,
  fetchTalents,
}: TalentsListProps) => {
  const { t } = useTranslation()

  const handlePageChange = useCallback((page: number) => {
    saveSession(userTalentsPageString, page)
    setCurrentPage(page)
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.items}>
        <div className={styles.header}>
          <div className={styles.title}>
            {talentsList && (
              <>
                <h3 className={styles.name}>
                  {t('admin-catalog-talents-page-text-4')}
                </h3>
                <h3 className={styles.number}>{talentsList.meta.total}</h3>
              </>
            )}
          </div>
          <SortList setSort={setSort} sort={sort} />
        </div>
        {talentsList ? (
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
        ) : (
          <div className={styles.loading}>
            <LoadingSpinner size='xl' />
          </div>
        )}
      </div>
    </div>
  )
}
