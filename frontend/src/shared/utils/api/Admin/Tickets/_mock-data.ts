export const MOCK_TICKETS = [
  {
    id: 1,
    title: 'Payment issue with invoice #1042',
    status: 'open',
    priority: 'high',
    department: { id: 1, name: 'Billing' },
    client: { id: 1, name: 'John Smith', email: 'john@example.com' },
    assigned_to: { id: 1, name: 'Manager' },
    created_at: '2026-05-10T10:00:00Z',
    updated_at: '2026-05-12T14:00:00Z',
    replies_count: 2,
  },
  {
    id: 2,
    title: 'Cannot access my account',
    status: 'in_progress',
    priority: 'medium',
    department: { id: 2, name: 'Technical' },
    client: { id: 2, name: 'Anna Lee', email: 'anna@example.com' },
    assigned_to: null,
    created_at: '2026-05-11T09:00:00Z',
    updated_at: '2026-05-13T11:00:00Z',
    replies_count: 1,
  },
  {
    id: 3,
    title: 'Request for contract renewal',
    status: 'closed',
    priority: 'low',
    department: { id: 3, name: 'Sales' },
    client: { id: 3, name: 'Mark Johnson', email: 'mark@example.com' },
    assigned_to: { id: 2, name: 'Support Agent' },
    created_at: '2026-05-08T15:00:00Z',
    updated_at: '2026-05-09T16:00:00Z',
    replies_count: 5,
  },
]

export const MOCK_REPLIES = [
  {
    id: 1,
    ticket_id: 1,
    body: 'We are looking into your payment issue and will get back to you shortly.',
    author_info: { name: 'Manager', type: 'admin' },
    created_at: '2026-05-11T10:00:00Z',
  },
  {
    id: 2,
    ticket_id: 1,
    body: 'Thank you. Could you please provide the invoice number?',
    author_info: { name: 'John Smith', type: 'client' },
    created_at: '2026-05-11T11:00:00Z',
  },
]

export const MOCK_INPUT_DATA = {
  statuses: [
    { id: 'open', name: 'Open' },
    { id: 'in_progress', name: 'In Progress' },
    { id: 'closed', name: 'Closed' },
  ],
  priorities: [
    { id: 'low', name: 'Low' },
    { id: 'medium', name: 'Medium' },
    { id: 'high', name: 'High' },
  ],
  departments: [
    { id: 1, name: 'Billing' },
    { id: 2, name: 'Technical' },
    { id: 3, name: 'Sales' },
  ],
}
