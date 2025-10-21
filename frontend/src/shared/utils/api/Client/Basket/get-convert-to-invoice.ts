import {
  AUTH_ERROR_MESSAGE,
  INVALID_RESPONSE_MESSAGE,
  NETWORK_ERROR_MESSAGE,
  REQUEST_TIMEOUT_MS,
} from '../../../../../app/constants/constants'
import { customFetch } from '../../custom-fetch'
import { getAuthToken } from '../../get-auth-token'

interface SuccessResponse {
  status: true
  token: string
  message: string
}

interface ErrorResponse {
  status: false
  message: string
  token?: string
  error?: unknown
}

type Response = SuccessResponse | ErrorResponse

export const getConvertToInvoice = async (): Promise<Response> => {
  const authToken = getAuthToken()

  if (!authToken) {
    return {
      status: false,
      message: AUTH_ERROR_MESSAGE,
    }
  }

  try {
    const baseUrl = import.meta.env.VITE_MAIN_DOMAIN
    const apiPath = import.meta.env.VITE_CART_CONVERT_TO_INVOICE

    if (!baseUrl || !apiPath) {
      throw new Error('Configuration error - missing environment variables')
    }

    const url = new URL(apiPath, baseUrl).toString()

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    const data = await customFetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!data || typeof data !== 'object' || typeof data.success !== 'boolean') {
      return {
        status: false,
        message: INVALID_RESPONSE_MESSAGE,
        token: '',
        error: data,
      }
    }

    return {
      status: true,
      token: data.token,
      message: data.message,
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return {
        status: false,
        message: 'Request timeout',
        token: '',
        error,
      }
    }

    return {
      status: false,
      message: NETWORK_ERROR_MESSAGE,
      token: '',
      error,
    }
  }
}
