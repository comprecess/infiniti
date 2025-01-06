import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { BusinessPlanBusinessModelData } from '../../../app/constants/constants'
import { ListInfoItem } from '../../../features/Client/TalentDetailsPage/ListInfoItem/ListInfoItem'
import { TextInfoItem } from '../../../features/Client/TalentDetailsPage/TextInfoItem/TextInfoItem'
import { TitleCard } from '../../../features/Client/TalentDetailsPage/TitleCard/TitleCard'
import { TitlePage } from '../../../features/Main/TitlePage/TitlePage'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { StatusProfitability } from '../../../shared/ui/StatusProfitability/StatusProfitability'
import { getModelInfo } from '../../../shared/utils/api/Admin/BusinessPlan/BusinessModel/GetModelInfo'
import styles from './ViewBusinessModelsPage.module.scss'

const extractIdFromUrl = (url: string): number | null => {
  const regex = /\/view\/(\d+)$/
  const match = url.match(regex)

  return match ? parseInt(match[1], 10) : null
}

const useIdFromUrl = () => {
  const location = useLocation()

  return useMemo(
    () => extractIdFromUrl(location.pathname),
    [location.pathname],
  )
}

export const ClientViewBusinessModelsPage = () => {
  const [data, setData] = useState<BusinessPlanBusinessModelData | null>(
    null,
  )

  const id = useIdFromUrl()

  const getData = async () => {
    if (!id) return

    const response = await getModelInfo(id)

    setData(response.data)
  }

  useEffect(() => {
    getData()

    document.title = 'infiniti | View Business Models'
  }, [])

  return (
    <div className={styles.wrapper}>
      {data ? (
        <section className={styles.section}>
          <div className={styles.titleModel}>
            <TitlePage title={data.title} />
          </div>
          <div className={styles.content}>
            <div className={styles.card}>
              <div className={styles.rowHalfContainer}>
                <img
                  src={data.preview}
                  alt='BusinessModelImg'
                  className={styles.businessModelImg}
                />
                <div className={styles.aboutModel}>
                  <div className={styles.aboutModelContainer}>
                    <TitleCard title='About Model' />
                    <StatusProfitability
                      profitability={data.profitability[0].value}
                    />
                  </div>
                  <div className={styles.list}>
                    <span className={styles.description}>
                      {data.fullDescription}
                    </span>
                    <ListInfoItem
                      title='Industries'
                      list={data.industries}
                    />
                    <ListInfoItem
                      title='Technologies'
                      list={data.technologies}
                    />
                    <TextInfoItem
                      title='Location'
                      text={data.location[0].value}
                    />
                    <TextInfoItem title='Price' text={data.price} />
                    <TextInfoItem title='Age' text={data.age} />
                    <TextInfoItem title='Start' text={data.start} />
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.card}>
              <TitleCard title='Market Analysis' />
              content
            </div>
            <div className={styles.card}>
              <TitleCard title='Financial Model' />
              content
            </div>
            <div className={styles.card}>
              <TitleCard title='Current Investors' />
              content
            </div>
            <div className={styles.card}>
              <TitleCard title='Implementation Stages' />
              content
            </div>
            <div className={styles.card}>
              <TitleCard title='Partnership Options' />
              content
            </div>
          </div>
        </section>
      ) : (
        <LoadingSpinner size='xl' />
      )}
    </div>
  )
}
