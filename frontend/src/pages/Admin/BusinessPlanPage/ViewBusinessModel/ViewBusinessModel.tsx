import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
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
  const id = useIdFromUrl()
  const navigate = useNavigate()

  const { data: model, isLoading: modelLoading } = useQuery({
    queryKey: ['model', id],
    queryFn: async () => {
      if (!id) return

      const response: { data: BusinessPlanBusinessModelData } =
        await getModelInfo(id)

      return response
    },
    placeholderData: previousData => previousData,
  })

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
    document.title = 'infiniti | View Business Models'
  }, [])

  return (
    <div className={styles.wrapper}>
      {!modelLoading && model ? (
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
            <TitlePage title={model.data.title} />
          </div>
          <div className={styles.content}>
            <div className={styles.card}>
              <div className={styles.rowHalfContainer}>
                <div className={styles.imgContainer}>
                  <img
                    src={model.data.content}
                    alt='BusinessModelImg'
                    className={styles.businessModelImg}
                  />
                </div>
                <div className={styles.aboutModel}>
                  <div className={styles.aboutModelContainer}>
                    <TitleCard title='About Model' />
                    <StatusProfitability
                      profitability={model.data.profitability[0].value}
                    />
                  </div>
                  <div className={styles.list}>
                    <span className={styles.description}>
                      {model.data.fullDescription}
                    </span>
                    {model.data.industries.length > 0 && (
                      <ListInfoItem
                        title='Industries'
                        list={model.data.industries}
                      />
                    )}
                    {model.data.technologies.length > 0 && (
                      <ListInfoItem
                        title='Technologies'
                        list={model.data.technologies}
                      />
                    )}
                    {model.data.location.length > 0 && (
                      <ListInfoItem
                        title='Location'
                        list={model.data.location}
                      />
                    )}
                    {model.data.technologies.length > 0 && (
                      <ListInfoItem
                        title='Technologies'
                        list={model.data.technologies}
                      />
                    )}
                    {model.data.category.length > 0 && (
                      <ListInfoItem
                        title='Category'
                        list={model.data.category}
                      />
                    )}
                    <TextInfoItem title='Price' text={model.data.price} />
                    <TextInfoItem title='Age' text={model.data.age} />
                    <TextInfoItem title='Start' text={model.data.start} />
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
