import { authTokenString } from '../../../../../../app/constants/constants'
import { getCookies } from '../../../../Saving/Cookies/GetCookies'

interface Response {
  status: boolean
  message: string
}

export const updateTalentAvatar = async (
  idTalent: number,
  file: FormData,
): Promise<Response> => {
  const authToken = getCookies(authTokenString)

  if (authToken) {
    try {
      const url =
        import.meta.env.VITE_MAIN_DOMAIN +
        import.meta.env.VITE_TALENTS_UPDATE_TALENT_INFO +
        idTalent +
        '/update'

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${authToken.cookie}`,
        },
        body: file,
      })

      const data = await response.json()

      return data
    } catch (error) {
      return { status: false, message: 'An error occurred' }
    }
  } else {
    return { status: false, message: 'Authentication failed' }
  }
}
