import {
  AUTH_ERROR_MESSAGE,
  INVALID_RESPONSE_MESSAGE,
  NETWORK_ERROR_MESSAGE,
} from '../../../../../app/constants/constants'
import { getAuthToken } from '../../GetAuthToken'

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

const DEFAULT_ERROR_MESSAGE =
  'An error occurred while deleting the project'
const REQUEST_TIMEOUT_MS = 30000

export const deleteProject = async (
  idProject: number,
): Promise<Response> => {
  if (!Number.isInteger(idProject) || idProject <= 0) {
    return {
      status: false,
      message: 'Invalid project ID',
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
    const apiPath = import.meta.env.VITE_PROJECTS_API

    if (!baseUrl || !apiPath) {
      throw new Error(
        'Configuration error - missing environment variables',
      )
    }

    const url = new URL(`${apiPath}/${idProject}`, baseUrl).toString()

    const controller = new AbortController()
    const timeoutId = setTimeout(
      () => controller.abort(),
      REQUEST_TIMEOUT_MS,
    )

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))

      return {
        status: false,
        message:
          errorData.message ||
          `Server responded with status ${response.status}`,
        error: errorData,
      }
    }

    const data = await response.json()

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

    return data as Response
  } catch (error) {
    if (error instanceof Error) {
      return {
        status: false,
        message:
          error.name === 'AbortError'
            ? 'Request timeout'
            : NETWORK_ERROR_MESSAGE,
        error,
      }
    }

    return {
      status: false,
      message: DEFAULT_ERROR_MESSAGE,
      error,
    }
  }
}
