import {
  authTokenString,
  INVALID_RESPONSE_MESSAGE,
  NETWORK_ERROR_MESSAGE,
  profileInfoString,
  REQUEST_TIMEOUT_MS,
  UserInfo,
  userTalentsPageString,
} from '../../../app/constants/constants'
import { removeCookies } from '../Saving/Cookies/RemoveCookies'
import { saveSession } from '../Saving/Session/SaveSession'
import { customFetch } from './custom-fetch'
import { getAuthToken } from './get-auth-token'

interface SuccessResponse {
  status: true
  data: UserInfo
}

interface ErrorResponse {
  status: false
  message: string
  error?: unknown
}

type Response = SuccessResponse | ErrorResponse

export const getProfileInfo = async (): Promise<Response> => {
  const authToken = getAuthToken()

  if (!authToken) {
    return {
      status: false,
      message: 'No auth token',
    }
  }

  try {
    const baseUrl = import.meta.env.VITE_MAIN_DOMAIN
    const apiPath = import.meta.env.VITE_USER_API

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
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${authToken}`,
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

    saveSession(profileInfoString, data.data)
    saveSession(userTalentsPageString, 1)

    return {
      status: true,
      data: data.data,
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return {
        status: false,
        message: 'Request timeout',
        error,
      }
    }

    console.error(NETWORK_ERROR_MESSAGE, error)
    removeCookies(authTokenString)

    return {
      status: false,
      message: NETWORK_ERROR_MESSAGE,
      error,
    }
  }
}
