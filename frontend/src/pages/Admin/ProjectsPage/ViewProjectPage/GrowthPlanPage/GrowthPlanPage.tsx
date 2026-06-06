import { useEffect, useState, useRef } from 'react';
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
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Text,
  Box,
} from '@chakra-ui/react';
import {
  GrowthItemData,
  getGrowthItems,
  createGrowthItem,
  updateGrowthItem,
  deleteGrowthItem,
  approveGrowthItem,
  changeGrowthItemStatus,
} from '../../../../../shared/utils/api/Admin/Projects/growth-items';
import styles from './GrowthPlanPage.module.scss';

interface GrowthPlanPageContext {
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

const categoryBadgeClass: Record<string, string> = {
  technical: 'badgePurple',
  financial: 'badgeGreen',
  operational: 'badgeBlue',
  marketing: 'badgeOrange',
  team: 'badgeTeal',
  product: 'badgeCyan',
  legal: 'badgeRed',
};

const statusBadgeClass: Record<string, string> = {
  proposed: 'badgeGray',
  approved: 'badgeBlue',
  in_progress: 'badgeYellow',
  completed: 'badgeGreen',
  rejected: 'badgeRed',
};

const GrowthPlanPage = () => {
  const { project, token } = useOutletContext<GrowthPlanPageContext>();
  const [items, setItems] = useState<GrowthItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<GrowthItemData | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isApproveOpen, onOpen: onApproveOpen, onClose: onApproveClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'technical',
    impact_multiplier_increase: '',
    impact_metric_increase: '',
    confidence_percent: '70',
    estimated_cost: '',
    estimated_duration_days: '',
    priority: '0',
  });

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await getGrowthItems(project.id, token);
      setItems(data.data || data || []);
    } catch (err) {
      console.error('Failed to load growth items', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (project?.id) loadItems();
  }, [project?.id]);

  const handleCreate = async () => {
    try {
      await createGrowthItem(project.id, {
        title: form.title,
        description: form.description || undefined,
        category: form.category as any,
        impact_multiplier_increase: parseFloat(form.impact_multiplier_increase) || 0,
        impact_metric_increase: parseFloat(form.impact_metric_increase) || 0,
        confidence_percent: parseInt(form.confidence_percent),
        estimated_cost: parseFloat(form.estimated_cost) || 0,
        estimated_duration_days: parseInt(form.estimated_duration_days) || 0,
        priority: parseInt(form.priority) || 0,
      }, token);
      toast({ title: 'Growth item created', status: 'success', duration: 3000 });
      onClose();
      resetForm();
      loadItems();
    } catch (err) {
      toast({ title: 'Error creating growth item', status: 'error', duration: 3000 });
    }
  };

  const handleApprove = async () => {
    if (!selectedItem) return;
    try {
      await approveGrowthItem(project.id, selectedItem.id!, token);
      toast({ title: 'Item approved. Task created in Kanban.', status: 'success', duration: 4000 });
      onApproveClose();
      setSelectedItem(null);
      loadItems();
    } catch (err) {
      toast({ title: 'Error approving item', status: 'error', duration: 3000 });
    }
  };

  const handleStatusChange = async (itemId: number, newStatus: string) => {
    try {
      await changeGrowthItemStatus(project.id, itemId, newStatus, token);
      toast({ title: `Status changed to ${newStatus}`, status: 'info', duration: 2000 });
      loadItems();
    } catch (err) {
      toast({ title: 'Error changing status', status: 'error', duration: 3000 });
    }
  };

  const handleDelete = async (itemId: number) => {
    try {
      await deleteGrowthItem(project.id, itemId, token);
      toast({ title: 'Item deleted', status: 'info', duration: 2000 });
      loadItems();
    } catch (err) {
      toast({ title: 'Error deleting item', status: 'error', duration: 3000 });
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      category: 'technical',
      impact_multiplier_increase: '',
      impact_metric_increase: '',
      confidence_percent: '70',
      estimated_cost: '',
      estimated_duration_days: '',
      priority: '0',
    });
  };

  const totalEstimatedCost = items.reduce((sum, item) => sum + (item.estimated_cost || 0), 0);
  const completedCount = items.filter(i => i.status === 'completed').length;
  const inProgressCount = items.filter(i => i.status === 'in_progress').length;

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.loadingWrapper}>
          <span>Loading growth plan...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Growth Plan</h1>
          <p className={styles.subtitle}>Value creation recommendations and execution tracking</p>
        </div>
        <button className={styles.btnAdd} onClick={onOpen}>
          + Add Recommendation
        </button>
      </div>

      {/* Summary Stats */}
      {items.length > 0 && (
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Total Items</div>
            <div className={styles.statValue}>{items.length}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>In Progress</div>
            <div className={`${styles.statValue} ${styles.statValueAmber}`}>{inProgressCount}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Completed</div>
            <div className={`${styles.statValue} ${styles.statValueMint}`}>{completedCount}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Total Investment</div>
            <div className={`${styles.statValue} ${styles.statValueBrand}`}>{formatCurrency(totalEstimatedCost)}</div>
          </div>
        </div>
      )}

      {/* Growth Items List */}
      {items.length === 0 ? (
        <div className={styles.emptyCard}>
          <div className={styles.emptyIcon}>—</div>
          <h2 className={styles.emptyTitle}>No Growth Items Yet</h2>
          <p className={styles.emptyDescription}>
            Growth items are value creation recommendations that increase your company valuation.
            Each item tracks impact on metrics, multiplier, and estimated cost.
          </p>
          <p className={styles.emptyHint}>
            Create your first recommendation to start the growth plan.
          </p>
          <button className={styles.btnAdd} onClick={onOpen}>
            + Create First Recommendation
          </button>
        </div>
      ) : (
        <div className={styles.itemsList}>
          {items.map((item) => (
            <div key={item.id} className={styles.itemCard}>
              <div className={styles.itemHeader}>
                <div className={styles.itemHeaderLeft}>
                  <div className={styles.itemTitleRow}>
                    <span className={styles.itemTitle}>{item.title}</span>
                    <span className={`${styles.badge} ${styles[categoryBadgeClass[item.category] || 'badgeGray']}`}>
                      {item.category}
                    </span>
                    <span className={`${styles.badge} ${styles[statusBadgeClass[item.status] || 'badgeGray']}`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>
                  {item.description && (
                    <p className={styles.itemDescription}>{item.description}</p>
                  )}
                  <div className={styles.itemMetrics}>
                    <div className={styles.metricItem}>
                      <span className={styles.metricLabel}>Metric Impact</span>
                      <span className={`${styles.metricValue} ${styles.metricValueMint}`}>
                        +{formatCurrency(item.impact_metric_increase || 0)}
                      </span>
                    </div>
                    <div className={styles.metricItem}>
                      <span className={styles.metricLabel}>Multiplier Impact</span>
                      <span className={`${styles.metricValue} ${styles.metricValueMint}`}>
                        +{item.impact_multiplier_increase || 0}x
                      </span>
                    </div>
                    <div className={styles.metricItem}>
                      <span className={styles.metricLabel}>Confidence</span>
                      <span className={styles.metricValue}>
                        {item.confidence_percent}%
                      </span>
                    </div>
                    <div className={styles.metricItem}>
                      <span className={styles.metricLabel}>Cost</span>
                      <span className={`${styles.metricValue} ${styles.metricValueCherry}`}>
                        {formatCurrency(item.estimated_cost || 0)}
                      </span>
                    </div>
                    <div className={styles.metricItem}>
                      <span className={styles.metricLabel}>Duration</span>
                      <span className={styles.metricValue}>
                        {item.estimated_duration_days || 0} days
                      </span>
                    </div>
                  </div>
                  {item.sys_task_id && (
                    <span className={styles.taskTag}>Task #{item.sys_task_id} linked</span>
                  )}
                </div>
                <div className={styles.itemActions}>
                  {item.status === 'proposed' && (
                    <button
                      className={styles.btnApprove}
                      onClick={() => { setSelectedItem(item); onApproveOpen(); }}
                    >
                      Approve & Start
                    </button>
                  )}
                  {item.status === 'approved' && (
                    <button
                      className={styles.btnStart}
                      onClick={() => handleStatusChange(item.id!, 'in_progress')}
                    >
                      Start Work
                    </button>
                  )}
                  {item.status === 'in_progress' && (
                    <button
                      className={styles.btnComplete}
                      onClick={() => handleStatusChange(item.id!, 'completed')}
                    >
                      Complete
                    </button>
                  )}
                  {item.status === 'proposed' && (
                    <button
                      className={styles.btnDelete}
                      onClick={() => handleDelete(item.id!)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Growth Item Modal - keep Chakra for modals */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Growth Recommendation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <GridItem colSpan={2}>
                <FormControl isRequired>
                  <FormLabel fontSize="sm">Title</FormLabel>
                  <Input
                    size="sm"
                    placeholder="e.g., Improve customer retention"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={2}>
                <FormControl>
                  <FormLabel fontSize="sm">Description</FormLabel>
                  <Textarea
                    size="sm"
                    placeholder="Detailed description of the recommendation..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel fontSize="sm">Category</FormLabel>
                  <Select
                    size="sm"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option value="technical">Technical</option>
                    <option value="financial">Financial</option>
                    <option value="operational">Operational</option>
                    <option value="marketing">Marketing</option>
                    <option value="team">Team</option>
                    <option value="product">Product</option>
                    <option value="legal">Legal</option>
                  </Select>
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
              <GridItem>
                <FormControl>
                  <FormLabel fontSize="sm">Metric Impact ($)</FormLabel>
                  <Input
                    type="number"
                    size="sm"
                    placeholder="100000"
                    value={form.impact_metric_increase}
                    onChange={(e) => setForm({ ...form, impact_metric_increase: e.target.value })}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel fontSize="sm">Multiplier Impact (x)</FormLabel>
                  <Input
                    type="number"
                    step="0.1"
                    size="sm"
                    placeholder="0.5"
                    value={form.impact_multiplier_increase}
                    onChange={(e) => setForm({ ...form, impact_multiplier_increase: e.target.value })}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel fontSize="sm">Estimated Cost ($)</FormLabel>
                  <Input
                    type="number"
                    size="sm"
                    placeholder="50000"
                    value={form.estimated_cost}
                    onChange={(e) => setForm({ ...form, estimated_cost: e.target.value })}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel fontSize="sm">Duration (days)</FormLabel>
                  <Input
                    type="number"
                    size="sm"
                    placeholder="60"
                    value={form.estimated_duration_days}
                    onChange={(e) => setForm({ ...form, estimated_duration_days: e.target.value })}
                  />
                </FormControl>
              </GridItem>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
            <Button
              colorScheme="blue"
              onClick={handleCreate}
              isDisabled={!form.title}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Approve Confirmation Dialog */}
      <AlertDialog
        isOpen={isApproveOpen}
        leastDestructiveRef={cancelRef}
        onClose={onApproveClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Approve & Execute
            </AlertDialogHeader>
            <AlertDialogBody>
              <Text mb={3}>
                Approving <strong>{selectedItem?.title}</strong> will:
              </Text>
              <Box pl={4}>
                <Text fontSize="sm" mb={1}>1. Create a task in the project Kanban board</Text>
                <Text fontSize="sm" mb={1}>2. Generate an offer/quote if cost is specified</Text>
                <Text fontSize="sm" mb={1}>3. Change status to "approved"</Text>
              </Box>
              {selectedItem?.estimated_cost ? (
                <Box mt={4} p={3} bg="brand.800" borderRadius="md">
                  <Text fontSize="sm" color="gray.200">
                    Estimated cost: <strong>{formatCurrency(selectedItem.estimated_cost)}</strong>
                  </Text>
                </Box>
              ) : null}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onApproveClose}>
                Cancel
              </Button>
              <Button colorScheme="green" onClick={handleApprove} ml={3}>
                Approve & Start
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </div>
  );
};

export { GrowthPlanPage as AdminProjectsGrowthPlanPage };
