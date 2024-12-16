import { FC } from 'react'

import { CustomMiniButton } from '../../shared/ui/CustomMiniButton/CustomMiniButton'
import { StatusProfitability } from '../../shared/ui/StatusProfitability/StatusProfitability'
import { Item } from '../TalentsCard/Body/Item/Item'
import styles from './BusinessModelCard.module.scss'

interface BusinessModelCardProps {
  title: string
  image: string
  profitability: 'average' | 'high' | 'veryHigh'
}

export const BusinessModelCard: FC<BusinessModelCardProps> = ({
  title,
  image,
  profitability,
}) => {
  return (
    <div className={styles.wrapper}>
      <img
        src={image}
        alt='BusinessModelImg'
        className={styles.businessModelImg}
      />
      <div className={styles.titleWrapper}>
        <div className={styles.container}>
          <StatusProfitability profitability={profitability} />
          <div className={styles.titleKeyData}>
            <span className={styles.title}>{title}</span>
            <div className={styles.keyData}>
              <span className={styles.keyDataDescription}>
                Привлечено $2 млн
              </span>
              <div className={styles.containerEllipse}>
                <div className={styles.ellipse} />
              </div>
              <span className={styles.keyDataDescription}>
                Локальный рынок
              </span>
              <div className={styles.containerEllipse}>
                <div className={styles.ellipse} />
              </div>
              <span className={styles.keyDataDescription}>
                Восточная Европа
              </span>
            </div>
          </div>
          <div className={styles.otherInfo}>
            <div className={styles.otherInfoContainer}>
              <span className={styles.description}>
                Платформа автоматизирует процесс выдачи займов для малых
                компаний, основанная на данных об их операциях. test test
                test test test test test test test test test test test test
                test test test test test test test test test test test test
              </span>
              <div className={styles.tags}>
                <Item
                  title='-Test-'
                  tags={[
                    { id: 0, propId: 0, value: 'Business' },
                    { id: 1, propId: 1, value: 'Business' },
                    { id: 2, propId: 2, value: 'Business' },
                  ]}
                />
                <Item
                  title='-Test-'
                  tags={[
                    { id: 0, propId: 0, value: 'Business' },
                    { id: 1, propId: 1, value: 'Business' },
                    { id: 2, propId: 2, value: 'Business' },
                  ]}
                />
              </div>
              <div className={styles.buttons}>
                <CustomMiniButton
                  style='mint'
                  icon='/icons/view.svg'
                  tooltipTitle='View'
                  alt='View'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
