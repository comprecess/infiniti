import {
  AUTH_ERROR_MESSAGE,
  INVALID_RESPONSE_MESSAGE,
  NETWORK_ERROR_MESSAGE,
  REQUEST_TIMEOUT_MS,
} from '../../../../../../app/constants/constants'
import { customFetch } from '../../../custom-fetch'
import { getAuthToken } from '../../../get-auth-token'

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

export const putRemoveBusinessModelPicture = async (
  id: number,
  updateData: {
    [key: string]: number
  },
): Promise<Response> => {
  if (!Number.isInteger(id) || id <= 0) {
    return {
      status: false,
      message: 'Invalid business model ID',
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
    const apiPath = import.meta.env
      .VITE_BUSINESS_MODEL_ADD_PICTURE_BUSINESS_MODEL

    if (!baseUrl || !apiPath) {
      throw new Error(
        'Configuration error - missing environment variables',
      )
    }

    const url = new URL(`${apiPath}${id}/update`, baseUrl).toString()

    const controller = new AbortController()
    const timeoutId = setTimeout(
      () => controller.abort(),
      REQUEST_TIMEOUT_MS,
    )

    const data = await customFetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(updateData),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (
      typeof data !== 'object' ||
      data === null ||
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
