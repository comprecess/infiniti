import { useCallback } from 'react'

import { ButtonBrand } from '../../../../../shared/ui/ButtonBrand/ButtonBrand'
import { BusinessModelCard } from '../../../../../widgets/BusinessModelCard/BusinessModelCard'
import styles from './ModelsList.module.scss'

export const ModelsList = () => {
  const scrollToTop = useCallback(() => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 0)
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
            />
            <BusinessModelCard
              title='Финтех платформа для малого и среднего бизнеса'
              image='/test_2.jpg'
              profitability='high'
            />
            <BusinessModelCard
              title='Перспективные бизнес модели для корпоративного роста и инноваций'
              image='/test_4.png'
              profitability='veryHigh'
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
