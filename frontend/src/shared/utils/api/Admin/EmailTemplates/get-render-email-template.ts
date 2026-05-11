import {
  AUTH_ERROR_MESSAGE,
  INVALID_RESPONSE_MESSAGE,
  NETWORK_ERROR_MESSAGE,
  REQUEST_TIMEOUT_MS,
} from '../../../../../app/constants/constants'
import { customFetch } from '../../custom-fetch'
import { getAuthToken } from '../../get-auth-token'


export const getRenderEmailTemplate = async (id: number, contactId?: number) => {
  const authToken = getAuthToken()
  if (!authToken) return { status: false, message: AUTH_ERROR_MESSAGE }
  try {
    const baseUrl = import.meta.env.VITE_MAIN_DOMAIN
    const params = contactId ? `?contact_id=${contactId}` : ''
    const url = `${baseUrl}/api/v1/email-templates/${id}/render${params}`
    const data = await customFetch(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${authToken}`, Accept: 'application/json' },
    })
    if (!data || typeof data !== 'object') return { status: false, message: INVALID_RESPONSE_MESSAGE }
    return { status: true, data: data.data as { subject: string; body: string } }
  } catch (error) {
    return { status: false, message: NETWORK_ERROR_MESSAGE, error }
  }
}
