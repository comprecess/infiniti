import { authTokenString } from '../../../../app/constants/constants'
import { getCookies } from '../../Saving/Cookies/GetCookies'

export const updateProfileAvatar = async (file: FormData) => {
  const authToken = getCookies(authTokenString)

  if (authToken.status) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_MAIN_DOMAIN}${
          import.meta.env.VITE_PROFILE_API_UPDATE_CLIENT_AVATAR
        }`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${authToken.cookie}`,
          },
          body: file,
        },
      )

      if (!response.ok) {
        return false
      }

      const data = await response.json()

      return data
    } catch (error) {
      return false
    }
  } else {
    return false
  }
}
