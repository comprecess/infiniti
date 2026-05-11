import {
  AUTH_ERROR_MESSAGE,
  INVALID_RESPONSE_MESSAGE,
  NETWORK_ERROR_MESSAGE,
  REQUEST_TIMEOUT_MS,
} from '../../../../../app/constants/constants'
import { customFetch } from '../../custom-fetch'
import { getAuthToken } from '../../get-auth-token'


export const postEmailTemplate = async (payload: { name: string; subject: string; body: string }) => {
  const authToken = getAuthToken()
  if (!authToken) return { status: false, message: AUTH_ERROR_MESSAGE }
  try {
    const baseUrl = import.meta.env.VITE_MAIN_DOMAIN
    const url = `${baseUrl}/api/v1/email-templates`
    const data = await customFetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!data || typeof data !== 'object') return { status: false, message: INVALID_RESPONSE_MESSAGE }
    return { status: true, data: data.data }
  } catch (error) {
    return { status: false, message: NETWORK_ERROR_MESSAGE, error }
  }
}
