import { Fragment, useEffect, useRef, useState } from 'react'

import { Skeleton, SkeletonText, Text, useTheme } from '@chakra-ui/react'
import styles from './ViewBusinessPlanPage.module.scss'
import {
  BusinessPlanNewPlanFormData,
  TalentInputDataBusinessPlan,
} from '../../../app/constants/constants'
import { Routes } from '../../../app/router/routes'
import { ChatGPTCard } from '../../../features/Admin/BusinessPlanPage/EditBusinessPlanPage/Fields/Team/ChatGPTCard/ChatGPTCard'
import { PeopleCard } from '../../../features/Admin/BusinessPlanPage/EditBusinessPlanPage/Fields/Team/PeopleCard/PeopleCard'
import { PlusCard } from '../../../features/Admin/BusinessPlanPage/EditBusinessPlanPage/Fields/Team/PlusCard/PlusCard'
import { Item } from '../../../features/Admin/BusinessPlanPage/ViewBusinessPlan/Item/Item'
import { ChatGPTIcon } from '../../../shared/icons/ChatGPTIcon'
import { BackButton } from '../../../shared/ui/BackButton/BackButton'
import { ButtonBlue } from '../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomDivider } from '../../../shared/ui/CustomDivider/CustomDivider'
import { CustomInput } from '../../../shared/ui/CustomInput/CustomInput'
import { useCustomToast } from '../../../shared/ui/CustomToast/CustomToast'
import { Icon } from '../../../shared/ui/Icon/Icon'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getBusinessPlanInfo } from '../../../shared/utils/api/Client/BusinessPlan/get-business-plan-info'
import { getBusinessPlanInputData } from '../../../shared/utils/api/Client/BusinessPlan/get-business-plan-input-data'
import { getChatGPTTeam } from '../../../shared/utils/api/Client/BusinessPlan/get-chat-gpt-team'
import { patchUpdateBusinessPlanTeam } from '../../../shared/utils/api/Client/BusinessPlan/patch-update-business-plan-team'
import { useAppWebSocket } from '../../../shared/utils/providers/WebSocketProvider'
import { useIdFromUrl } from '../../../shared/utils/usefulMethods'
import { RecentCard } from '../../../widgets/RecentCard/RecentCard'
import { ModalAddTalentTeam } from '../../Admin/BusinessPlanPage/EditBusinessPlanPage/ModalAddTalentTeam/ModalAddTalentTeam'

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

const STEPS = [
  { until: 15,  label: 'Starting up...' },
  { until: 40,  label: 'Researching live market data...' },
  { until: 85,  label: 'Writing your investor-grade plan...' },
  { until: 99,  label: 'Saving sections...' },
  { until: 100, label: 'Done!' },
]

