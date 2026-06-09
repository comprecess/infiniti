import { useState, useEffect } from 'react'
import styles from './KnowledgeTab.module.scss'
import { getTaskKnowledge } from '../../../../../../shared/utils/api/Resident/Knowledge/knowledge-api'

interface KnowledgeTabProps {
  taskId: number
}

interface DecisionRecord {
  id: number
  title: string
  context: string | null
  decision: string | null
  alternatives: string | null
  status: string
  decision_date: string | null
}

interface PromptRecord {
  id: number
  objective: string
  prompt_text: string
  output_text: string | null
  status: string
  execution_date: string | null
}

interface ValidationRecord {
  id: number
  finding: string
  severity: string
  resolution: string | null
  status: string
}

interface OutcomeRecord {
  id: number
  expected_result: string | null
  actual_result: string | null
  metrics: any
  lessons_learned: string | null
  outcome_date: string | null
}

interface TaskContextData {
  problem_statement: string | null
  business_value: string | null
  success_criteria: string | null
  origin_source: string | null
}

interface KnowledgeAsset {
  id: number
  title: string
  asset_type: string
  content: string | null
  version: string | null
}

interface WorkspaceData {
  context: TaskContextData | null
  assets: KnowledgeAsset[]
  decisions: DecisionRecord[]
  prompts: PromptRecord[]
  validations: ValidationRecord[]
  outcomes: OutcomeRecord[]
}

type SubTab = 'context' | 'decisions' | 'prompts' | 'validations' | 'outcomes' | 'assets'

// Simple markdown renderer for .md content display
const renderMarkdown = (md: string): string => {
  let html = md
  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')
  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
  // Inline code
  html = html.replace(/`(.+?)`/g, '<code>$1</code>')
  // Horizontal rule
  html = html.replace(/^---$/gm, '<hr/>')
  // Unordered lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
  // Tables (basic)
  const tableRegex = /\|(.+)\|\n\|[-| :]+\|\n((\|.+\|\n?)+)/g
  html = html.replace(tableRegex, (match, headerRow, bodyRows) => {
    const headers = headerRow.split('|').filter((h: string) => h.trim())
    const rows = bodyRows.trim().split('\n').map((row: string) =>
      row.split('|').filter((c: string) => c.trim())
    )
    let table = '<table><thead><tr>'
    headers.forEach((h: string) => { table += `<th>${h.trim()}</th>` })
    table += '</tr></thead><tbody>'
    rows.forEach((row: string[]) => {
      table += '<tr>'
      row.forEach((cell: string) => { table += `<td>${cell.trim()}</td>` })
      table += '</tr>'
    })
    table += '</tbody></table>'
    return table
  })
  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
  // Paragraphs (double newlines)
  html = html.replace(/\n\n/g, '</p><p>')
  html = '<p>' + html + '</p>'
  // Clean up empty paragraphs
  html = html.replace(/<p><\/p>/g, '')
  html = html.replace(/<p>(<h[1-3]>)/g, '$1')
  html = html.replace(/(<\/h[1-3]>)<\/p>/g, '$1')
  html = html.replace(/<p>(<ul>)/g, '$1')
  html = html.replace(/(<\/ul>)<\/p>/g, '$1')
  html = html.replace(/<p>(<table>)/g, '$1')
  html = html.replace(/(<\/table>)<\/p>/g, '$1')
  html = html.replace(/<p>(<hr\/>)/g, '$1')
  html = html.replace(/(<hr\/>)<\/p>/g, '$1')
  html = html.replace(/<p>(<blockquote>)/g, '$1')
  html = html.replace(/(<\/blockquote>)<\/p>/g, '$1')
  return html
}

