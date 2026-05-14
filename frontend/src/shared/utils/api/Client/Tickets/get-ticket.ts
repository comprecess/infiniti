import { MOCK_CLIENT_TICKETS } from './_mock-data'

export const getClientTicket = async (id: number) => {
  await new Promise(r => setTimeout(r, 300))
  const ticket = MOCK_CLIENT_TICKETS.find(t => t.id === id) ?? MOCK_CLIENT_TICKETS[0]
  return { status: true, data: { data: ticket } }
}
