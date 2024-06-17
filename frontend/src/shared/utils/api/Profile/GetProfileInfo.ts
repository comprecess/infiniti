import {
  authTokenString,
  profileInfoString,
  userTalentsPageString,
} from '../../../../app/constants/constants'
import { getCookies } from '../../Saving/Cookies/GetCookies'
import { removeCookies } from '../../Saving/Cookies/RemoveCookies'
import { saveSession } from '../../Saving/Session/SaveSession'

export const getProfileInfo = async () => {
  const authToken = getCookies(authTokenString)

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
        removeCookies(authTokenString)

        return false
      }

      const data = await response.json()

      saveSession(profileInfoString, data.data)
      saveSession(userTalentsPageString, '?page=1')

      return data.data
    } catch (error) {
      return false
    }
  } else {
    return false
  }
}
