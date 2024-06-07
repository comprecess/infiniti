import { FC, memo, useCallback, useState } from 'react'

import { TalentsListData } from '../../../../app/data/client/talentsList'
import { ButtonBrand } from '../../../../shared/ui/ButtonBrand/ButtonBrand'
import { TalentsCard } from '../../../../widgets/TalentsCard/TalentsCard'
import { PagesList } from './PagesList/PagesList'
import { SortList } from './SortList/SortList'
import styles from './TalentsList.module.scss'

const SortListMemoized = memo(SortList)
const ButtonBrandMemoized = memo(ButtonBrand)

export const TalentsList: FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const productsPerPage = 6

  const totalProducts = TalentsListData.length
  const totalPages = Math.ceil(totalProducts / productsPerPage)

  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = TalentsListData.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  )

  const nextPage = useCallback(() => {
    setCurrentPage(prevPage => prevPage + 1)
  }, [])

  const prevPage = useCallback(() => {
    setCurrentPage(prevPage => prevPage - 1)
  }, [])

  const handlePageChange = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber)
  }, [])

  const scrollToTop = useCallback(() => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 0)
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.title}>
          <h3 className={styles.name}>Talents</h3>
          <h3 className={styles.number}>{TalentsListData.length}</h3>
        </div>
        <SortListMemoized />
      </div>
      <div className={styles.list}>
        <div className={styles.talentsList}>
          {currentProducts.map(talent => {
            return <TalentsCard key={talent.id} talentInfo={talent} />
          })}
        </div>
        <PagesList
          currentPage={currentPage}
          totalPages={totalPages}
          leftButtonDisabled={currentPage === 1}
          leftButtonOnClick={prevPage}
          rightButtonOnClick={nextPage}
          rightButtonDisabled={
            indexOfLastProduct >= TalentsListData.length
          }
          onPageChange={handlePageChange}
        />
        <ButtonBrandMemoized title='Back to top' onClick={scrollToTop} />
      </div>
    </div>
  )
}
