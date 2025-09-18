import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { ListInfoItem } from '../../../features/Client/TalentDetailsPage/ListInfoItem/ListInfoItem'
import { TextInfoItem } from '../../../features/Client/TalentDetailsPage/TextInfoItem/TextInfoItem'
import { TitleCard } from '../../../features/Client/TalentDetailsPage/TitleCard/TitleCard'
import { TitlePage } from '../../../features/Main/TitlePage/TitlePage'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { StatusProfitability } from '../../../shared/ui/StatusProfitability/StatusProfitability'
import { getPublicBusinessModel } from '../../../shared/utils/api/Public/get-public-business-model'
import { sanitizeMessage } from '../../../shared/utils/TextEditor/sanitizeMessage'
import styles from './BusinessModelViewPage.module.scss'

const extractTokenFromUrl = (url: string): string | null => {
  const regex = /\/business-plan\/([^/]+)$/
  const match = url.match(regex)

  return match ? match[1] : null
}

const useTokenFromUrl = () => {
  const location = useLocation()

  return useMemo(
    () => extractTokenFromUrl(location.pathname),
    [location.pathname],
  )
}

export const BusinessModelViewPage = () => {
  const [model, setModel] = useState<any | null>(null)

  const token = useTokenFromUrl()

  const getFullInfoBusinessModel = async () => {
    if (!token) return

    const response = await getPublicBusinessModel(token)

    if (!response.status) return

    setModel(response.data.data)
  }

  const isValidHTML = (value?: string) => {
    return !!value && value !== '<p><br></p>'
  }

  useEffect(() => {
    getFullInfoBusinessModel()
  }, [token])

  useEffect(() => {
    document.title = 'infiniti | Public Business Models'
  }, [])

  return (
    <div className={styles.wrapperContent}>
      <div className={styles.wrapper}>
        {model ? (
          <section className={styles.section}>
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
                    className='dangerouslySetInnerHTML'
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
                    className='dangerouslySetInnerHTML'
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
                    className='dangerouslySetInnerHTML'
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
                    className='dangerouslySetInnerHTML'
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
                    className='dangerouslySetInnerHTML'
                  />
                </div>
              )}
            </div>
          </section>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </div>
    </div>
  )
}
