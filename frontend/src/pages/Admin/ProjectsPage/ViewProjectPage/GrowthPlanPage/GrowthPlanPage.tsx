import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Flex,
  Grid,
  GridItem,
  Button,
  Badge,
  Card,
  CardBody,
  CardHeader,
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
  useDisclosure,
  useToast,
  Progress,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Tooltip,
  Tag,
  TagLabel,
} from '@chakra-ui/react';
import { useRef } from 'react';
import {
  GrowthItemData,
  getGrowthItems,
  createGrowthItem,
  updateGrowthItem,
  deleteGrowthItem,
  approveGrowthItem,
  changeGrowthItemStatus,
} from '../../../../../shared/utils/api/Admin/Projects/growth-items';

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

const categoryColors: Record<string, string> = {
  technical: 'purple',
  financial: 'green',
  operational: 'blue',
  marketing: 'orange',
  team: 'teal',
  product: 'cyan',
  legal: 'red',
};

const statusColors: Record<string, string> = {
  proposed: 'gray',
  approved: 'blue',
  in_progress: 'yellow',
  completed: 'green',
  rejected: 'red',
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
      <Box p={6}>
        <Progress size="xs" isIndeterminate colorScheme="blue" />
        <Text mt={4} color="gray.300">Loading growth plan...</Text>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="lg">Growth Plan</Heading>
          <Text color="gray.300" mt={1}>Value creation recommendations and execution tracking</Text>
        </Box>
        <Button size="sm" colorScheme="blue" onClick={onOpen}>
          + Add Recommendation
        </Button>
      </Flex>

      {/* Summary Stats - only show when items exist */}
      {items.length > 0 && (
      <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4} mb={6}>
        <Card bg="brand.900" >
          <CardBody py={3} px={4}>
            <Text fontSize="xs" color="gray.300">Total Items</Text>
            <Text fontSize="xl" fontWeight="bold">{items.length}</Text>
          </CardBody>
        </Card>
        <Card bg="brand.900" >
          <CardBody py={3} px={4}>
            <Text fontSize="xs" color="gray.300">In Progress</Text>
            <Text fontSize="xl" fontWeight="bold" color="amber.500">{inProgressCount}</Text>
          </CardBody>
        </Card>
        <Card bg="brand.900" >
          <CardBody py={3} px={4}>
            <Text fontSize="xs" color="gray.300">Completed</Text>
            <Text fontSize="xl" fontWeight="bold" color="mint.500">{completedCount}</Text>
          </CardBody>
        </Card>
        <Card bg="brand.900" >
          <CardBody py={3} px={4}>
            <Text fontSize="xs" color="gray.300">Total Investment</Text>
            <Text fontSize="xl" fontWeight="bold" color="brand.400">{formatCurrency(totalEstimatedCost)}</Text>
          </CardBody>
        </Card>
      </Grid>
      )}

      {/* Growth Items List */}
      {items.length === 0 ? (
        <Card bg="brand.900"  borderTop="4px solid" borderTopColor="brand.500">
          <CardBody textAlign="center" py={16}>
            <Text fontSize="3xl" mb={4}>—</Text>
            <Heading size="md" color="white" mb={2}>No Growth Items Yet</Heading>
            <Text color="gray.300" mb={2} maxW="md" mx="auto">
              Growth items are value creation recommendations that increase your company valuation.
              Each item tracks impact on metrics, multiplier, and estimated cost.
            </Text>
            <Text color="gray.400" fontSize="sm" mb={6}>
              Create your first recommendation to start the growth plan.
            </Text>
            <Button colorScheme="blue" size="md" onClick={onOpen}>
              + Create First Recommendation
            </Button>
          </CardBody>
        </Card>
      ) : (
        <Flex direction="column" gap={4}>
          {items.map((item) => (
            <Card key={item.id} bg="brand.900"  _hover={{ shadow: 'md' }} transition="all 0.2s">
              <CardBody>
                <Flex justify="space-between" align="flex-start">
                  <Box flex={1}>
                    <Flex align="center" gap={2} mb={2}>
                      <Heading size="sm">{item.title}</Heading>
                      <Badge colorScheme={categoryColors[item.category] || 'gray'} fontSize="xs">
                        {item.category}
                      </Badge>
                      <Badge colorScheme={statusColors[item.status] || 'gray'} fontSize="xs">
                        {item.status.replace('_', ' ')}
                      </Badge>
                    </Flex>
                    {item.description && (
                      <Text fontSize="sm" color="gray.200" mb={3}>{item.description}</Text>
                    )}
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(5, 1fr)' }} gap={3}>
                      <Box>
                        <Text fontSize="xs" color="gray.300">Metric Impact</Text>
                        <Text fontSize="sm" fontWeight="medium" color="mint.500">
                          +{formatCurrency(item.impact_metric_increase || 0)}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="xs" color="gray.300">Multiplier Impact</Text>
                        <Text fontSize="sm" fontWeight="medium" color="mint.500">
                          +{item.impact_multiplier_increase || 0}x
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="xs" color="gray.300">Confidence</Text>
                        <Text fontSize="sm" fontWeight="medium">
                          {item.confidence_percent}%
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="xs" color="gray.300">Cost</Text>
                        <Text fontSize="sm" fontWeight="medium" color="cherry.500">
                          {formatCurrency(item.estimated_cost || 0)}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="xs" color="gray.300">Duration</Text>
                        <Text fontSize="sm" fontWeight="medium">
                          {item.estimated_duration_days || 0} days
                        </Text>
                      </Box>
                    </Grid>
                    {item.sys_task_id && (
                      <Tag size="sm" mt={2} colorScheme="blue" variant="subtle">
                        <TagLabel>Task #{item.sys_task_id} linked</TagLabel>
                      </Tag>
                    )}
                  </Box>
                  <Flex direction="column" gap={1} ml={4}>
                    {item.status === 'proposed' && (
                      <Button
                        size="xs"
                        colorScheme="green"
                        onClick={() => { setSelectedItem(item); onApproveOpen(); }}
                      >
                        Approve & Start
                      </Button>
                    )}
                    {item.status === 'approved' && (
                      <Button
                        size="xs"
                        colorScheme="yellow"
                        onClick={() => handleStatusChange(item.id!, 'in_progress')}
                      >
                        Start Work
                      </Button>
                    )}
                    {item.status === 'in_progress' && (
                      <Button
                        size="xs"
                        colorScheme="green"
                        onClick={() => handleStatusChange(item.id!, 'completed')}
                      >
                        Complete
                      </Button>
                    )}
                    {item.status === 'proposed' && (
                      <Button
                        size="xs"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleDelete(item.id!)}
                      >
                        Delete
                      </Button>
                    )}
                  </Flex>
                </Flex>
              </CardBody>
            </Card>
          ))}
        </Flex>
      )}

      {/* Create Growth Item Modal */}
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
                    placeholder="e.g., Hire CTO to reduce founder dependency"
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
                <Box mt={4} p={3} bg="yellow.50" borderRadius="md">
                  <Text fontSize="sm" color="yellow.800">
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
    </Box>
  );
};

export { GrowthPlanPage as AdminProjectsGrowthPlanPage };
