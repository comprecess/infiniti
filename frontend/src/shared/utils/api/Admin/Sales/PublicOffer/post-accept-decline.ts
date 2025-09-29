import {
  INVALID_RESPONSE_MESSAGE,
  NETWORK_ERROR_MESSAGE,
  REQUEST_TIMEOUT_MS,
} from '../../../../../../app/constants/constants'
import { customFetch } from '../../../custom-fetch'

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

export const postAcceptDecline = async (
  tokenOffer: string,
  stage: 'Accepted' | 'Decline',
  message?: string,
  authToken?: string,
): Promise<Response> => {
  if (typeof tokenOffer !== 'string' || !tokenOffer.trim()) {
    return {
      status: false,
      message: 'Invalid offer token',
    }
  }

  if (stage !== 'Accepted' && stage !== 'Decline') {
    return {
      status: false,
      message: 'Invalid stage value',
    }
  }

  if (!authToken) {
    return {
      status: false,
      message: 'Authentication failed',
    }
  }

  try {
    const baseUrl = import.meta.env.VITE_MAIN_DOMAIN
    const apiPath = import.meta.env.VITE_SALES_ACCEPT_DECLINE_OFFER

    if (!baseUrl || !apiPath) {
      return {
        status: false,
        message: 'Configuration error - missing environment variables',
      }
    }

    const url = new URL(`${apiPath}${tokenOffer}`, baseUrl).toString()

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    const data = await customFetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ stage, message }),
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
