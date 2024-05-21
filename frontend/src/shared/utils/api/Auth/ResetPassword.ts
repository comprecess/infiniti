interface ResetPasswordResponse {
  token: string
}

export const resetPassword = async (login: string): Promise<string> => {
  try {
    const response = await fetch(
      import.meta.env.VITE_MAIN_DOMAIN +
        import.meta.env.VITE_AUTH_API_RESET_PASSWORD,
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

    const data: ResetPasswordResponse = await response.json()

    return data.token
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}
