import { useEffect, useState } from 'react';
import { useOutletContext, useLocation } from 'react-router-dom';
import { customFetch } from '../../../../../shared/utils/api/custom-fetch';
import { getAuthToken } from '../../../../../shared/utils/api/get-auth-token';
import styles from './PipelinePage.module.scss';

interface Lead {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  stage: string;
  created_at: string;
  last_contact: string | null;
}

interface PipelineData {
  type: string;
  total: number;
  stages: Record<string, Lead[]>;
  leads: Lead[];
}

const stageColors: Record<string, string> = {
  'Initial Contact': '#6B7280',
  'Qualified': '#3B82F6',
  'Meeting Scheduled': '#8B5CF6',
  'Due Diligence': '#F59E0B',
  'Term Sheet': '#10B981',
};

const PipelinePage = () => {
  const ctx = useOutletContext<any>();
  const projectId = ctx?.idProject || ctx?.project?.id;
  const location = useLocation();
  const pathSegment = location.pathname.split('/').pop() || '';
  const pipelineType = pathSegment === 'pipeline-investors' ? 'investor' : 'buyer';
  const title = pipelineType === 'investor' ? 'Investor Pipeline' : 'Buyer Pipeline';

  const [data, setData] = useState<PipelineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');

  const loadPipeline = async () => {
    try {
      setLoading(true);
      setError(null);
      const authToken = getAuthToken();
      if (!authToken) {
        setError('Authentication required');
        return;
      }
      const baseUrl = import.meta.env.VITE_MAIN_DOMAIN;
      const url = `${baseUrl}/api/v1/resident/project/${projectId}/pipeline/${pipelineType}`;
      const response = await customFetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        redirectOnError: false,
      });
      if (response?.success || response?.data) {
        setData(response.data || response);
      } else {
        setError(response?.message || 'Failed to load pipeline data');
      }
    } catch (err) {
      console.error('Pipeline load error:', err);
      setError('Network error loading pipeline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) loadPipeline();
  }, [projectId, pipelineType]);

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.loadingWrapper}>
          <span>Loading {title.toLowerCase()}...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.errorWrapper}>
          <span>{error}</span>
          <button className={styles.retryBtn} onClick={loadPipeline}>Retry</button>
        </div>
      </div>
    );
  }

  const stages = data?.stages || {};
  const stageOrder = ['Initial Contact', 'Qualified', 'Meeting Scheduled', 'Due Diligence', 'Term Sheet'];

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>
            {data?.total || 0} {pipelineType === 'investor' ? 'investors' : 'buyers'} in pipeline
          </p>
        </div>
        <div className={styles.headerActions}>
          <button
            className={viewMode === 'board' ? styles.btnActive : styles.btnOutline}
            onClick={() => setViewMode('board')}
          >
            Board
          </button>
          <button
            className={viewMode === 'list' ? styles.btnActive : styles.btnOutline}
            onClick={() => setViewMode('list')}
          >
            List
          </button>
        </div>
      </div>

      {/* Pipeline Board View */}
      {viewMode === 'board' && (
        <div className={styles.board}>
          {stageOrder.map((stage) => (
            <div key={stage} className={styles.column}>
              <div className={styles.columnHeader}>
                <span
                  className={styles.stageDot}
                  style={{ backgroundColor: stageColors[stage] }}
                />
                <span className={styles.stageName}>{stage}</span>
                <span className={styles.stageCount}>{(stages[stage] || []).length}</span>
              </div>
              <div className={styles.columnBody}>
                {(stages[stage] || []).map((lead) => (
                  <div key={lead.id} className={styles.card}>
                    <div className={styles.cardName}>{lead.name}</div>
                    <div className={styles.cardCompany}>{lead.company}</div>
                    {lead.source && (
                      <div className={styles.cardMeta}>
                        <span className={styles.sourceBadge}>{lead.source}</span>
                      </div>
                    )}
                  </div>
                ))}
                {(stages[stage] || []).length === 0 && (
                  <div className={styles.emptyColumn}>No leads</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pipeline List View */}
      {viewMode === 'list' && (
        <div className={styles.listWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Stage</th>
                <th>Source</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {(data?.leads || []).map((lead) => (
                <tr key={lead.id}>
                  <td className={styles.leadName}>{lead.name}</td>
                  <td>{lead.company}</td>
                  <td>
                    <span
                      className={styles.stageBadge}
                      style={{ backgroundColor: stageColors[lead.stage] + '20', color: stageColors[lead.stage], borderColor: stageColors[lead.stage] }}
                    >
                      {lead.stage}
                    </span>
                  </td>
                  <td>{lead.source}</td>
                  <td>{lead.email || lead.phone || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export { PipelinePage as AdminProjectsPipelinePage };
