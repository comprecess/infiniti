import {
  AUTH_ERROR_MESSAGE,
  INVALID_RESPONSE_MESSAGE,
  NETWORK_ERROR_MESSAGE,
  REQUEST_TIMEOUT_MS,
} from '../../../../../app/constants/constants'
import { customFetch } from '../../custom-fetch'
import { getAuthToken } from '../../get-auth-token'


export interface EmailTemplate {
  id: number
  name: string
  subject: string
  body: string
  created_at: string
  updated_at: string
}

interface SuccessResponse { status: true; data: EmailTemplate[] }
interface ErrorResponse { status: false; message: string; error?: unknown }
type Response = SuccessResponse | ErrorResponse

export const getEmailTemplates = async (): Promise<Response> => {
  const authToken = getAuthToken()
  if (!authToken) return { status: false, message: AUTH_ERROR_MESSAGE }
  try {
    const baseUrl = import.meta.env.VITE_MAIN_DOMAIN
    const url = `${baseUrl}/api/v1/email-templates`
    const data = await customFetch(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${authToken}`, Accept: 'application/json' },
    })
    if (!data || typeof data !== 'object') return { status: false, message: INVALID_RESPONSE_MESSAGE, error: data }
    return { status: true, data: data.data }
  } catch (error) {
    return { status: false, message: NETWORK_ERROR_MESSAGE, error }
  }
}
