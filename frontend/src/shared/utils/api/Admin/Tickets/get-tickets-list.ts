import { AUTH_ERROR_MESSAGE, NETWORK_ERROR_MESSAGE, REQUEST_TIMEOUT_MS } from '../../../../app/constants/constants'
import { customFetch } from '../../custom-fetch'
import { getAuthToken } from '../../get-auth-token'

interface Filters {
  status?: string
  did?: number
  search?: string
  amount?: number
}

export const getAdminTicketsList = async (filters?: Filters) => {
  const authToken = getAuthToken()
  if (!authToken) return { status: false, message: AUTH_ERROR_MESSAGE }

  try {
    const base = import.meta.env.VITE_MAIN_DOMAIN
    const params = new URLSearchParams()
    if (filters?.status)   params.set('status', filters.status)
    if (filters?.did)      params.set('did', String(filters.did))
    if (filters?.search)   params.set('search', filters.search)
    if (filters?.amount)   params.set('amount', String(filters.amount))

    const url = `${base}/api/v1/resident/support?${params.toString()}`
    const controller = new AbortController()
    const tid = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    const data = await customFetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json', Authorization: `Bearer ${authToken}` },
      signal: controller.signal,
    })
    clearTimeout(tid)
    return { status: true, data }
  } catch (error) {
    return { status: false, message: NETWORK_ERROR_MESSAGE, error }
  }
}
