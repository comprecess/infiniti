export const MOCK_CLIENT_TICKETS = [
  {
    id: 1,
    title: 'Payment issue with invoice #1042',
    status: 'open',
    priority: 'high',
    department: { id: 1, name: 'Billing' },
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
    created_at: '2026-05-11T09:00:00Z',
    updated_at: '2026-05-13T11:00:00Z',
    replies_count: 1,
  },
]

export const MOCK_CLIENT_REPLIES = [
  {
    id: 1,
    ticket_id: 1,
    body: 'We are looking into your payment issue and will get back to you shortly.',
    author_info: { name: 'Support Team', type: 'admin' },
    created_at: '2026-05-11T10:00:00Z',
  },
  {
    id: 2,
    ticket_id: 1,
    body: 'Thank you for your patience.',
    author_info: { name: 'You', type: 'client' },
    created_at: '2026-05-11T11:00:00Z',
  },
]

export const MOCK_CLIENT_INPUT_DATA = {
  departments: [
    { id: 1, name: 'Billing' },
    { id: 2, name: 'Technical' },
    { id: 3, name: 'Sales' },
  ],
  priorities: [
    { id: 'low', name: 'Low' },
    { id: 'medium', name: 'Medium' },
    { id: 'high', name: 'High' },
  ],
}
