import {
  AUTH_ERROR_MESSAGE,
  INVALID_RESPONSE_MESSAGE,
  NETWORK_ERROR_MESSAGE,
  REQUEST_TIMEOUT_MS,
} from '../../../../../app/constants/constants'
import { customFetch } from '../../custom-fetch'
import { getAuthToken } from '../../get-auth-token'
export interface TemplateSection {
  id: number
  code: string
  name: string
  icon: string | null
  sort_order: number
  config: Record<string, any> | null
  is_required: boolean
  is_active: boolean
}
interface SuccessResponse {
  status: true
  data: TemplateSection[]
}
interface ErrorResponse {
  status: false
  message: string
  error?: unknown
}
type Response = SuccessResponse | ErrorResponse
export const getTemplateSections = async (
  templateCode: string,
): Promise<Response> => {
  if (!templateCode) {
    return {
      status: false,
      message: 'Template code is required',
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
    const apiPrefix = import.meta.env.VITE_RESIDENT_PROJECT_TEMPLATES_API || '/api/v1/resident/project-templates'
    if (!baseUrl) {
      return {
        status: false,
        message: 'Configuration error - missing environment variables',
      }
    }
    const url = new URL(
      `${apiPrefix}/by-code/${templateCode}`,
      baseUrl,
    ).toString()
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
      return {
        status: false,
        message: INVALID_RESPONSE_MESSAGE,
        error: data,
      }
    }
    return {
      status: true,
      data: data.data || [],
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

/**
 * Client-accessible version of getTemplateSections.
 * Uses the client API prefix instead of the resident (admin) prefix.
 * Falls back to the resident endpoint if client endpoint fails.
 */
export const getTemplateSectionsClient = async (
  templateCode: string,
): Promise<Response> => {
  if (!templateCode) {
    return {
      status: false,
      message: 'Template code is required',
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
    if (!baseUrl) {
      return {
        status: false,
        message: 'Configuration error - missing environment variables',
      }
    }
    // Try client endpoint first
    const clientPrefix = '/api/v1/client/project-templates'
    const url = new URL(
      `${clientPrefix}/by-code/${templateCode}`,
      baseUrl,
    ).toString()
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
      return {
        status: false,
        message: INVALID_RESPONSE_MESSAGE,
        error: data,
      }
    }
    return {
      status: true,
      data: data.data || [],
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
