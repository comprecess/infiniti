import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import styles from './ViewBusinessModelsPage.module.scss'
import { ValuesProps } from '../../../app/constants/constants'
import { Routes } from '../../../app/router/routes'
import { Block } from '../../../features/General/Survey/types'
import { BackButton } from '../../../shared/ui/BackButton/BackButton'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { StatusProfitability } from '../../../shared/ui/StatusProfitability/StatusProfitability'
import { getBusinessModelFullInfo } from '../../../shared/utils/api/Admin/BusinessPlan/BusinessModel/get-business-model-full-info'
import { postSubmitSurvey } from '../../../shared/utils/api/Client/BusinessPlan/post-submit-survey'
import { sanitizeMessage } from '../../../shared/utils/TextEditor/sanitizeMessage'
import { generateStorageKey, useIdFromUrl } from '../../../shared/utils/usefulMethods'
import { useCustomToast } from '../../../shared/ui/CustomToast/CustomToast'
import { useNavigate } from 'react-router-dom'

// ─── SVG Icons (console stroke style) ───────────────────────────────────────

const IconOverview = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
)

const IconPassport = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/>
    <path d="M12 2a14.5 14.5 0 0 1 0 20M12 2a14.5 14.5 0 0 0 0 20M2 12h20"/>
  </svg>
)

const IconRevenue = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
)

const IconEconomics = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
    <line x1="2" y1="20" x2="22" y2="20"/>
  </svg>
)

const IconHowItWorks = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
)

const IconTransfer = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
)

const IconRisks = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
)

// ─── Tab config ──────────────────────────────────────────────────────────────

const TABS = [
  { id: 'overview',   label: 'Overview',        Icon: IconOverview   },
  { id: 'passport',   label: 'Passport',         Icon: IconPassport   },
  { id: 'revenue',    label: 'Revenue',          Icon: IconRevenue    },
  { id: 'economics',  label: 'Economics',        Icon: IconEconomics  },
  { id: 'howto',      label: 'How It Works',     Icon: IconHowItWorks },
  { id: 'transfer',   label: 'Transferability',  Icon: IconTransfer   },
  { id: 'risks',      label: 'Facts & Risks',    Icon: IconRisks      },
]

// ─── Main Component ──────────────────────────────────────────────────────────

