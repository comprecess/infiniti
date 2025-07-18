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
  message: string
}

interface ErrorResponse {
  status: false
  message: string
  error?: unknown
}

type Response = SuccessResponse | ErrorResponse

export const postCreateNewBusinessPlan = async (
  formData: Record<string, any>,
): Promise<Response> => {
  const authToken = getAuthToken()

  if (!authToken) {
    return {
      status: false,
      message: AUTH_ERROR_MESSAGE,
    }
  }

  const form = new FormData()

  Object.entries(formData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      form.append(key, value)
    }
  })

  try {
    const baseUrl = import.meta.env.VITE_MAIN_DOMAIN
    const apiPath = import.meta.env.VITE_BUSINESS_PLAN_CREATE_NEW_PLAN

    if (!baseUrl || !apiPath) {
      return {
        status: false,
        message: 'Configuration error - missing environment variables',
      }
    }

    const url = new URL(apiPath, baseUrl).toString()

    const controller = new AbortController()
    const timeoutId = setTimeout(
      () => controller.abort(),
      REQUEST_TIMEOUT_MS,
    )

    const data = await customFetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: form,
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
