import { getAuthToken } from '../GetAuthToken'

export const patchSetDevicePush = async (
  token: string,
  enabled: number,
) => {
  const authToken = getAuthToken()

  if (authToken) {
    try {
      const url = `${import.meta.env.VITE_MAIN_DOMAIN}${
        import.meta.env.VITE_NOTIFICATIONS_API
      }/${token}`

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ enabled }),
      })

      const data = await response.json()

      return data
    } catch (error) {
      return false
    }
  } else {
    return false
  }
}
