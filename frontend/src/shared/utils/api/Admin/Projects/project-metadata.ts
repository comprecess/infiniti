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
  data: Record<string, Record<string, string>>
}

interface ErrorResponse {
  status: false
  message: string
  error?: unknown
}

type Response = SuccessResponse | ErrorResponse

/**
 * Get all metadata for a project, grouped by dot-notation prefix.
 * Universal: works for Exit Deal, Fundraising, Venture Building, etc.
 */
export const getProjectMetadata = async (
  projectId: number,
): Promise<Response> => {
  if (!Number.isInteger(projectId) || projectId <= 0) {
    return { status: false, message: 'Invalid project ID' }
  }

  const authToken = getAuthToken()
  if (!authToken) {
    return { status: false, message: AUTH_ERROR_MESSAGE }
  }

  try {
    const baseUrl = import.meta.env.VITE_MAIN_DOMAIN
    const apiPath = import.meta.env.VITE_RESIDENT_PROJECTS_API

    if (!baseUrl || !apiPath) {
      return { status: false, message: 'Configuration error - missing environment variables' }
    }

    const url = new URL(`${apiPath}/${projectId}/metadata`, baseUrl).toString()

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    const data = await customFetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!data || typeof data !== 'object') {
      return { status: false, message: INVALID_RESPONSE_MESSAGE, error: data }
    }

    return { status: true, data: data.data || data }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return { status: false, message: 'Request timeout', error }
    }
    return { status: false, message: NETWORK_ERROR_MESSAGE, error }
  }
}

/**
 * Get metadata for a specific group (e.g., "onboarding", "financials").
 */
export const getProjectMetadataGroup = async (
  projectId: number,
  group: string,
): Promise<Response> => {
  if (!Number.isInteger(projectId) || projectId <= 0) {
    return { status: false, message: 'Invalid project ID' }
  }

  const authToken = getAuthToken()
  if (!authToken) {
    return { status: false, message: AUTH_ERROR_MESSAGE }
  }

  try {
    const baseUrl = import.meta.env.VITE_MAIN_DOMAIN
    const apiPath = import.meta.env.VITE_RESIDENT_PROJECTS_API

    if (!baseUrl || !apiPath) {
      return { status: false, message: 'Configuration error - missing environment variables' }
    }

    const url = new URL(`${apiPath}/${projectId}/metadata/${group}`, baseUrl).toString()

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    const data = await customFetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!data || typeof data !== 'object') {
      return { status: false, message: INVALID_RESPONSE_MESSAGE, error: data }
    }

    return { status: true, data: data.data || data }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return { status: false, message: 'Request timeout', error }
    }
    return { status: false, message: NETWORK_ERROR_MESSAGE, error }
  }
}

/**
 * Save metadata for a project group (batch upsert).
 * Universal: same API works for any template type.
 */
export const saveProjectMetadata = async (
  projectId: number,
  group: string,
  data: Record<string, string>,
): Promise<Response> => {
  if (!Number.isInteger(projectId) || projectId <= 0) {
    return { status: false, message: 'Invalid project ID' }
  }

  const authToken = getAuthToken()
  if (!authToken) {
    return { status: false, message: AUTH_ERROR_MESSAGE }
  }

  try {
    const baseUrl = import.meta.env.VITE_MAIN_DOMAIN
    const apiPath = import.meta.env.VITE_RESIDENT_PROJECTS_API

    if (!baseUrl || !apiPath) {
      return { status: false, message: 'Configuration error - missing environment variables' }
    }

    const url = new URL(`${apiPath}/${projectId}/metadata`, baseUrl).toString()

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    const responseData = await customFetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ group, data }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!responseData || typeof responseData !== 'object') {
      return { status: false, message: INVALID_RESPONSE_MESSAGE, error: responseData }
    }

    return { status: true, data: responseData.data || responseData }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return { status: false, message: 'Request timeout', error }
    }
    return { status: false, message: NETWORK_ERROR_MESSAGE, error }
  }
}
