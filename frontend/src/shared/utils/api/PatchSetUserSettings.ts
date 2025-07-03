import { getAuthToken } from './GetAuthToken'

interface Response {
  status: boolean
  message: string
}

export const patchSetUserSettings = async (
  object: any,
): Promise<Response> => {
  const authToken = getAuthToken()

  if (authToken) {
    try {
      const url = `${import.meta.env.VITE_MAIN_DOMAIN}${
        import.meta.env.VITE_USER_API
      }/setting?push=${object.push}`

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      })

      const data: Response = await response.json()

      return data
    } catch (error) {
      return { status: false, message: 'An error occurred' }
    }
  } else {
    return { status: false, message: 'Authentication failed' }
  }
}
