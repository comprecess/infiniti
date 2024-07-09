import { authTokenString } from '../../../../app/constants/constants'
import { getCookies } from '../../Saving/Cookies/GetCookies'

interface Response {
  status: boolean
}

export const deleteCurrency = async (id: number): Promise<boolean> => {
  const authToken = getCookies(authTokenString)

  if (authToken) {
    try {
      const url = `${import.meta.env.VITE_MAIN_DOMAIN}${
        import.meta.env.VITE_CURRENCY_DELETE_CURRENCY
      }${id}`

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${authToken.cookie}`,
        },
      })

      const data: Response = await response.json()

      return data.status
    } catch (error) {
      return false
    }
  } else {
    return false
  }
}
