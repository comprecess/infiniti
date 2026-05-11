import {
  AUTH_ERROR_MESSAGE,
  INVALID_RESPONSE_MESSAGE,
  NETWORK_ERROR_MESSAGE,
  REQUEST_TIMEOUT_MS,
} from '../../../../../app/constants/constants'
import { customFetch } from '../../custom-fetch'
import { getAuthToken } from '../../get-auth-token'


export const deleteEmailTemplate = async (id: number) => {
  const authToken = getAuthToken()
  if (!authToken) return { status: false, message: AUTH_ERROR_MESSAGE }
  try {
    const baseUrl = import.meta.env.VITE_MAIN_DOMAIN
    const url = `${baseUrl}/api/v1/resident/email-templates/${id}`
    const data = await customFetch(url, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authToken}`, Accept: 'application/json' },
    })
    return { status: true }
  } catch (error) {
    return { status: false, message: NETWORK_ERROR_MESSAGE, error }
  }
}
