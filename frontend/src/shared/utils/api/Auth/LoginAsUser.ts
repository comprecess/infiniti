import { authTokenString } from '../../../../app/constants/constants'
import { saveCookies } from '../../Saving/Cookies/SaveCookies'

interface LoginUserResponse {
  token: string
  status: boolean
}

export const loginUser = async (
  login: string,
  password: string,
): Promise<boolean> => {
  try {
    const response = await fetch(
      import.meta.env.VITE_MAIN_DOMAIN +
        import.meta.env.VITE_AUTH_API_USER_LOGIN,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ login, password }),
      },
    )

    if (!response.ok) {
      return false
    }

    const data: LoginUserResponse = await response.json()

    saveCookies(authTokenString, data.token, 30)

    return data.status
  } catch (error) {
    return false
  }
}
