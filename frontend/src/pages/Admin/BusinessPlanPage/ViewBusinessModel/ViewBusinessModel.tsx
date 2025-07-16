import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

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
import { sanitizeMessage } from '../../../../shared/utils/TextEditor/sanitizeMessage'
import { useIdFromUrl } from '../../../../shared/utils/usefulMethods'
import styles from './ViewBusinessModel.module.scss'

export const AdminViewBusinessModel = () => {
  const id = useIdFromUrl('business-model')
  const navigate = useNavigate()

  const { data: model } = useQuery({
    queryKey: ['model', id],
    queryFn: async () => {
      if (!id) return

      const response: { data: BusinessPlanBusinessModelData } =
        await getModelInfo(id)

      return response.data
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

  const isValidHTML = (value?: string) => {
    return !!value && value !== '<p><br></p>'
  }

  useEffect(() => {
    document.title = 'infiniti | View Business Models'
  }, [])

  return (
    <div className={styles.wrapper}>
      {model ? (
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
            <TitlePage title={model.title} />
          </div>
          <div className={styles.content}>
            <div className={styles.card}>
              <div className={styles.rowHalfContainer}>
                <div className={styles.imgContainer}>
                  <img
                    src={model.content}
                    alt='BusinessModelImg'
                    className={styles.businessModelImg}
                  />
                </div>
                <div className={styles.aboutModel}>
                  <div className={styles.aboutModelContainer}>
                    <TitleCard title='About Model' />
                    <StatusProfitability
                      profitability={model.profitability[0].value}
                    />
                  </div>
                  <div className={styles.list}>
                    <span className={styles.description}>
                      {model.fullDescription}
                    </span>
                    {model.industries.length > 0 && (
                      <ListInfoItem
                        title='Industries'
                        list={model.industries}
                      />
                    )}
                    {model.technologies.length > 0 && (
                      <ListInfoItem
                        title='Technologies'
                        list={model.technologies}
                      />
                    )}
                    {model.location.length > 0 && (
                      <ListInfoItem
                        title='Location'
                        list={model.location}
                      />
                    )}
                    {model.technologies.length > 0 && (
                      <ListInfoItem
                        title='Technologies'
                        list={model.technologies}
                      />
                    )}
                    {model.category.length > 0 && (
                      <ListInfoItem
                        title='Category'
                        list={model.category}
                      />
                    )}
                    <TextInfoItem title='Price' text={model.price} />
                    <TextInfoItem title='Age' text={model.age} />
                    <TextInfoItem title='Start' text={model.start} />
                  </div>
                </div>
              </div>
            </div>
            {isValidHTML(model.marketAnalysis) && (
              <div className={styles.card}>
                <TitleCard title='Market Analysis' />
                <div
                  dangerouslySetInnerHTML={{
                    __html: sanitizeMessage(model.marketAnalysis),
                  }}
                  className={styles.categoryContent}
                />
              </div>
            )}
            {isValidHTML(model.financialModel) && (
              <div className={styles.card}>
                <TitleCard title='Financial Model' />
                <div
                  dangerouslySetInnerHTML={{
                    __html: sanitizeMessage(model.financialModel),
                  }}
                  className={styles.categoryContent}
                />
              </div>
            )}
            {isValidHTML(model.currentInvestors) && (
              <div className={styles.card}>
                <TitleCard title='Current Investors' />
                <div
                  dangerouslySetInnerHTML={{
                    __html: sanitizeMessage(model.currentInvestors),
                  }}
                  className={styles.categoryContent}
                />
              </div>
            )}
            {isValidHTML(model.stagesImplementation) && (
              <div className={styles.card}>
                <TitleCard title='Implementation Stages' />
                <div
                  dangerouslySetInnerHTML={{
                    __html: sanitizeMessage(model.stagesImplementation),
                  }}
                  className={styles.categoryContent}
                />
              </div>
            )}
            {isValidHTML(model.partnershipOptions) && (
              <div className={styles.card}>
                <TitleCard title='Partnership Options' />
                <div
                  dangerouslySetInnerHTML={{
                    __html: sanitizeMessage(model.partnershipOptions),
                  }}
                  className={styles.categoryContent}
                />
              </div>
            )}
          </div>
        </section>
      ) : (
        <LoadingSpinner size='xl' />
      )}
    </div>
  )
}