// SVG Icons inline
const DocIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C5.45 2 5 2.45 5 3V21C5 21.55 5.45 22 6 22H18C18.55 22 19 21.55 19 21V7L14 2Z" stroke="#a5b4fc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2V7H19" stroke="#a5b4fc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 13H15" stroke="#a5b4fc" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M9 16H13" stroke="#a5b4fc" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
)

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3V15M12 15L8 11M12 15L16 11" stroke="#00c896" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 17V19C4 20.1 4.9 21 6 21H18C19.1 21 20 20.1 20 19V17" stroke="#00c896" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ViewIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5C5.636 5 2 12 2 12C2 12 5.636 19 12 19C18.364 19 22 12 22 12C22 12 18.364 5 12 5Z" stroke="#a5b4fc" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="3" stroke="#a5b4fc" strokeWidth="1.8"/>
  </svg>
)

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18M6 6L18 18" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const KnowledgeTab = ({ taskId }: KnowledgeTabProps) => {
  const [data, setData] = useState<WorkspaceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('context')
  const [viewingAsset, setViewingAsset] = useState<KnowledgeAsset | null>(null)
  const [viewingPrompt, setViewingPrompt] = useState<PromptRecord | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const response = await getTaskKnowledge(taskId)
      if (response.status) {
        setData(response.data)
      }
      setLoading(false)
    }
    fetchData()
  }, [taskId])

  const handleDownload = (title: string, content: string) => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title.replace(/[^a-zA-Z0-9_\-\s]/g, '').replace(/\s+/g, '_')}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return <div className={styles.loading}>Loading knowledge...</div>
  }

  if (!data) {
    return <div className={styles.empty}>No knowledge data available</div>
  }

  const subTabs: { key: SubTab; label: string; count: number }[] = [
    { key: 'context', label: 'Context', count: data.context ? 1 : 0 },
    { key: 'assets', label: 'Assets', count: data.assets.length },
    { key: 'decisions', label: 'Decisions', count: data.decisions.length },
    { key: 'prompts', label: 'Prompts', count: data.prompts.length },
    { key: 'validations', label: 'Validations', count: data.validations.length },
    { key: 'outcomes', label: 'Outcomes', count: data.outcomes.length },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Blocker': return '#ef4444'
      case 'High': return '#f97316'
      case 'Medium': return '#eab308'
      case 'Low': return '#22c55e'
      case 'Pass': return '#06b6d4'
      default: return '#94a3b8'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted': return '#22c55e'
      case 'Proposed': return '#3b82f6'
      case 'Deprecated': return '#ef4444'
      case 'Superseded': return '#f97316'
      case 'Success': return '#22c55e'
      case 'Partial': return '#eab308'
      case 'Failed': return '#ef4444'
      case 'Open': return '#f97316'
      case 'Resolved': return '#22c55e'
      case 'Ignored': return '#94a3b8'
      default: return '#94a3b8'
    }
  }

  return (
    <div className={styles.wrapper}>
      {/* Markdown Viewer Modal for Assets */}
      {viewingAsset && (
        <div className={styles.viewerOverlay} onClick={() => setViewingAsset(null)}>
          <div className={styles.viewerModal} onClick={e => e.stopPropagation()}>
            <div className={styles.viewerHeader}>
              <div className={styles.viewerTitle}>
                <DocIcon />
                <span>{viewingAsset.title}</span>
                {viewingAsset.version && <span className={styles.viewerVersion}>v{viewingAsset.version}</span>}
              </div>
              <div className={styles.viewerActions}>
                {viewingAsset.content && (
                  <button
                    className={styles.viewerBtn}
                    onClick={() => handleDownload(viewingAsset.title, viewingAsset.content!)}
                    title="Download as .md"
                  >
                    <DownloadIcon /> Download
                  </button>
                )}
                <button className={styles.viewerCloseBtn} onClick={() => setViewingAsset(null)}>
                  <CloseIcon />
                </button>
              </div>
            </div>
            <div className={styles.viewerBody}>
              {viewingAsset.content ? (
                <div
                  className={styles.markdownContent}
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(viewingAsset.content) }}
                />
              ) : (
                <div className={styles.emptyState}>No content available for this asset</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Markdown Viewer Modal for Prompts */}
      {viewingPrompt && (
        <div className={styles.viewerOverlay} onClick={() => setViewingPrompt(null)}>
          <div className={styles.viewerModal} onClick={e => e.stopPropagation()}>
            <div className={styles.viewerHeader}>
              <div className={styles.viewerTitle}>
                <DocIcon />
                <span>{viewingPrompt.objective}</span>
              </div>
              <div className={styles.viewerActions}>
                <button
                  className={styles.viewerBtn}
                  onClick={() => handleDownload(viewingPrompt.objective, viewingPrompt.prompt_text + (viewingPrompt.output_text ? '\n\n---\n\n## Output\n\n' + viewingPrompt.output_text : ''))}
                  title="Download as .md"
                >
                  <DownloadIcon /> Download
                </button>
                <button className={styles.viewerCloseBtn} onClick={() => setViewingPrompt(null)}>
                  <CloseIcon />
                </button>
              </div>
            </div>
            <div className={styles.viewerBody}>
              <div className={styles.markdownContent}>
                <h3>Prompt</h3>
                <div dangerouslySetInnerHTML={{ __html: renderMarkdown(viewingPrompt.prompt_text) }} />
                {viewingPrompt.output_text && (
                  <>
                    <hr />
                    <h3>Output</h3>
                    <div dangerouslySetInnerHTML={{ __html: renderMarkdown(viewingPrompt.output_text) }} />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={styles.subTabs}>
        {subTabs.map(tab => (
          <button
            key={tab.key}
            className={`${styles.subTab} ${activeSubTab === tab.key ? styles.active : ''}`}
            onClick={() => setActiveSubTab(tab.key)}
          >
            {tab.label}
            {tab.count > 0 && <span className={styles.badge}>{tab.count}</span>}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {activeSubTab === 'context' && (
          <div className={styles.contextSection}>
            {data.context ? (
              <>
                {data.context.problem_statement && (
                  <div className={styles.field}>
                    <label>Problem Statement</label>
                    <p>{data.context.problem_statement}</p>
                  </div>
                )}
                {data.context.business_value && (
                  <div className={styles.field}>
                    <label>Business Value</label>
                    <p>{data.context.business_value}</p>
                  </div>
                )}
                {data.context.success_criteria && (
                  <div className={styles.field}>
                    <label>Success Criteria</label>
                    <p>{data.context.success_criteria}</p>
                  </div>
                )}
                {data.context.origin_source && (
                  <div className={styles.field}>
                    <label>Origin</label>
                    <p>{data.context.origin_source}</p>
                  </div>
                )}
              </>
            ) : (
              <div className={styles.emptyState}>No context defined for this task</div>
            )}
          </div>
        )}

        {activeSubTab === 'assets' && (
          <div className={styles.listSection}>
            {data.assets.length > 0 ? (
              data.assets.map(asset => (
                <div key={asset.id} className={`${styles.card} ${styles.clickableCard}`}>
                  <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}>{asset.title}</span>
                    <span className={styles.typeBadge}>{asset.asset_type}</span>
                  </div>
                  {asset.version && <span className={styles.version}>v{asset.version}</span>}
                  <div className={styles.cardActions}>
                    <button
                      className={styles.actionBtn}
                      onClick={() => setViewingAsset(asset)}
                      title="View content"
                    >
                      <ViewIcon /> <span>View</span>
                    </button>
                    {asset.content && (
                      <button
                        className={styles.actionBtn}
                        onClick={() => handleDownload(asset.title, asset.content!)}
                        title="Download as .md"
                      >
                        <DownloadIcon /> <span>Download</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>No knowledge assets attached</div>
            )}
          </div>
        )}

        {activeSubTab === 'decisions' && (
          <div className={styles.listSection}>
            {data.decisions.length > 0 ? (
              data.decisions.map(dr => (
                <div key={dr.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}>{dr.title}</span>
                    <span
                      className={styles.statusBadge}
                      style={{ backgroundColor: getStatusColor(dr.status) }}
                    >
                      {dr.status}
                    </span>
                  </div>
                  {dr.decision && <p className={styles.cardBody}>{dr.decision}</p>}
                  {dr.decision_date && (
                    <span className={styles.date}>{new Date(dr.decision_date).toLocaleDateString()}</span>
                  )}
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>No decision records</div>
            )}
          </div>
        )}

        {activeSubTab === 'prompts' && (
          <div className={styles.listSection}>
            {data.prompts.length > 0 ? (
              data.prompts.map(pr => (
                <div key={pr.id} className={`${styles.card} ${styles.clickableCard}`}>
                  <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}>{pr.objective}</span>
                    <span
                      className={styles.statusBadge}
                      style={{ backgroundColor: getStatusColor(pr.status) }}
                    >
                      {pr.status}
                    </span>
                  </div>
                  <p className={styles.cardBody + ' ' + styles.mono}>{pr.prompt_text.substring(0, 200)}...</p>
                  {pr.execution_date && (
                    <span className={styles.date}>{new Date(pr.execution_date).toLocaleDateString()}</span>
                  )}
                  <div className={styles.cardActions}>
                    <button
                      className={styles.actionBtn}
                      onClick={() => setViewingPrompt(pr)}
                      title="View full prompt"
                    >
                      <ViewIcon /> <span>View</span>
                    </button>
                    <button
                      className={styles.actionBtn}
                      onClick={() => handleDownload(pr.objective, pr.prompt_text + (pr.output_text ? '\n\n---\n\n## Output\n\n' + pr.output_text : ''))}
                      title="Download as .md"
                    >
                      <DownloadIcon /> <span>Download</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>No prompt records</div>
            )}
          </div>
        )}

        {activeSubTab === 'validations' && (
          <div className={styles.listSection}>
            {data.validations.length > 0 ? (
              data.validations.map(vr => (
                <div key={vr.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <span
                      className={styles.severityBadge}
                      style={{ backgroundColor: getSeverityColor(vr.severity) }}
                    >
                      {vr.severity}
                    </span>
                    <span
                      className={styles.statusBadge}
                      style={{ backgroundColor: getStatusColor(vr.status) }}
                    >
                      {vr.status}
                    </span>
                  </div>
                  <p className={styles.cardBody}>{vr.finding}</p>
                  {vr.resolution && <p className={styles.resolution}>Resolution: {vr.resolution}</p>}
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>No validation records</div>
            )}
          </div>
        )}

        {activeSubTab === 'outcomes' && (
          <div className={styles.listSection}>
            {data.outcomes.length > 0 ? (
              data.outcomes.map(or => (
                <div key={or.id} className={styles.card}>
                  {or.expected_result && (
                    <div className={styles.field}>
                      <label>Expected</label>
                      <p>{or.expected_result}</p>
                    </div>
                  )}
                  {or.actual_result && (
                    <div className={styles.field}>
                      <label>Actual</label>
                      <p>{or.actual_result}</p>
                    </div>
                  )}
                  {or.lessons_learned && (
                    <div className={styles.field}>
                      <label>Lessons Learned</label>
                      <p>{or.lessons_learned}</p>
                    </div>
                  )}
                  {or.outcome_date && (
                    <span className={styles.date}>{new Date(or.outcome_date).toLocaleDateString()}</span>
                  )}
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>No outcome records</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
