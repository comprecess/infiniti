import { Fragment, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

import {
  BusinessPlanNewPlanFormData,
  TalentInputDataBusinessPlan,
} from '../../../../app/constants/constants'
import { PeopleCard } from '../../../../features/Admin/BusinessPlanPage/EditBusinessPlanPage/Fields/Team/PeopleCard/PeopleCard'
import { Item } from '../../../../features/Admin/BusinessPlanPage/ViewBusinessPlan/Item/Item'
import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getBusinessPlanFullInfo } from '../../../../shared/utils/api/Admin/BusinessPlan/GetBusinessPlanFullInfo'
import { getInputDataBusinessPlan } from '../../../../shared/utils/api/Admin/BusinessPlan/GetInputDataBusinessPlan'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './ViewBusinessPlanPage.module.scss'

const extractIdFromUrl = (url: string): number | null => {
  const regex = /\/business-plan\/(\d+)$/
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

const sections = [
  { key: 'exSummary', title: 'Executive Summary' },
  { key: 'description', title: 'Company description' },
  { key: 'mAnalysis', title: 'Market Analysis' },
  { key: 'management', title: 'Organization & Management' },
  { key: 'product', title: 'Service or product' },
  { key: 'marketing', title: 'Marketing and sales' },
  { key: 'budget', title: 'Budget' },
  { key: 'investment', title: 'Investment/Funding request' },
  { key: 'finance', title: 'Financial projections' },
  { key: 'appendix', title: 'Appendix' },
]

export const AdminViewBusinessPlanPage = () => {
  const [fullInfo, setFullInfo] =
    useState<BusinessPlanNewPlanFormData | null>(null)
  const [inputData, setInputData] = useState<
  TalentInputDataBusinessPlan[] | null
  >(null)

  const id = useIdFromUrl()

  const getFullInfoBusinessPlan = async () => {
    if (!id) return

    const response = await getBusinessPlanFullInfo(id)

    setFullInfo(response.data)
  }

  const getInputData = async () => {
    const response: { talents: TalentInputDataBusinessPlan[] } =
      await getInputDataBusinessPlan()

    setInputData(response.talents)
  }

  useEffect(() => {
    document.title = 'infiniti | View Business Plan'
  }, [])

  useEffect(() => {
    getFullInfoBusinessPlan()
    getInputData()
  }, [id])

  const filteredSections = sections.filter(
    ({ key }) =>
      fullInfo && fullInfo[key as keyof BusinessPlanNewPlanFormData],
  )

  return (
    <div className={styles.wrapper}>
      {fullInfo && inputData ? (
        <section className={styles.section}>
          <div className={styles.header}>
            <img
              src='/logoInfinitiWhite.svg'
              alt='Logo'
              className={styles.logo}
            />
            <div className={styles.titleWrapper}>
              <span className={styles.title}>{fullInfo.companyName}</span>
              <span className={styles.businessPlan}>BUSINESS PLAN</span>
            </div>
            <div className={styles.preparedBy}>
              {fullInfo.name && (
                <span className={styles.name}>{fullInfo.name}</span>
              )}
              {fullInfo.email && (
                <span className={styles.email}>{fullInfo.email}</span>
              )}
              {fullInfo.website && (
                <span className={styles.website}>{fullInfo.website}</span>
              )}
              {fullInfo.phone && (
                <span className={styles.phone}>{fullInfo.phone}</span>
              )}
            </div>
            {fullInfo.date && (
              <span className={styles.dateTitle}>{fullInfo.date}</span>
            )}
          </div>
          <RecentCard>
            <div className={styles.contentWrapper}>
              {filteredSections.map(({ key, title }, index) => {
                const content =
                  fullInfo[key as keyof BusinessPlanNewPlanFormData]

                return (
                  <Fragment key={key}>
                    <Item title={title} content={content as string} />
                    {key === 'management' && (
                      <div className={styles.teamWrapper}>
                        {fullInfo.teams &&
                          fullInfo.teams.map(id => {
                            return (
                              <PeopleCard
                                key={id}
                                talent={inputData.find(
                                  item => item.id === id,
                                )}
                              />
                            )
                          })}
                      </div>
                    )}
                    {index < filteredSections.length - 1 && (
                      <div className={styles.divider}>
                        <CustomDivider />
                      </div>
                    )}
                  </Fragment>
                )
              })}
            </div>
          </RecentCard>
        </section>
      ) : (
        <LoadingSpinner size='xl' />
      )}
    </div>
  )
}
