import {
  AUTH_ERROR_MESSAGE,
  INVALID_RESPONSE_MESSAGE,
  NETWORK_ERROR_MESSAGE,
  REQUEST_TIMEOUT_MS,
} from '../../../../../../app/constants/constants'
import { PartialFieldsNewOfferData } from '../../../../../../features/Admin/Sales/NewOfferPage/Fields/Fields'
import { PartialFieldsCartToOfferData } from '../../../../../../features/Admin/TalentsPage/CartToOfferPage/Fields/Fields'
import { customFetch } from '../../../custom-fetch'
import { getAuthToken } from '../../../get-auth-token'

interface SuccessResponse {
  status: true
  message: string
  id: number
}

interface ErrorResponse {
  status: false
  message: string
  id?: number
  error?: unknown
}

type Response = SuccessResponse | ErrorResponse

export const postCreateNewOffer = async (
  formData: PartialFieldsNewOfferData | PartialFieldsCartToOfferData,
): Promise<Response> => {
  const authToken = getAuthToken()

  if (!authToken) {
    return {
      status: false,
      message: AUTH_ERROR_MESSAGE,
      id: 0,
    }
  }

  try {
    const baseUrl = import.meta.env.VITE_MAIN_DOMAIN
    const apiPath = import.meta.env.VITE_SALES_CREATE_NEW_OFFER

    if (!baseUrl || !apiPath) {
      return {
        status: false,
        message: 'Configuration error - missing environment variables',
        id: 0,
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
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(formData),
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
        id: 0,
      }
    }

    return data
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return {
        status: false,
        message: 'Request timeout',
        error,
        id: 0,
      }
    }

    return {
      status: false,
      message: NETWORK_ERROR_MESSAGE,
      error,
      id: 0,
    }
  }
}
