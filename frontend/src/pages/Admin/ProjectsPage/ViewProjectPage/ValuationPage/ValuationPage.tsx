import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, Button, useDisclosure, Grid, GridItem,
  FormControl, FormLabel, Input, Select, Textarea, Flex, Text, Divider,
} from '@chakra-ui/react';
import { getValuationDashboard, createValuation } from '../../../../../shared/utils/api/Admin/Projects/valuation';
import styles from './ValuationPage.module.scss';
import { BarChartIcon, TrendingUpIcon, LaunchIcon, GlobeIcon, PartnershipIcon } from '../../../../../shared/icons/VentureIcons';

interface ValuationData {
  id: number;
  valuation_type: string;
  base_metric_name: string;
  base_metric_value: number;
  multiplier: number;
  total_value: number;
  confidence_percent: number;
  notes: string;
  created_at: string;
}

interface ValueDriver {
  driver: string;
  current_contribution: number;
  potential_impact: number;
  status: string;
  icon: string;
  description: string;
}

interface ConfidenceFactor {
  factor: string;
  impact: string;
  score: number;
  explanation: string;
}

const formatCurrency = (value: any): string => {
  const v = Number(value) || 0;
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
};

const ValuationPage = () => {
  const ctx = useOutletContext<any>();
  const projectId = ctx?.idProject || ctx?.project?.id;
  const token = ctx?.token;
  const [dashboard, setDashboard] = useState<any>(null);
  const [history, setHistory] = useState<ValuationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [activePanel, setActivePanel] = useState<string>('overview');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [form, setForm] = useState({
    valuation_type: 'current',
    base_metric_name: 'ARR',
    base_metric_value: '',
    multiplier: '',
    confidence_percent: '85',
    notes: '',
  });

  const loadDashboard = async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      const response = await getValuationDashboard(projectId);
      if (response?.data) {
        setDashboard(response.data);
        setHistory(response.data.history || []);
      }
    } catch (err) {
      console.error('Valuation load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) loadDashboard();
  }, [projectId]);

  const handleSubmit = async () => {
    if (!projectId) return;
    try {
      await createValuation(projectId, {
        base_metric_name: form.base_metric_name,
        base_metric_value: parseFloat(form.base_metric_value) || 0,
        multiplier: parseFloat(form.multiplier) || 1,
        confidence_percent: parseInt(form.confidence_percent) || 85,
        notes: form.notes,
      });
      onClose();
      setForm({ valuation_type: 'current', base_metric_name: 'ARR', base_metric_value: '', multiplier: '', confidence_percent: '85', notes: '' });
      loadDashboard();
    } catch (err) {
      console.error('Create valuation error:', err);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner}></div>
        <span>Loading valuation data...</span>
      </div>
    );
  }

  const current = dashboard?.current;
  const projected = dashboard?.projected;
  const bestCase = dashboard?.best_case;
  const assumptions = dashboard?.assumptions;
  const confidenceExplanation = dashboard?.confidence_explanation;
  const valueDrivers = dashboard?.value_drivers || [];
  const recommendation = dashboard?.recommendation;

  const confidenceColor = (pct: number) => {
    if (pct >= 80) return styles.confidenceHigh;
    if (pct >= 50) return styles.confidenceMedium;
    return styles.confidenceLow;
  };

  const impactColor = (impact: string) => {
    if (impact === 'positive') return styles.factorPositive;
    if (impact === 'negative') return styles.factorNegative;
    return styles.factorNeutral;
  };

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Valuation Intelligence</h1>
          <p className={styles.subtitle}>AI-powered valuation analysis and strategic recommendations</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.btnOutline} onClick={() => setShowHistory(!showHistory)}>
            {showHistory ? 'Hide History' : 'History'}
          </button>
          <button className={styles.btnPrimary} onClick={onOpen}>+ New Valuation</button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabNav}>
        {['overview', 'assumptions', 'drivers', 'action'].map((tab) => (
          <button
            key={tab}
            className={`${styles.tab} ${activePanel === tab ? styles.tabActive : ''}`}
            onClick={() => setActivePanel(tab)}
          >
            {tab === 'overview' && 'Overview'}
            {tab === 'assumptions' && 'Assumptions'}
            {tab === 'drivers' && 'Value Drivers'}
            {tab === 'action' && 'Next Action'}
          </button>
        ))}
      </div>

      {/* Overview Panel */}
      {activePanel === 'overview' && (
        <>
          {/* Valuation Cards */}
          <div className={styles.valuationGrid}>
            <div className={styles.valuationCard}>
              <div className={styles.cardIcon}><BarChartIcon size={28} /></div>
              <div className={styles.statLabel}>Current Valuation</div>
              <div className={styles.statValue}>{formatCurrency(current?.total_value || 0)}</div>
              <div className={styles.statHelp}>
                {current?.base_metric_name} {formatCurrency(current?.base_metric_value || 0)} × {Number(current?.multiplier || 0).toFixed(1)}x
              </div>
            </div>
            <div className={styles.valuationCard}>
              <div className={styles.cardIcon}><TrendingUpIcon size={28} /></div>
              <div className={`${styles.statLabel}`}>Projected Valuation</div>
              <div className={`${styles.statValue} ${styles.statValueMint}`}>{formatCurrency(projected?.total_value || 0)}</div>
              <div className={styles.statHelp}>
                <span className={styles.growthArrow}>↑</span>
                {current?.total_value ? `+${Math.round(((Number(projected?.total_value) - Number(current?.total_value)) / Number(current?.total_value)) * 100)}%` : '—'} from current
              </div>
            </div>
            <div className={styles.valuationCard}>
              <div className={styles.cardIcon}><LaunchIcon size={28} /></div>
              <div className={styles.statLabel}>Best Case</div>
              <div className={`${styles.statValue} ${styles.statValueBrand}`}>{formatCurrency(bestCase?.total_value || 0)}</div>
              <div className={styles.statHelp}>
                100% execution scenario
              </div>
            </div>
          </div>

          {/* Confidence Panel */}
          {confidenceExplanation && (
            <div className={styles.panelCard}>
              <div className={styles.panelHeader}>
                <h3 className={styles.panelTitle}>Confidence Analysis</h3>
                <span className={`${styles.confidenceBadge} ${confidenceColor(confidenceExplanation.overall)}`}>
                  {confidenceExplanation.overall}%
                </span>
              </div>
              <div className={styles.factorsGrid}>
                {confidenceExplanation.factors?.map((factor: ConfidenceFactor, idx: number) => (
                  <div key={idx} className={styles.factorCard}>
                    <div className={styles.factorHeader}>
                      <span className={styles.factorName}>{factor.factor}</span>
                      <span className={`${styles.factorBadge} ${impactColor(factor.impact)}`}>
                        {factor.score}%
                      </span>
                    </div>
                    <div className={styles.factorBar}>
                      <div
                        className={`${styles.factorBarFill} ${impactColor(factor.impact)}`}
                        style={{ width: `${factor.score}%` }}
                      />
                    </div>
                    <p className={styles.factorExplanation}>{factor.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Assumptions Panel */}
      {activePanel === 'assumptions' && assumptions && (
        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>Valuation Assumptions</h3>
          </div>
          <div className={styles.assumptionsGrid}>
            <div className={styles.assumptionItem}>
              <div className={styles.assumptionLabel}>Annual Recurring Revenue</div>
              <div className={styles.assumptionValue}>{formatCurrency(assumptions.arr)}</div>
              <div className={styles.assumptionProjected}>Projected: {formatCurrency(assumptions.arr_projected)}</div>
            </div>
            <div className={styles.assumptionItem}>
              <div className={styles.assumptionLabel}>Growth Rate</div>
              <div className={styles.assumptionValue}>{assumptions.growth_rate}%</div>
              <div className={styles.assumptionProjected}>Year-over-year</div>
            </div>
            <div className={styles.assumptionItem}>
              <div className={styles.assumptionLabel}>Revenue Multiple</div>
              <div className={styles.assumptionValue}>{Number(assumptions.multiple).toFixed(1)}x</div>
              <div className={styles.assumptionProjected}>Projected: {Number(assumptions.multiple_projected).toFixed(1)}x</div>
            </div>
            <div className={styles.assumptionItem}>
              <div className={styles.assumptionLabel}>Base Metric</div>
              <div className={styles.assumptionValue}>{assumptions.base_metric}</div>
              <div className={styles.assumptionProjected}>Primary valuation driver</div>
            </div>
          </div>

          {/* Comparable Transactions */}
          <div className={styles.comparablesSection}>
            <h4 className={styles.sectionSubtitle}>Comparable Transactions</h4>
            <div className={styles.comparablesTable}>
              <table>
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Multiple</th>
                    <th>ARR</th>
                    <th>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {assumptions.comparables?.map((comp: any, idx: number) => (
                    <tr key={idx}>
                      <td className={styles.textBold}>{comp.name}</td>
                      <td>{comp.multiple}x</td>
                      <td>{formatCurrency(comp.arr)}</td>
                      <td className={styles.textMuted}>{comp.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Value Drivers Panel */}
      {activePanel === 'drivers' && (
        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>Key Value Drivers</h3>
          </div>
          <div className={styles.driversGrid}>
            {valueDrivers.map((driver: ValueDriver, idx: number) => (
              <div key={idx} className={styles.driverCard}>
                <div className={styles.driverHeader}>
                  <div className={styles.driverIcon}>
                    {driver.icon === 'trending_up' && <TrendingUpIcon size={22} />}
                    {driver.icon === 'public' && <GlobeIcon size={22} />}
                    {driver.icon === 'handshake' && <PartnershipIcon size={22} />}
                    {driver.icon === 'rocket_launch' && <LaunchIcon size={22} />}
                  </div>
                  <div className={styles.driverInfo}>
                    <span className={styles.driverName}>{driver.driver}</span>
                    <span className={`${styles.driverStatus} ${driver.status === 'active' ? styles.statusActive : styles.statusPlanned}`}>
                      {driver.status}
                    </span>
                  </div>
                </div>
                <p className={styles.driverDescription}>{driver.description}</p>
                <div className={styles.driverMetrics}>
                  <div className={styles.driverMetric}>
                    <span className={styles.driverMetricLabel}>Current</span>
                    <span className={styles.driverMetricValue}>{formatCurrency(driver.current_contribution)}</span>
                  </div>
                  <div className={styles.driverMetric}>
                    <span className={styles.driverMetricLabel}>Potential</span>
                    <span className={`${styles.driverMetricValue} ${styles.textMint}`}>
                      +{formatCurrency(driver.potential_impact)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Next Action Panel */}
      {activePanel === 'action' && recommendation && (
        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>Recommended Next Action</h3>
            <span className={`${styles.priorityBadge} ${recommendation.priority === 'high' ? styles.priorityHigh : styles.priorityMedium}`}>
              {recommendation.priority} priority
            </span>
          </div>
          <div className={styles.recommendationContent}>
            <div className={styles.recommendationAction}>
              <h4 className={styles.actionTitle}>{recommendation.action}</h4>
              <p className={styles.actionRationale}>{recommendation.rationale}</p>
            </div>

            {/* Impact Estimate */}
            <div className={styles.impactCard}>
              <div className={styles.impactHeader}>
                <span className={styles.impactLabel}>Estimated Valuation Impact</span>
              </div>
              <div className={styles.impactValue}>+{formatCurrency(recommendation.impact_estimate)}</div>
              {recommendation.impact_description && (
                <p className={styles.impactDescription}>{recommendation.impact_description}</p>
              )}
            </div>

            {/* Action Steps */}
            {recommendation.steps && (
              <div className={styles.stepsSection}>
                <h5 className={styles.stepsTitle}>Action Steps</h5>
                <div className={styles.stepsList}>
                  {recommendation.steps.map((step: string, idx: number) => (
                    <div key={idx} className={styles.stepItem}>
                      <span className={styles.stepNumber}>{idx + 1}</span>
                      <span className={styles.stepText}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* History Table */}
      {showHistory && history.length > 0 && (
        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>Valuation History</h3>
            <button className={styles.btnHide} onClick={() => setShowHistory(false)}>Hide</button>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.historyTable}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Metric</th>
                  <th>Value</th>
                  <th>Multiple</th>
                  <th>Total</th>
                  <th>Confidence</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id}>
                    <td>{new Date(item.created_at).toLocaleDateString()}</td>
                    <td>{item.base_metric_name}</td>
                    <td>{formatCurrency(item.base_metric_value)}</td>
                    <td>{Number(item.multiplier).toFixed(1)}x</td>
                    <td className={styles.textBold}>{formatCurrency(item.total_value)}</td>
                    <td>
                      <span className={`${styles.confidenceBadge} ${confidenceColor(Number(item.confidence_percent))}`}>
                        {item.confidence_percent}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Valuation Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg" blockScrollOnMount={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Valuation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <GridItem colSpan={2}>
                <FormControl>
                  <FormLabel fontSize="sm">Valuation Type</FormLabel>
                  <Select
                    value={form.valuation_type}
                    onChange={(e) => setForm({ ...form, valuation_type: e.target.value as any })}
                    size="sm"
                  >
                    <option value="current">Current</option>
                    <option value="projected">Projected</option>
                    <option value="best_case">Best Case</option>
                    <option value="final">Final (Deal Close)</option>
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel fontSize="sm">Base Metric</FormLabel>
                  <Select
                    value={form.base_metric_name}
                    onChange={(e) => setForm({ ...form, base_metric_name: e.target.value })}
                    size="sm"
                  >
                    <option value="EBITDA">EBITDA</option>
                    <option value="MRR">MRR</option>
                    <option value="ARR">ARR</option>
                    <option value="Revenue">Revenue</option>
                    <option value="Gross Profit">Gross Profit</option>
                    <option value="Net Income">Net Income</option>
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl isRequired>
                  <FormLabel fontSize="sm">Metric Value ($)</FormLabel>
                  <Input
                    type="number"
                    size="sm"
                    placeholder="500000"
                    value={form.base_metric_value}
                    onChange={(e) => setForm({ ...form, base_metric_value: e.target.value })}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl isRequired>
                  <FormLabel fontSize="sm">Multiplier (x)</FormLabel>
                  <Input
                    type="number"
                    step="0.1"
                    size="sm"
                    placeholder="5.0"
                    value={form.multiplier}
                    onChange={(e) => setForm({ ...form, multiplier: e.target.value })}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel fontSize="sm">Confidence (%)</FormLabel>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    size="sm"
                    value={form.confidence_percent}
                    onChange={(e) => setForm({ ...form, confidence_percent: e.target.value })}
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={2}>
                <FormControl>
                  <FormLabel fontSize="sm">Notes</FormLabel>
                  <Textarea
                    size="sm"
                    placeholder="Valuation methodology notes..."
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  />
                </FormControl>
              </GridItem>
              {form.base_metric_value && form.multiplier && (
                <GridItem colSpan={2}>
                  <Divider my={2} />
                  <Flex justify="space-between" align="center" bg="brand.800" p={3} borderRadius="md">
                    <Text fontSize="sm" color="gray.200">Calculated Total Value:</Text>
                    <Text fontSize="lg" fontWeight="bold" color="brand.400">
                      {formatCurrency(parseFloat(form.base_metric_value) * parseFloat(form.multiplier))}
                    </Text>
                  </Flex>
                </GridItem>
              )}
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isDisabled={!form.base_metric_value || !form.multiplier}
            >
              Create Valuation
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export { ValuationPage as AdminProjectsValuationPage };
