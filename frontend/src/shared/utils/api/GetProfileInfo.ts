import {
  authTokenString,
  profileInfoString,
  UserInfo,
  userTalentsPageString,
} from '../../../app/constants/constants'
import { removeCookies } from '../Saving/Cookies/RemoveCookies'
import { saveSession } from '../Saving/Session/SaveSession'
import { getAuthToken } from './GetAuthToken'

export const getProfileInfo = async (): Promise<UserInfo | false> => {
  const authToken = getAuthToken()

  if (authToken) {
    try {
      const response = await fetch(
        import.meta.env.VITE_MAIN_DOMAIN +
          import.meta.env.VITE_PROFILE_API_CLIENT_INFO,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        },
      )

      if (!response.ok) {
        removeCookies(authTokenString)

        return false
      }

      const data = await response.json()

      saveSession(profileInfoString, data.data)
      saveSession(userTalentsPageString, 1)

      return data.data
    } catch (error) {
      return false
    }
  } else {
    return false
  }
}
