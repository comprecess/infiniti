import { AUTH_ERROR_MESSAGE, NETWORK_ERROR_MESSAGE, REQUEST_TIMEOUT_MS } from '../../../../app/constants/constants'
import { customFetch } from '../../custom-fetch'
import { getAuthToken } from '../../get-auth-token'

export const getClientTicketsList = async (filters?: { status?: string }) => {
  const authToken = getAuthToken()
  if (!authToken) return { status: false, message: AUTH_ERROR_MESSAGE }

  try {
    const base = import.meta.env.VITE_MAIN_DOMAIN
    const params = new URLSearchParams()
    if (filters?.status) params.set('status', filters.status)

    const url = `${base}/api/v1/support?${params.toString()}`
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
