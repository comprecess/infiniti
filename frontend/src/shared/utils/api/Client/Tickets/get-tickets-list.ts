import { MOCK_CLIENT_TICKETS } from './_mock-data'

export const getClientTicketsList = async () => {
  await new Promise(r => setTimeout(r, 300))
  return { status: true, data: { data: MOCK_CLIENT_TICKETS, total: MOCK_CLIENT_TICKETS.length } }
}
