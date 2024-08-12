import { authTokenString } from '../../../../../app/constants/constants'
import { getCookies } from '../../../Saving/Cookies/GetCookies'

export const getSelectedTypeInfo = async (id: number, type: string) => {
  const authToken = getCookies(authTokenString)

  if (authToken) {
    try {
      const url =
        import.meta.env.VITE_MAIN_DOMAIN +
        import.meta.env.VITE_CUSTOMERS_VIEW_GET_SELECTED_TYPE_INFO +
        id +
        '/view/' +
        type

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
