import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Grid,
  GridItem,
  Button,
  useDisclosure,
  useToast,
  Divider,
  Flex,
  Text,
} from '@chakra-ui/react';
import { getValuationDashboard, createValuation, getValuationHistory, ValuationData } from '../../../../../shared/utils/api/Admin/Projects/valuation';
import styles from './ValuationPage.module.scss';

interface ValuationPageContext {
  project: {
    id: number;
    title: string;
    template_code?: string;
  };
  token: string;
}

const formatCurrency = (value: number): string => {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
};

const ValuationPage = () => {
  const { project, token } = useOutletContext<ValuationPageContext>();
  const [dashboard, setDashboard] = useState<any>(null);
  const [history, setHistory] = useState<ValuationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [form, setForm] = useState({
    valuation_type: 'current' as const,
    base_metric_name: 'EBITDA',
    base_metric_value: '',
    multiplier: '',
    confidence_percent: '100',
    notes: '',
  });

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await getValuationDashboard(project.id, token);
      setDashboard(data.data || data);
    } catch (err) {
      console.error('Failed to load valuation dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      const data = await getValuationHistory(project.id, token);
      setHistory(data.data || data || []);
      setShowHistory(true);
    } catch (err) {
      console.error('Failed to load history', err);
    }
  };

  useEffect(() => {
    if (project?.id) loadDashboard();
  }, [project?.id]);

  const handleSubmit = async () => {
    try {
      await createValuation(project.id, {
        valuation_type: form.valuation_type,
        base_metric_name: form.base_metric_name,
        base_metric_value: parseFloat(form.base_metric_value),
        multiplier: parseFloat(form.multiplier),
        confidence_percent: parseInt(form.confidence_percent),
        notes: form.notes || undefined,
      }, token);
      toast({ title: 'Valuation created', status: 'success', duration: 3000 });
      onClose();
      setForm({ valuation_type: 'current', base_metric_name: 'EBITDA', base_metric_value: '', multiplier: '', confidence_percent: '100', notes: '' });
      loadDashboard();
    } catch (err) {
      toast({ title: 'Error creating valuation', status: 'error', duration: 3000 });
    }
  };

  const getGrowthPercent = (): number => {
    if (!dashboard?.current?.total_value || !dashboard?.projected?.total_value) return 0;
    return Math.round(((dashboard.projected.total_value - dashboard.current.total_value) / dashboard.current.total_value) * 100);
  };

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.loadingWrapper}>
          <span>Loading valuation data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Valuation</h1>
          <p className={styles.subtitle}>Business valuation and growth projections</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.btnOutline} onClick={loadHistory}>
            History
          </button>
          <button className={styles.btnPrimary} onClick={onOpen}>
            + New Valuation
          </button>
        </div>
      </div>

      {/* Valuation Cards */}
      <div className={styles.valuationGrid}>
        {/* Current Value */}
        <div className={styles.valuationCard}>
          <div className={styles.statLabel}>Current Value</div>
          <div className={styles.statValue}>
            {dashboard?.current ? formatCurrency(dashboard.current.total_value) : '—'}
          </div>
          <div className={styles.statHelp}>
            {dashboard?.current
              ? `${dashboard.current.base_metric_name}: ${formatCurrency(dashboard.current.base_metric_value)} × ${dashboard.current.multiplier}x`
              : 'No valuation set'}
          </div>
        </div>

        {/* Projected Value */}
        <div className={`${styles.valuationCard} ${styles.valuationCardMint}`}>
          <div className={styles.statLabel}>Projected Value</div>
          <div className={`${styles.statValue} ${styles.statValueMint}`}>
            {dashboard?.projected ? formatCurrency(dashboard.projected.total_value) : '—'}
          </div>
          <div className={styles.statHelp}>
            {dashboard?.projected ? (
              <>
                <span className={styles.growthArrow}>↑</span>
                {getGrowthPercent()}% growth potential
                <span className={styles.confidenceBadge}>
                  {dashboard.projected.confidence_percent}% confidence
                </span>
              </>
            ) : 'Add growth items to see projections'}
          </div>
        </div>

        {/* Best Case Value */}
        <div className={`${styles.valuationCard} ${styles.valuationCardBrand}`}>
          <div className={styles.statLabel}>Best Case Value</div>
          <div className={`${styles.statValue} ${styles.statValueBrand}`}>
            {dashboard?.best_case ? formatCurrency(dashboard.best_case.total_value) : '—'}
          </div>
          <div className={styles.statHelp}>
            {dashboard?.best_case
              ? 'All items at 100% confidence'
              : 'No growth items yet'}
          </div>
        </div>
      </div>

      {/* Growth Progress */}
      {dashboard && (dashboard.growth_items_count > 0 || dashboard.completed_items_count > 0) && (
        <div className={styles.progressCard}>
          <div className={styles.progressHeader}>
            <span className={styles.progressTitle}>Growth Progress</span>
            <span className={styles.progressPercent}>
              {dashboard.growth_items_count > 0
                ? Math.round((dashboard.completed_items_count / dashboard.growth_items_count) * 100)
                : 0}%
            </span>
          </div>
          <div className={styles.progressText}>
            {dashboard.completed_items_count} of {dashboard.growth_items_count} items completed
          </div>
          <div className={styles.progressBarBg}>
            <div
              className={styles.progressBarFill}
              style={{
                width: `${dashboard.growth_items_count > 0
                  ? (dashboard.completed_items_count / dashboard.growth_items_count) * 100
                  : 0}%`
              }}
            />
          </div>
        </div>
      )}

      {/* Confidence Indicator */}
      {dashboard?.projected && (
        <div className={styles.progressCard}>
          <div className={styles.progressHeader}>
            <span className={styles.progressTitle}>Confidence Level</span>
            <span className={styles.progressPercent} style={{
              color: dashboard.projected.confidence_percent >= 70 ? '#10b7b7' :
                     dashboard.projected.confidence_percent >= 40 ? '#f59f0a' : '#ef4382'
            }}>
              {dashboard.projected.confidence_percent}%
            </span>
          </div>
          <div className={styles.progressText}>
            Weighted average across all growth items
          </div>
          <div className={styles.progressBarBg}>
            <div
              className={`${styles.progressBarFill} ${
                dashboard.projected.confidence_percent >= 70 ? '' :
                dashboard.projected.confidence_percent >= 40 ? styles.progressBarFillYellow : styles.progressBarFillRed
              }`}
              style={{ width: `${dashboard.projected.confidence_percent}%` }}
            />
          </div>
        </div>
      )}

      {/* History Table */}
      {showHistory && history.length > 0 && (
        <div className={styles.historyCard}>
          <div className={styles.historyHeader}>
            <span className={styles.historyTitle}>Valuation History</span>
            <button className={styles.btnHide} onClick={() => setShowHistory(false)}>Hide</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className={styles.historyTable}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Metric</th>
                  <th className={styles.textRight}>Value</th>
                  <th className={styles.textRight}>Multiplier</th>
                  <th className={styles.textRight}>Total</th>
                  <th className={styles.textRight}>Confidence</th>
                </tr>
              </thead>
              <tbody>
                {history.map((v) => (
                  <tr key={v.id}>
                    <td>{v.created_at ? new Date(v.created_at).toLocaleDateString() : '—'}</td>
                    <td>
                      <span className={`${styles.badge} ${
                        v.valuation_type === 'current' ? styles.badgeBlue :
                        v.valuation_type === 'projected' ? styles.badgeGreen :
                        v.valuation_type === 'final' ? styles.badgePurple : styles.badgeGray
                      }`}>
                        {v.valuation_type}
                      </span>
                    </td>
                    <td>{v.base_metric_name}</td>
                    <td className={styles.textRight}>{formatCurrency(v.base_metric_value)}</td>
                    <td className={styles.textRight}>{v.multiplier}x</td>
                    <td className={`${styles.textRight} ${styles.textBold}`}>{formatCurrency(v.total_value || 0)}</td>
                    <td className={styles.textRight}>{v.confidence_percent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Valuation Modal - keep Chakra for modals */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
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
