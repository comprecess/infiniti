interface LoginResponse {
  token: string
}

export const loginUser = async (
  login: string,
  password: string,
): Promise<string> => {
  try {
    const response = await fetch(
      'https://console.infiniti.stream/api/v1/client/login',
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

    const data: LoginResponse = await response.json()

    return data.token
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}
