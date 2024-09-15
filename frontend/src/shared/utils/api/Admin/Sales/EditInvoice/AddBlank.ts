import { authTokenString } from '../../../../../../app/constants/constants'
import { getCookies } from '../../../../Saving/Cookies/GetCookies'

interface Response {
  status: boolean
  message: string
}

export const addBlankInvoice = async (
  id: number,
  service: string,
): Promise<Response> => {
  const authToken = getCookies(authTokenString)

  if (authToken.status) {
    try {
      const url =
        import.meta.env.VITE_MAIN_DOMAIN +
        import.meta.env.VITE_SALES_CREATE_NEW_INVOICE +
        '/' +
        id +
        '/blank'

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${authToken.cookie}`,
        },
        body: JSON.stringify({ service }),
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
