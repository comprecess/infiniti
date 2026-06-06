import { customFetch } from '../../custom-fetch'
import { getAuthToken } from '../../get-auth-token'

const AUTH_ERROR_MESSAGE = 'Authentication required'
const NETWORK_ERROR_MESSAGE = 'Network error'
const INVALID_RESPONSE_MESSAGE = 'Invalid server response'
const REQUEST_TIMEOUT_MS = 30000

export interface GrowthItemData {
  id?: number
  project_id: number
  title: string
  description?: string
  category: 'technical' | 'financial' | 'operational' | 'marketing' | 'team' | 'product' | 'legal'
  impact_multiplier_increase: number
  impact_metric_increase: number
  confidence_percent: number
  estimated_cost: number
  estimated_duration_days: number
  status: 'proposed' | 'approved' | 'in_progress' | 'completed' | 'rejected'
  priority?: number
  sys_task_id?: number
  sys_offer_id?: number
  sys_invoice_id?: number
  catalog_talent_id?: number
  created_by?: number
  created_at?: string
  updated_at?: string
}

interface Response {
  status: boolean
  message?: string
  data?: any
  error?: any
}

/**
 * Get all growth items for a project.
 */
export const getGrowthItems = async (projectId: number): Promise<Response> => {
  const authToken = getAuthToken()
  if (!authToken) return { status: false, message: AUTH_ERROR_MESSAGE }

  try {
    const baseUrl = import.meta.env.VITE_MAIN_DOMAIN
    const apiPath = import.meta.env.VITE_RESIDENT_PROJECTS_API
    if (!baseUrl || !apiPath) return { status: false, message: 'Configuration error' }

    const url = new URL(`${apiPath}/${projectId}/growth-items`, baseUrl).toString()
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
 * Create a new growth item.
 */
export const createGrowthItem = async (
  projectId: number,
  payload: Partial<GrowthItemData>,
): Promise<Response> => {
  const authToken = getAuthToken()
  if (!authToken) return { status: false, message: AUTH_ERROR_MESSAGE }

  try {
    const baseUrl = import.meta.env.VITE_MAIN_DOMAIN
    const apiPath = import.meta.env.VITE_RESIDENT_PROJECTS_API
    if (!baseUrl || !apiPath) return { status: false, message: 'Configuration error' }

    const url = new URL(`${apiPath}/${projectId}/growth-items`, baseUrl).toString()
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
 * Update an existing growth item.
 */
export const updateGrowthItem = async (
  projectId: number,
  itemId: number,
  payload: Partial<GrowthItemData>,
): Promise<Response> => {
  const authToken = getAuthToken()
  if (!authToken) return { status: false, message: AUTH_ERROR_MESSAGE }

  try {
    const baseUrl = import.meta.env.VITE_MAIN_DOMAIN
    const apiPath = import.meta.env.VITE_RESIDENT_PROJECTS_API
    if (!baseUrl || !apiPath) return { status: false, message: 'Configuration error' }

    const url = new URL(`${apiPath}/${projectId}/growth-items/${itemId}`, baseUrl).toString()
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    const data = await customFetch(url, {
      method: 'PUT',
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
 * Delete a growth item.
 */
export const deleteGrowthItem = async (
  projectId: number,
  itemId: number,
): Promise<Response> => {
  const authToken = getAuthToken()
  if (!authToken) return { status: false, message: AUTH_ERROR_MESSAGE }

  try {
    const baseUrl = import.meta.env.VITE_MAIN_DOMAIN
    const apiPath = import.meta.env.VITE_RESIDENT_PROJECTS_API
    if (!baseUrl || !apiPath) return { status: false, message: 'Configuration error' }

    const url = new URL(`${apiPath}/${projectId}/growth-items/${itemId}`, baseUrl).toString()
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

/**
 * Approve a growth item and trigger task/offer creation.
 */
export const approveGrowthItem = async (
  projectId: number,
  itemId: number,
): Promise<Response> => {
  const authToken = getAuthToken()
  if (!authToken) return { status: false, message: AUTH_ERROR_MESSAGE }

  try {
    const baseUrl = import.meta.env.VITE_MAIN_DOMAIN
    const apiPath = import.meta.env.VITE_RESIDENT_PROJECTS_API
    if (!baseUrl || !apiPath) return { status: false, message: 'Configuration error' }

    const url = new URL(`${apiPath}/${projectId}/growth-items/${itemId}/approve`, baseUrl).toString()
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    const data = await customFetch(url, {
      method: 'POST',
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
 * Change the status of a growth item.
 */
export const changeGrowthItemStatus = async (
  projectId: number,
  itemId: number,
  status: string,
): Promise<Response> => {
  const authToken = getAuthToken()
  if (!authToken) return { status: false, message: AUTH_ERROR_MESSAGE }

  try {
    const baseUrl = import.meta.env.VITE_MAIN_DOMAIN
    const apiPath = import.meta.env.VITE_RESIDENT_PROJECTS_API
    if (!baseUrl || !apiPath) return { status: false, message: 'Configuration error' }

    const url = new URL(`${apiPath}/${projectId}/growth-items/${itemId}/status`, baseUrl).toString()
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    const data = await customFetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ status }),
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
