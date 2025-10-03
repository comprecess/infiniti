import {
  INVALID_RESPONSE_MESSAGE,
  NETWORK_ERROR_MESSAGE,
} from '../../../../app/constants/constants'
import { customFetch } from '../custom-fetch'

interface SuccessResponse {
  status: true
  message: string
}

interface ErrorResponse {
  status: false
  message: string
  error?: unknown
}

type Response = SuccessResponse | ErrorResponse

export const postSubmit = async (formData: any): Promise<Response> => {
  const baseUrl = import.meta.env.VITE_MAIN_DOMAIN
  const apiPath = '/api/v1/test/promt'

  if (!baseUrl || !apiPath) {
    return {
      status: false,
      message: 'Configuration error - missing environment variables',
    }
  }

  try {
    const url = new URL(apiPath, baseUrl).toString()

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 300000)

    const data = await customFetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...formData }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!data || typeof data !== 'object' || typeof data.status !== 'boolean') {
      return {
        status: false,
        message: INVALID_RESPONSE_MESSAGE,
        error: data,
      }
    }

    return data
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return {
        status: false,
        message: 'Request timeout',
        error,
      }
    }

    return {
      status: false,
      message: NETWORK_ERROR_MESSAGE,
      error,
    }
  }
}
