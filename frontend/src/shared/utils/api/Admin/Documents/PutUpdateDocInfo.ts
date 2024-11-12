import { authTokenString } from '../../../../../app/constants/constants'
import { getCookies } from '../../../Saving/Cookies/GetCookies'

interface Response {
  status: boolean
  message: string
}

export const putUpdateDocInfo = async (
  id: number,
  global: number,
): Promise<Response> => {
  const authToken = getCookies(authTokenString)

  if (authToken.status) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_MAIN_DOMAIN}${
          import.meta.env.VITE_DOCUMENTS_GET_SELECTED_FILE_INFO
        }${id}/update`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${authToken.cookie}`,
          },
          body: JSON.stringify({ global }),
        },
      )

      const data: Response = await response.json()

      return data
    } catch (error) {
      return { status: false, message: 'An error occurred' }
    }
  } else {
    return { status: false, message: 'Authentication failed' }
  }
}
