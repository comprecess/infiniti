import {
  AUTH_ERROR_MESSAGE,
  INVALID_RESPONSE_MESSAGE,
  NETWORK_ERROR_MESSAGE,
  REQUEST_TIMEOUT_MS,
} from '../../../../../app/constants/constants'
import { customFetch } from '../../custom-fetch'
import { getAuthToken } from '../../get-auth-token'

interface FolderStats {
  [code: string]: {
    name: string
    count: number
  }
}

interface DealRoomOverviewResponse {
  status: true
  data: {
    folders: FolderStats
    initialized: boolean
  }
}

interface DealRoomDocumentsResponse {
  status: true
  data: Array<{
    document: any
    folder: string | null
  }>
}

interface ErrorResponse {
  status: false
  message: string
  error?: unknown
}

type OverviewResponse = DealRoomOverviewResponse | ErrorResponse
type DocumentsResponse = DealRoomDocumentsResponse | ErrorResponse

/**
 * Get Deal Room overview with folder stats.
 * Universal: works for any template type (Exit Deal, Fundraising, etc.)
 */
export const getDealRoomOverview = async (
  projectId: number,
): Promise<OverviewResponse> => {
  const authToken = getAuthToken()
  if (!authToken) return { status: false, message: AUTH_ERROR_MESSAGE }

  try {
    const baseUrl = import.meta.env.VITE_MAIN_DOMAIN
    const apiPath = import.meta.env.VITE_RESIDENT_PROJECTS_API

    if (!baseUrl || !apiPath) {
      return { status: false, message: 'Configuration error' }
    }

    const url = new URL(`${apiPath}/${projectId}/deal-room`, baseUrl).toString()

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
      return { status: false, message: INVALID_RESPONSE_MESSAGE }
    }

    return { status: true, data: data.data || data }
  } catch (error) {
    return { status: false, message: NETWORK_ERROR_MESSAGE, error }
  }
}

/**
 * Get documents in a specific Deal Room folder.
 */
export const getDealRoomFolderDocuments = async (
  projectId: number,
  folderCode: string,
): Promise<DocumentsResponse> => {
  const authToken = getAuthToken()
  if (!authToken) return { status: false, message: AUTH_ERROR_MESSAGE }

  try {
    const baseUrl = import.meta.env.VITE_MAIN_DOMAIN
    const apiPath = import.meta.env.VITE_RESIDENT_PROJECTS_API

    if (!baseUrl || !apiPath) {
      return { status: false, message: 'Configuration error' }
    }

    const url = new URL(`${apiPath}/${projectId}/deal-room/folder/${folderCode}`, baseUrl).toString()

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
      return { status: false, message: INVALID_RESPONSE_MESSAGE }
    }

    return { status: true, data: data.data || [] }
  } catch (error) {
    return { status: false, message: NETWORK_ERROR_MESSAGE, error }
  }
}

/**
 * Get all project documents with their folder assignments.
 */
export const getDealRoomAllDocuments = async (
  projectId: number,
): Promise<DocumentsResponse> => {
  const authToken = getAuthToken()
  if (!authToken) return { status: false, message: AUTH_ERROR_MESSAGE }

  try {
    const baseUrl = import.meta.env.VITE_MAIN_DOMAIN
    const apiPath = import.meta.env.VITE_RESIDENT_PROJECTS_API

    if (!baseUrl || !apiPath) {
      return { status: false, message: 'Configuration error' }
    }

    const url = new URL(`${apiPath}/${projectId}/deal-room/documents`, baseUrl).toString()

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
      return { status: false, message: INVALID_RESPONSE_MESSAGE }
    }

    return { status: true, data: data.data || [] }
  } catch (error) {
    return { status: false, message: NETWORK_ERROR_MESSAGE, error }
  }
}

/**
 * Assign a document to a Deal Room folder.
 */
export const assignDocumentToFolder = async (
  projectId: number,
  documentId: number,
  folder: string,
): Promise<{ status: boolean; message?: string }> => {
  const authToken = getAuthToken()
  if (!authToken) return { status: false, message: AUTH_ERROR_MESSAGE }

  try {
    const baseUrl = import.meta.env.VITE_MAIN_DOMAIN
    const apiPath = import.meta.env.VITE_RESIDENT_PROJECTS_API

    if (!baseUrl || !apiPath) {
      return { status: false, message: 'Configuration error' }
    }

    const url = new URL(`${apiPath}/${projectId}/deal-room/assign`, baseUrl).toString()

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    const data = await customFetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ document_id: documentId, folder }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    return { status: true }
  } catch (error) {
    return { status: false, message: NETWORK_ERROR_MESSAGE }
  }
}

/**
 * Remove a document from its Deal Room folder assignment.
 */
export const unassignDocument = async (
  projectId: number,
  documentId: number,
): Promise<{ status: boolean; message?: string }> => {
  const authToken = getAuthToken()
  if (!authToken) return { status: false, message: AUTH_ERROR_MESSAGE }

  try {
    const baseUrl = import.meta.env.VITE_MAIN_DOMAIN
    const apiPath = import.meta.env.VITE_RESIDENT_PROJECTS_API

    if (!baseUrl || !apiPath) {
      return { status: false, message: 'Configuration error' }
    }

    const url = new URL(`${apiPath}/${projectId}/deal-room/document/${documentId}`, baseUrl).toString()

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    await customFetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    return { status: true }
  } catch (error) {
    return { status: false, message: NETWORK_ERROR_MESSAGE }
  }
}
