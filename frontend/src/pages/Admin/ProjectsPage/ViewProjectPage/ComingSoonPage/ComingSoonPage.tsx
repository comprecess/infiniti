import { Box, Heading, Text, Card, CardBody, Badge, Flex } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';

const featureInfo: Record<string, { title: string; description: string }> = {
  'pipeline-buyers': {
    title: 'Buyer Pipeline',
    description: 'Manage potential buyers, track outreach progress, and organize acquisition interest. This feature will allow you to create buyer profiles, track communication history, and manage the deal negotiation process.',
  },
  'pipeline-investors': {
    title: 'Investor Pipeline',
    description: 'Manage investor relationships, track funding rounds, and organize investment interest. This feature will allow you to create investor profiles, share deal room access, and track due diligence progress.',
  },
};

const ComingSoonPage = () => {
  const location = useLocation();
  const pathSegment = location.pathname.split('/').pop() || '';
  const info = featureInfo[pathSegment] || {
    title: 'Feature',
    description: 'This feature is currently under development.',
  };

  return (
    <Box p={6}>
      <Card bg="brand.900" shadow="none" borderRadius="8px" borderTop="3px solid" borderTopColor="brand.500">
        <CardBody textAlign="center" py={16}>
          <Box mb={4}>
            <img src="/icons/elements.svg" alt="" style={{ width: 48, height: 48, margin: '0 auto', opacity: 0.6 }} />
          </Box>
          <Heading size="lg" color="white" mb={3}>{info.title}</Heading>
          <Flex justify="center" mb={6}>
            <Badge bg="brand.800" color="brand.300" fontSize="sm" px={3} py={1} borderRadius="full">
              Coming Soon
            </Badge>
          </Flex>
          <Text color="gray.200" maxW="lg" mx="auto" mb={4} lineHeight="tall">
            {info.description}
          </Text>
          <Text color="gray.400" fontSize="sm">
            This feature is planned for a future release. You will be notified when it becomes available.
          </Text>
        </CardBody>
      </Card>
    </Box>
  );
};

export { ComingSoonPage as AdminProjectsComingSoonPage };
