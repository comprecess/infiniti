interface LoginResponse {
  token: string
  status: boolean
}

export const loginUser = async (
  login: string,
  password: string,
): Promise<boolean> => {
  try {
    const response = await fetch(
      'http://94.250.251.126/api/v1/client/login',
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

    return data.status
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}
