import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

import styles from './BusinessModelViewPage.module.scss'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { StatusProfitability } from '../../../shared/ui/StatusProfitability/StatusProfitability'
import { getPublicBusinessModel } from '../../../shared/utils/api/Public/get-public-business-model'
import { sanitizeMessage } from '../../../shared/utils/TextEditor/sanitizeMessage'
import { ValuesProps } from '../../../app/constants/constants'

// ─── Back chevron ─────────────────────────────────────────────────────────────
const IconBack = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// ─── HTML entity decoder ────────────────────────────────────────────────────────
// Pill values stored in DB may contain HTML entities (e.g. "Logistics &amp; Transport")
const decodeEntities = (s: string): string =>
  s
    .replace(/&amp;/g,  '&')
    .replace(/&lt;/g,   '<')
    .replace(/&gt;/g,   '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")

// ─── Token helper ─────────────────────────────────────────────────────────────

const extractToken = (url: string): string | null => {
  const m = url.match(/\/business-model\/([^/]+)$/)
  return m ? m[1] : null
}

const useToken = () => {
  const location = useLocation()
  return useMemo(() => extractToken(location.pathname), [location.pathname])
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────

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

// ─── Tabs config ──────────────────────────────────────────────────────────────

const TABS = [
  { id: 'overview',  label: 'Overview',        Icon: IconOverview,   desc: 'Hero, key metrics and section map'                       },
  { id: 'passport',  label: 'Passport',         Icon: IconPassport,   desc: 'Who is the client, JTBD, value prop, moat'               },
  { id: 'revenue',   label: 'Revenue',          Icon: IconRevenue,    desc: '6 ways this model generates income'                     },
  { id: 'economics', label: 'Economics',        Icon: IconEconomics,  desc: 'ARPA, CAC, LTV, payback, NRR — the numbers'              },
  { id: 'howto',     label: 'How It Works',     Icon: IconHowItWorks, desc: 'Implementation steps, GTM motion'                        },
  { id: 'transfer',  label: 'Transferability',  Icon: IconTransfer,   desc: 'What moves to new markets, what needs adaptation'        },
  { id: 'risks',     label: 'Facts & Risks',    Icon: IconRisks,      desc: 'What\'s proven, what\'s a bet, where the dangers are'    },
]

// ─── Component ────────────────────────────────────────────────────────────────

export const BusinessModelViewPage = () => {
  const token = useToken()
  const [model, setModel] = useState<any | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [progress, setProgress] = useState(0)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  useEffect(() => {
    if (!token) return
    getPublicBusinessModel(token).then(res => {
      if (res.status) setModel(res.data.data)
    })
  }, [token])

  useEffect(() => {
    document.title = model ? `${model.title} — Infiniti` : 'Infiniti | Business Model'
  }, [model])

  // Scroll tracking — window scroll (page is not overflow:hidden)
  useEffect(() => {
    if (!model) return
    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const pct = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0
      setProgress(pct)
      for (let i = TABS.length - 1; i >= 0; i--) {
        const sec = sectionRefs.current[TABS[i].id]
        if (sec && sec.getBoundingClientRect().top <= 120) {
          setActiveTab(TABS[i].id)
          break
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [model])

  const scrollTo = (tabId: string) => {
    const sec = sectionRefs.current[tabId]
    if (sec) {
      const y = sec.getBoundingClientRect().top + window.scrollY - 56
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
    setActiveTab(tabId)
  }

  const isHTML = (v?: string) => !!v && v.trim() !== '' && v !== '<p><br></p>'

  if (!model) {
    return (
      <div className={styles.loadingWrapper}>
        <LoadingSpinner size="xl" />
      </div>
    )
  }

  const profitability = model.profitability?.[0]?.value ?? ''

  return (
    <div className={styles.pageWrapper}>

      {/* ── Fixed header (topbar) ── */}
      <div className={styles.topbar}>
        <a href="https://console.infiniti.stream" className={styles.backBtn}>
          <IconBack />
          Business Models
        </a>
        <span className={styles.topbarTitle}>{model.title}</span>
        {profitability && (
          <div className={styles.topbarBadge}>{profitability}</div>
        )}
      </div>

      {/* ── Fixed tab bar (sits below topbar) ── */}
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

      {/* ── Scrollable body ── */}
      <div className={styles.body}>

        {/* ══════════════════════════════════════════════════
            SCREEN 1 — OVERVIEW
        ══════════════════════════════════════════════════ */}
        <section
          id="overview"
          ref={el => { sectionRefs.current['overview'] = el }}
          className={styles.section}
        >
          {/* Hero image */}
          {model.content && (
            <img src={model.content} alt={model.title} className={styles.heroImg} />
          )}

          {/* Title card */}
          <div className={styles.card}>
            <div className={styles.titleRow}>
              <h1 className={styles.modelTitle}>{model.title}</h1>
              {profitability && <StatusProfitability profitability={profitability} />}
            </div>
            {model.fullDescription && (
              <p className={styles.modelDesc}>{model.fullDescription}</p>
            )}
            <div className={styles.pills}>
              {model.industries?.map((i: ValuesProps) => (
                <span key={i.id} className={`${styles.pill} ${styles.pillBlue}`}>{decodeEntities(i.value)}</span>
              ))}
              {model.category?.map((c: ValuesProps) => (
                <span key={c.id} className={`${styles.pill} ${styles.pillBlue}`}>{decodeEntities(c.value)}</span>
              ))}
              {model.location?.map((l: ValuesProps) => (
                <span key={l.id} className={styles.pill}>{decodeEntities(l.value)}</span>
              ))}
              {model.age && <span className={styles.pill}>{model.age} yrs proven</span>}
            </div>
          </div>

          {/* KPI grid — always 4 items for visual balance */}
          <div className={styles.kpiGrid}>
            <div className={styles.kpiItem}>
              <span className={styles.kpiLbl}>Plan Price</span>
              <span className={`${styles.kpiVal} ${styles.kpiBlue}`}>{model.price}</span>
              <span className={styles.kpiSub}>one-time</span>
            </div>
            <div className={styles.kpiItem}>
              <span className={styles.kpiLbl}>Proven</span>
              <span className={styles.kpiVal}>{model.age ? `${model.age} yrs` : '10+ yrs'}</span>
              <span className={styles.kpiSub}>track record</span>
            </div>
            <div className={styles.kpiItem}>
              <span className={styles.kpiLbl}>Stack</span>
              <span className={`${styles.kpiVal} ${styles.kpiMint}`}>
                {model.technologies?.length > 0 ? model.technologies.length : '—'}
              </span>
              <span className={styles.kpiSub}>technologies</span>
            </div>
            <div className={styles.kpiItem}>
              <span className={styles.kpiLbl}>Industries</span>
              <span className={`${styles.kpiVal} ${styles.kpiAmber}`}>
                {model.industries?.length > 0 ? model.industries.length : '—'}
              </span>
              <span className={styles.kpiSub}>verticals</span>
            </div>
          </div>

          {/* Sections nav — exactly like mockup */}
          <h2 className={styles.explorTitle}>Explore</h2>
          <div className={styles.navList}>
            {TABS.filter(t => t.id !== 'overview').map(({ id: tabId, label, Icon, desc }) => (
              <button key={tabId} className={styles.navItem} onClick={() => scrollTo(tabId)}>
                <div className={styles.navIcon}><Icon /></div>
                <div className={styles.navBody}>
                  <span className={styles.navTitle}>{label}</span>
                  <span className={styles.navDesc}>{desc}</span>
                </div>
                <span className={styles.navArrow}>›</span>
              </button>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            SCREEN 2 — PASSPORT
        ══════════════════════════════════════════════════ */}
        <section
          id="passport"
          ref={el => { sectionRefs.current['passport'] = el }}
          className={styles.section}
        >
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}><IconPassport /></span>
            Model Passport
          </h2>

          {/* Quote — first thing after title, exactly like mockup */}
          {model.description && (
            <div className={styles.quote}>{model.description}</div>
          )}

          {/* Props card */}
          <div className={styles.card}>
            {model.industries?.length > 0 && (
              <div className={styles.row}>
                <span className={styles.metaLabel}>Industries</span>
                <div className={styles.pills}>
                  {model.industries.map((i: ValuesProps) => (
                    <span key={i.id} className={`${styles.pill} ${styles.pillBlue}`}>{decodeEntities(i.value)}</span>
                  ))}
                </div>
              </div>
            )}
            {model.technologies?.length > 0 && (
              <div className={styles.row}>
                <span className={styles.metaLabel}>Technologies</span>
                <div className={styles.pills}>
                  {model.technologies.map((t: ValuesProps) => (
                    <span key={t.id} className={`${styles.pill} ${styles.pillMint}`}>{decodeEntities(t.value)}</span>
                  ))}
                </div>
              </div>
            )}
            {model.location?.length > 0 && (
              <div className={styles.row}>
                <span className={styles.metaLabel}>Location</span>
                <div className={styles.pills}>
                  {model.location.map((l: ValuesProps) => (
                    <span key={l.id} className={styles.pill}>{decodeEntities(l.value)}</span>
                  ))}
                </div>
              </div>
            )}
            {model.category?.length > 0 && (
              <div className={styles.row}>
                <span className={styles.metaLabel}>Category</span>
                <div className={styles.pills}>
                  {model.category.map((c: ValuesProps) => (
                    <span key={c.id} className={`${styles.pill} ${styles.pillAmber}`}>{decodeEntities(c.value)}</span>
                  ))}
                </div>
              </div>
            )}
            {model.age && (
              <div className={styles.row}>
                <span className={styles.metaLabel}>Model Age</span>
                <span className={styles.metaValue}>{model.age} years proven</span>
              </div>
            )}
            {model.start && (
              <div className={styles.row}>
                <span className={styles.metaLabel}>Available since</span>
                <span className={styles.metaValue}>{model.start}</span>
              </div>
            )}
          </div>

          {/* Target Client & JTBD — rich HTML */}
          {isHTML(model.targetClient) && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Target Client &amp; JTBD</h3>
              <div
                dangerouslySetInnerHTML={{ __html: sanitizeMessage(model.targetClient) }}
                className="dangerouslySetInnerHTML"
              />
            </div>
          )}

          {/* Value Proposition */}
          {isHTML(model.valueProposition) && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Value Proposition &amp; Moat</h3>
              <div
                dangerouslySetInnerHTML={{ __html: sanitizeMessage(model.valueProposition) }}
                className="dangerouslySetInnerHTML"
              />
            </div>
          )}

        </section>

        {/* ══════════════════════════════════════════════════
            SCREEN 3 — REVENUE STREAMS
        ══════════════════════════════════════════════════ */}
        <section
          id="revenue"
          ref={el => { sectionRefs.current['revenue'] = el }}
          className={styles.section}
        >
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}><IconRevenue /></span>
            Revenue Streams
          </h2>

          {isHTML(model.revenueLogic) && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Revenue Logic</h3>
              <div
                dangerouslySetInnerHTML={{ __html: sanitizeMessage(model.revenueLogic) }}
                className="dangerouslySetInnerHTML"
              />
            </div>
          )}

          {isHTML(model.financialModel) ? (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Revenue Streams Detail</h3>
              <div
                dangerouslySetInnerHTML={{ __html: sanitizeMessage(model.financialModel) }}
                className="dangerouslySetInnerHTML"
              />
            </div>
          ) : (
            <div className={styles.emptyCard}><span className={styles.emptyText}>No revenue data yet</span></div>
          )}

        </section>

        {/* ══════════════════════════════════════════════════
            SCREEN 4 — UNIT ECONOMICS
        ══════════════════════════════════════════════════ */}
        <section
          id="economics"
          ref={el => { sectionRefs.current['economics'] = el }}
          className={styles.section}
        >
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}><IconEconomics /></span>
            Unit Economics
          </h2>

          {/* KPI grid — always 4 items for visual balance */}
          <div className={styles.kpiGrid}>
            <div className={styles.kpiItem}>
              <span className={styles.kpiLbl}>Plan Price</span>
              <span className={`${styles.kpiVal} ${styles.kpiBlue}`}>{model.price}</span>
              <span className={styles.kpiSub}>one-time</span>
            </div>
            <div className={styles.kpiItem}>
              <span className={styles.kpiLbl}>Model Age</span>
              <span className={styles.kpiVal}>{model.age ? `${model.age} yrs` : '10+ yrs'}</span>
              <span className={styles.kpiSub}>track record</span>
            </div>
            <div className={styles.kpiItem}>
              <span className={styles.kpiLbl}>Gross Margin</span>
              <span className={`${styles.kpiVal} ${styles.kpiMint}`}>82%</span>
              <span className={styles.kpiSub}>avg. target</span>
            </div>
            <div className={styles.kpiItem}>
              <span className={styles.kpiLbl}>CAC Payback</span>
              <span className={`${styles.kpiVal} ${styles.kpiAmber}`}>6–7 mo</span>
              <span className={styles.kpiSub}>typical</span>
            </div>
          </div>

          {/* Note box — "How to read" like mockup */}
          <div className={styles.note}>
            <strong>How to read:</strong> Model is healthy when gross margin stays high at scale,
            CAC payback &lt;12 months, and NRR &gt;100% means existing clients grow your revenue
            without new sales.
          </div>

          {isHTML(model.unitEconomics) && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Unit Economics</h3>
              <div
                dangerouslySetInnerHTML={{ __html: sanitizeMessage(model.unitEconomics) }}
                className="dangerouslySetInnerHTML"
              />
            </div>
          )}

          {isHTML(model.marketAnalysis) && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Market Analysis</h3>
              <div
                dangerouslySetInnerHTML={{ __html: sanitizeMessage(model.marketAnalysis) }}
                className="dangerouslySetInnerHTML"
              />
            </div>
          )}

        </section>

        {/* ══════════════════════════════════════════════════
            SCREEN 5 — HOW IT WORKS
        ══════════════════════════════════════════════════ */}
        <section
          id="howto"
          ref={el => { sectionRefs.current['howto'] = el }}
          className={styles.section}
        >
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}><IconHowItWorks /></span>
            How It Works
          </h2>

          {isHTML(model.stagesImplementation) ? (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Implementation Stages</h3>
              <div
                dangerouslySetInnerHTML={{ __html: sanitizeMessage(model.stagesImplementation) }}
                className="dangerouslySetInnerHTML"
              />
            </div>
          ) : (
            <div className={styles.emptyCard}><span className={styles.emptyText}>No implementation data yet</span></div>
          )}

        </section>

        {/* ══════════════════════════════════════════════════
            SCREEN 6 — TRANSFERABILITY
        ══════════════════════════════════════════════════ */}
        <section
          id="transfer"
          ref={el => { sectionRefs.current['transfer'] = el }}
          className={styles.section}
        >
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}><IconTransfer /></span>
            Transferability
          </h2>

          <p className={styles.sectionSubtitle}>
            Before generating a plan — understand what transfers and what needs adaptation.
          </p>

          {isHTML(model.partnershipOptions) ? (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Partnership Options &amp; Transferability</h3>
              <div
                dangerouslySetInnerHTML={{ __html: sanitizeMessage(model.partnershipOptions) }}
                className="dangerouslySetInnerHTML"
              />
            </div>
          ) : (
            <div className={styles.emptyCard}><span className={styles.emptyText}>No transferability data yet</span></div>
          )}

        </section>

        {/* ══════════════════════════════════════════════════
            SCREEN 7 — FACTS / HYPOTHESES / RISKS
        ══════════════════════════════════════════════════ */}
        <section
          id="risks"
          ref={el => { sectionRefs.current['risks'] = el }}
          className={styles.section}
        >
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}><IconRisks /></span>
            Facts · Hypotheses · Risks
          </h2>

          {isHTML(model.factsHypothesesRisks) ? (
            <div className={styles.card}>
              <div
                dangerouslySetInnerHTML={{ __html: sanitizeMessage(model.factsHypothesesRisks) }}
                className="dangerouslySetInnerHTML"
              />
            </div>
          ) : (
            <div className={styles.emptyCard}><span className={styles.emptyText}>No facts &amp; risks data yet</span></div>
          )}

        </section>

        <div className={styles.bottomSpacer} />
      </div>

      {/* ── Sticky CTA bar ── */}
      <div className={styles.ctaBar}>
        <div className={styles.ctaPriceWrap}>
          <span className={styles.ctaPriceLbl}>Generation price</span>
          <span className={styles.ctaPrice}>
            {model.priceAmount && model.priceAmount !== '0' ? model.price : '$299'}
          </span>
        </div>
        <div className={styles.ctaActions}>
          <a
            href="https://console.infiniti.stream"
            className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLg}`}
          >
            Generate Plan
          </a>
        </div>
      </div>

    </div>
  )
}
