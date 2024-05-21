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
      console.error('Response error:', response)
      throw new Error('Failed to login')
    }

    const data: LoginUserResponse = await response.json()

    return data.status
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}
