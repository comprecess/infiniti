interface RegisterResponse {
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
      'http://94.250.251.126/api/v1/client/register',
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
      console.error('Response error:', response)
      throw new Error('Failed to login')
    }

    const data: RegisterResponse = await response.json()

    return data.status
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}
