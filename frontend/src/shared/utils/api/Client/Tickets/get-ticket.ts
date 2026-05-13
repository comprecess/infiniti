import { MOCK_CLIENT_TICKETS, MOCK_CLIENT_REPLIES } from './_mock-data'

export const getClientTicket = async (id: number) => {
  await new Promise(r => setTimeout(r, 300))
  const ticket = MOCK_CLIENT_TICKETS.find(t => t.id === id) ?? MOCK_CLIENT_TICKETS[0]
  const replies = MOCK_CLIENT_REPLIES.filter(r => r.ticket_id === id)
  return { status: true, data: { ticket, replies } }
}
