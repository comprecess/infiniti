import { FC } from 'react'

import { ValuesProps } from '../../app/constants/constants'
import { ButtonBlue } from '../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomMiniButton } from '../../shared/ui/CustomMiniButton/CustomMiniButton'
import { StatusProfitability } from '../../shared/ui/StatusProfitability/StatusProfitability'
import { Item } from '../TalentsCard/Body/Item/Item'
import styles from './BusinessModelCard.module.scss'

interface BusinessModelCardProps {
  id: number
  title: string
  image: string
  isAdmin: boolean
  description: string
  price: string
  industries: ValuesProps[]
  technologies: ValuesProps[]
  profitability: string
  location: ValuesProps[]
  isOpen: boolean
  onMobileCLick: () => void
  onNavigate: (id: number) => void
}

export const BusinessModelCard: FC<BusinessModelCardProps> = ({
  id,
  title,
  image,
  isAdmin,
  description,
  industries,
  technologies,
  price,
  location,
  profitability,
  isOpen,
  onMobileCLick,
  onNavigate,
}) => {
  return (
    <div
      className={`${styles.wrapper} ${isOpen ? styles.wrapperOpen : ''}`}
      onClick={onMobileCLick}
    >
      <div className={styles.businessModelImg}>
        <img src={image} alt='BusinessModelImg' />
      </div>
      <div className={styles.titleWrapper}>
        <div className={styles.container}>
          <div className={styles.profitability}>
            <StatusProfitability profitability={profitability} />
          </div>
          <div className={styles.titleKeyData}>
            <span className={styles.title}>{title}</span>
            <div className={styles.keyData}>
              <span className={styles.keyDataDescription}>{price}</span>
              <div className={styles.containerEllipse}>
                <div className={styles.ellipse} />
              </div>
              <span className={styles.keyDataDescription}>
                {location[0].value}
              </span>
            </div>
          </div>
          <div className={styles.otherInfo}>
            <div className={styles.otherInfoContainer}>
              <span className={styles.description}>{description}</span>
              <div className={styles.tags}>
                <Item title='Industries' tags={industries} />
                <Item title='Technologies' tags={technologies} />
              </div>
              {isAdmin && (
                <div className={styles.buttons}>
                  <CustomMiniButton
                    style='mint'
                    icon='/icons/view.svg'
                    tooltipTitle='View'
                    alt='View'
                    onClick={() => onNavigate(id)}
                  />
                </div>
              )}
              {!isAdmin && (
                <ButtonBlue
                  title='Details'
                  onClick={() => onNavigate(id)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
