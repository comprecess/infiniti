import { authTokenString } from '../../../../app/constants/constants'
import { getCookies } from '../../Saving/Cookies/GetCookies'

interface Response {
  status: boolean
}

export const editGroup = async (
  id: number,
  name: string,
): Promise<boolean> => {
  const authToken = getCookies(authTokenString)

  if (authToken.status) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_MAIN_DOMAIN}${
          import.meta.env.VITE_CUSTOMERS_EDIT_GROUP
        }${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${authToken.cookie}`,
          },
          body: JSON.stringify({ name }),
        },
      )

      const data: Response = await response.json()

      return data.status
    } catch (error) {
      return false
    }
  } else {
    return false
  }
}
