import { customFetch } from '../../custom-fetch'
import { getAuthToken } from '../../get-auth-token'
import {
  AUTH_ERROR_MESSAGE,
  NETWORK_ERROR_MESSAGE,
  REQUEST_TIMEOUT_MS,
} from '../../../../../app/constants/constants'

interface SuccessResponse {
  status: true
  data: any
}

interface ErrorResponse {
  status: false
  message: string
  error?: unknown
}

type ApiResponse = SuccessResponse | ErrorResponse

const getBaseUrl = () => import.meta.env.VITE_MAIN_DOMAIN
const getTaskKnowledgePath = () => import.meta.env.VITE_RESIDENT_TASK_KNOWLEDGE

const makeRequest = async (
  url: string,
  method: string,
  body?: any
): Promise<ApiResponse> => {
  const authToken = getAuthToken()
  if (!authToken) {
    return { status: false, message: AUTH_ERROR_MESSAGE }
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      signal: controller.signal,
    }

    if (body) {
      options.body = JSON.stringify(body)
    }

    const data = await customFetch(url, options)
    clearTimeout(timeoutId)

    return { status: true, data }
  } catch (error) {
    return { status: false, message: NETWORK_ERROR_MESSAGE, error }
  }
}

// Full workspace (all knowledge for a task)
export const getTaskKnowledge = async (taskId: number): Promise<ApiResponse> => {
  const baseUrl = getBaseUrl()
  const apiPath = getTaskKnowledgePath()
  const url = new URL(`${apiPath}/${taskId}/knowledge`, baseUrl).toString()
  return makeRequest(url, 'GET')
}

// Decision Records
export const getDecisions = async (taskId: number): Promise<ApiResponse> => {
  const baseUrl = getBaseUrl()
  const apiPath = getTaskKnowledgePath()
  const url = new URL(`${apiPath}/${taskId}/knowledge/decisions`, baseUrl).toString()
  return makeRequest(url, 'GET')
}

export const createDecision = async (taskId: number, data: any): Promise<ApiResponse> => {
  const baseUrl = getBaseUrl()
  const apiPath = getTaskKnowledgePath()
  const url = new URL(`${apiPath}/${taskId}/knowledge/decisions`, baseUrl).toString()
  return makeRequest(url, 'POST', data)
}

export const updateDecision = async (taskId: number, id: number, data: any): Promise<ApiResponse> => {
  const baseUrl = getBaseUrl()
  const apiPath = getTaskKnowledgePath()
  const url = new URL(`${apiPath}/${taskId}/knowledge/decisions/${id}`, baseUrl).toString()
  return makeRequest(url, 'PUT', data)
}

export const deleteDecision = async (taskId: number, id: number): Promise<ApiResponse> => {
  const baseUrl = getBaseUrl()
  const apiPath = getTaskKnowledgePath()
  const url = new URL(`${apiPath}/${taskId}/knowledge/decisions/${id}`, baseUrl).toString()
  return makeRequest(url, 'DELETE')
}

// Prompt Records
export const getPrompts = async (taskId: number): Promise<ApiResponse> => {
  const baseUrl = getBaseUrl()
  const apiPath = getTaskKnowledgePath()
  const url = new URL(`${apiPath}/${taskId}/knowledge/prompts`, baseUrl).toString()
  return makeRequest(url, 'GET')
}

export const createPrompt = async (taskId: number, data: any): Promise<ApiResponse> => {
  const baseUrl = getBaseUrl()
  const apiPath = getTaskKnowledgePath()
  const url = new URL(`${apiPath}/${taskId}/knowledge/prompts`, baseUrl).toString()
  return makeRequest(url, 'POST', data)
}

export const updatePrompt = async (taskId: number, id: number, data: any): Promise<ApiResponse> => {
  const baseUrl = getBaseUrl()
  const apiPath = getTaskKnowledgePath()
  const url = new URL(`${apiPath}/${taskId}/knowledge/prompts/${id}`, baseUrl).toString()
  return makeRequest(url, 'PUT', data)
}

export const deletePrompt = async (taskId: number, id: number): Promise<ApiResponse> => {
  const baseUrl = getBaseUrl()
  const apiPath = getTaskKnowledgePath()
  const url = new URL(`${apiPath}/${taskId}/knowledge/prompts/${id}`, baseUrl).toString()
  return makeRequest(url, 'DELETE')
}

// Validation Records
export const getValidations = async (taskId: number): Promise<ApiResponse> => {
  const baseUrl = getBaseUrl()
  const apiPath = getTaskKnowledgePath()
  const url = new URL(`${apiPath}/${taskId}/knowledge/validations`, baseUrl).toString()
  return makeRequest(url, 'GET')
}

