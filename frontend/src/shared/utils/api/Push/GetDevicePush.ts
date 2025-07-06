import { getAuthToken } from '../GetAuthToken'

interface Response {
  data: any
  status: boolean
}

export const getDevicePush = async (token: string): Promise<Response> => {
  const authToken = getAuthToken()

  if (authToken) {
    try {
      const url = `${import.meta.env.VITE_MAIN_DOMAIN}${
        import.meta.env.VITE_NOTIFICATIONS_API
      }/${token}`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      })

      const data: Response = await response.json()

      return data
    } catch (error) {
      return { status: false, data: null }
    }
  } else {
    return { status: false, data: null }
  }
}
