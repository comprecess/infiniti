#!/usr/bin/env python3
"""Patch ValuationPage.tsx: add dedicated empty state when no valuations exist."""

filepath = '/var/www/Infiniti/frontend/src/pages/Admin/ProjectsPage/ViewProjectPage/ValuationPage/ValuationPage.tsx'

with open(filepath, 'r') as f:
    content = f.read()

# Find the return section after loading check and add empty state before valuation cards
old_return_start = """  return (
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
      <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6} mb={8}>"""

new_return_start = """  // Check if there are no valuations at all
  const hasNoValuations = !dashboard?.current && !dashboard?.projected && !dashboard?.best_case;

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
      {/* Empty State */}
      {hasNoValuations && (
        <Card bg="white" shadow="sm" borderTop="4px solid" borderTopColor="green.400" mb={8}>
          <CardBody textAlign="center" py={16}>
            <Text fontSize="3xl" mb={4}>📊</Text>
            <Heading size="md" color="gray.700" mb={2}>No Valuations Created Yet</Heading>
            <Text color="gray.500" mb={2} maxW="lg" mx="auto">
              Business valuation calculates your company worth using the formula:
              Base Metric (e.g. EBITDA, ARR) multiplied by an Industry Multiplier.
            </Text>
            <Text color="gray.400" fontSize="sm" mb={6}>
              Create your first valuation to establish a baseline and track growth over time.
            </Text>
            <Button colorScheme="blue" size="md" onClick={onOpen}>
              + Create First Valuation
            </Button>
          </CardBody>
        </Card>
      )}
      {/* Valuation Cards */}
      {!hasNoValuations && (
      <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6} mb={8}>"""

content = content.replace(old_return_start, new_return_start)

# Need to close the conditional Grid - find the closing </Grid> for the valuation cards
# The Grid ends before the next section. Let's find the pattern.
old_grid_end = """      </Grid>
      {/* Growth Potential */}"""

new_grid_end = """      </Grid>
      )}
      {/* Growth Potential */}"""

content = content.replace(old_grid_end, new_grid_end, 1)

with open(filepath, 'w') as f:
    f.write(content)

print("ValuationPage.tsx patched successfully")
