import { customFetch } from '../../custom-fetch'
import { getAuthToken } from '../../get-auth-token'

const AUTH_ERROR_MESSAGE = 'Authentication required'
const NETWORK_ERROR_MESSAGE = 'Network error'
const INVALID_RESPONSE_MESSAGE = 'Invalid server response'
const REQUEST_TIMEOUT_MS = 30000

export interface ValuationData {
  id?: number
  project_id: number
  valuation_type: 'current' | 'projected' | 'best_case' | 'final'
  base_metric_name: string
  base_metric_value: number
  multiplier: number
  total_value?: number
  confidence_percent: number
  notes?: string
  created_by?: number
  created_at?: string
}

interface Response {
  status: boolean
  message?: string
  data?: any
  error?: any
}

/**
 * Get the valuation dashboard for a project (current, projected, best_case).
 */
export const getValuationDashboard = async (projectId: number): Promise<Response> => {
  const authToken = getAuthToken()
  if (!authToken) return { status: false, message: AUTH_ERROR_MESSAGE }

  try {
    const baseUrl = import.meta.env.VITE_MAIN_DOMAIN
    const apiPath = import.meta.env.VITE_RESIDENT_PROJECTS_API
    if (!baseUrl || !apiPath) return { status: false, message: 'Configuration error' }

    const url = new URL(`${apiPath}/${projectId}/valuation`, baseUrl).toString()
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
 * Create a new valuation entry.
 */
export const createValuation = async (
  projectId: number,
  payload: Partial<ValuationData>,
): Promise<Response> => {
  const authToken = getAuthToken()
  if (!authToken) return { status: false, message: AUTH_ERROR_MESSAGE }

  try {
    const baseUrl = import.meta.env.VITE_MAIN_DOMAIN
    const apiPath = import.meta.env.VITE_RESIDENT_PROJECTS_API
    if (!baseUrl || !apiPath) return { status: false, message: 'Configuration error' }

    const url = new URL(`${apiPath}/${projectId}/valuation`, baseUrl).toString()
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    const data = await customFetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(payload),
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
 * Get valuation history for a project.
 */
export const getValuationHistory = async (projectId: number): Promise<Response> => {
  const authToken = getAuthToken()
  if (!authToken) return { status: false, message: AUTH_ERROR_MESSAGE }

  try {
    const baseUrl = import.meta.env.VITE_MAIN_DOMAIN
    const apiPath = import.meta.env.VITE_RESIDENT_PROJECTS_API
    if (!baseUrl || !apiPath) return { status: false, message: 'Configuration error' }

    const url = new URL(`${apiPath}/${projectId}/valuation/history`, baseUrl).toString()
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
 * Delete a valuation entry.
 */
export const deleteValuation = async (
  projectId: number,
  valuationId: number,
): Promise<Response> => {
  const authToken = getAuthToken()
  if (!authToken) return { status: false, message: AUTH_ERROR_MESSAGE }

  try {
    const baseUrl = import.meta.env.VITE_MAIN_DOMAIN
    const apiPath = import.meta.env.VITE_RESIDENT_PROJECTS_API
    if (!baseUrl || !apiPath) return { status: false, message: 'Configuration error' }

    const url = new URL(`${apiPath}/${projectId}/valuation/${valuationId}`, baseUrl).toString()
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    const data = await customFetch(url, {
      method: 'DELETE',
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
