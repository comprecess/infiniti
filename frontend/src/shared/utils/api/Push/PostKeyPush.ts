import { getAuthToken } from '../GetAuthToken'

interface Response {
  status: boolean
  message: string
}

export const postKeyPush = async (
  userId: string,
  nameDevice: string,
): Promise<Response> => {
  const authToken = getAuthToken()

  if (authToken) {
    try {
      const url = `${import.meta.env.VITE_MAIN_DOMAIN}${
        import.meta.env.VITE_NOTIFICATIONS_API
      }/subscribe`

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ subscription: userId, name: nameDevice }),
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
