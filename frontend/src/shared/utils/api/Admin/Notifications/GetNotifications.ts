import { getAuthToken } from '../../get-auth-token'

export const getNotifications = async (
  timeZone: string,
  type?: string,
) => {
  const authToken = getAuthToken()

  if (authToken) {
    try {
      const url = `${import.meta.env.VITE_MAIN_DOMAIN}${
        import.meta.env.VITE_GET_NOTIFICATIONS
      }?timezone=${timeZone}${type ? `&${type}` : ''}`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
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
