import { authTokenString } from '../../../app/constants/constants'
import { getCookies } from '../Saving/Cookies/GetCookies'

export const getAutoLogin = async (token: string) => {
  const authToken = getCookies(authTokenString)

  if (authToken) {
    try {
      const url = `${import.meta.env.VITE_MAIN_DOMAIN}${
        import.meta.env.VITE_AUTO_LOGIN_ACCOUNT
      }${token}`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${authToken.cookie}`,
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
