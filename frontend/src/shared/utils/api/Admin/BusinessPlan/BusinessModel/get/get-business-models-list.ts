import {
  AUTH_ERROR_MESSAGE,
  INVALID_RESPONSE_MESSAGE,
  NETWORK_ERROR_MESSAGE,
  REQUEST_TIMEOUT_MS,
} from '../../../../../../../app/constants/constants'
import { customFetch } from '../../../../custom-fetch'
import { getAuthToken } from '../../../../get-auth-token'

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

export const getBusinessModelsList = async (
  page: string,
  filters?: Record<string, (string | number | null)[]>,
): Promise<Response> => {
  if (!page || typeof page !== 'string') {
    return {
      status: false,
      message: 'Invalid page parameter',
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
    const apiPath = import.meta.env.VITE_RESIDENT_BUSINESS_MODEL

    if (!baseUrl || !apiPath) {
      return {
        status: false,
        message: 'Configuration error - missing environment variables',
      }
    }

    const url = new URL(`${apiPath}/list${page}`, baseUrl)

    if (filters) {
      for (const [key, values] of Object.entries(filters)) {
        values.forEach(value => {
          if (value !== null) {
            url.searchParams.append(`filter[${key}][]`, String(value))
          }
        })
      }
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(
      () => controller.abort(),
      REQUEST_TIMEOUT_MS,
    )

    const data = await customFetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (
      !data ||
      typeof data !== 'object' ||
      typeof data.status !== 'boolean'
    ) {
      return {
        status: false,
        message: INVALID_RESPONSE_MESSAGE,
        error: data,
      }
    }

    return { status: true, data }
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
