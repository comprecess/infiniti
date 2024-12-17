import { useCallback, useEffect, useState } from 'react'

import { ButtonBrand } from '../../../../../shared/ui/ButtonBrand/ButtonBrand'
import { BusinessModelCard } from '../../../../../widgets/BusinessModelCard/BusinessModelCard'
import styles from './ModelsList.module.scss'

export const ModelsList = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [modelsOpen, setModelsOpen] = useState<boolean[]>([
    false,
    false,
    false,
  ])

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
            />
            <BusinessModelCard
              title='Финтех платформа для малого и среднего бизнеса'
              image='/test_2.jpg'
              profitability='high'
              isMobile={isMobile}
              isMobileOpen={modelsOpen[1]}
              onMobileCLick={() => handleModelOpenClose(1)}
            />
            <BusinessModelCard
              title='Перспективные бизнес модели для корпоративного роста и инноваций'
              image='/test_4.png'
              profitability='veryHigh'
              isMobile={isMobile}
              isMobileOpen={modelsOpen[2]}
              onMobileCLick={() => handleModelOpenClose(2)}
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
