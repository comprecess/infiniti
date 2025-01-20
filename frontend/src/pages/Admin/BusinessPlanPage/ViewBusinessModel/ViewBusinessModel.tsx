import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { BusinessPlanBusinessModelData } from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import { ListInfoItem } from '../../../../features/Client/TalentDetailsPage/ListInfoItem/ListInfoItem'
import { TextInfoItem } from '../../../../features/Client/TalentDetailsPage/TextInfoItem/TextInfoItem'
import { TitleCard } from '../../../../features/Client/TalentDetailsPage/TitleCard/TitleCard'
import { TitlePage } from '../../../../features/Main/TitlePage/TitlePage'
import { ChevronDownIcon } from '../../../../shared/icons/ChevronDownIcon'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { StatusProfitability } from '../../../../shared/ui/StatusProfitability/StatusProfitability'
import { getModelInfo } from '../../../../shared/utils/api/Admin/BusinessPlan/BusinessModel/GetModelInfo'
import styles from './ViewBusinessModel.module.scss'

const extractIdFromUrl = (url: string): number | null => {
  const regex = /\/business-model\/(\d+)$/
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

export const AdminViewBusinessModel = () => {
  const [data, setData] = useState<BusinessPlanBusinessModelData | null>(
    null,
  )

  const id = useIdFromUrl()
  const navigate = useNavigate()

  const getData = async () => {
    if (!id) return

    const response = await getModelInfo(id)

    setData(response.data)
  }

  const handleNavigateBack = () => {
    if (window.history.length - 3 <= 0) {
      navigate(
        `/${Routes.adminPages}/${Routes.businessPlan}/${Routes.businessModels}`,
      )
    } else {
      navigate(-1)
    }
  }

  useEffect(() => {
    getData()

    document.title = 'infiniti | View Business Models'
  }, [])

  return (
    <div className={styles.wrapper}>
      {data ? (
        <section className={styles.section}>
          <section className={styles.section}>
            <div className={styles.item}>
              <div
                className={styles.buttonBack}
                onClick={handleNavigateBack}
              >
                <ChevronDownIcon style={styles.buttonBackIcon} />
                <span className={styles.buttonBackText}>Back</span>
              </div>
            </div>
          </section>
          <div className={styles.titleModel}>
            <TitlePage title={data.title} />
          </div>
          <div className={styles.content}>
            <div className={styles.card}>
              <div className={styles.rowHalfContainer}>
                <div className={styles.imgContainer}>
                  <img
                    src={data.content}
                    alt='BusinessModelImg'
                    className={styles.businessModelImg}
                  />
                </div>
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
                    {data.industries.length > 0 && (
                      <ListInfoItem
                        title='Industries'
                        list={data.industries}
                      />
                    )}
                    {data.technologies.length > 0 && (
                      <ListInfoItem
                        title='Technologies'
                        list={data.technologies}
                      />
                    )}
                    {data.location.length > 0 && (
                      <ListInfoItem
                        title='Location'
                        list={data.location}
                      />
                    )}
                    {data.technologies.length > 0 && (
                      <ListInfoItem
                        title='Technologies'
                        list={data.technologies}
                      />
                    )}
                    {data.category.length > 0 && (
                      <ListInfoItem
                        title='Category'
                        list={data.category}
                      />
                    )}
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
