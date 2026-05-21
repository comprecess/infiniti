import { Fragment, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

import styles from './BusinessPlanViewPage.module.scss'
import { BusinessPlanNewPlanFormData, TalentInputDataBusinessPlan } from '../../../app/constants/constants'
import { Item } from '../../../features/Admin/BusinessPlanPage/ViewBusinessPlan/Item/Item'
import { CustomDivider } from '../../../shared/ui/CustomDivider/CustomDivider'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getPublicBusinessPlan } from '../../../shared/utils/api/Public/get-public-business-plan'
import { RecentCard } from '../../../widgets/RecentCard/RecentCard'

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

const TeamMemberCard = ({ talent }: { talent: TalentInputDataBusinessPlan }) => {
  const specialization = talent.specialization || ''
  const industries = talent.property
    .flatMap(spec => spec.industries?.map(val => val.value) || [])
    .slice(0, 2)
  const keySkills = talent.property
    .flatMap(spec => spec.keySkills?.map(val => val.value) || [])
    .slice(0, 2)

  return (
    <div className={styles.teamMemberCard}>
      <img
        className={styles.teamMemberAvatar}
        alt={talent.name}
        src={talent.img ? `${talent.img}?width=120&height=120` : '/profileWithoutAvatar.svg'}
      />
      <div className={styles.teamMemberInfo}>
        <span className={styles.teamMemberName}>{talent.name}</span>
        {specialization && (
          <span className={styles.teamMemberRole}>{specialization}</span>
        )}
        {(industries.length > 0 || keySkills.length > 0) && (
          <div className={styles.teamMemberTags}>
            {[...industries, ...keySkills].map((tag, i) => (
              <span key={i} className={styles.teamMemberTag}>{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const sections = [
  { key: 'exSummary', title: 'Executive Summary' },
  { key: 'description', title: 'Company Description' },
  { key: 'mAnalysis', title: 'Market Analysis' },
  { key: 'management', title: 'Organization & Management' },
  { key: 'product', title: 'Products & Services' },
  { key: 'marketing', title: 'Marketing & Sales Strategy' },
  { key: 'budget', title: 'Implementation Timeline' },
  { key: 'investment', title: 'Funding Requirements' },
  { key: 'finance', title: 'Financial Projections' },
  { key: 'appendix', title: 'Risk Analysis' },
]

export const BusinessPlanViewPage = () => {
  const [fullInfo, setFullInfo] =
    useState<BusinessPlanNewPlanFormData | null>(null)

  const token = useTokenFromUrl()

  const getFullInfoBusinessPlan = async () => {
    if (!token) return

    const response = await getPublicBusinessPlan(token)

    if (!response.status) return

    setFullInfo(response.data.data)
  }

  useEffect(() => {
    getFullInfoBusinessPlan()
  }, [token])

  useEffect(() => {
    document.title = 'infiniti | Public Business Plan'
  }, [])

  const filteredSections = sections.filter(
    ({ key }) =>
      fullInfo && fullInfo[key as keyof BusinessPlanNewPlanFormData],
  )

  return (
    <div className={styles.content}>
      <div className={styles.wrapper}>
        {fullInfo ? (
          <section className={styles.section}>
            <div className={styles.header}>
              <img
                src='/logoInfinitiWhite.svg'
                alt='Logo'
                className={styles.logo}
              />
              <div className={styles.titleWrapper}>
                <span className={styles.title}>
                  {fullInfo.companyName}
                </span>
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
                  <span className={styles.website}>
                    {fullInfo.website}
                  </span>
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

                  const isEmpty =
                    content === null ||
                    content === '' ||
                    content === '<p><br></p>'

                  if (isEmpty) return null

                  return (
                    <Fragment key={key}>
                      <Item title={title} content={content as string} />
                      {index < filteredSections.length - 1 && (
                        <div className={styles.divider}>
                          <CustomDivider />
                        </div>
                      )}
                    </Fragment>
                  )
                })}
                <div className={styles.divider}>
                  <CustomDivider />
                </div>
                {fullInfo.teamsData && fullInfo.teamsData.length > 0 && (
                  <>
                    <div className={styles.teamSection}>
                      <div className={styles.teamSectionTitle}>Meet the Team</div>
                      <div className={styles.teamGrid}>
                        {fullInfo.teamsData.map(talent => (
                          <TeamMemberCard key={talent.id} talent={talent} />
                        ))}
                      </div>
                    </div>
                    <div className={styles.divider}>
                      <CustomDivider />
                    </div>
                  </>
                )}
                <div className='cta-block'>
                  <h3>Ready to accelerate this venture?</h3>
                  <p>This business plan was generated on the <strong>INFINITI Venture OS</strong> — the platform that turns business models into investor-ready companies in days, not months.</p>
                  <ul>
                    <li>Access 50+ vetted specialists to build your team</li>
                    <li>Get AI-powered market research and financial modeling</li>
                    <li>Connect with INFINITI's investor network</li>
                    <li>Launch your pilot in 90 days</li>
                  </ul>
                  <a href='https://console.infiniti.stream' target='_blank' rel='noreferrer' className='cta-button'>Get Started on INFINITI →</a>
                </div>
              </div>
            </RecentCard>
          </section>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </div>
    </div>
  )
}
