import { MOCK_TICKETS } from './_mock-data'

interface Filters {
  status?: string
  department_id?: number
  assigned_to?: number
  client_id?: number
  search?: string
}

export const getAdminTicketsList = async (filters?: Filters) => {
  await new Promise(r => setTimeout(r, 300)) // simulate network
  let data = [...MOCK_TICKETS]
  if (filters?.status) data = data.filter(t => t.status === filters.status)
  if (filters?.search) data = data.filter(t => t.title.toLowerCase().includes(filters.search!.toLowerCase()))
  return { status: true, data: { data: { data, total: data.length, per_page: 15, current_page: 1 } } }
}
