import { authTokenString } from '../../../app/constants/constants'
import { getCookies } from '../Saving/Cookies/GetCookies'
import { getSession } from '../Saving/Session/GetSession'

export const getAuthToken = (): string | undefined => {
  const sessionToken = getSession(authTokenString)

  if (sessionToken) {
    return sessionToken
  }

  const authToken = getCookies(authTokenString)

  if (authToken.status) {
    return authToken.cookie
  }
}
