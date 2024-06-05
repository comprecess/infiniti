import { authTokenString } from '../../../../app/constants/constants'
import { saveCookies } from '../../Saving/Cookies/SaveCookies'

interface LoginResidentResponse {
  token: string
  message: string
  status: boolean
}

export const loginResident = async (
  login: string,
  password: string,
): Promise<LoginResidentResponse> => {
  try {
    const response = await fetch(
      import.meta.env.VITE_MAIN_DOMAIN +
        import.meta.env.VITE_AUTH_API_ADMIN_LOGIN,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ login, password }),
      },
    )

    const data: LoginResidentResponse = await response.json()

    saveCookies(authTokenString, data.token, 30)

    return data
  } catch (error) {
    return { token: '', message: 'Response error', status: false }
  }
}
