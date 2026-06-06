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
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
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
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';
import { getValuationDashboard, createValuation, getValuationHistory, ValuationData } from '../../../../../shared/utils/api/Admin/Projects/valuation';

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

  // Form state for new valuation
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
      <Box p={6}>
        <Progress size="xs" isIndeterminate colorScheme="blue" />
        <Text mt={4} color="gray.500">Loading valuation data...</Text>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="lg">Valuation</Heading>
          <Text color="gray.500" mt={1}>Business valuation and growth projections</Text>
        </Box>
        <Flex gap={3}>
          <Button size="sm" variant="outline" onClick={loadHistory}>
            History
          </Button>
          <Button size="sm" colorScheme="blue" onClick={onOpen}>
            + New Valuation
          </Button>
        </Flex>
      </Flex>

      {/* Valuation Cards */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6} mb={8}>
        {/* Current Value */}
        <GridItem>
          <Card bg="white" shadow="sm" borderTop="4px solid" borderTopColor="blue.500">
            <CardBody>
              <Stat>
                <StatLabel color="gray.500" fontSize="sm">Current Value</StatLabel>
                <StatNumber fontSize="2xl" color="blue.600">
                  {dashboard?.current ? formatCurrency(dashboard.current.total_value) : '—'}
                </StatNumber>
                <StatHelpText>
                  {dashboard?.current
                    ? `${dashboard.current.base_metric_name}: ${formatCurrency(dashboard.current.base_metric_value)} × ${dashboard.current.multiplier}x`
                    : 'No valuation set'}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>

        {/* Projected Value */}
        <GridItem>
          <Card bg="white" shadow="sm" borderTop="4px solid" borderTopColor="green.500">
            <CardBody>
              <Stat>
                <StatLabel color="gray.500" fontSize="sm">Projected Value</StatLabel>
                <StatNumber fontSize="2xl" color="green.600">
                  {dashboard?.projected ? formatCurrency(dashboard.projected.total_value) : '—'}
                </StatNumber>
                <StatHelpText>
                  {dashboard?.projected ? (
                    <>
                      <StatArrow type="increase" />
                      {getGrowthPercent()}% growth potential
                      <Badge ml={2} colorScheme="yellow" fontSize="xs">
                        {dashboard.projected.confidence_percent}% confidence
                      </Badge>
                    </>
                  ) : 'Add growth items to see projections'}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>

        {/* Best Case Value */}
        <GridItem>
          <Card bg="white" shadow="sm" borderTop="4px solid" borderTopColor="purple.500">
            <CardBody>
              <Stat>
                <StatLabel color="gray.500" fontSize="sm">Best Case Value</StatLabel>
                <StatNumber fontSize="2xl" color="purple.600">
                  {dashboard?.best_case ? formatCurrency(dashboard.best_case.total_value) : '—'}
                </StatNumber>
                <StatHelpText>
                  {dashboard?.best_case
                    ? `All items at 100% confidence`
                    : 'No growth items yet'}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      {/* Growth Progress */}
      {dashboard && (dashboard.growth_items_count > 0 || dashboard.completed_items_count > 0) && (
        <Card mb={6} bg="white" shadow="sm">
          <CardHeader pb={2}>
            <Heading size="sm">Growth Progress</Heading>
          </CardHeader>
          <CardBody pt={0}>
            <Flex justify="space-between" mb={2}>
              <Text fontSize="sm" color="gray.600">
                {dashboard.completed_items_count} of {dashboard.growth_items_count} items completed
              </Text>
              <Text fontSize="sm" fontWeight="bold" color="blue.600">
                {dashboard.growth_items_count > 0
                  ? Math.round((dashboard.completed_items_count / dashboard.growth_items_count) * 100)
                  : 0}%
              </Text>
            </Flex>
            <Progress
              value={dashboard.growth_items_count > 0
                ? (dashboard.completed_items_count / dashboard.growth_items_count) * 100
                : 0}
              colorScheme="green"
              size="md"
              borderRadius="full"
            />
          </CardBody>
        </Card>
      )}

      {/* Confidence Indicator */}
      {dashboard?.projected && (
        <Card mb={6} bg="white" shadow="sm">
          <CardHeader pb={2}>
            <Heading size="sm">Confidence Level</Heading>
          </CardHeader>
          <CardBody pt={0}>
            <Flex justify="space-between" mb={2}>
              <Text fontSize="sm" color="gray.600">
                Weighted average across all growth items
              </Text>
              <Text fontSize="sm" fontWeight="bold" color={
                dashboard.projected.confidence_percent >= 70 ? 'green.600' :
                dashboard.projected.confidence_percent >= 40 ? 'yellow.600' : 'red.600'
              }>
                {dashboard.projected.confidence_percent}%
              </Text>
            </Flex>
            <Progress
              value={dashboard.projected.confidence_percent}
              colorScheme={
                dashboard.projected.confidence_percent >= 70 ? 'green' :
                dashboard.projected.confidence_percent >= 40 ? 'yellow' : 'red'
              }
              size="md"
              borderRadius="full"
            />
          </CardBody>
        </Card>
      )}

      {/* History Table */}
      {showHistory && history.length > 0 && (
        <Card bg="white" shadow="sm">
          <CardHeader>
            <Flex justify="space-between" align="center">
              <Heading size="sm">Valuation History</Heading>
              <Button size="xs" variant="ghost" onClick={() => setShowHistory(false)}>Hide</Button>
            </Flex>
          </CardHeader>
          <CardBody pt={0}>
            <TableContainer>
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th>Date</Th>
                    <Th>Type</Th>
                    <Th>Metric</Th>
                    <Th isNumeric>Value</Th>
                    <Th isNumeric>Multiplier</Th>
                    <Th isNumeric>Total</Th>
                    <Th isNumeric>Confidence</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {history.map((v) => (
                    <Tr key={v.id}>
                      <Td>{v.created_at ? new Date(v.created_at).toLocaleDateString() : '—'}</Td>
                      <Td>
                        <Badge colorScheme={
                          v.valuation_type === 'current' ? 'blue' :
                          v.valuation_type === 'projected' ? 'green' :
                          v.valuation_type === 'final' ? 'purple' : 'gray'
                        } fontSize="xs">
                          {v.valuation_type}
                        </Badge>
                      </Td>
                      <Td>{v.base_metric_name}</Td>
                      <Td isNumeric>{formatCurrency(v.base_metric_value)}</Td>
                      <Td isNumeric>{v.multiplier}x</Td>
                      <Td isNumeric fontWeight="bold">{formatCurrency(v.total_value || 0)}</Td>
                      <Td isNumeric>{v.confidence_percent}%</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>
      )}

      {/* Create Valuation Modal */}
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
                  <Flex justify="space-between" align="center" bg="gray.50" p={3} borderRadius="md">
                    <Text fontSize="sm" color="gray.600">Calculated Total Value:</Text>
                    <Text fontSize="lg" fontWeight="bold" color="blue.600">
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
    </Box>
  );
};

export { ValuationPage as AdminProjectsValuationPage };