export const ClientViewBusinessPlanPage = () => {
  const [fullInfo, setFullInfo] = useState<BusinessPlanNewPlanFormData | null>(null)
  const [inputData, setInputData] = useState<TalentInputDataBusinessPlan[] | null>(null)

  const [modalAddTalent, setModalAddTalent] = useState<boolean>(false)
  const [isLoadingTeam, setIsLoadingTeam] = useState<boolean>(false)

  // Progress state for when plan is generating
  const [percent, setPercent] = useState(0)
  const [label, setLabel] = useState('Preparing your plan...')

  const id = useIdFromUrl('view')
  const showToast = useCustomToast()
  const theme = useTheme()
  const { isConnected, isAuth, on } = useAppWebSocket()

  const planIdNum = id ? parseInt(id, 10) : null
  const isGenerating = fullInfo?.status === 'New' || fullInfo?.status === 'Processing'

  const getFullInfoBusinessPlan = async () => {
    if (!id) return

    const response = await getBusinessPlanInfo(id)

    if (!response.status) return

    const planData = response.data.data
    setFullInfo(planData)

    // Auto-suggest team via ChatGPT if no team members yet (only when ready)
    if (
      planData.status === 'Ready' &&
      (!planData.teams || planData.teams.length === 0)
    ) {
      autoSuggestTeam(id)
    }
  }

  const getInputData = async () => {
    const response = await getBusinessPlanInputData()

    if (!response.status) return

    setInputData(response.data.talents)
  }

  const autoSuggestTeam = async (planId: string) => {
    setIsLoadingTeam(true)
    try {
      const response = await getChatGPTTeam(planId)
      if (!response.status) return

      const idsArray = response.data.ids.split(',').map((id: string) => parseInt(id.trim(), 10))
      await patchUpdateBusinessPlanTeam(planId, idsArray)

      setFullInfo(prev => prev ? { ...prev, teams: idsArray } : prev)
    } catch {
      // silent fail — user can retry manually
    } finally {
      setIsLoadingTeam(false)
    }
  }

  const addChatGPTTeam = async () => {
    if (!id) return

    setIsLoadingTeam(true)

    const response = await getChatGPTTeam(id)

    if (!response.status) return

    const idsArray = response.data.ids.split(',').map((id: string) => parseInt(id.trim(), 10))

    const { status, message } = await patchUpdateBusinessPlanTeam(id, idsArray)

    if (status) {
      setFullInfo(prevFormData => {
        if (!prevFormData) return prevFormData

        return {
          ...prevFormData,
          teams: idsArray,
        }
      })
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }

    setIsLoadingTeam(false)
  }

  const handleNavigateToPreview = () => {
    if (!fullInfo) return

    const url = `${import.meta.env.VITE_MAIN_DOMAIN}/${Routes.public}/${Routes.view}/${
      Routes.businessPlan
    }/${fullInfo.publicToken}`

    window.open(url, '_blank')
  }

  const addTalent = async (idTalent: number) => {
    if (!id || !fullInfo) return

    const updatedTeams = [...fullInfo.teams, idTalent]

    const { status, message } = await patchUpdateBusinessPlanTeam(id, updatedTeams)

    if (status) {
      setFullInfo({
        ...fullInfo,
        teams: updatedTeams,
      })
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  const deleteTalent = async (idTalent: number) => {
    if (!id || !fullInfo) return

    const updatedTeams = fullInfo.teams.filter(teamId => teamId !== idTalent)

    const { status, message } = await patchUpdateBusinessPlanTeam(id, updatedTeams)

    if (status) {
      setFullInfo({
        ...fullInfo,
        teams: updatedTeams,
      })
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  useEffect(() => {
    document.title = 'infiniti | View Business Plan'
  }, [])

  useEffect(() => {
    getFullInfoBusinessPlan()
    getInputData()
  }, [id])

  // ── Simulated progress (only while generating) ────────────────────────────
  useEffect(() => {
    if (!isGenerating) return

    const timer = setInterval(() => {
      setPercent(prev => {
        if (prev >= 95) { clearInterval(timer); return prev }
        const next = Math.min(prev + 0.6, 95)
        const step = STEPS.find(s => next <= s.until)
        if (step) setLabel(step.label)
        return next
      })
    }, 1500)
    return () => clearInterval(timer)
  }, [isGenerating])

  // ── Polling fallback: re-fetch every 15s while generating ─────────────────
  const getFullInfoRef = useRef(getFullInfoBusinessPlan)
  getFullInfoRef.current = getFullInfoBusinessPlan

  useEffect(() => {
    if (!isGenerating) return

    const poll = setInterval(() => {
      getFullInfoRef.current()
    }, 15_000)
    return () => clearInterval(poll)
  }, [isGenerating])

  // ── Real progress from WebSocket ──────────────────────────────────────────
  useEffect(() => {
    if (!isConnected || !isAuth) return

    const handler = (wsData: any) => {
      const data = wsData?.data ?? wsData
      if (planIdNum && data?.planId && Number(data.planId) !== planIdNum) return

      const p = Number(data?.percent ?? 0)
      const l = data?.label ?? ''

      if (p > 0) {
        setPercent(prev => Math.max(prev, p))
        if (l) setLabel(l)
      }
    }

    on('business-plan-progress', handler)
    return () => on('business-plan-progress', () => {})
  }, [isConnected, isAuth, on, planIdNum])

  // ── Listen for plan-list WS event to trigger re-fetch ────────────────────
  useEffect(() => {
    if (!isConnected || !isAuth) return

    on('business-plan-list', () => getFullInfoRef.current())
    return () => on('business-plan-list', () => {})
  }, [isConnected, isAuth, on])

  const filteredSections = sections.filter(({ key }) => {
    if (key === 'management') return true

    const content = fullInfo?.[key as keyof BusinessPlanNewPlanFormData]

    const isEmpty = content === null || content === '' || content === '<p><br></p>'

    return !isEmpty
  })

  const skeletonStart = theme.colors.gray?.[600]
  const skeletonEnd = theme.colors.gray?.[700]
  const displayPercent = Math.round(percent)

  // ── Generating state — full-page progress view ────────────────────────────
  if (isGenerating) {
    return (
      <div className={styles.wrapper}>
        <section className={styles.section}>
          <div className={styles.backButton}>
            <BackButton />
          </div>
          <div className={styles.generatingWrapper}>
            <div className={styles.generatingCard}>
              <div className={styles.generatingSpinner}>
                <LoadingSpinner size='xl' />
                <Text mt='12px' fontSize='20px' color='white' fontWeight='700' textAlign='center'>
                  {displayPercent}%
                </Text>
              </div>
              <div className={styles.generatingContent}>
                <Skeleton startColor={skeletonStart} endColor={skeletonEnd} height='32px' width='55%' borderRadius='6px' mb='12px' />
                <SkeletonText noOfLines={4} spacing='3' startColor={skeletonStart} endColor={skeletonEnd} />
                <div className={styles.generatingProgressWrapper}>
                  <div className={styles.generatingProgressBar}>
                    <div
                      className={styles.generatingProgressFill}
                      style={{ width: `${displayPercent}%` }}
                    />
                  </div>
                  <Text fontSize='13px' color='#9ea0b7' mt='8px' textAlign='center'>
                    {label}
                  </Text>
                </div>
                <Text fontSize='12px' color='#6b6e8a' mt='6px' textAlign='center'>
                  Your investor-grade business plan is being generated. This takes 2–3 minutes.
                </Text>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <>
      <div className={styles.wrapper}>
        {fullInfo && inputData ? (
          <section className={styles.section}>
            <div className={styles.backButton}>
              <BackButton />
            </div>
            <div className={styles.publicURLWrapper}>
              <CustomInput
                readOnly
                title='Unique Business Plan URL:'
                type='text'
                name='uniqueURL'
                id='uniqueURL'
                styleInput={styles.input}
                value={`${import.meta.env.VITE_MAIN_DOMAIN}/${Routes.public}/${Routes.view}/${
                  Routes.businessPlan
                }/${fullInfo.publicToken}`}
                onChange={() => {}}
              />
              <ButtonBlue title='Preview' onClick={handleNavigateToPreview} />
            </div>
            <div className={styles.header}>
              <img src='/logoInfinitiWhite.svg' alt='Logo' className={styles.logo} />
              <div className={styles.titleWrapper}>
                <span className={styles.title}>{fullInfo.companyName}</span>
                <span className={styles.businessPlan}>BUSINESS PLAN</span>
              </div>
              <div className={styles.preparedBy}>
                {fullInfo.name && <span className={styles.name}>{fullInfo.name}</span>}
                {fullInfo.email && <span className={styles.email}>{fullInfo.email}</span>}
                {fullInfo.website && <span className={styles.website}>{fullInfo.website}</span>}
                {fullInfo.phone && <span className={styles.phone}>{fullInfo.phone}</span>}
              </div>
              {fullInfo.date && <span className={styles.dateTitle}>{fullInfo.date}</span>}
            </div>
            <RecentCard>
              <div className={styles.contentWrapper}>
                {filteredSections.map(({ key, title }, index) => {
                  const content = fullInfo[key as keyof BusinessPlanNewPlanFormData]

                  const isEmpty = content === null || content === '' || content === '<p><br></p>'

                  if (key !== 'management' && isEmpty) return null

                  return (
                    <Fragment key={key}>
                      {key === 'management' ? (

                        <div className={styles.contentManagement}>
                          <Item
                            title={title}
                            content={content as string}
                            forceShow={key === 'management'}
                          />
                          {inputData &&
                            fullInfo.teams &&
                            (!isLoadingTeam ? (
                              <div className={styles.teamWrapper}>
                                {fullInfo.teams.map(id => {
                                  return (
                                    <PeopleCard
                                      key={id}
                                      isRemove
                                      talent={inputData.find(item => item.id === id)}
                                      deleteTalent={deleteTalent}
                                    />
                                  )
                                })}
                                <PlusCard onClick={() => setModalAddTalent(prev => !prev)} />
                                <ChatGPTCard addNewTalentChatGPT={addChatGPTTeam} />
                              </div>
                            ) : (
                              <div className={styles.chatGPTLoading}>
                                <Icon
                                  hover={false}
                                  icon={<ChatGPTIcon style={styles.icon} />}
                                  style={styles.wrapperIcon}
                                />
                                <span className={styles.chatGPTLoadingText}>
                                  ChatGPT is assembling a Team
                                </span>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <Item title={title} content={content as string} />
                      )}
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
      {modalAddTalent && inputData && fullInfo && (
        <ModalAddTalentTeam
          inputData={inputData}
          teams={fullInfo.teams}
          isOpen={modalAddTalent}
          addTalent={addTalent}
          deleteTalent={deleteTalent}
          onClose={() => setModalAddTalent(prev => !prev)}
        />
      )}
    </>
  )
}
