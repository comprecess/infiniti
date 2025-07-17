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
  data: any
}

interface ErrorResponse {
  status: false
  message: string
  error?: unknown
}

type Response = SuccessResponse | ErrorResponse

export const getTransactionsDocuments = async (
  options: string,
): Promise<Response> => {
  if (!options || typeof options !== 'string') {
    return {
      status: false,
      message: 'Invalid request options',
    }
  }

  const authToken = getAuthToken()

  if (!authToken) {
    return {
      status: false,
      message: AUTH_ERROR_MESSAGE,
    }
  }

  try {
    const baseUrl = import.meta.env.VITE_MAIN_DOMAIN
    const apiPath = import.meta.env.VITE_ACCOUNTING_GET_LIST_TRANSACTIONS

    if (!baseUrl || !apiPath) {
      return {
        status: false,
        message: 'Configuration error - missing environment variables',
      }
    }

    const safeOptions = options.startsWith('?')
      ? options.slice(1)
      : options
    const url = new URL(apiPath, baseUrl)

    if (safeOptions) {
      const params = new URLSearchParams(safeOptions)
      params.forEach((value, key) => url.searchParams.append(key, value))
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(
      () => controller.abort(),
      REQUEST_TIMEOUT_MS,
    )

    const data = await customFetch(url.toString(), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      signal: controller.signal,
      responseType: 'blob',
    })

    clearTimeout(timeoutId)

    if (!data) {
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
