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
    const url = `${import.meta.env.VITE_MAIN_DOMAIN}${
      import.meta.env.VITE_AUTH_RESIDENT_LOGIN_API
    }`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ login, password }),
    })

    const data: LoginResidentResponse = await response.json()

    saveCookies(authTokenString, data.token, 30)

    return data
  } catch (error) {
    return { token: '', message: 'Response error', status: false }
  }
}
