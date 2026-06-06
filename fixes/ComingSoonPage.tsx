import { Box, Heading, Text, Card, CardBody, Badge, Flex, Icon } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';

const featureInfo: Record<string, { title: string; description: string; icon: string }> = {
  'pipeline-buyers': {
    title: 'Buyer Pipeline',
    description: 'Manage potential buyers, track outreach progress, and organize acquisition interest. This feature will allow you to create buyer profiles, track communication history, and manage the deal negotiation process.',
    icon: '🏢',
  },
  'pipeline-investors': {
    title: 'Investor Pipeline',
    description: 'Manage investor relationships, track funding rounds, and organize investment interest. This feature will allow you to create investor profiles, share deal room access, and track due diligence progress.',
    icon: '💼',
  },
};

const ComingSoonPage = () => {
  const location = useLocation();
  const pathSegment = location.pathname.split('/').pop() || '';
  const info = featureInfo[pathSegment] || {
    title: 'Feature',
    description: 'This feature is currently under development.',
    icon: '🚀',
  };

  return (
    <Box p={6}>
      <Card bg="white" shadow="sm" borderTop="4px solid" borderTopColor="purple.400">
        <CardBody textAlign="center" py={16}>
          <Text fontSize="4xl" mb={4}>{info.icon}</Text>
          <Heading size="lg" color="gray.700" mb={3}>{info.title}</Heading>
          <Flex justify="center" mb={6}>
            <Badge colorScheme="purple" fontSize="sm" px={3} py={1} borderRadius="full">
              Coming Soon
            </Badge>
          </Flex>
          <Text color="gray.500" maxW="lg" mx="auto" mb={4} lineHeight="tall">
            {info.description}
          </Text>
          <Text color="gray.400" fontSize="sm">
            This feature is planned for Phase 6. You will be notified when it becomes available.
          </Text>
        </CardBody>
      </Card>
    </Box>
  );
};

export { ComingSoonPage as AdminProjectsComingSoonPage };
