#!/usr/bin/env python3
"""Patch GrowthPlanPage.tsx: hide summary stats when items is empty, improve empty state."""

import re

filepath = '/var/www/Infiniti/frontend/src/pages/Admin/ProjectsPage/ViewProjectPage/GrowthPlanPage/GrowthPlanPage.tsx'

with open(filepath, 'r') as f:
    content = f.read()

# Replace the section: wrap Summary Stats in {items.length > 0 && (...)}
old_summary = """      {/* Summary Stats */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4} mb={6}>
        <Card bg="white" shadow="sm">
          <CardBody py={3} px={4}>
            <Text fontSize="xs" color="gray.500">Total Items</Text>
            <Text fontSize="xl" fontWeight="bold">{items.length}</Text>
          </CardBody>
        </Card>
        <Card bg="white" shadow="sm">
          <CardBody py={3} px={4}>
            <Text fontSize="xs" color="gray.500">In Progress</Text>
            <Text fontSize="xl" fontWeight="bold" color="yellow.600">{inProgressCount}</Text>
          </CardBody>
        </Card>
        <Card bg="white" shadow="sm">
          <CardBody py={3} px={4}>
            <Text fontSize="xs" color="gray.500">Completed</Text>
            <Text fontSize="xl" fontWeight="bold" color="green.600">{completedCount}</Text>
          </CardBody>
        </Card>
        <Card bg="white" shadow="sm">
          <CardBody py={3} px={4}>
            <Text fontSize="xs" color="gray.500">Total Investment</Text>
            <Text fontSize="xl" fontWeight="bold" color="blue.600">{formatCurrency(totalEstimatedCost)}</Text>
          </CardBody>
        </Card>
      </Grid>"""

new_summary = """      {/* Summary Stats - only show when items exist */}
      {items.length > 0 && (
      <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4} mb={6}>
        <Card bg="white" shadow="sm">
          <CardBody py={3} px={4}>
            <Text fontSize="xs" color="gray.500">Total Items</Text>
            <Text fontSize="xl" fontWeight="bold">{items.length}</Text>
          </CardBody>
        </Card>
        <Card bg="white" shadow="sm">
          <CardBody py={3} px={4}>
            <Text fontSize="xs" color="gray.500">In Progress</Text>
            <Text fontSize="xl" fontWeight="bold" color="yellow.600">{inProgressCount}</Text>
          </CardBody>
        </Card>
        <Card bg="white" shadow="sm">
          <CardBody py={3} px={4}>
            <Text fontSize="xs" color="gray.500">Completed</Text>
            <Text fontSize="xl" fontWeight="bold" color="green.600">{completedCount}</Text>
          </CardBody>
        </Card>
        <Card bg="white" shadow="sm">
          <CardBody py={3} px={4}>
            <Text fontSize="xs" color="gray.500">Total Investment</Text>
            <Text fontSize="xl" fontWeight="bold" color="blue.600">{formatCurrency(totalEstimatedCost)}</Text>
          </CardBody>
        </Card>
      </Grid>
      )}"""

content = content.replace(old_summary, new_summary)

# Improve the empty state text
old_empty = """      {items.length === 0 ? (
        <Card bg="white" shadow="sm">
          <CardBody textAlign="center" py={12}>
            <Text color="gray.500" fontSize="lg">No growth items yet</Text>
            <Text color="gray.400" mt={2}>Add recommendations to start the value creation process</Text>
            <Button mt={4} colorScheme="blue" size="sm" onClick={onOpen}>
              Add First Recommendation
            </Button>
          </CardBody>
        </Card>"""

new_empty = """      {items.length === 0 ? (
        <Card bg="white" shadow="sm" borderTop="4px solid" borderTopColor="blue.400">
          <CardBody textAlign="center" py={16}>
            <Text fontSize="3xl" mb={4}>📋</Text>
            <Heading size="md" color="gray.700" mb={2}>No Growth Items Yet</Heading>
            <Text color="gray.500" mb={2} maxW="md" mx="auto">
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
        </Card>"""

content = content.replace(old_empty, new_empty)

with open(filepath, 'w') as f:
    f.write(content)

print("GrowthPlanPage.tsx patched successfully")
