import { AUTH_ERROR_MESSAGE, NETWORK_ERROR_MESSAGE, REQUEST_TIMEOUT_MS } from '../../../../../app/constants/constants'
import { customFetch } from '../../custom-fetch'
import { getAuthToken } from '../../get-auth-token'

export const postClientTicketReply = async (ticketId: number, payload: { message: string }) => {
  const authToken = getAuthToken()
  if (!authToken) return { status: false, message: AUTH_ERROR_MESSAGE }

  try {
    const url = `${import.meta.env.VITE_MAIN_DOMAIN}/api/v1/client/support/${ticketId}/reply`
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
