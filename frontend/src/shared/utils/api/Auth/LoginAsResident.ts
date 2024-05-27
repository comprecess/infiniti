import { saveCookies } from '../../Saving/Cookies/SaveCookies'

interface LoginResidentResponse {
  token: string
  status: boolean
}

export const loginResident = async (
  login: string,
  password: string,
): Promise<boolean> => {
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

    if (!response.ok) {
      return false
    }

    const data: LoginResidentResponse = await response.json()

    saveCookies('authToken', data.token, 30)

    return data.status
  } catch (error) {
    return false
  }
}
