import { saveCookies } from '../../Saving/Cookies/SaveCookies'

interface RegisterUserResponse {
  token: string
  status: boolean
}

export const registerUser = async (
  fullname: string,
  email: string,
  password: string,
  password2: string,
): Promise<boolean> => {
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
        body: JSON.stringify({ fullname, email, password, password2 }),
      },
    )

    if (!response.ok) {
      return false
    }

    const data: RegisterUserResponse = await response.json()

    saveCookies('authToken', data.token, 30)

    return data.status
  } catch (error) {
    return false
  }
}
