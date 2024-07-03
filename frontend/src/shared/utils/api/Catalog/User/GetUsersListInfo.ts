import { authTokenString } from '../../../../../app/constants/constants'
import { getCookies } from '../../../Saving/Cookies/GetCookies'

export const getUsersListInfo = async (page: string, sort?: object) => {
  const authToken = getCookies(authTokenString)

  if (authToken) {
    try {
      const response = await fetch(
        import.meta.env.VITE_MAIN_DOMAIN +
          `${import.meta.env.VITE_CATALOG_API_USERSLIST_INFO}${page}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${authToken.cookie}`,
          },
          body: JSON.stringify({ filter: sort }),
        },
      )

      const data = await response.json()

      return data
    } catch (error) {
      return false
    }
  } else {
    return false
  }
}
