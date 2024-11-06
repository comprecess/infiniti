import { authTokenString } from '../../../../../../app/constants/constants'
import { getCookies } from '../../../../Saving/Cookies/GetCookies'

interface Response {
  status: boolean
  message: string
}

export const deleteCart = async (
  idCart: number,
  idItem: number,
): Promise<Response> => {
  const authToken = getCookies(authTokenString)

  if (authToken) {
    try {
      const url = `${import.meta.env.VITE_MAIN_DOMAIN}${
        import.meta.env.VITE_TALENTS_EDIT_CART_ORDER
      }${idCart}/item/${idItem}`

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${authToken.cookie}`,
        },
      })

      const data: Response = await response.json()

      return data
    } catch (error) {
      return { status: false, message: 'An error occurred' }
    }
  } else {
    return { status: false, message: 'Authentication failed' }
  }
}
