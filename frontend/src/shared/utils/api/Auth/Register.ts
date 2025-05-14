import { authTokenString } from '../../../../app/constants/constants'
import { initOneSignal } from '../../../../oneSignalService'
import { saveCookies } from '../../Saving/Cookies/SaveCookies'

interface RegisterUserResponse {
  token: string
  message: string
  status: boolean
}

export const registerUser = async (
  fullName: string,
  email: string,
  password: string,
  confirmationPassword: string,
): Promise<RegisterUserResponse> => {
  try {
    const response = await fetch(
      import.meta.env.VITE_MAIN_DOMAIN +
        import.meta.env.VITE_AUTH_API_USER_REGISTER,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
          confirmationPassword,
        }),
      },
    )

    const data: RegisterUserResponse = await response.json()

    saveCookies(authTokenString, data.token, 30)

    await initOneSignal()

    return data
  } catch (error) {
    return { token: '', message: 'Response error', status: false }
  }
}
