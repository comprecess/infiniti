import { FC, memo, useCallback, useEffect, useState } from 'react'

import {
  UserInfo,
  UserPropertiesProps,
} from '../../../../app/constants/constants'
import { ButtonBrand } from '../../../../shared/ui/ButtonBrand/ButtonBrand'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getUsersInfo } from '../../../../shared/utils/api/Catalog/User/GetUsersInfo'
import { TalentsCard } from '../../../../widgets/TalentsCard/TalentsCard'
import { PagesList } from './PagesList/PagesList'
import { SortList } from './SortList/SortList'
import styles from './TalentsList.module.scss'

const SortListMemoized = memo(SortList)
const ButtonBrandMemoized = memo(ButtonBrand)

interface TalentsData {
  id: number
  properties: UserPropertiesProps[]
  user: UserInfo
}

export const TalentsList: FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [talentsList, setTalentsList] = useState<{ data: TalentsData[] }>({
    data: [],
  })
  const productsPerPage = 6

  const totalProducts = talentsList.data.length
  const totalPages = Math.ceil(totalProducts / productsPerPage)

  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = talentsList.data.slice(
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

  const getInfo = useCallback(async () => {
    const talentsData = await getUsersInfo()

    setTalentsList(talentsData)
  }, [])

  useEffect(() => {
    getInfo()
  }, [])

  useEffect(() => {
    if (talentsList.data.length > 0) {
      console.log('TalentsList.tsx', talentsList)
    }
  }, [talentsList])

  return (
    <div className={styles.wrapper}>
      {talentsList.data.length > 0 ? (
        <div className={styles.items}>
          <div className={styles.header}>
            <div className={styles.title}>
              <h3 className={styles.name}>Talents</h3>
              <h3 className={styles.number}>{talentsList.data.length}</h3>
            </div>
            <SortListMemoized />
          </div>
          <div className={styles.list}>
            <div className={styles.talentsList}>
              {currentProducts.map(talent => {
                return (
                  <TalentsCard
                    key={talent.id}
                    id={talent.id}
                    properties={talent.properties}
                    user={talent.user}
                  />
                )
              })}
            </div>
            <PagesList
              currentPage={currentPage}
              totalPages={totalPages}
              leftButtonDisabled={currentPage === 1}
              leftButtonOnClick={prevPage}
              rightButtonOnClick={nextPage}
              rightButtonDisabled={
                indexOfLastProduct >= talentsList.data.length
              }
              onPageChange={handlePageChange}
            />
            <ButtonBrandMemoized
              title='Back to top'
              onClick={scrollToTop}
            />
          </div>
        </div>
      ) : (
        <LoadingSpinner size='xl' />
      )}
    </div>
  )
}
