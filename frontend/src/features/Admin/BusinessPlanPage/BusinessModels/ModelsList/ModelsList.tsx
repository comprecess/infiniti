import { FC, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Routes } from '../../../../../app/router/routes'
import { ButtonBrand } from '../../../../../shared/ui/ButtonBrand/ButtonBrand'
import { BusinessModelCard } from '../../../../../widgets/BusinessModelCard/BusinessModelCard'
import styles from './ModelsList.module.scss'

interface ModelsListProps {
  isAdmin: boolean
}

export const ModelsList: FC<ModelsListProps> = ({ isAdmin }) => {
  const [isMobile, setIsMobile] = useState(false)
  const [modelsOpen, setModelsOpen] = useState<boolean[]>([
    false,
    false,
    false,
  ])

  const navigate = useNavigate()

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

  const scrollToTop = useCallback(() => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 0)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth <= 1700

      setIsMobile(isMobileView)
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.items}>
        <div className={styles.header}>
          <div className={styles.title}>
            <h3 className={styles.name}>Models</h3>
            <h3 className={styles.number}>-3-</h3>
          </div>
          -SortList-
        </div>
        <div className={styles.list}>
          <div className={styles.modelsList}>
            <BusinessModelCard
              title='Платформа для автоматизации выдачи займов'
              image='/test_1.jpg'
              profitability='average'
              isMobile={isMobile}
              isMobileOpen={modelsOpen[0]}
              onMobileCLick={() => handleModelOpenClose(0)}
              onNavigate={handleNavigateToViewBusinessModel}
            />
            <BusinessModelCard
              title='Финтех платформа для малого и среднего бизнеса'
              image='/test_2.jpg'
              profitability='high'
              isMobile={isMobile}
              isMobileOpen={modelsOpen[1]}
              onMobileCLick={() => handleModelOpenClose(1)}
              onNavigate={handleNavigateToViewBusinessModel}
            />
            <BusinessModelCard
              title='Перспективные бизнес модели для корпоративного роста и инноваций'
              image='/test_4.png'
              profitability='veryHigh'
              isMobile={isMobile}
              isMobileOpen={modelsOpen[2]}
              onMobileCLick={() => handleModelOpenClose(2)}
              onNavigate={handleNavigateToViewBusinessModel}
            />
          </div>
          <div
            className={
              [0, 0, 0].length > 0
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
