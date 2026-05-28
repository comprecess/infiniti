import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './ViewBusinessModel.module.scss'
import { Routes } from '../../../../app/router/routes'
import { ValuesProps } from '../../../../app/constants/constants'
import { BackButton } from '../../../../shared/ui/BackButton/BackButton'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { StatusProfitability } from '../../../../shared/ui/StatusProfitability/StatusProfitability'
import { getBusinessModelFullInfo } from '../../../../shared/utils/api/Admin/BusinessPlan/BusinessModel/get-business-model-full-info'
import { sanitizeMessage } from '../../../../shared/utils/TextEditor/sanitizeMessage'
import { useIdFromUrl } from '../../../../shared/utils/usefulMethods'

// ─── SVG Icons ───────────────────────────────────────────────────────────────

const IconOverview = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
)
const IconPassport = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/>
    <path d="M12 2a14.5 14.5 0 0 1 0 20M12 2a14.5 14.5 0 0 0 0 20M2 12h20"/>
  </svg>
)
const IconRevenue = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
)
const IconEconomics = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
  </svg>
)
const IconHowItWorks = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
)
const IconTransfer = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
)
const IconRisks = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
)
const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)
const IconExternalLink = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
)

// ─── Nav section descriptions ────────────────────────────────────────────────

const NAV_DESCS: Record<string, string> = {
  passport:  'Who is the client, JTBD, value prop, moat, revenue logic',
  revenue:   'Revenue streams — subscriptions, API, white-label and more',
  economics: 'ARPA, CAC, LTV, payback, NRR — how the numbers work',
  howto:     'Implementation steps, GTM motion, operating model',
  transfer:  'What moves to new markets, what needs adaptation',
  risks:     'What\'s proven, what\'s a bet, where the dangers are',
}

const TABS = [
  { id: 'overview',  label: 'Overview',       Icon: IconOverview   },
  { id: 'passport',  label: 'Passport',        Icon: IconPassport   },
  { id: 'revenue',   label: 'Revenue',         Icon: IconRevenue    },
  { id: 'economics', label: 'Economics',       Icon: IconEconomics  },
  { id: 'howto',     label: 'How It Works',    Icon: IconHowItWorks },
  { id: 'transfer',  label: 'Transferability', Icon: IconTransfer   },
  { id: 'risks',     label: 'Facts & Risks',   Icon: IconRisks      },
]

// ─── Component ────────────────────────────────────────────────────────────────

