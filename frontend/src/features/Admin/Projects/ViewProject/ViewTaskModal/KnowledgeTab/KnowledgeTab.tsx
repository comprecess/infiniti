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

export const KnowledgeTab = ({ taskId }: KnowledgeTabProps) => {
  const [data, setData] = useState<WorkspaceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('context')

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
                <div key={asset.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}>{asset.title}</span>
                    <span className={styles.typeBadge}>{asset.asset_type}</span>
                  </div>
                  {asset.version && <span className={styles.version}>v{asset.version}</span>}
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
                <div key={pr.id} className={styles.card}>
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
