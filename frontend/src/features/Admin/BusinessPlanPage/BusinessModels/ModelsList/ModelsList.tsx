import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './ModelsList.module.scss'
import {
  BusinessPlanBusinessModelData,
  PagesMetaData,
  RolesAccess,
} from '../../../../../app/constants/constants'
import { Routes } from '../../../../../app/router/routes'
import { ButtonBrand } from '../../../../../shared/ui/ButtonBrand/ButtonBrand'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getBusinessPlanSurvey } from '../../../../../shared/utils/api/Client/BusinessPlan/get-business-plan-survey'
import { BusinessModelCard } from '../../../../../widgets/BusinessModelCard/BusinessModelCard'
import { PagesList } from '../../../../Client/CatalogPage/TalentsList/PagesList/PagesList'
import { Block } from '../../../../General/Survey/types'

interface ModelsListProps {
  isAdmin: boolean
  modelsList:
  | {
    access?: RolesAccess
    data: BusinessPlanBusinessModelData[]
    meta: PagesMetaData
  }
  | undefined
  setCurrentPage: Dispatch<SetStateAction<number>>
  deleteBusinessModel?: (id: number) => void
}

export const ModelsList = ({
  isAdmin,
  modelsList,
  setCurrentPage,
  deleteBusinessModel,
}: ModelsListProps) => {
  const [survey, setSurvey] = useState<Block[] | null>(null)

  const [modelsOpen, setModelsOpen] = useState<boolean[]>([])

  const navigate = useNavigate()

  const getSurvey = async () => {
    if (!isAdmin) {
      const response = await getBusinessPlanSurvey()

      if (!response.status) return

      setSurvey(response.data.data)
    }
  }

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

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

  const handleNavigateToEditBusinessModel = (id: number) => {
    navigate(
      `/${Routes.adminPages}/${Routes.businessPlan}/${Routes.edit}/${Routes.businessModel}/${id}`,
    )
  }

  const handleModelOpenClose = (index: number) => {
    setModelsOpen(prevModelsOpen => {
      const newModelsOpen = prevModelsOpen.map((_, i) =>
        i === index ? !prevModelsOpen[index] : false,
      )

      return newModelsOpen
    })
  }

  useEffect(() => {
    if (modelsList) setModelsOpen(Array(modelsList.meta.total).fill(false))
  }, [modelsList])

  useEffect(() => {
    getSurvey()
  }, [])

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
            {modelsList && (
              <>
                <h3 className={styles.name}>Models</h3>
                <h3 className={styles.number}>{modelsList.meta.total}</h3>
              </>
            )}
          </div>
        </div>
        {modelsList ? (
          <div className={styles.list}>
            {modelsList.data.length > 0 ? (
              <>
                <div className={styles.modelsList}>
                  {modelsList.data.map((model, index) => {
                    return (
                      <BusinessModelCard
                        key={model.id}
                        survey={survey}
                        id={model.id}
                        isAdmin={isAdmin}
                        title={model.title}
                        description={model.description}
                        price={model.price}
                        image={model.preview}
                        industries={model.industries}
                        technologies={model.technologies}
                        location={model.location}
                        token={model.publicToken}
                        profitability={model.profitability[0].value}
                        isOpen={modelsOpen[index]}
                        access={modelsList.access}
                        onMobileCLick={() => handleModelOpenClose(index)}
                        onNavigate={handleNavigateToViewBusinessModel}
                        onEdit={handleNavigateToEditBusinessModel}
                        onDelete={deleteBusinessModel ? deleteBusinessModel : () => {}}
                      />
                    )
                  })}
                </div>
                <PagesList meta={modelsList.meta} nextPage={handlePageChange} />
              </>
            ) : (
              <div className={styles.nothingFound}>
                <span className={styles.nothingFoundText}>Nothing Found</span>
              </div>
            )}
            <div
              className={
                modelsList.data.length > 0
                  ? styles.buttonBackToTopActive
                  : styles.buttonBackToTopInactive
              }
            >
              <ButtonBrand
                title='Back to top'
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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