export const AdminViewBusinessModel = () => {
  const id = useIdFromUrl('business-model')
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('overview')
  const [progress, setProgress]   = useState(0)
  const bodyRef    = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  const { data: model, isLoading } = useQuery({
    queryKey: ['admin-model', id],
    queryFn: async () => {
      if (!id) return
      const response = await getBusinessModelFullInfo(id)
      if (!response.status) return
      return response.data.data
    },
    placeholderData: prev => prev,
  })

  useEffect(() => {
    const el = bodyRef.current
    if (!el) return
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el
      const pct = scrollHeight > clientHeight
        ? Math.round((scrollTop / (scrollHeight - clientHeight)) * 100) : 0
      setProgress(pct)
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

  const scrollTo = (tabId: string) => {
    const sec = sectionRefs.current[tabId]
    if (sec && bodyRef.current) {
      bodyRef.current.scrollTo({ top: sec.offsetTop - 8, behavior: 'smooth' })
    }
    setActiveTab(tabId)
  }

  const isValidHTML = (v?: string) => !!v && v !== '<p><br></p>'

  const handlePreview = () => {
    if (!model) return
    window.open(
      `${import.meta.env.VITE_MAIN_DOMAIN}/${Routes.public}/${Routes.view}/${Routes.businessModel}/${model.publicToken}`,
      '_blank',
    )
  }

  const handleEdit = () => {
    if (!id) return
    navigate(`/${Routes.adminPages}/${Routes.businessPlan}/${Routes.edit}/${Routes.businessModel}/${id}`)
  }

  useEffect(() => {
    document.title = model ? `Admin | ${model.title}` : 'Admin | Business Model'
  }, [model])

  if (isLoading || !model) {
    return <div className={styles.loadingWrapper}><LoadingSpinner size="xl" /></div>
  }

  const profitabilityValue = model.profitability?.[0]?.value ?? ''
  const publicUrl = `${import.meta.env.VITE_MAIN_DOMAIN}/${Routes.public}/${Routes.view}/${Routes.businessModel}/${model.publicToken}`

  return (
    <div className={styles.pageWrapper}>

      {/* ── Tab Bar ── */}
      <div className={styles.tabBar}>
        <div className={styles.tabBarInner}>
          {TABS.map(({ id: tabId, label, Icon }) => (
            <button
              key={tabId}
              className={`${styles.tab} ${activeTab === tabId ? styles.tabActive : ''}`}
              onClick={() => scrollTo(tabId)}
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

      {/* ── Body ── */}
      <div className={styles.body} ref={bodyRef}>

        {/* ══ OVERVIEW ══ */}
        <section id="overview" ref={el => { sectionRefs.current['overview'] = el }} className={styles.section}>

          {/* Admin top row: back + actions */}
          <div className={styles.topRow}>
            <BackButton />
            <div className={styles.adminActions}>
              <button className={styles.btnOutline} onClick={handleEdit}>
                <IconEdit /> Edit
              </button>
              <button className={styles.btnPrimary} onClick={handlePreview}>
                <IconExternalLink /> Public Preview
              </button>
            </div>
          </div>

          {/* Public URL strip */}
          <div className={styles.urlStrip}>
            <span className={styles.urlLabel}>Public URL</span>
            <a href={publicUrl} target="_blank" rel="noreferrer" className={styles.urlValue}>
              {publicUrl}
            </a>
          </div>

          {/* Hero */}
          {model.content && (
            <div className={styles.heroImgWrap}>
              <img src={model.content} alt={model.title} className={styles.heroImg} />
            </div>
          )}

          {/* Title card */}
          <div className={styles.card}>
            <div className={styles.titleRow}>
              <h1 className={styles.modelTitle}>{model.title}</h1>
              {profitabilityValue && <StatusProfitability profitability={profitabilityValue} />}
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
              {model.age && <span className={styles.pill}>{model.age} yrs proven</span>}
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
                <span className={styles.kpiLabel}>Start date</span>
                <span className={styles.kpiValue}>{model.start}</span>
              </div>
            )}
            {model.category?.length > 0 && (
              <div className={styles.kpiItem}>
                <span className={styles.kpiLabel}>Category</span>
                <span className={styles.kpiValue}>{model.category[0].value}</span>
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

          {/* Sections nav — with descriptions like mockup */}
          <h2 className={styles.explorTitle}>Explore sections</h2>
          <div className={styles.navList}>
            {TABS.filter(t => t.id !== 'overview').map(({ id: tabId, label, Icon }) => (
              <button key={tabId} className={styles.navItem} onClick={() => scrollTo(tabId)}>
                <div className={styles.navIcon}><Icon /></div>
                <div className={styles.navBody}>
                  <span className={styles.navTitle}>{label}</span>
                  <span className={styles.navDesc}>{NAV_DESCS[tabId]}</span>
                </div>
                <span className={styles.navArrow}>›</span>
              </button>
            ))}
          </div>
        </section>

        {/* ══ PASSPORT ══ */}
        <section id="passport" ref={el => { sectionRefs.current['passport'] = el }} className={styles.section}>
          <h2 className={styles.sectionTitle}><span className={styles.sectionIcon}><IconPassport /></span>Model Passport</h2>

          {/* Quote block — like mockup */}
          {model.description && (
            <div className={styles.quote}>{model.description}</div>
          )}

          <div className={styles.card}>
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
            {model.price && (
              <div className={styles.infoRow}>
                <span className={styles.metaLabel}>Price</span>
                <span className={styles.metaValue}>{model.price}</span>
              </div>
            )}
            {model.age && (
              <div className={styles.infoRow}>
                <span className={styles.metaLabel}>Model age</span>
                <span className={styles.metaValue}>{model.age} years</span>
              </div>
            )}
          </div>

          {isValidHTML(model.targetClient) && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Target Client &amp; JTBD</h3>
              <div dangerouslySetInnerHTML={{ __html: sanitizeMessage(model.targetClient) }} className="dangerouslySetInnerHTML" />
            </div>
          )}
          {isValidHTML(model.valueProposition) && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Value Proposition &amp; Moat</h3>
              <div dangerouslySetInnerHTML={{ __html: sanitizeMessage(model.valueProposition) }} className="dangerouslySetInnerHTML" />
            </div>
          )}
          {isValidHTML(model.currentInvestors) && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Current Investors</h3>
              <div dangerouslySetInnerHTML={{ __html: sanitizeMessage(model.currentInvestors) }} className="dangerouslySetInnerHTML" />
            </div>
          )}
        </section>

        {/* ══ REVENUE ══ */}
        <section id="revenue" ref={el => { sectionRefs.current['revenue'] = el }} className={styles.section}>
          <h2 className={styles.sectionTitle}><span className={styles.sectionIcon}><IconRevenue /></span>Revenue Streams</h2>

          {isValidHTML(model.revenueLogic) && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Revenue Logic</h3>
              <div dangerouslySetInnerHTML={{ __html: sanitizeMessage(model.revenueLogic) }} className="dangerouslySetInnerHTML" />
            </div>
          )}

          {isValidHTML(model.financialModel) ? (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Revenue Streams Detail</h3>
              <div dangerouslySetInnerHTML={{ __html: sanitizeMessage(model.financialModel) }} className="dangerouslySetInnerHTML" />
            </div>
          ) : (
            <div className={styles.emptyCard}><span className={styles.emptyText}>No revenue data yet</span></div>
          )}
        </section>

        {/* ══ ECONOMICS ══ */}
        <section id="economics" ref={el => { sectionRefs.current['economics'] = el }} className={styles.section}>
          <h2 className={styles.sectionTitle}><span className={styles.sectionIcon}><IconEconomics /></span>Unit Economics</h2>

          <div className={styles.kpiGrid}>
            <div className={styles.kpiItem}>
              <span className={styles.kpiLabel}>Plan Price</span>
              <span className={`${styles.kpiValue} ${styles.kpiBlue}`}>{model.price}</span>
              <span className={styles.kpiSub}>one-time</span>
            </div>
            {model.age && (
              <div className={styles.kpiItem}>
                <span className={styles.kpiLabel}>Model Age</span>
                <span className={styles.kpiValue}>{model.age} yrs</span>
              </div>
            )}
            {model.technologies?.length > 0 && (
              <div className={styles.kpiItem}>
                <span className={styles.kpiLabel}>Stack</span>
                <span className={`${styles.kpiValue} ${styles.kpiMint}`}>{model.technologies.length}</span>
                <span className={styles.kpiSub}>technologies</span>
              </div>
            )}
          </div>

          {/* Note box — like mockup "How to read" */}
          <div className={styles.note}>
            <strong>How to read:</strong> A healthy model has high gross margin, CAC payback under 12 months,
            and NRR above 100% — meaning existing clients grow your revenue without new sales.
          </div>

          {isValidHTML(model.unitEconomics) && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Unit Economics</h3>
              <div dangerouslySetInnerHTML={{ __html: sanitizeMessage(model.unitEconomics) }} className="dangerouslySetInnerHTML" />
            </div>
          )}
          {isValidHTML(model.marketAnalysis) && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Market Analysis</h3>
              <div dangerouslySetInnerHTML={{ __html: sanitizeMessage(model.marketAnalysis) }} className="dangerouslySetInnerHTML" />
            </div>
          )}
        </section>

        {/* ══ HOW IT WORKS ══ */}
        <section id="howto" ref={el => { sectionRefs.current['howto'] = el }} className={styles.section}>
          <h2 className={styles.sectionTitle}><span className={styles.sectionIcon}><IconHowItWorks /></span>How It Works</h2>

          {isValidHTML(model.stagesImplementation) ? (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Implementation Stages</h3>
              <div dangerouslySetInnerHTML={{ __html: sanitizeMessage(model.stagesImplementation) }} className="dangerouslySetInnerHTML" />
            </div>
          ) : (
            <div className={styles.emptyCard}><span className={styles.emptyText}>No implementation stages yet</span></div>
          )}
        </section>

        {/* ══ TRANSFERABILITY ══ */}
        <section id="transfer" ref={el => { sectionRefs.current['transfer'] = el }} className={styles.section}>
          <h2 className={styles.sectionTitle}><span className={styles.sectionIcon}><IconTransfer /></span>Transferability</h2>

          <p className={styles.sectionSubtitle}>Before generating a plan — understand what transfers and what needs adaptation.</p>

          {isValidHTML(model.partnershipOptions) ? (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Partnership Options &amp; Transferability</h3>
              <div dangerouslySetInnerHTML={{ __html: sanitizeMessage(model.partnershipOptions) }} className="dangerouslySetInnerHTML" />
            </div>
          ) : (
            <div className={styles.emptyCard}><span className={styles.emptyText}>No transferability data yet</span></div>
          )}
        </section>

        {/* ══ FACTS & RISKS ══ */}
        <section id="risks" ref={el => { sectionRefs.current['risks'] = el }} className={styles.section}>
          <h2 className={styles.sectionTitle}><span className={styles.sectionIcon}><IconRisks /></span>Facts &amp; Risks</h2>

          {isValidHTML(model.factsHypothesesRisks) ? (
            <div className={styles.card}>
              <div dangerouslySetInnerHTML={{ __html: sanitizeMessage(model.factsHypothesesRisks) }} className="dangerouslySetInnerHTML" />
            </div>
          ) : isValidHTML(model.marketAnalysis) ? (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Market Facts</h3>
              <div dangerouslySetInnerHTML={{ __html: sanitizeMessage(model.marketAnalysis) }} className="dangerouslySetInnerHTML" />
            </div>
          ) : (
            <div className={styles.emptyCard}><span className={styles.emptyText}>No facts &amp; risks data yet</span></div>
          )}

          {/* Admin manage CTA — like mockup "Ready to generate" card */}
          <div className={styles.editCta}>
            <div className={styles.editCtaInner}>
              <div>
                <h3 className={styles.editCtaTitle}>Manage this model</h3>
                <p className={styles.editCtaDesc}>Edit content, update images, change pricing or publish to clients.</p>
              </div>
              <div className={styles.editCtaButtons}>
                <button className={styles.btnPrimary} onClick={handleEdit}>
                  <IconEdit /> Edit Model
                </button>
                <button className={styles.btnOutline} onClick={handlePreview}>
                  <IconExternalLink /> Public Preview
                </button>
              </div>
            </div>
            <div className={styles.editCtaMeta}>
              Public URL: <a href={publicUrl} target="_blank" rel="noreferrer" className={styles.editCtaUrl}>{publicUrl}</a>
            </div>
          </div>
        </section>

        <div className={styles.bottomSpacer} />
      </div>
    </div>
  )
}
