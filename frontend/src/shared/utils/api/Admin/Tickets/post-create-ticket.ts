import { AUTH_ERROR_MESSAGE, NETWORK_ERROR_MESSAGE, REQUEST_TIMEOUT_MS } from '../../../../app/constants/constants'
import { customFetch } from '../../custom-fetch'
import { getAuthToken } from '../../get-auth-token'

interface CreatePayload {
  subject: string
  message: string
  did?: number
  aid?: number
  userid?: number
  urgency?: string
  status?: string
  email?: string
  cc?: string
  bcc?: string
  notes?: string
}

export const postCreateAdminTicket = async (payload: CreatePayload) => {
  const authToken = getAuthToken()
  if (!authToken) return { status: false, message: AUTH_ERROR_MESSAGE }

  try {
    const url = `${import.meta.env.VITE_MAIN_DOMAIN}/api/v1/resident/support`
    const controller = new AbortController()
    const tid = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    const data = await customFetch(url, {
      method: 'POST',
      headers: { Accept: 'application/json', Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
    clearTimeout(tid)
    return { status: true, data }
  } catch (error) {
    return { status: false, message: NETWORK_ERROR_MESSAGE, error }
  }
}
