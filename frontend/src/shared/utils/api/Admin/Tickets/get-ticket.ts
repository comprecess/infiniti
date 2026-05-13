import { MOCK_TICKETS, MOCK_REPLIES } from './_mock-data'

export const getAdminTicket = async (id: number) => {
  await new Promise(r => setTimeout(r, 300))
  const ticket = MOCK_TICKETS.find(t => t.id === id) ?? MOCK_TICKETS[0]
  const replies = MOCK_REPLIES.filter(r => r.ticket_id === (ticket?.id ?? id))
  return { status: true, data: { data: { ...ticket, replies } } }
}
