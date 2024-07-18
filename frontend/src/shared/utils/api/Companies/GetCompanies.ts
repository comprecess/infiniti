import { authTokenString } from '../../../../app/constants/constants'
import { getCookies } from '../../Saving/Cookies/GetCookies'

export const getCompaniesList = async () => {
  const authToken = getCookies(authTokenString)

  if (authToken) {
    try {
      const url =
        import.meta.env.VITE_MAIN_DOMAIN +
        import.meta.env.VITE_CUSTOMERS_GET_COMPANIES

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${authToken.cookie}`,
        },
      })

      const data = await response.json()

      return data.data
    } catch (error) {
      return false
    }
  } else {
    return false
  }
}
