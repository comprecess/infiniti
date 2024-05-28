import { getCookies } from '../../Saving/Cookies/GetCookies'
import { saveSession } from '../../Saving/Session/SaveSession'

export const getProfileInfo = async () => {
  const authToken = getCookies('authToken')

  if (authToken.status) {
    try {
      const response = await fetch(
        import.meta.env.VITE_MAIN_DOMAIN +
          import.meta.env.VITE_PROFILE_API_CLIENT_INFO,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${authToken.cookie}`,
          },
        },
      )

      if (!response.ok) {
        return false
      }

      const data = await response.json()

      saveSession('profileInfo', data.data)

      return data.data
    } catch (error) {
      return false
    }
  } else {
    return false
  }
}
