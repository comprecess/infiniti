import { navigateTo } from '../hooks/navigationService'
import { getLocalDateTimeString } from '../usefulMethods'

export interface CustomFetchOptions extends RequestInit {
  headers?: HeadersInit
  queryParams?: Record<string, string | number | boolean>
  redirectOnError?: boolean
  responseType?: 'json' | 'blob' | 'text'
}

export const customFetch = async <T = any>(
  url: string,
  options: CustomFetchOptions = {},
): Promise<T> => {
  const {
    headers = {},
    queryParams,
    body,
    redirectOnError = true,
    responseType = 'json',
    ...restOptions
  } = options

  let fullUrl = url

  if (queryParams) {
    const queryString = new URLSearchParams(
      Object.entries(queryParams).reduce((acc, [key, val]) => {
        acc[key] = String(val)

        return acc
      }, {} as Record<string, string>),
    ).toString()
    fullUrl += `?${queryString}`
  }

  try {
    const response = await fetch(fullUrl, {
      ...restOptions,
      body,
      headers: {
        ...headers,
        'Client-Date': getLocalDateTimeString(),
      },
    })

    if (!response.ok && redirectOnError) {
      if (response.status === 403) {
        navigateTo('/403')
      } else if (response.status === 404) {
        navigateTo('/404')
      } else if (response.status === 500) {
        navigateTo('/500')
      }
    }

    switch (responseType) {
      case 'blob':
        return (await response.blob()) as unknown as T
      case 'text':
        return (await response.text()) as unknown as T
      case 'json':
      default:
        return (await response.json()) as T
    }
  } catch (error) {
    console.error('Fetch error:', error)
    throw error
  }
}
