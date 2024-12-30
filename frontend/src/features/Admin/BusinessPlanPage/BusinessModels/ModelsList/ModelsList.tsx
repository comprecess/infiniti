import { FC, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  BusinessPlanBusinessModelData,
  FiltersState,
  page,
  PagesMetaData,
} from '../../../../../app/constants/constants'
import { Routes } from '../../../../../app/router/routes'
import { ButtonBrand } from '../../../../../shared/ui/ButtonBrand/ButtonBrand'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { postBusinessModelList } from '../../../../../shared/utils/api/Admin/BusinessPlan/BusinessModel/PostBusinessModelList'
import { BusinessModelCard } from '../../../../../widgets/BusinessModelCard/BusinessModelCard'
import { PagesList } from '../../../../Client/CatalogPage/TalentsList/PagesList/PagesList'
import styles from './ModelsList.module.scss'

interface ModelsListProps {
  isAdmin: boolean
  selectedFilters: FiltersState
}

export const ModelsList: FC<ModelsListProps> = ({
  isAdmin,
  selectedFilters,
}) => {
  const [modelsList, setModelsList] = useState<{
    data: BusinessPlanBusinessModelData[]
    meta: PagesMetaData
  } | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)

  const [modelsOpen, setModelsOpen] = useState<boolean[]>([])

  const navigate = useNavigate()

  const getModels = async () => {
    const response = await postBusinessModelList(
      page + String(currentPage),
      selectedFilters,
    )

    if (currentPage > response.meta.last_page) {
      setCurrentPage(1)
    }

    setModelsList(response)
    setModelsOpen(Array(response.meta.total).fill(false))
  }

  const handleNavigateToViewBusinessModel = (id: number) => {
    if (isAdmin) {
      navigate(
        `/${Routes.adminPages}/${Routes.businessPlan}/${Routes.view}/${Routes.businessModel}/${id}`,
      )
    } else {
      navigate(
        `/${Routes.clientPages}/${Routes.businessModels}/${Routes.businessModel}/${Routes.view}/${id}`,
      )
    }
  }

  const handleModelOpenClose = (index: number) => {
    setModelsOpen(prevModelsOpen => {
      const newModelsOpen = prevModelsOpen.map((_, i) =>
        i === index ? !prevModelsOpen[index] : false,
      )

      return newModelsOpen
    })
  }

  const nextPage = useCallback((id: number) => {
    setCurrentPage(id)
  }, [])

  const scrollToTop = useCallback(() => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 0)
  }, [])

  useEffect(() => {
    getModels()
  }, [currentPage, selectedFilters])

  if (!modelsList) {
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
            <h3 className={styles.name}>Models</h3>
            <h3 className={styles.number}>{modelsList.meta.total}</h3>
          </div>
          -SortList-
        </div>
        <div className={styles.list}>
          {modelsList.data.length > 0 ? (
            <>
              <div className={styles.modelsList}>
                {modelsList.data.map((model, index) => {
                  return (
                    <BusinessModelCard
                      key={model.id}
                      id={model.id}
                      isAdmin={isAdmin}
                      title={model.title}
                      description={model.description}
                      price={model.price}
                      image={model.preview}
                      industries={model.industries}
                      technologies={model.technologies}
                      location={model.location}
                      profitability={model.profitability[0].value}
                      isOpen={modelsOpen[index]}
                      onMobileCLick={() => handleModelOpenClose(index)}
                      onNavigate={handleNavigateToViewBusinessModel}
                    />
                  )
                })}
              </div>
              <PagesList meta={modelsList.meta} nextPage={nextPage} />
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
              modelsList.data.length > 0
                ? styles.buttonBackToTopActive
                : styles.buttonBackToTopInactive
            }
          >
            <ButtonBrand title='Back to top' onClick={scrollToTop} />
          </div>
        </div>
      </div>
    </div>
  )
}
