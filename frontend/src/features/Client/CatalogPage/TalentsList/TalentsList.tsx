import { Dispatch, SetStateAction, useCallback } from 'react'

import {
  PagesMetaData,
  TalentData,
} from '../../../../app/constants/constants'
import { ButtonBrand } from '../../../../shared/ui/ButtonBrand/ButtonBrand'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { TalentsCard } from '../../../../widgets/TalentsCard/TalentsCard'
import { PagesList } from './PagesList/PagesList'
import { SortList } from './SortList/SortList'
import styles from './TalentsList.module.scss'

interface TalentsListProps {
  talentsList:
  | {
    data: TalentData[]
    meta: PagesMetaData
  }
  | undefined
  sort: { name: string; type: string }
  setCurrentPage: Dispatch<SetStateAction<number>>
  setSort: Dispatch<SetStateAction<{ name: string; type: string }>>
}

export const TalentsList = ({
  talentsList,
  sort,
  setCurrentPage,
  setSort,
}: TalentsListProps) => {
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)

    const element = document.getElementById('talents')

    if (element) {
      const offset = 100
      const top =
        window.pageYOffset + element.getBoundingClientRect().top - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }, [])

  return (
    <section id='talents' className={styles.wrapper}>
      <div className={styles.items}>
        <div className={styles.header}>
          <div className={styles.title}>
            {talentsList && (
              <>
                <h3 className={styles.name}>Talents</h3>
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
                  {talentsList.data?.map(talent => {
                    return <TalentsCard key={talent.id} talent={talent} />
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
              <ButtonBrand
                title='Back to top'
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
    </section>
  )
}
