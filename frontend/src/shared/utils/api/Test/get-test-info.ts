import {
  INVALID_RESPONSE_MESSAGE,
  NETWORK_ERROR_MESSAGE,
  REQUEST_TIMEOUT_MS,
} from '../../../../app/constants/constants'
import { customFetch } from '../custom-fetch'

interface SuccessResponse {
  status: true
  data: any
}

interface ErrorResponse {
  status: false
  message: string
  error?: unknown
}

type Response = SuccessResponse | ErrorResponse

export const getTestInfo = async (): Promise<Response> => {
  try {
    const baseUrl = import.meta.env.VITE_MAIN_DOMAIN
    const apiPath = '/api/v1/test/promt'

    if (!baseUrl || !apiPath) {
      throw new Error('Configuration error - missing environment variables')
    }

    const url = new URL(`${apiPath}`, baseUrl).toString()

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    const data = await customFetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!data || typeof data !== 'object') {
      return {
        status: false,
        message: INVALID_RESPONSE_MESSAGE,
        error: data,
      }
    }

    return {
      status: true,
      data,
    }
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