export const ClientViewBusinessModelsPage = () => {
  const id = useIdFromUrl('view')
  const navigate = useNavigate()
  const showToast = useCustomToast()

  const [activeTab, setActiveTab] = useState('overview')
  const [progress, setProgress] = useState(0)
  const bodyRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  const { openSurvey, getUser, user } = useOutletContext<{
    openSurvey: (
      questions: Block[],
      isBlur: boolean,
      localStorageKey: string,
      onSubmit?: (answers: Record<number, string | string[]>) => void,
    ) => void
    getUser: () => Promise<void>
    user: { balance?: string; formattedBalance?: string; [key: string]: any } | null
  }>()

  const { data: model, isLoading } = useQuery({
    queryKey: ['model', id],
    queryFn: async () => {
      if (!id) return
      const response = await getBusinessModelFullInfo(id)
      if (!response.status) return
      return response.data.data
    },
    placeholderData: previousData => previousData,
  })

  // Track scroll for progress bar + active tab
  useEffect(() => {
    const el = bodyRef.current
    if (!el) return

    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el
      const pct = scrollHeight > clientHeight
        ? Math.round((scrollTop / (scrollHeight - clientHeight)) * 100)
        : 0
      setProgress(pct)

      // find which section is in view
      for (let i = TABS.length - 1; i >= 0; i--) {
        const sec = sectionRefs.current[TABS[i].id]
        if (sec && sec.offsetTop - 80 <= scrollTop) {
          setActiveTab(TABS[i].id)
          break
        }
      }
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [model])

  const scrollToSection = (tabId: string) => {
    const sec = sectionRefs.current[tabId]
    if (sec && bodyRef.current) {
      bodyRef.current.scrollTo({ top: sec.offsetTop - 8, behavior: 'smooth' })
    }
    setActiveTab(tabId)
  }

  const isValidHTML = (value?: string) => !!value && value !== '<p><br></p>'

  const handleSurveySubmit = async (answers: Record<number, string | string[]>) => {
    if (!model) return
    const result = await postSubmitSurvey(answers, model.id)
    if (result.status) {
      await getUser()
      showToast({ title: 'Successfully', description: 'Your business plan is being generated!', status: 'success' })
      navigate(`/${Routes.clientPages}/${Routes.businessPlans}/${Routes.businessPlan}/${Routes.view}/${result.planId}`)
    } else {
      showToast({ title: 'Error', description: result.message, status: 'error' })
    }
  }

  const handleGeneratePlan = () => {
    if (!model?.survey) return
    openSurvey(
      model.survey,
      false,
      generateStorageKey(`business_plan-${model.id}`),
      handleSurveySubmit,
    )
  }

  useEffect(() => {
    document.title = model ? `infiniti | ${model.title}` : 'infiniti | Business Model'
  }, [model])

  if (isLoading || !model) {
    return (
      <div className={styles.loadingWrapper}>
        <LoadingSpinner size="xl" />
      </div>
    )
  }

  const profitabilityValue = model.profitability?.[0]?.value ?? ''
  const balanceLabel = user?.formattedBalance ?? user?.balance ?? null

  return (
    <div className={styles.pageWrapper}>

      {/* ── Sticky Tab Bar ─────────────────────────────────────────── */}
      <div className={styles.tabBar}>
        <div className={styles.tabBarInner}>
          {TABS.map(({ id: tabId, label, Icon }) => (
            <button
              key={tabId}
              className={`${styles.tab} ${activeTab === tabId ? styles.tabActive : ''}`}
              onClick={() => scrollToSection(tabId)}
            >
              <span className={styles.tabIcon}><Icon /></span>
              <span className={styles.tabLabel}>{label}</span>
            </button>
          ))}
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* ── Scrollable Body ─────────────────────────────────────────── */}
      <div className={styles.body} ref={bodyRef}>

        {/* ══ SECTION 1 — OVERVIEW ══════════════════════════════════════ */}
        <section
          id="overview"
          ref={el => { sectionRefs.current['overview'] = el }}
          className={styles.section}
        >
          <div className={styles.backRow}>
            <BackButton />
          </div>

          {/* Hero image */}
          {model.content && (
            <div className={styles.heroImgWrap}>
              <img src={model.content} alt={model.title} className={styles.heroImg} />
            </div>
          )}

          {/* Title card */}
          <div className={styles.card}>
            <div className={styles.titleRow}>
              <h1 className={styles.modelTitle}>{model.title}</h1>
              {profitabilityValue && (
                <StatusProfitability profitability={profitabilityValue} />
              )}
            </div>
            {model.fullDescription && (
              <p className={styles.modelDesc}>{model.fullDescription}</p>
            )}
            <div className={styles.pills}>
              {model.industries?.map((i: ValuesProps) => (
                <span key={i.id} className={`${styles.pill} ${styles.pillBlue}`}>{i.value}</span>
              ))}
              {model.location?.map((l: ValuesProps) => (
                <span key={l.id} className={styles.pill}>{l.value}</span>
              ))}
              {model.age && <span className={styles.pill}>{model.age}</span>}
            </div>
          </div>

          {/* KPI strip */}
          <div className={styles.kpiGrid}>
            <div className={styles.kpiItem}>
              <span className={styles.kpiLabel}>Plan Price</span>
              <span className={`${styles.kpiValue} ${styles.kpiBlue}`}>{model.price}</span>
              <span className={styles.kpiSub}>one-time</span>
            </div>
            {model.start && (
              <div className={styles.kpiItem}>
                <span className={styles.kpiLabel}>Since</span>
                <span className={styles.kpiValue}>{model.start}</span>
                <span className={styles.kpiSub}>year started</span>
              </div>
            )}
            {model.category?.length > 0 && (
              <div className={styles.kpiItem}>
                <span className={styles.kpiLabel}>Category</span>
                <span className={styles.kpiValue}>{model.category[0].value}</span>
                <span className={styles.kpiSub}>segment</span>
              </div>
            )}
            {model.technologies?.length > 0 && (
              <div className={styles.kpiItem}>
                <span className={styles.kpiLabel}>Stack</span>
                <span className={`${styles.kpiValue} ${styles.kpiMint}`}>{model.technologies.length}+</span>
                <span className={styles.kpiSub}>technologies</span>
              </div>
            )}
          </div>

          {/* Sections nav menu */}
          <h2 className={styles.sectionTitle}>Explore this model</h2>
          <div className={styles.navList}>
            {TABS.filter(t => t.id !== 'overview').map(({ id: tabId, label, Icon }) => (
              <button
                key={tabId}
                className={styles.navItem}
                onClick={() => scrollToSection(tabId)}
              >
                <div className={styles.navIcon}><Icon /></div>
                <div className={styles.navBody}>
                  <span className={styles.navTitle}>{label}</span>
                </div>
                <span className={styles.navArrow}>›</span>
              </button>
            ))}
          </div>
        </section>

        {/* ══ SECTION 2 — PASSPORT ══════════════════════════════════════ */}
        <section
          id="passport"
          ref={el => { sectionRefs.current['passport'] = el }}
          className={styles.section}
        >
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}><IconPassport /></span>
            Model Passport
          </h2>

          <div className={styles.card}>
            {model.description && (
              <div className={styles.quote}>{model.description}</div>
            )}
            <div className={styles.infoRow}>
              <span className={styles.metaLabel}>Industries</span>
              <div className={styles.pills}>
                {model.industries?.map((i: ValuesProps) => (
                  <span key={i.id} className={`${styles.pill} ${styles.pillBlue}`}>{i.value}</span>
                ))}
              </div>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.metaLabel}>Technologies</span>
              <div className={styles.pills}>
                {model.technologies?.map((t: ValuesProps) => (
                  <span key={t.id} className={`${styles.pill} ${styles.pillMint}`}>{t.value}</span>
                ))}
              </div>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.metaLabel}>Location</span>
              <div className={styles.pills}>
                {model.location?.map((l: ValuesProps) => (
                  <span key={l.id} className={styles.pill}>{l.value}</span>
                ))}
              </div>
            </div>
            {model.category?.length > 0 && (
              <div className={styles.infoRow}>
                <span className={styles.metaLabel}>Category</span>
                <div className={styles.pills}>
                  {model.category.map((c: ValuesProps) => (
                    <span key={c.id} className={`${styles.pill} ${styles.pillAmber}`}>{c.value}</span>
                  ))}
                </div>
              </div>
            )}
            <div className={styles.infoRow}>
              <span className={styles.metaLabel}>Price</span>
              <span className={styles.metaValue}>{model.price}</span>
            </div>
            {model.age && (
              <div className={styles.infoRow}>
                <span className={styles.metaLabel}>Age</span>
                <span className={styles.metaValue}>{model.age}</span>
              </div>
            )}
          </div>

          {isValidHTML(model.targetClient) && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Target Client &amp; JTBD</h3>
              <div
                dangerouslySetInnerHTML={{ __html: sanitizeMessage(model.targetClient) }}
                className="dangerouslySetInnerHTML"
              />
            </div>
          )}

          {isValidHTML(model.valueProposition) && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Value Proposition &amp; Moat</h3>
              <div
                dangerouslySetInnerHTML={{ __html: sanitizeMessage(model.valueProposition) }}
                className="dangerouslySetInnerHTML"
              />
            </div>
          )}

          {isValidHTML(model.currentInvestors) && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Current Investors</h3>
              <div
                dangerouslySetInnerHTML={{ __html: sanitizeMessage(model.currentInvestors) }}
                className="dangerouslySetInnerHTML"
              />
            </div>
          )}
        </section>

        {/* ══ SECTION 3 — REVENUE ════════════════════════════════════════ */}
        <section
          id="revenue"
          ref={el => { sectionRefs.current['revenue'] = el }}
          className={styles.section}
        >
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}><IconRevenue /></span>
            Revenue Streams
          </h2>

          {isValidHTML(model.revenueLogic) && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Revenue Logic</h3>
              <div
                dangerouslySetInnerHTML={{ __html: sanitizeMessage(model.revenueLogic) }}
                className="dangerouslySetInnerHTML"
              />
            </div>
          )}

          {isValidHTML(model.financialModel) ? (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Revenue Streams</h3>
              <div
                dangerouslySetInnerHTML={{ __html: sanitizeMessage(model.financialModel) }}
                className="dangerouslySetInnerHTML"
              />
            </div>
          ) : (
            <div className={styles.emptyCard}>
              <span className={styles.emptyText}>Revenue model data not available yet.</span>
            </div>
          )}
        </section>

        {/* ══ SECTION 4 — UNIT ECONOMICS ════════════════════════════════ */}
        <section
          id="economics"
          ref={el => { sectionRefs.current['economics'] = el }}
          className={styles.section}
        >
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}><IconEconomics /></span>
            Unit Economics
          </h2>

          <div className={styles.kpiGrid}>
            <div className={styles.kpiItem}>
              <span className={styles.kpiLabel}>Plan Price</span>
              <span className={`${styles.kpiValue} ${styles.kpiBlue}`}>{model.price}</span>
              <span className={styles.kpiSub}>one-time charge</span>
            </div>
            {model.start && (
              <div className={styles.kpiItem}>
                <span className={styles.kpiLabel}>Model Age</span>
                <span className={styles.kpiValue}>{model.age || '—'}</span>
                <span className={styles.kpiSub}>years proven</span>
              </div>
            )}
          </div>

          {isValidHTML(model.unitEconomics) && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Unit Economics</h3>
              <div
                dangerouslySetInnerHTML={{ __html: sanitizeMessage(model.unitEconomics) }}
                className="dangerouslySetInnerHTML"
              />
            </div>
          )}

          {isValidHTML(model.marketAnalysis) && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Market Analysis</h3>
              <div
                dangerouslySetInnerHTML={{ __html: sanitizeMessage(model.marketAnalysis) }}
                className="dangerouslySetInnerHTML"
              />
            </div>
          )}
        </section>

        {/* ══ SECTION 5 — HOW IT WORKS ══════════════════════════════════ */}
        <section
          id="howto"
          ref={el => { sectionRefs.current['howto'] = el }}
          className={styles.section}
        >
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}><IconHowItWorks /></span>
            How It Works
          </h2>

          {isValidHTML(model.stagesImplementation) ? (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Implementation Stages</h3>
              <div
                dangerouslySetInnerHTML={{ __html: sanitizeMessage(model.stagesImplementation) }}
                className="dangerouslySetInnerHTML"
              />
            </div>
          ) : (
            <div className={styles.emptyCard}>
              <span className={styles.emptyText}>Implementation stages not available yet.</span>
            </div>
          )}
        </section>

        {/* ══ SECTION 6 — TRANSFERABILITY ═══════════════════════════════ */}
        <section
          id="transfer"
          ref={el => { sectionRefs.current['transfer'] = el }}
          className={styles.section}
        >
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}><IconTransfer /></span>
            Transferability
          </h2>

          {isValidHTML(model.partnershipOptions) ? (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Partnership Options</h3>
              <div
                dangerouslySetInnerHTML={{ __html: sanitizeMessage(model.partnershipOptions) }}
                className="dangerouslySetInnerHTML"
              />
            </div>
          ) : (
            <div className={styles.emptyCard}>
              <span className={styles.emptyText}>Partnership & transferability data not available yet.</span>
            </div>
          )}
        </section>

        {/* ══ SECTION 7 — FACTS & RISKS ═════════════════════════════════ */}
        <section
          id="risks"
          ref={el => { sectionRefs.current['risks'] = el }}
          className={styles.section}
        >
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}><IconRisks /></span>
            Facts &amp; Risks
          </h2>

          {isValidHTML(model.factsHypothesesRisks) ? (
            <div className={styles.card}>
              <div
                dangerouslySetInnerHTML={{ __html: sanitizeMessage(model.factsHypothesesRisks) }}
                className="dangerouslySetInnerHTML"
              />
            </div>
          ) : isValidHTML(model.marketAnalysis) ? (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Market Facts</h3>
              <div
                dangerouslySetInnerHTML={{ __html: sanitizeMessage(model.marketAnalysis) }}
                className="dangerouslySetInnerHTML"
              />
            </div>
          ) : (
            <div className={styles.emptyCard}>
              <span className={styles.emptyText}>Facts & risks data not available yet.</span>
            </div>
          )}

          {/* Final CTA card */}
          {model.survey && (
            <div className={styles.ctaCard}>
              <h3 className={styles.ctaTitle}>Ready to generate your plan?</h3>
              <p className={styles.ctaDesc}>
                AI will build a full business plan tailored to your answers.
                Charged once from your balance.
              </p>
              <button className={styles.ctaBtnLarge} onClick={handleGeneratePlan}>
                Generate Plan — {model.price}
              </button>
              {balanceLabel && (
                <p className={styles.ctaBalance}>
                  Your balance: <span>{balanceLabel}</span>
                </p>
              )}
            </div>
          )}
        </section>

        <div className={styles.bottomSpacer} />
      </div>

      {/* ── Sticky Bottom CTA ───────────────────────────────────────── */}
      {model.survey && (
        <div className={styles.ctaBar}>
          <div className={styles.ctaPriceWrap}>
            <span className={styles.ctaPriceLbl}>Generation price</span>
            <span className={styles.ctaPrice}>{model.price}</span>
            {balanceLabel && (
              <span className={styles.ctaBalanceSmall}>
                Balance: <strong>{balanceLabel}</strong>
              </span>
            )}
          </div>
          <div className={styles.ctaActions}>
            <button className={styles.ctaBtn} onClick={handleGeneratePlan}>
              Generate Plan
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
