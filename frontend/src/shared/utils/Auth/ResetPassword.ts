interface LoginResponse {
  token: string
}

export const resetPassword = async (login: string): Promise<string> => {
  try {
    const response = await fetch(
      'http://94.250.251.126/api/v1/client/resetpassword',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ login }),
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
