import { FC, useState } from 'react'

import { TalentsListData } from '../../../../app/data/client/talentsList'
import { ButtonBrand } from '../../../../shared/ui/ButtonBrand/ButtonBrand'
import { TalentsCard } from '../../../../widgets/TalentsCard/TalentsCard'
import { PagesList } from './PagesList/PagesList'
import { SortList } from './SortList/SortList'
import styles from './TalentsList.module.scss'

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

  const nextPage = () => {
    setCurrentPage(currentPage + 1)
  }

  const prevPage = () => {
    setCurrentPage(currentPage - 1)
  }

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.title}>
          <h3 className={styles.name}>Talents</h3>
          <h3 className={styles.number}>{TalentsListData.length}</h3>
        </div>
        <SortList />
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
        <ButtonBrand title='Back to top' onClick={scrollToTop} />
      </div>
    </div>
  )
}