export const createValidation = async (taskId: number, data: any): Promise<ApiResponse> => {
  const baseUrl = getBaseUrl()
  const apiPath = getTaskKnowledgePath()
  const url = new URL(`${apiPath}/${taskId}/knowledge/validations`, baseUrl).toString()
  return makeRequest(url, 'POST', data)
}

export const updateValidation = async (taskId: number, id: number, data: any): Promise<ApiResponse> => {
  const baseUrl = getBaseUrl()
  const apiPath = getTaskKnowledgePath()
  const url = new URL(`${apiPath}/${taskId}/knowledge/validations/${id}`, baseUrl).toString()
  return makeRequest(url, 'PUT', data)
}

export const deleteValidation = async (taskId: number, id: number): Promise<ApiResponse> => {
  const baseUrl = getBaseUrl()
  const apiPath = getTaskKnowledgePath()
  const url = new URL(`${apiPath}/${taskId}/knowledge/validations/${id}`, baseUrl).toString()
  return makeRequest(url, 'DELETE')
}

// Context
export const getContext = async (taskId: number): Promise<ApiResponse> => {
  const baseUrl = getBaseUrl()
  const apiPath = getTaskKnowledgePath()
  const url = new URL(`${apiPath}/${taskId}/knowledge/context`, baseUrl).toString()
  return makeRequest(url, 'GET')
}

export const saveContext = async (taskId: number, data: any): Promise<ApiResponse> => {
  const baseUrl = getBaseUrl()
  const apiPath = getTaskKnowledgePath()
  const url = new URL(`${apiPath}/${taskId}/knowledge/context`, baseUrl).toString()
  return makeRequest(url, 'POST', data)
}

// Knowledge Assets
export const getAssets = async (taskId: number): Promise<ApiResponse> => {
  const baseUrl = getBaseUrl()
  const apiPath = getTaskKnowledgePath()
  const url = new URL(`${apiPath}/${taskId}/knowledge/assets`, baseUrl).toString()
  return makeRequest(url, 'GET')
}

export const createAsset = async (taskId: number, data: any): Promise<ApiResponse> => {
  const baseUrl = getBaseUrl()
  const apiPath = getTaskKnowledgePath()
  const url = new URL(`${apiPath}/${taskId}/knowledge/assets`, baseUrl).toString()
  return makeRequest(url, 'POST', data)
}

export const updateAsset = async (taskId: number, id: number, data: any): Promise<ApiResponse> => {
  const baseUrl = getBaseUrl()
  const apiPath = getTaskKnowledgePath()
  const url = new URL(`${apiPath}/${taskId}/knowledge/assets/${id}`, baseUrl).toString()
  return makeRequest(url, 'PUT', data)
}

export const deleteAsset = async (taskId: number, id: number): Promise<ApiResponse> => {
  const baseUrl = getBaseUrl()
  const apiPath = getTaskKnowledgePath()
  const url = new URL(`${apiPath}/${taskId}/knowledge/assets/${id}`, baseUrl).toString()
  return makeRequest(url, 'DELETE')
}

// Outcome Records
export const getOutcomes = async (taskId: number): Promise<ApiResponse> => {
  const baseUrl = getBaseUrl()
  const apiPath = getTaskKnowledgePath()
  const url = new URL(`${apiPath}/${taskId}/knowledge/outcomes`, baseUrl).toString()
  return makeRequest(url, 'GET')
}

export const createOutcome = async (taskId: number, data: any): Promise<ApiResponse> => {
  const baseUrl = getBaseUrl()
  const apiPath = getTaskKnowledgePath()
  const url = new URL(`${apiPath}/${taskId}/knowledge/outcomes`, baseUrl).toString()
  return makeRequest(url, 'POST', data)
}

export const updateOutcome = async (taskId: number, id: number, data: any): Promise<ApiResponse> => {
  const baseUrl = getBaseUrl()
  const apiPath = getTaskKnowledgePath()
  const url = new URL(`${apiPath}/${taskId}/knowledge/outcomes/${id}`, baseUrl).toString()
  return makeRequest(url, 'PUT', data)
}

export const deleteOutcome = async (taskId: number, id: number): Promise<ApiResponse> => {
  const baseUrl = getBaseUrl()
  const apiPath = getTaskKnowledgePath()
  const url = new URL(`${apiPath}/${taskId}/knowledge/outcomes/${id}`, baseUrl).toString()
  return makeRequest(url, 'DELETE')
}
